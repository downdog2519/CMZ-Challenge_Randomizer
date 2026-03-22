/* ============================================================
   LOGIC.JS — Challenge Logic, Stopwatch, Run Flow
   ============================================================ */

import { state, saveSession } from "./state.js";
import {
    survivalRoundValues,
    survivalRoundWeightsStandard,
    survivalRoundWeightsExtreme,
    trailRules,
    survivalMaps,
    startingRoomRounds,
    startingRoomWeightsStandard,
    startingRoomWeightsExtreme,
    grimRelics,
    sinisterRelics,
    wickedRelics,
    fieldUpgrades
} from "./data.js";

import {
    pickRandom,
    pickUnique,
    weightedPick
} from "./utils.js";

import {
    renderBossChallenge,
    renderSurvivalChallenge,
    renderTrailChallenge,
    renderStartingRoomChallenge,
    applyMapTheme,
    clearChallengePanel
} from "./renderers.js";

import {
    lockSetupPanel,
    showChallengePanel,
    showChallengeButtons,
    hideChallengeButtons,
    showBeginButton,
    hideBeginButton,
    showPassFail,
    hidePassFail,
    updateSessionStats
} from "./ui.js";

/* ============================================================
   STOPWATCH
   ============================================================ */

let stopwatchInterval = null;

export function startStopwatch() {
    if (state.stopwatchActive) return;

    state.stopwatchActive = true;
    saveSession();

    stopwatchInterval = setInterval(() => {
        state.stopwatchTime++;
        saveSession();
        updateStopwatchDisplay();
    }, 1000);
}

export function stopStopwatch() {
    state.stopwatchActive = false;
    saveSession();
    clearInterval(stopwatchInterval);
}

export function resetStopwatch() {
    state.stopwatchTime = 0;
    saveSession();
    updateStopwatchDisplay();
}

function updateStopwatchDisplay() {
    const el = document.getElementById("stopwatchTimer");
    if (!el) return;

    const m = Math.floor(state.stopwatchTime / 60);
    const s = state.stopwatchTime % 60;

    el.innerHTML = `
        <span class="chalk-text" style="font-size:14px;">Time</span>
        <div class="neon-pulse-blue" style="font-size:18px;">
            ${m}:${s.toString().padStart(2, "0")}
        </div>
    `;
}

/* ============================================================
   EXTREME MODE QUEUE — UNIQUE, NO DUPES
   ============================================================ */

function buildExtremeQueue() {
    const allTypes = ["boss", "survival", "trail", "starting"];

    const shuffled = allTypes
        .map(t => ({ t, r: Math.random() }))
        .sort((a, b) => a.r - b.r)
        .map(o => o.t);

    state.extremeQueue = shuffled.slice(0, state.challengeStageCount);
    state.extremeIndex = 0;
    saveSession();
}

function nextExtremeType() {
    const type = state.extremeQueue[state.extremeIndex];
    state.extremeIndex++;
    saveSession();
    return type;
}

/* ============================================================
   RELIC HELPERS
   ============================================================ */

function noRelicsUnlocked() {
    return state.unlockedRelics.length === 0;
}

function getUnlockedFromPool(pool) {
    return pool.filter(r => state.unlockedRelics.includes(r));
}

function getUnlockedGrim() {
    return getUnlockedFromPool(grimRelics);
}

function getUnlockedSinister() {
    return getUnlockedFromPool(sinisterRelics);
}

function getUnlockedWicked() {
    return getUnlockedFromPool(wickedRelics);
}

/* ============================================================
   BOSS RELIC LOGIC — EXACT RULES
   ============================================================ */

