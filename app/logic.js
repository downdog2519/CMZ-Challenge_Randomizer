import { $, state, saveSession, resetRunState } from "./state.js";
import {
    pickRandom,
    pickUnique,
    weightedPick,
    allRelics,
    grimRelics,
    sinisterRelics,
    wickedRelics,
    fieldUpgrades,
    survivalRoundValues,
    survivalRoundWeights,
    bossTiers,
    extremeRelicRange,
    trailRules,
    survivalMaps
} from "./data.js";
import {
    renderBossChallenge,
    renderSurvivalChallenge,
    renderTrailChallenge,
    renderStopwatch,
    clearChallengePanel,
    applyMapTheme
} from "./ui.js";

/* ============================================================
   PLAYER CONFIRMATION
============================================================ */

export function confirmPlayers() {
    if (state.playerCount > 1) {
        for (let i = 0; i < state.playerCount; i++) {
            if (!state.gamertags[i] || state.gamertags[i].trim() === "") {
                alert("All players must enter a gamertag.");
                return false;
            }
        }
    }

    // Prevent Extreme mode with 0 relics
    if (state.challengeModeType === "extreme" && state.unlockedRelics.length === 0) {
        alert("You must unlock at least one relic before starting Extreme mode.");
        return false;
    }

    return true;
}

/* ============================================================
   MODE SWITCHING
============================================================ */

export function toggleMode() {
    state.challengeModeType =
        state.challengeModeType === "standard" ? "extreme" : "standard";
    saveSession();
}

/* ============================================================
   STOPWATCH ENGINE
============================================================ */

let timerInterval = null;

export function startStopwatch() {
    if (timerInterval) clearInterval(timerInterval);
    state.stopwatchActive = true;

    timerInterval = setInterval(() => {
        state.stopwatchTime++;
        renderStopwatch();
        saveSession();
    }, 1000);
}

export function stopStopwatch() {
    if (timerInterval) clearInterval(timerInterval);
    state.stopwatchActive = false;
    renderStopwatch();
    saveSession();
}

export function resetStopwatch() {
    if (timerInterval) clearInterval(timerInterval);
    state.stopwatchTime = 0;
    state.stopwatchActive = false;
    renderStopwatch();
    saveSession();
}

/* ============================================================
   RELIC FILTERING
============================================================ */

export function getUnlockedRelics() {
    return allRelics.filter(r => state.unlockedRelics.includes(r));
}

function getOwnedByPool() {
    const owned = getUnlockedRelics();
    return {
        grim: owned.filter(r => grimRelics.includes(r)),
        sinister: owned.filter(r => sinisterRelics.includes(r)),
        wicked: owned.filter(r => wickedRelics.includes(r))
    };
}

function getExtremeOwnedWeightedList() {
    const { grim, sinister, wicked } = getOwnedByPool();
    const weighted = [];

    grim.forEach(r => weighted.push(r));
    sinister.forEach(r => weighted.push(r, r, r));
    wicked.forEach(r => weighted.push(r, r, r, r, r));

    return weighted;
}

/* ============================================================
   FIELD UPGRADE ASSIGNMENT
============================================================ */

function assignFieldUpgrades() {
    const players = state.gamertags.slice(0, state.playerCount);
    const result = [];

    if (players.length <= fieldUpgrades.length) {
        const upgrades = pickUnique(fieldUpgrades, players.length);
        players.forEach((p, i) => {
            result.push({ player: p || `Player ${i + 1}`, upgrade: upgrades[i] });
        });
    } else {
        players.forEach((p, i) => {
            const up = pickRandom(fieldUpgrades);
            result.push({ player: p || `Player ${i + 1}`, upgrade: up });
        });
    }

    return result;
}

/* ============================================================
   STANDARD MODE GENERATORS
============================================================ */

export function generateStandardBoss() {
    const tierKey = pickRandom(["T1", "T2", "T3"]);
    const tier = bossTiers[tierKey];

    const owned = getUnlockedRelics();
    const relicCount = Math.min(tier.minRelics, owned.length);
    const relics = relicCount > 0 ? pickUnique(owned, relicCount) : [];

    const maps = ["Astra", "Ashes of the Damned", "Paradox Junction"];
    const map = pickRandom(maps);

    applyMapTheme(map);

    const fieldUp = assignFieldUpgrades();

    const data = {
        tier: tier.label,
        map,
        relics,
        fieldUpgrades: fieldUp
    };

    renderBossChallenge(data);
    return data;
}

