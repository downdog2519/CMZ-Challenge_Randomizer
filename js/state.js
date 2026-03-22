/* ============================================================
   STATE.JS — Hybrid Persistence (localStorage + sessionStorage)
   ============================================================ */

/* ============================================================
   STORAGE HELPERS
   ============================================================ */

function loadLocal(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

function saveLocal(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function loadSession(key, fallback) {
    try {
        const raw = sessionStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

function saveSessionValue(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
}

/* ============================================================
   STATE OBJECT — Divided Into Profile + Session
   ============================================================ */

export const state = {

    /* ---------- PLAYER PROFILE (localStorage) ---------- */
    playerCount: loadLocal("playerCount", 1),
    gamertags: loadLocal("gamertags", []),
    unlockedRelics: loadLocal("unlockedRelics", []),
    challengeModeType: loadLocal("challengeModeType", "standard"),
    challengeStageCount: loadLocal("challengeStageCount", 3),

    /* ---------- SESSION STATE (sessionStorage) ---------- */
    currentRun: loadSession("currentRun", []),
    currentChallengeType: loadSession("currentChallengeType", null),
    currentMode: loadSession("currentMode", "standard"),

    extremeQueue: loadSession("extremeQueue", []),
    extremeIndex: loadSession("extremeIndex", 0),

    stopwatchTime: loadSession("stopwatchTime", 0),
    stopwatchActive: loadSession("stopwatchActive", false),

    sessionWins: loadSession("sessionWins", 0),
    sessionFails: loadSession("sessionFails", 0),

    selectedTrailRelic: loadSession("selectedTrailRelic", null),

    /* ⭐ NEW — Track used field upgrades across the run */
    usedFieldUpgrades: loadSession("usedFieldUpgrades", [])
};

/* ============================================================
   SAVE FUNCTIONS
   ============================================================ */

export function saveProfile() {
    saveLocal("playerCount", state.playerCount);
    saveLocal("gamertags", state.gamertags);
    saveLocal("unlockedRelics", state.unlockedRelics);
    saveLocal("challengeModeType", state.challengeModeType);
    saveLocal("challengeStageCount", state.challengeStageCount);
}

export function saveSession() {
    saveSessionValue("currentRun", state.currentRun);
    saveSessionValue("currentChallengeType", state.currentChallengeType);
    saveSessionValue("currentMode", state.currentMode);

    saveSessionValue("extremeQueue", state.extremeQueue);
    saveSessionValue("extremeIndex", state.extremeIndex);

    saveSessionValue("stopwatchTime", state.stopwatchTime);
    saveSessionValue("stopwatchActive", state.stopwatchActive);

    saveSessionValue("sessionWins", state.sessionWins);
    saveSessionValue("sessionFails", state.sessionFails);

    saveSessionValue("selectedTrailRelic", state.selectedTrailRelic);

    /* ⭐ NEW — Persist used field upgrades */
    saveSessionValue("usedFieldUpgrades", state.usedFieldUpgrades);
}

/* ============================================================
   STATE MUTATORS — PROFILE
   ============================================================ */

export function setPlayerCount(count) {
    state.playerCount = Number(count);
    saveProfile();
}

export function setChallengeStageCount(count) {
    state.challengeStageCount = Number(count);
    saveProfile();
}

export function setGamertag(index, name) {
    state.gamertags[index] = name;
    saveProfile();
}

export function toggleRelic(name) {
    if (state.unlockedRelics.includes(name)) {
        state.unlockedRelics = state.unlockedRelics.filter(r => r !== name);
    } else {
        state.unlockedRelics.push(name);
    }
    saveProfile();
}

/* ============================================================
   STATE MUTATORS — SESSION
   ============================================================ */

export function resetRunState() {
    state.currentRun = [];
    state.currentChallengeType = null;
    state.currentMode = state.challengeModeType;

    state.extremeQueue = [];
    state.extremeIndex = 0;

    state.stopwatchTime = 0;
    state.stopwatchActive = false;

    state.selectedTrailRelic = null;

    /* ⭐ NEW — Reset field upgrade history for the run */
    state.usedFieldUpgrades = [];

    saveSession();
}

export function resetSessionStats() {
    state.sessionWins = 0;
    state.sessionFails = 0;
    saveSession();
}