function generateBossRelicsForTier(tier) {
    if (noRelicsUnlocked()) return [];

    const unlocked = state.unlockedRelics.slice();
    const grim = getUnlockedGrim();
    const sinister = getUnlockedSinister();
    const wicked = getUnlockedWicked();

    if (tier === "T1") {
        if (wicked.length >= 1) return [pickRandom(wicked)];
        if (grim.length >= 1 && sinister.length >= 1)
            return [pickRandom(grim), pickRandom(sinister)];
        return pickUnique(unlocked, Math.min(2, unlocked.length));
    }

    if (tier === "T2") {
        if (wicked.length >= 1 && grim.length >= 1 && sinister.length >= 1)
            return [pickRandom(wicked), pickRandom(grim), pickRandom(sinister)];

        if (grim.length >= 2 && sinister.length >= 1) {
            const g = pickUnique(grim, 2);
            return [...g, pickRandom(sinister)];
        }

        return pickUnique(unlocked, Math.min(3, unlocked.length));
    }

    if (tier === "T3") {
        if (wicked.length >= 3) return pickUnique(wicked, 3);

        if (wicked.length >= 2 && sinister.length >= 2)
            return [...pickUnique(wicked, 2), ...pickUnique(sinister, 2)];

        if (wicked.length >= 2 && sinister.length >= 2 && grim.length >= 2)
            return [
                ...pickUnique(wicked, 2),
                ...pickUnique(sinister, 2),
                ...pickUnique(grim, 2)
            ];

        return pickUnique(unlocked, Math.min(4, unlocked.length));
    }

    return pickUnique(unlocked, Math.min(2, unlocked.length));
}

/* ============================================================
   FIELD UPGRADES — UNIQUE PER PLAYER + UNIQUE ACROSS RUN
   WITH GAMERTAG ATTACHMENT
   ============================================================ */

function generateFieldUpgrades() {
    // Remove upgrades already used this run
    const available = fieldUpgrades.filter(
        u => !state.usedFieldUpgrades.includes(u)
    );

    // Pick unique upgrades for the number of players
    const chosen = pickUnique(available, state.playerCount);

    // Store them so they can't appear again this run
    state.usedFieldUpgrades.push(...chosen);
    saveSession();

    // Attach gamertags to each upgrade
    return chosen.map((upgrade, index) => ({
        player: state.gamertags[index] || `Player ${index + 1}`,
        upgrade
    }));
}

/* ============================================================
   CHALLENGE GENERATORS (TYPE INCLUDED)
   ============================================================ */

function generateBossChallenge() {
    const map = pickRandom(["Astra", "Ashes of the Damned", "Paradox Junction"]);
    const tier = pickRandom(["T1", "T2", "T3"]);

    const relics = noRelicsUnlocked()
        ? []
        : generateBossRelicsForTier(tier);

    return {
        type: "boss",
        map,
        tier,
        relics,
        fieldUpgrades: generateFieldUpgrades()
    };
}

function generateSurvivalChallenge() {
    const map = pickRandom(survivalMaps);
    const round =
        state.currentMode === "extreme"
            ? weightedPick(survivalRoundValues, survivalRoundWeightsExtreme)
            : weightedPick(survivalRoundValues, survivalRoundWeightsStandard);

    let relics = [];

    if (!noRelicsUnlocked()) {
        let relicCount;

        if (state.currentMode === "extreme") {
            relicCount = Math.min(
                state.unlockedRelics.length,
                Math.floor(Math.random() * (17 - 10 + 1)) + 10
            );
        } else {
            const counts = [6, 8, 10];
            const weights = [60, 30, 10];
            relicCount = weightedPick(counts, weights);
            relicCount = Math.min(relicCount, state.unlockedRelics.length);
        }

        relics = pickUnique(state.unlockedRelics, relicCount);
    }

    return {
        type: "survival",
        map,
        round,
        relics,
        fieldUpgrades: generateFieldUpgrades()
    };
}

function generateTrailChallenge() {
    const map = pickRandom(Object.keys(trailRules));
    const pool = trailRules[map].pool;
    const requiredRelic = pickRandom(pool);

    return {
        type: "trail",
        map,
        requiredRelic,
        relics: [requiredRelic],
        fieldUpgrades: [] // Trail has NO field upgrades
    };
}

