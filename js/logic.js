/* ============================================================
   LOGIC.JS — Challenge Logic, Stopwatch, Run Flow
   ============================================================ */

import { state, saveSession } from "./state.js";
import {
    survivalRoundValues,
    survivalRoundWeightsStandard,
    trailRules,
    trailMapGrimRelics,
    survivalMaps,
    startingRoomRoundsQuick,
    startingRoomWeightsQuick,
    startingRoomRoundsNormal,
    startingRoomWeightsNormal,
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
   SETTINGS READER
   ============================================================ */

function loadGameSettings() {
    try { return JSON.parse(localStorage.getItem('cmz_settings') || '{}'); }
    catch { return {}; }
}

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
   BOSS RELIC LOGIC 
   ============================================================ */

/* Build the required base set for a tier (no bonus) */
function buildBaseBossRelics(tier, owned, grim, sinister, wicked) {
    let base = [];

    if (tier === "T1") {
        if (wicked.length >= 1)  base = [pickRandom(wicked)];
        else if (grim.length >= 1) base = [pickRandom(grim)];
        else                      base = pickUnique(owned, Math.min(1, owned.length));

    } else if (tier === "T2") {
        if (wicked.length >= 2)                          base = pickUnique(wicked, 2);
        else if (wicked.length >= 1 && grim.length >= 1) base = [pickRandom(wicked), pickRandom(grim)];
        else                                             base = pickUnique(owned, Math.min(2, owned.length));

    } else if (tier === "T3") {
        if (wicked.length >= 3)                              base = pickUnique(wicked, 3);
        else if (wicked.length >= 2 && sinister.length >= 2) base = [...pickUnique(wicked, 2), ...pickUnique(sinister, 2)];
        else                                                 base = pickUnique(owned, Math.min(3, owned.length));
    }

    return base;
}

/* Build the default (level 3) relic set for any tier — required base + 60% bonus */
function buildDefaultBossRelics(tier, owned, grim, sinister, wicked) {
    const base      = buildBaseBossRelics(tier, owned, grim, sinister, wicked);
    if (tier !== "T3" && tier !== "T2" && tier !== "T1") return base;

    const remaining  = owned.filter(r => !base.includes(r));
    const bonusCount = Math.round(owned.length * 0.6);
    const bonus      = pickUnique(remaining, Math.min(bonusCount, remaining.length));
    return [...base, ...bonus];
}

function generateBossRelicsForTier(tier) {
    if (noRelicsUnlocked()) return [];

    const settings  = loadGameSettings();
    const level     = settings.bossRelicLevel ?? 3;
    const owned     = state.unlockedRelics.slice();
    const grim      = getUnlockedGrim();
    const sinister  = getUnlockedSinister();
    const wicked    = getUnlockedWicked();

    /* ── Level 5 — 100% of all owned relics ── */
    if (level === 5) return owned.slice();

    /* ── Level 4 — 80% of all owned relics ── */
    if (level === 4) {
        const count = Math.max(1, Math.round(owned.length * 0.8));
        return pickUnique(owned, count);
    }

    /* ── Level 3 (default) — required base + 60% bonus ── */
    if (level === 3) return buildDefaultBossRelics(tier, owned, grim, sinister, wicked);

    /* ── Levels 1 & 2 — required base, Grim/Sinister preferred over Wicked ── */
    if (level === 1) {
        // Required minimum — Grim/Sinister first, Wicked last resort
        if (tier === "T1") {
            if (grim.length)     return [pickRandom(grim)];
            if (sinister.length) return [pickRandom(sinister)];
            return wicked.length ? [pickRandom(wicked)] : [];
        }
        if (tier === "T2") {
            const pref = [...grim, ...sinister];
            if (pref.length >= 2)                   return pickUnique(pref, 2);
            if (pref.length === 1 && wicked.length) return [...pref, pickRandom(wicked)];
            return pickUnique(owned, Math.min(2, owned.length));
        }
        // T3 falls back to default at level 1
        return buildBaseBossRelics("T3", owned, grim, sinister, wicked);
    }

    // Level 2 — required base + 1 extra Grim or Sinister
    const base      = buildBaseBossRelics(tier, owned, grim, sinister, wicked);
    const extraPool = [...grim, ...sinister].filter(r => !base.includes(r));
    if (extraPool.length) return [...base, pickRandom(extraPool)];
    return base;
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
   SURVIVAL RELIC HELPER — TIER + LEVEL % SYSTEM
   ============================================================ */

/* % value each relic contributes toward a tier threshold */
function relicPct(relic) {
    if (grimRelics.includes(relic))     return 100 / 3;  // 3 grims  = 100%
    if (sinisterRelics.includes(relic)) return 50;        // 2 sinist = 100%
    if (wickedRelics.includes(relic))   return 100;       // 1 wicked = 100%
    return 0;
}

/* Pick relics at random until accumulated % reaches targetPct (or pool exhausted) */
function pickRelicsToPct(pool, targetPct) {
    const shuffled    = pickUnique(pool, pool.length);
    const result      = [];
    let   accumulated = 0;
    for (const relic of shuffled) {
        if (accumulated >= targetPct) break;
        result.push(relic);
        accumulated += relicPct(relic);
    }
    return result;
}

function generateSurvivalRelics(runMode) {
    if (noRelicsUnlocked()) return [];

    const settings = loadGameSettings();
    const level    = settings.survivalRelicLevel ?? 3;
    const tier     = state.selectedTier ?? 0;
    const owned    = state.unlockedRelics.slice();
    const grim     = getUnlockedGrim();
    const sinister = getUnlockedSinister();

    const isCursed = runMode === 'quickSurvivalCursed' || runMode === 'normalSurvival';
    if (!isCursed) return [];

    // Tier 0 — no relics regardless of level
    if (tier === 0) return [];

    // Level 1 — no relics for any tier
    if (level === 1) return [];

    // Level 2 — Tier 1 and 2 only: pick exactly 1 relic; Tier 3 falls through to level 3
    if (level === 2 && tier <= 2) {
        return owned.length ? [pickRandom(owned)] : [];
    }

    // Level 5 — pick until 800% from all owned (any tier)
    if (level === 5) return pickRelicsToPct(owned, 800);

    // Level 4 — Tier 3 only: pick until 600%; all other tiers fall through to level 3
    if (level === 4 && tier === 3) return pickRelicsToPct(owned, 600);

    /* ── Level 3 (default) — tier-based % targets with extras ── */
    const tierTargetPct = [0, 100, 200, 300];
    const targetPct     = tierTargetPct[tier] ?? 100;

    const base      = pickRelicsToPct(owned, targetPct);
    const remaining = owned.filter(r => !base.includes(r));

    if (tier === 1) {
        // +1 extra Grim or Sinister from remaining owned
        const extras = [...grim, ...sinister].filter(r => remaining.includes(r));
        if (extras.length) return [...base, pickRandom(extras)];
        return base;
    }
    if (tier === 2) {
        // up to 80% of remaining owned relics added as bonus
        const bonusCount = Math.round(remaining.length * 0.8);
        return [...base, ...pickUnique(remaining, bonusCount)];
    }
    if (tier === 3) {
        // +1 extra relic from remaining (350% allowance total)
        if (remaining.length) return [...base, pickRandom(remaining)];
        return base;
    }

    return base;
}

/* ============================================================
   SURVIVAL ROUND RANGE HELPER
   ============================================================ */

function getSurvivalRoundPool(runMode) {
    const settings   = loadGameSettings();
    const allRounds  = survivalRoundValues;
    const allWeights = survivalRoundWeightsStandard;
    const lastIdx    = allRounds.length - 1;

    let minIdx, maxIdx;

    switch (runMode) {
        case 'quickSurvivalStandard':
            minIdx = settings.quickStandardMinRound ?? 0;
            maxIdx = settings.quickStandardMaxRound ?? 4;
            break;
        case 'quickSurvivalCursed':
        case 'normalSurvival':
            // All cursed survival modes share the same round range setting
            minIdx = settings.cursedMinRound ?? 4;
            maxIdx = settings.cursedMaxRound ?? 12;
            break;
        default:
            return { rounds: allRounds, weights: allWeights };
    }

    minIdx = Math.max(0, Math.min(minIdx, lastIdx));
    maxIdx = Math.max(minIdx, Math.min(maxIdx, lastIdx));

    return {
        rounds:  allRounds.slice(minIdx, maxIdx + 1),
        weights: allWeights.slice(minIdx, maxIdx + 1)
    };
}

/* ============================================================
   CHALLENGE GENERATORS (TYPE INCLUDED)
   ============================================================ */

/**
 * Boss challenge.
 *  runMode: 'quickBoss'           → Standard, no tier, no relics
 *  runMode: 'normalBoss'          → Tier-based, relics from player pool
 *  runMode: 'round101Standard'    → Round 101, no relics
 *  runMode: 'round101Cursed'      → Round 101, T3 relics + 60% bonus
 */
function generateBossChallenge() {
    const bossMaps = ["Astra", "Ashes of the Damned", "Paradox Junction"];
    const map = pickRandom(bossMaps);
    // In a mixed normal sequence state.runMode may be e.g. 'normalSurvival';
    // treat any normal-prefixed mode as 'normalBoss' for this generator.
    const raw = state.runMode || 'quickBoss';
    const runMode = raw.startsWith('normal') ? 'normalBoss' : raw;
    const tier    = state.selectedTier ?? 0;

    const tierLabels = ['T0', 'T1', 'T2', 'T3'];
    const tierLabel  = tierLabels[tier] || 'T0';

    const isRound101 = runMode === 'round101Standard' || runMode === 'round101Cursed';
    const round      = isRound101 ? 101 : null;

    let relics = [];

    if (runMode === 'quickBoss' || runMode === 'round101Standard') {
        relics = [];
    } else if (runMode === 'normalBoss' || runMode === 'round101Cursed') {
        relics = generateBossRelicsForTier(tierLabel);
    }

    let label;
    if (runMode === 'round101Standard') label = 'Round 101 Boss Fight — Standard';
    else if (runMode === 'round101Cursed') label = 'Round 101 Boss Fight — Cursed';
    else if (runMode === 'quickBoss')       label = 'Boss Challenge — Standard';
    else label = `Boss Challenge — ${tierLabel}`;

    const settings = loadGameSettings();
    const fu = settings.bossFieldUpgrades !== false ? generateFieldUpgrades() : [];

    return {
        type: 'boss',
        label,
        map,
        tier: tierLabel,
        round,
        relics,
        fieldUpgrades: fu
    };
}

/**
 * Survival challenge.
 *  runMode: 'quickSurvivalStandard' → rounds 11-31 (or settings range), field upgrades, no relics
 *  runMode: 'quickSurvivalCursed'   → rounds 11-31 (or settings range), field upgrades, relics via level
 *  runMode: 'normalSurvival'        → full round table (or settings range), field upgrades, relics via level
 */
function generateSurvivalChallenge() {
    const map = pickRandom(survivalMaps);
    // In a mixed normal sequence state.runMode may be e.g. 'normalBoss';
    // treat any normal-prefixed mode as 'normalSurvival' for this generator.
    const raw = state.runMode || 'quickSurvivalStandard';
    const runMode = raw.startsWith('normal') ? 'normalSurvival' : raw;

    const { rounds, weights } = getSurvivalRoundPool(runMode);
    const round = weightedPick(rounds, weights);

    const relics = runMode === 'quickSurvivalStandard' ? [] : generateSurvivalRelics(runMode);

    const label = runMode === 'quickSurvivalCursed' ? 'Survival — Cursed'
                : runMode === 'normalSurvival'       ? 'Survival — Cursed'
                : 'Survival — Standard';

    const settings = loadGameSettings();
    const fu = settings.survivalFieldUpgrades !== false ? generateFieldUpgrades() : [];

    return {
        type: 'survival',
        label,
        map,
        round,
        relics,
        fieldUpgrades: fu
    };
}

/**
 * Trail challenge.
 *  Quick Play: pick from Grim relics on that map that player does NOT own.
 *  Normal Mode: pick from any relic on that map that player does NOT own.
 */
function generateTrailChallenge() {
    // In a mixed normal sequence state.runMode may be e.g. 'normalBoss';
    // treat any normal-prefixed mode as 'normalTrail' for this generator.
    const raw = state.runMode || 'quickTrail';
    const runMode   = raw.startsWith('normal') ? 'normalTrail' : raw;
    const mapNames  = Object.keys(trailRules);
    const owned     = state.unlockedRelics;

    // Try each map in random order until we find one with an unowned relic
    const shuffledMaps = mapNames
        .map(m => ({ m, r: Math.random() }))
        .sort((a, b) => a.r - b.r)
        .map(o => o.m);

    let chosenMap = null;
    let chosenRelic = null;

    for (const mapName of shuffledMaps) {
        let pool;
        if (runMode === 'quickTrail') {
            pool = (trailMapGrimRelics[mapName] || []).filter(r => !owned.includes(r));
        } else {
            pool = trailRules[mapName].pool.filter(r => !owned.includes(r));
        }
        if (pool.length > 0) {
            chosenMap   = mapName;
            chosenRelic = pickRandom(pool);
            break;
        }
    }

    // Fallback: player owns everything — pick any random trail relic
    if (!chosenRelic) {
        chosenMap   = pickRandom(mapNames);
        const fallbackPool = runMode === 'quickTrail'
            ? (trailMapGrimRelics[chosenMap] || trailRules[chosenMap].pool)
            : trailRules[chosenMap].pool;
        chosenRelic = pickRandom(fallbackPool);
    }

    return {
        type: 'trail',
        label: 'Relic Trail',
        map: chosenMap,
        requiredRelic: chosenRelic,
        relics: [chosenRelic],
        fieldUpgrades: []
    };
}

/**
 * Starting Room challenge.
 *  Quick Play: rounds 11-31 weighted.
 *  Normal Mode: rounds 31-71 weighted.
 *  No relics. Field upgrades randomised and never duped.
 */
function generateStartingRoomChallenge() {
    // In a mixed normal sequence state.runMode may be e.g. 'normalBoss';
    // treat any normal-prefixed mode as 'normalStarting' for this generator.
    const raw = state.runMode || 'quickStarting';
    const runMode = raw.startsWith('normal') ? 'normalStarting' : raw;
    const isQuick = runMode === 'quickStarting';

    const rounds  = isQuick ? startingRoomRoundsQuick   : startingRoomRoundsNormal;
    const weights = isQuick ? startingRoomWeightsQuick  : startingRoomWeightsNormal;

    const map   = pickRandom(["Astra", "Ashes of the Damned"]);
    const round = weightedPick(rounds, weights);

    return {
        type: 'starting',
        label: 'Starting Room',
        map,
        round,
        relics: [],
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
    // Read run configuration set by app.js launchRun()
    state.runMode      = sessionStorage.getItem('cmz_runMode')  || 'quickBoss';
    state.selectedTier = Number(sessionStorage.getItem('cmz_tier') ?? 0);

    lockSetupPanel();
    showChallengePanel();
    hideChallengeButtons();
    hidePassFail();
    showBeginButton();

    resetStopwatch();
    clearChallengePanel();

    state.currentRun        = [];
    state.usedFieldUpgrades = [];
    state.currentMode       = 'standard';

    updateStandardChallengeAvailability();
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
    const singleChallengeMode = [
        'quickBoss', 'quickSurvivalStandard', 'quickSurvivalCursed',
        'quickTrail', 'quickStarting', 'round101Standard', 'round101Cursed'
    ].includes(state.runMode);

    hidePassFail();

    if (singleChallengeMode || state.currentRun.length >= state.challengeStageCount) {
        finishRun();
        return;
    }

    // Normal mode: advance through the pre-built stage sequence
    const rawSeq = sessionStorage.getItem('cmz_stageSequence');
    if (rawSeq) {
        const seq      = JSON.parse(rawSeq);
        const nextType = seq[state.currentRun.length] ?? null;
        if (nextType) {
            beginChallenge(nextType);
            return;
        }
        finishRun();
        return;
    }

    updateStandardChallengeAvailability();
    showChallengeButtons();
}

/* ============================================================
   SUMMARY — FULL RUN INCLUDED
   ============================================================ */

export function finishRun() {
    stopStopwatch();

    const last = state.currentRun[state.currentRun.length - 1];
    const runLabel = last?.label || state.runMode || 'Run';

    const summary = {
        runMode:       state.runMode,
        mode:          runLabel,
        type:          state.currentChallengeType,
        map:           last?.map ?? '—',
        round:         last?.round ?? null,
        tier:          last?.tier ?? null,
        requiredRelic: last?.requiredRelic ?? null,
        relics:        last?.relics ?? [],
        fieldUpgrades: last?.fieldUpgrades ?? [],
        time: `${Math.floor(state.stopwatchTime / 60)}:${(state.stopwatchTime % 60)
            .toString()
            .padStart(2, '0')}`,
        stages: state.currentRun
    };

    sessionStorage.setItem('summaryData', JSON.stringify(summary));

    // Write leaderboard entry
    try {
        const players = state.gamertags.length ? state.gamertags : ['Player 1'];
        const entry = {
            player:  players.join(', '),
            stage:   state.currentRun.length,
            mode:    runLabel,
            tier:    last?.tier ?? 'N/A',
            map:     last?.map ?? '—',
            relics:  (last?.relics ?? []).join(', ') || 'None',
            time:    summary.time,
            score:   state.sessionWins,
            fails:   state.sessionFails,
            date:    new Date().toLocaleDateString(),
            details: `W:${state.sessionWins} L:${state.sessionFails} | ${runLabel} | Map: ${last?.map}`
        };
        const lb = JSON.parse(localStorage.getItem('cmz_leaderboard') || '[]');
        lb.push(entry);
        localStorage.setItem('cmz_leaderboard', JSON.stringify(lb));
    } catch { /* non-critical */ }

    window.location.href = 'summary.html';
}