export function generateStandardSurvival() {
    const round = weightedPick(survivalRoundValues, survivalRoundWeights);
    const map = pickRandom(survivalMaps);

    applyMapTheme(map);

    const owned = getUnlockedRelics();
    let relics = [];

    if (owned.length === 0) {
        relics = [];
    } else if (owned.length < 4) {
        relics = [...owned];
    } else {
        const maxCount = Math.min(10, owned.length);
        const count = Math.floor(Math.random() * (maxCount - 4 + 1)) + 4;
        relics = pickUnique(owned, count);
    }

    const fieldUp = assignFieldUpgrades();

    const data = {
        map,
        round,
        relics,
        fieldUpgrades: fieldUp
    };

    renderSurvivalChallenge(data);
    return data;
}

export function generateStandardTrail() {
    const maps = ["Astra", "Ashes of the Damned", "Paradox Junction"];
    const map = pickRandom(maps);

    applyMapTheme(map);

    let requiredRelic = null;

    if (map === "Astra") {
        requiredRelic = pickRandom(trailRules["Astra"].pool);
    }
    if (map === "Ashes of the Damned") {
        requiredRelic = pickRandom(trailRules["Ashes of the Damned"].pool);
    }
    if (map === "Paradox Junction") {
        requiredRelic = pickRandom(trailRules["Paradox Junction"].pool);
    }

    const data = {
        map,
        requiredRelic,
        relics: []
    };

    renderTrailChallenge(data);
    return data;
}

/* ============================================================
   EXTREME MODE GENERATORS
============================================================ */

