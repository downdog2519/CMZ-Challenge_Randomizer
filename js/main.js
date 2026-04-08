/* ============================================================
   MAIN.JS — App Orchestration + Event Wiring + Session Restore
   ============================================================ */

import {
    state,
    saveProfile,
    saveSession,
    resetRunState
} from "./state.js";

import {
    renderGamertagInputs,
    renderRelicOwnership,
    updateModeToggleText,
    updateSessionStats,
    showChallengePanel,
    hideChallengePanel,
    showChallengeButtons,
    hideChallengeButtons,
    showBeginButton,
    hideBeginButton,
    showPassFail,
    hidePassFail,
    unlockSetupPanel
} from "./ui.js";

import {
    beginRun,
    beginChallenge,
    beginExtremeChallenge,
    markPass,
    markFail,
    startStopwatch,
    stopStopwatch,
    resetStopwatch
} from "./logic.js";

import { applyMapTheme } from "./renderers.js";

/* ============================================================
   DOM ELEMENTS
   ============================================================ */

const playerCountInput = document.getElementById("playerCountInput");
const challengeStageSelect = document.getElementById("challengeStageSelect");
const modeToggleBtn = document.getElementById("modeToggleBtn");
const confirmPlayersBtn = document.getElementById("confirmPlayersBtn");

const bossBtn = document.getElementById("bossBtn");
const survivalBtn = document.getElementById("survivalBtn");
const trailBtn = document.getElementById("trailBtn");
const startingBtn = document.getElementById("startingBtn");

const beginBtn = document.getElementById("beginBtn");
const passBtn = document.getElementById("passBtn");
const failBtn = document.getElementById("failBtn");

const resetSessionBtn = document.getElementById("resetSessionBtn");
const themeToggleBtn = document.getElementById("themeToggleBtn");

/* ============================================================
   INITIALIZATION
   ============================================================ */

function initializeUI() {
    playerCountInput.value = state.playerCount;
    challengeStageSelect.value = state.challengeStageCount;

    renderGamertagInputs();
    renderRelicOwnership();
    updateModeToggleText();
    updateSessionStats();

    if (state.currentRun.length > 0) {
        restoreSessionState();
    } else {
        hideChallengePanel();
    }
}

/* ============================================================
   SESSION RESTORE
   ============================================================ */

function restoreSessionState() {
    showChallengePanel();

    if (state.stopwatchActive) {
        startStopwatch();
    } else {
        resetStopwatch();
    }

    const last = state.currentRun[state.currentRun.length - 1];
    if (last?.map) applyMapTheme(last.map);

    if (state.currentChallengeType) {
        hideBeginButton();
        hideChallengeButtons();
        showPassFail();
    } else {
        showBeginButton();
        hidePassFail();
        showChallengeButtons();
    }
}

/* ============================================================
   EVENT LISTENERS
   ============================================================ */

playerCountInput.addEventListener("change", () => {
    state.playerCount = Number(playerCountInput.value);
    saveProfile();
    renderGamertagInputs();
});

challengeStageSelect.addEventListener("change", () => {
    state.challengeStageCount = Number(challengeStageSelect.value);
    saveProfile();
});

modeToggleBtn.addEventListener("click", () => {
    state.challengeModeType =
        state.challengeModeType === "standard" ? "extreme" : "standard";

    saveProfile();
    updateModeToggleText();
});

/* ---------- Settings Button ---------- */
const settingsBtn = document.getElementById("settingsBtn");

settingsBtn.addEventListener("click", () => {
    window.electronAPI.openSettings();
});

confirmPlayersBtn.addEventListener("click", () => {
    const modal = document.getElementById("confirmModal");
    modal.style.display = "flex";

    const confirmBtn = document.getElementById("modalConfirmBtn");
    const cancelBtn = document.getElementById("modalCancelBtn");

    const closeModal = () => modal.style.display = "none";

    confirmBtn.onclick = () => {
        closeModal();
        document.querySelector(".main-layout").classList.add("full-right");
        showChallengePanel();
        beginRun();
    };

    cancelBtn.onclick = closeModal;
});

/* ---------- Challenge Buttons ---------- */

bossBtn.addEventListener("click", () => beginChallenge("boss"));
survivalBtn.addEventListener("click", () => beginChallenge("survival"));
trailBtn.addEventListener("click", () => beginChallenge("trail"));
startingBtn.addEventListener("click", () => beginChallenge("starting"));

/* ---------- Begin Button ---------- */

beginBtn.addEventListener("click", () => {
    if (state.currentMode === "extreme") {
        beginExtremeChallenge();
    } else {
        showChallengeButtons();
        hideBeginButton();
    }
});

/* ---------- Pass / Fail ---------- */

passBtn.addEventListener("click", () => markPass());
failBtn.addEventListener("click", () => markFail());

/* ---------- Reset Session (FULL RESET) ---------- */

resetSessionBtn.addEventListener("click", () => {
    state.sessionWins = 0;
    state.sessionFails = 0;

    resetRunState();
    saveSession();
    updateSessionStats();

    // Restore layout to default
    document.querySelector(".main-layout").classList.remove("full-right");

    // Hide challenge panel
    hideChallengePanel();

    // Unlock setup panel
    unlockSetupPanel();

    // Reset UI buttons
    showBeginButton();
    showChallengeButtons();
});

themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

/* ============================================================
   STARTUP
   ============================================================ */

initializeUI();