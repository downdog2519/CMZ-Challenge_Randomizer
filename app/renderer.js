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

    // Ensure setup is unlocked on fresh load
    $("setupContainer").classList.remove("locked");

    if (state.playerCount > 1 && $("gamertagInputs")) {
        $("gamertagInputs").style.display = "block";
    }

    if ($("summaryContent")) {
        const summary = buildSummaryObject();
        if (summary) renderSummaryData(summary);
    }
});

/* ============================================================
   PLAYER COUNT TOGGLE
============================================================ */

if ($("playerToggleBtn")) {
    $("playerToggleBtn").addEventListener("click", () => {
        let count = state.playerCount + 1;
        if (count > 4) count = 1;

        state.playerCount = count;
        state.gamertags.length = count;

        $("playerToggleBtn").textContent =
            count === 1 ? "Player Count: Solo" : `Player Count: ${count}`;

        renderGamertagInputs();
        saveSession();
    });
}

/* ============================================================
   MODE TOGGLE
============================================================ */

if ($("modeToggleBtn")) {
    $("modeToggleBtn").addEventListener("click", () => {
        toggleMode();
        updateModeLabel();
    });
}

/* ============================================================
   CONFIRM PLAYERS — LOCK SETUP PANEL
============================================================ */

if ($("confirmPlayersBtn")) {
    $("confirmPlayersBtn").addEventListener("click", () => {
        if (!confirmPlayers()) return;

        // KEEP SETUP VISIBLE
        $("setupContainer").style.display = "block";

        // SHOW RIGHT PANEL
        $("challengeArea").style.display = "block";

        // LOCK SETUP PANEL
        $("setupContainer").classList.add("locked");

        resetRun();

        const beginBtn = $("beginBtn");
        const passFail = $("passFailContainer");
        if (beginBtn && passFail) {
            beginBtn.style.display = "none";
            passFail.style.display = "none";
        }

        if (state.challengeModeType === "standard") {
            if ($("challengeButtons")) $("challengeButtons").style.display = "block";
        } else {
            if ($("challengeButtons")) $("challengeButtons").style.display = "none";
            setupExtremeQueue();
            generateNextExtremeChallenge();
        }
    });
}

/* ============================================================
   CHALLENGE BUTTONS (STANDARD ONLY)
============================================================ */

if ($("bossBtn")) {
    $("bossBtn").addEventListener("click", () => {
        if (state.challengeModeType !== "standard") return;
        if (state.currentRun.some(c => c.type === "boss")) return;
        generateChallenge("boss");
    });
}

if ($("survivalBtn")) {
    $("survivalBtn").addEventListener("click", () => {
        if (state.challengeModeType !== "standard") return;
        if (state.currentRun.some(c => c.type === "survival")) return;
        generateChallenge("survival");
    });
}

if ($("trailBtn")) {
    $("trailBtn").addEventListener("click", () => {
        if (state.challengeModeType !== "standard") return;
        if (state.currentRun.some(c => c.type === "trail")) return;
        generateChallenge("trail");
    });
}

/* ============================================================
   BEGIN / PASS / FAIL
============================================================ */

if ($("beginBtn")) {
    $("beginBtn").addEventListener("click", () => {
        if (!state.currentRun.length) return;

        resetStopwatch();
        startStopwatch();

        const beginBtn = $("beginBtn");
        const passFail = $("passFailContainer");
        if (beginBtn && passFail) {
            beginBtn.style.display = "none";
            passFail.style.display = "inline-block";
        }
    });
}

if ($("passBtn")) {
    $("passBtn").addEventListener("click", () => {
        if (!state.currentRun.length) return;
        markPass();
        updateSessionStats();
    });
}

if ($("failBtn")) {
    $("failBtn").addEventListener("click", () => {
        if (!state.currentRun.length) return;
        markFail();
        updateSessionStats();
    });
}

/* ============================================================
   RESET CHALLENGES — FULL PROGRAM RESET
============================================================ */

if ($("newChallengeBtn")) {
    $("newChallengeBtn").addEventListener("click", () => {

        // FULL RESET — CLEANEST POSSIBLE
        sessionStorage.clear();

        // Reload page to restore fresh state
        window.location.reload();
    });
}

/* ============================================================
   RESET SESSION STATS
============================================================ */

if ($("resetSessionBtn")) {
    $("resetSessionBtn").addEventListener("click", () => {
        resetSessionStats();
        updateSessionStats();
    });
}