function getExtremeRelicCount() {
    const { min, max } = extremeRelicRange;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getExtremeRelics() {
    const weighted = getExtremeOwnedWeightedList();
    if (!weighted.length) return [];

    const unique = [];
    const used = new Set();

    while (unique.length < getExtremeRelicCount() && weighted.length > 0) {
        const r = pickRandom(weighted);
        if (!used.has(r)) {
            used.add(r);
            unique.push(r);
        }
    }

    return unique;
}

export function generateExtremeBoss() {
    const tierKey = pickRandom(["T1", "T2", "T3"]);
    const tier = bossTiers[tierKey];

    const ownedWeighted = getExtremeOwnedWeightedList();
    let relics = [];

    if (ownedWeighted.length) {
        const ownedUnique = Array.from(new Set(ownedWeighted));
        const relicCount = Math.min(tier.minRelics, ownedUnique.length);
        relics = pickUnique(ownedUnique, relicCount);
    }

    const maps = ["Astra", "Ashes of the Damned", "Paradox Junction"];
    const map = pickRandom(maps);

    applyMapTheme(map);

    const fieldUp = assignFieldUpgrades();

    const data = {
        tier: tier.label,
        map,
        relics,
        fieldUpgrades: fieldUp
    };

    renderBossChallenge(data);
    return data;
}

export function generateExtremeSurvival() {
    const round = weightedPick(survivalRoundValues, survivalRoundWeights);
    const map = pickRandom(survivalMaps);

    applyMapTheme(map);

    const relics = getExtremeRelics();
    const fieldUp = assignFieldUpgrades();

    const data = {
        map,
        round,
        relics,
        fieldUpgrades: fieldUp
    };

    renderSurvivalChallenge(data);
    return data;
}

export function generateExtremeTrail() {
    const maps = ["Astra", "Ashes of the Damned", "Paradox Junction"];
    const map = pickRandom(maps);

    applyMapTheme(map);

    let requiredRelic = null;

    if (map === "Astra") {
        requiredRelic = pickRandom(trailRules["Astra"].pool);
    }
    if (map === "Ashes of the Damned") {
        requiredRelic = pickRandom(trailRules["Ashes of the Damned"].pool);
    }
    if (map === "Paradox Junction") {
        requiredRelic = pickRandom(trailRules["Paradox Junction"].pool);
    }

    const data = {
        map,
        requiredRelic,
        relics: []
    };

    renderTrailChallenge(data);
    return data;
}

/* ============================================================
   DUPLICATE CHECKER
============================================================ */

function isDuplicateChallenge(newChallenge) {
    return state.currentRun.some(c =>
        c.type === newChallenge.type &&
        c.round === newChallenge.round &&
        c.tier === newChallenge.tier &&
        c.map === newChallenge.map &&
        c.requiredRelic === newChallenge.requiredRelic &&
        JSON.stringify(c.relics) === JSON.stringify(newChallenge.relics)
    );
}

/* ============================================================
   FINISH RUN
============================================================ */

function finishRun() {
    const summary = {
        players: [...state.gamertags],
        challenges: [...state.currentRun]
    };

    sessionStorage.setItem("completedRun", JSON.stringify(summary));

    resetRunState();
    window.location.href = "summary.html";
}

/* ============================================================
   CHALLENGE ROUTER
============================================================ */

export function generateChallenge(type) {
    clearChallengePanel();
    resetStopwatch();

    if (state.currentRun.length >= 3) return;

    state.currentChallengeType = type;
    state.currentMode = state.challengeModeType;

    let data = null;

    if (state.challengeModeType === "standard") {
        if (type === "boss") data = generateStandardBoss();
        if (type === "survival") data = generateStandardSurvival();
        if (type === "trail") data = generateStandardTrail();
    } else {
        if (type === "boss") data = generateExtremeBoss();
        if (type === "survival") data = generateExtremeSurvival();
        if (type === "trail") data = generateExtremeTrail();
    }

    const packaged = {
        mode: state.challengeModeType === "standard" ? "Standard" : "Extreme",
        type,
        ...data,
        timeSeconds: 0
    };

    // Duplicate checking only in Standard mode
    if (state.challengeModeType === "standard" && isDuplicateChallenge(packaged)) {
        return generateChallenge(type);
    }

    state.currentRun.push(packaged);
    saveSession();

    if (state.challengeModeType === "standard") {
        if (type === "boss") $("bossBtn").style.display = "none";
        if (type === "survival") $("survivalBtn").style.display = "none";
        if (type === "trail") $("trailBtn").style.display = "none";
    }

    const beginBtn = $("beginBtn");
    const passFail = $("passFailContainer");
    if (beginBtn && passFail) {
        beginBtn.style.display = "inline-block";
        passFail.style.display = "none";
    }
}

/* ============================================================
   EXTREME QUEUE
============================================================ */

export function setupExtremeQueue() {
    state.extremeQueue = ["boss", "survival", "trail"];
    for (let i = state.extremeQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [state.extremeQueue[i], state.extremeQueue[j]] = [state.extremeQueue[j], state.extremeQueue[i]];
    }
    state.extremeIndex = 0;
    saveSession();
}

export function generateNextExtremeChallenge() {
    if (state.extremeIndex >= state.extremeQueue.length) return;

    const beginBtn = $("beginBtn");
    const passFail = $("passFailContainer");
    if (beginBtn && passFail) {
        beginBtn.style.display = "inline-block";
        passFail.style.display = "none";
    }

    const type = state.extremeQueue[state.extremeIndex];
    generateChallenge(type);
}

/* ============================================================
   PASS / FAIL
============================================================ */

export function markPass() {
    stopStopwatch();
    state.sessionWins++;

    const last = state.currentRun[state.currentRun.length - 1];
    if (last) {
        last.timeSeconds = state.stopwatchTime;
    }

    saveSession();

    const beginBtn = $("beginBtn");
    const passFail = $("passFailContainer");
    if (beginBtn && passFail) {
        passFail.style.display = "none";
    }

    if (state.currentRun.length === 3) {
        finishRun();
        return;
    }

    if (state.challengeModeType === "extreme") {
        state.extremeIndex++;

        resetStopwatch();

        if (state.extremeIndex < state.extremeQueue.length) {
            generateNextExtremeChallenge();
        }
    }
}

export function markFail() {
    stopStopwatch();
    resetRunState();
    state.sessionFails++;
    saveSession();

    const setup = $("setupContainer");
    const area = $("challengeArea");
    if (setup && area) {
        setup.classList.remove("locked");   // unlock setup
        setup.style.display = "block";
        area.style.display = "none";
    }

    const beginBtn = $("beginBtn");
    const passFail = $("passFailContainer");
    if (beginBtn && passFail) {
        beginBtn.style.display = "none";
        passFail.style.display = "none";
    }
}

/* ============================================================
   SUMMARY OBJECT
============================================================ */

export function buildSummaryObject() {
    const last = state.currentRun[state.currentRun.length - 1];
    if (!last) return null;

    const seconds = last.timeSeconds || 0;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return {
        mode: last.mode || state.currentMode,
        type: last.type || null,
        map: last.map || null,
        round: last.round || null,
        tier: last.tier || null,
        requiredRelic: last.requiredRelic || null,
        relics: last.relics || [],
        time: seconds > 0 ? `${mins}:${secs.toString().padStart(2, "0")}` : null
    };
}

/* ============================================================
   RESET RUN
============================================================ */

export function resetRun() {
    resetRunState();
    clearChallengePanel();
}