function generateStartingRoomChallenge() {
    const map = pickRandom(["Astra", "Ashes of the Damned"]);

    const weights =
        state.currentMode === "extreme"
            ? startingRoomWeightsExtreme
            : startingRoomWeightsStandard;

    const round = weightedPick(startingRoomRounds, weights);

    return {
        type: "starting",
        map,
        round,
        fieldUpgrades: generateFieldUpgrades()
    };
}

/* ============================================================
   STANDARD MODE — HIDE COMPLETED TYPES
   ============================================================ */

function updateStandardChallengeAvailability() {
    const used = new Set(state.currentRun.map(c => c.type));

    const map = {
        boss: "bossBtn",
        survival: "survivalBtn",
        trail: "trailBtn",
        starting: "startingBtn"
    };

    Object.entries(map).forEach(([type, id]) => {
        const btn = document.getElementById(id);
        if (!btn) return;

        btn.style.display = used.has(type) ? "none" : "inline-block";
    });
}

/* ============================================================
   RUN PROGRESSION
   ============================================================ */

export function beginRun() {
    lockSetupPanel();
    showChallengePanel();
    hideChallengeButtons();
    hidePassFail();
    showBeginButton();

    resetStopwatch();
    clearChallengePanel();

    state.currentRun = [];
    state.usedFieldUpgrades = []; // reset upgrade history

    if (state.challengeModeType === "extreme") {
        state.currentMode = "extreme";
        buildExtremeQueue();
    } else {
        state.currentMode = "standard";
        updateStandardChallengeAvailability();
    }

    saveSession();
}

export function beginChallenge(type) {
    showChallengePanel();

    hideBeginButton();
    hideChallengeButtons();

    let data;

    switch (type) {
        case "boss":
            data = generateBossChallenge();
            renderBossChallenge(data);
            break;

        case "survival":
            data = generateSurvivalChallenge();
            renderSurvivalChallenge(data);
            break;

        case "trail":
            data = generateTrailChallenge();
            renderTrailChallenge(data);
            break;

        case "starting":
            data = generateStartingRoomChallenge();
            renderStartingRoomChallenge(data);
            break;
    }

    state.currentChallengeType = type;
    state.currentRun.push(data);
    saveSession();

    applyMapTheme(data.map);

    showPassFail();
    startStopwatch();
}

export function beginExtremeChallenge() {
    const type = nextExtremeType();
    beginChallenge(type);
}

/* ============================================================
   PASS / FAIL HANDLING
   ============================================================ */

export function markPass() {
    state.sessionWins++;
    saveSession();
    updateSessionStats();
    nextStage();
}

export function markFail() {
    state.sessionFails++;
    saveSession();
    updateSessionStats();
    nextStage();
}

function nextStage() {
    if (state.currentMode === "extreme") {
        if (state.extremeIndex < state.extremeQueue.length) {
            beginExtremeChallenge();
        } else {
            hidePassFail();
            finishRun();
        }
    } else {
        hidePassFail();

        if (state.currentRun.length >= state.challengeStageCount) {
            finishRun();
            return;
        }

        updateStandardChallengeAvailability();
        showChallengeButtons();
    }
}

/* ============================================================
   SUMMARY — FULL RUN INCLUDED
   ============================================================ */

export function finishRun() {
    stopStopwatch();

    const last = state.currentRun[state.currentRun.length - 1];

    const summary = {
        mode: state.currentMode,
        type: state.currentChallengeType,
        map: last.map,
        round: last.round ?? null,
        tier: last.tier ?? null,
        requiredRelic: last.requiredRelic ?? null,
        relics: last.relics ?? [],
        fieldUpgrades: last.fieldUpgrades ?? [],
        time: `${Math.floor(state.stopwatchTime / 60)}:${(state.stopwatchTime % 60)
            .toString()
            .padStart(2, "0")}`,
        stages: state.currentRun
    };

    sessionStorage.setItem("summaryData", JSON.stringify(summary));
    window.location.href = "summary.html";
}