// ===================== GLOBAL STATE =====================

export const state = {
    sessionWins: 0,
    sessionFails: 0,

    playerCount: 1,
    gamertags: [""],

    unlockedRelics: [],

    challengeModeType: "standard", // "standard" | "extreme"
    challengeStageCount: 2, // NEW — number of challenges (2,3,4)

    currentRun: [],
    currentMode: null,
    currentChallengeType: null,
    extremeQueue: [],
    extremeIndex: 0,

    stopwatchTime: 0,
    stopwatchActive: false,

    // ★ Stores the relic the player confirms during Relic Trail
    selectedTrailRelic: null,

    // ★ NEW — tracks the currently applied map theme
    activeMapTheme: null
};

// ===================== DOM HELPER =====================

export const $ = id => document.getElementById(id);

// ===================== SAVE SESSION =====================

export function saveSession() {
    sessionStorage.setItem("cmz_state", JSON.stringify(state));
}

// ===================== LOAD SESSION =====================

(function loadSession() {
    const raw = sessionStorage.getItem("cmz_state");
    if (!raw) return;
    const saved = JSON.parse(raw);
    Object.assign(state, saved);
})();

// ===================== RESET RUN =====================

export function resetRunState() {
    state.currentRun = [];
    state.currentMode = null;
    state.currentChallengeType = null;
    state.extremeQueue = [];
    state.extremeIndex = 0;

    state.stopwatchTime = 0;
    state.stopwatchActive = false;

    // Reset trail relic confirmation
    state.selectedTrailRelic = null;

    // ★ Reset active map theme
    state.activeMapTheme = null;

    saveSession();
}

// ===================== RESET SESSION STATS =====================

export function resetSessionStats() {
    state.sessionWins = 0;
    state.sessionFails = 0;
    saveSession();
}

export function setChallengeStageCount(value) {
    state.challengeStageCount = Number(value);
    saveSession();
}

export function setPlayerCount(value) {
    const num = Number(value);
    if (num >= 1 && num <= 4) {
        state.playerCount = num;
        state.gamertags.length = num;
        saveSession();
    }
}




