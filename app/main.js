import { $, state, saveSession, resetSessionStats } from "./state.js";
import {
    renderGamertagInputs,
    renderRelicOwnership,
    updateSessionStats,
    updateModeLabel,
    renderSummaryData,
    renderStopwatch
} from "./ui.js";
import {
    toggleMode,
    confirmPlayers,
    generateChallenge,
    markPass,
    markFail,
    buildSummaryObject,
    resetRun,
    setupExtremeQueue,
    generateNextExtremeChallenge,
    startStopwatch,
    resetStopwatch
} from "./logic.js";

/* ============================================================
   INITIAL RENDER
============================================================ */

window.addEventListener("DOMContentLoaded", () => {
    renderGamertagInputs();
    renderRelicOwnership();
    updateSessionStats();
    updateModeLabel();
    renderStopwatch();

    if (state.playerCount > 1 && $("gamertagInputs")) {
        $("gamertagInputs").style.display = "block";
    }

    // Summary page support
    if ($("summaryContent")) {
        const summary = buildSummaryObject();
        if (summary) renderSummaryData(summary);
    }

    // Restore UI if a run was in progress
    if (state.currentRun.length > 0) {
        $("setupContainer").classList.add("locked");
        $("challengeArea").style.display = "block";
    }
});

/* ============================================================
   PLAYER COUNT TOGGLE
============================================================ */

$("playerToggleBtn")?.addEventListener("click", () => {
    let count = state.playerCount + 1;
    if (count > 4) count = 1;

    state.playerCount = count;
    state.gamertags.length = count;

    $("playerToggleBtn").textContent =
        count === 1 ? "Player Count: Solo" : `Player Count: ${count}`;

    renderGamertagInputs();
    saveSession();
});

/* ============================================================
   MODE TOGGLE
============================================================ */

$("modeToggleBtn")?.addEventListener("click", () => {
    toggleMode();
    updateModeLabel();
});

/* ============================================================
   CONFIRM PLAYERS
============================================================ */

$("confirmPlayersBtn")?.addEventListener("click", () => {
    if (!confirmPlayers()) return;

    // NEW: Lock setup instead of hiding it
    $("setupContainer").classList.add("locked");

    // Show challenge panel on the right
    $("challengeArea").style.display = "block";

    resetRun();

    // Reset trail relic confirmation
    state.selectedTrailRelic = null;
    saveSession();

    // Reset Begin / Pass / Fail UI
    $("beginBtn").style.display = "none";
    $("passFailContainer").style.display = "none";

    if (state.challengeModeType === "standard") {
        $("challengeButtons").style.display = "block";
    } else {
        $("challengeButtons").style.display = "none";
        setupExtremeQueue();
        generateNextExtremeChallenge();
    }
});

/* ============================================================
   CHALLENGE BUTTONS (STANDARD ONLY)
============================================================ */

$("bossBtn")?.addEventListener("click", () => {
    if (state.challengeModeType !== "standard") return;
    if (state.currentRun.some(c => c.type === "boss")) return;
    generateChallenge("boss");
});

$("survivalBtn")?.addEventListener("click", () => {
    if (state.challengeModeType !== "standard") return;
    if (state.currentRun.some(c => c.type === "survival")) return;
    generateChallenge("survival");
});

$("trailBtn")?.addEventListener("click", () => {
    if (state.challengeModeType !== "standard") return;
    if (state.currentRun.some(c => c.type === "trail")) return;
    generateChallenge("trail");
});

/* ============================================================
   BEGIN / PASS / FAIL
============================================================ */

$("beginBtn")?.addEventListener("click", () => {
    if (!state.currentRun.length) return;

    resetStopwatch();
    startStopwatch();

    $("beginBtn").style.display = "none";
    $("passFailContainer").style.display = "inline-block";
});

$("passBtn")?.addEventListener("click", () => {
    if (!state.currentRun.length) return;
    markPass();
    updateSessionStats();
});

$("failBtn")?.addEventListener("click", () => {
    if (!state.currentRun.length) return;
    markFail();
    updateSessionStats();
});

/* ============================================================
   NEW CHALLENGE (FULL RESET)
============================================================ */

$("newChallengeBtn")?.addEventListener("click", () => {
    resetRun();
    $("result").innerHTML = "";

    // NEW: Unlock setup again
    $("setupContainer").classList.remove("locked");

    // Hide challenge area again
    $("challengeArea").style.display = "none";

    $("beginBtn").style.display = "none";
    $("passFailContainer").style.display = "none";
});

/* ============================================================
   RESET SESSION STATS
============================================================ */

$("resetSessionBtn")?.addEventListener("click", () => {
    resetSessionStats();
    updateSessionStats();
});



