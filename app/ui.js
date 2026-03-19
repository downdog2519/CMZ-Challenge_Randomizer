import { $, state, saveSession } from "./state.js";
import {
    grimRelics,
    sinisterRelics,
    wickedRelics,
    relicImages
} from "./data.js";

/* ============================================================
   MAP THEME HANDLER
============================================================ */

export function applyMapTheme(mapName) {
    const panel = $("challengeArea");
    if (!panel) return;

    const className = "map-" + mapName.replace(/\s+/g, "").replace(/'/g, "");

    // FIX: Copy classList first so we don't mutate while iterating
    [...panel.classList].forEach(c => {
        if (c.startsWith("map-")) panel.classList.remove(c);
    });

    panel.classList.add(className);
}



/* ============================================================
   RENDER GAMERTAG INPUTS
============================================================ */

export function renderGamertagInputs() {
    const container = $("gamertagInputs");
    if (!container) return;

    container.innerHTML = "";

    for (let i = 0; i < state.playerCount; i++) {
        const row = document.createElement("div");
        row.className = "gamertag-row";

        const input = document.createElement("input");
        input.className = "gamertag-input";
        input.placeholder = `Player ${i + 1} Gamertag`;
        input.value = state.gamertags[i] || "";

        input.addEventListener("input", () => {
            state.gamertags[i] = input.value;
            saveSession();
        });

        row.appendChild(input);
        container.appendChild(row);
    }
}

/* ============================================================
   RELIC OWNERSHIP RENDER
============================================================ */

export function renderRelicOwnership() {
    const grimCol = $("grimColumn");
    const sinCol = $("sinisterColumn");
    const wickCol = $("wickedColumn");

    if (!grimCol || !sinCol || !wickCol) return;

    grimCol.innerHTML = "";
    sinCol.innerHTML = "";
    wickCol.innerHTML = "";

    function createRelicOption(name) {
        const div = document.createElement("div");
        div.className = "relic-option";

        if (state.unlockedRelics.includes(name)) {
            div.classList.add("selected");
        }

        const img = document.createElement("img");
        img.className = "relic-img";

        // FIXED: Correct filename mapping
        img.src = `./images/relics/${relicImages[name]}`;
        img.alt = name;

        div.appendChild(img);

        div.addEventListener("click", () => {
            if (state.unlockedRelics.includes(name)) {
                state.unlockedRelics = state.unlockedRelics.filter(r => r !== name);
            } else {
                state.unlockedRelics.push(name);
            }
            saveSession();
            renderRelicOwnership();
        });

        return div;
    }

    grimRelics.forEach(r => grimCol.appendChild(createRelicOption(r)));
    sinisterRelics.forEach(r => sinCol.appendChild(createRelicOption(r)));
    wickedRelics.forEach(r => wickCol.appendChild(createRelicOption(r)));
}

/* ============================================================
   CLEAR CHALLENGE PANEL
============================================================ */

export function clearChallengePanel() {
    const result = $("result");
    if (result) result.innerHTML = "";

    const panel = $("challengeArea");
    if (panel) {
        panel.classList.forEach(c => {
            if (c.startsWith("map-")) panel.classList.remove(c);
        });
    }
}

/* ============================================================
   SESSION STATS
============================================================ */

export function updateSessionStats() {
    $("sessionWinsValue").textContent = state.sessionWins;
    $("sessionFailsValue").textContent = state.sessionFails;
}

/* ============================================================
   MODE LABEL
============================================================ */

export function updateModeLabel() {
    const btn = $("modeToggleBtn");
    if (!btn) return;

    btn.textContent =
        state.challengeModeType === "standard"
            ? "Mode: Standard Challenges"
            : "Mode: Extreme Challenges";
}

/* ============================================================
   STOPWATCH
============================================================ */

export function renderStopwatch() {
    const el = $("stopwatchTimer");
    if (!el) return;

    const secs = state.stopwatchTime;
    const m = Math.floor(secs / 60);
    const s = secs % 60;

    el.textContent = `Time: ${m}:${s.toString().padStart(2, "0")}`;
}

/* ============================================================
   SUMMARY RENDER
============================================================ */

export function renderSummaryData(summary) {
    const container = $("summaryContent");
    if (!container) return;

    container.innerHTML = JSON.stringify(summary, null, 2);
}

/* ============================================================
   CHALLENGE RENDERERS
============================================================ */

export function renderBossChallenge(data) {
    applyMapTheme(data.map);

    $("result").innerHTML = `
        <div class="challenge-section-title">Boss Challenge</div>
        <div class="challenge-line"><strong>Tier:</strong> ${data.tier}</div>
        <div class="challenge-line"><strong>Map:</strong> ${data.map}</div>

        <div class="challenge-line"><strong>Relics:</strong>
            ${data.relics.length ? data.relics.join(", ") : "None"}
        </div>

        <div class="challenge-line"><strong>Field Upgrades:</strong>
            ${data.fieldUpgrades.map(f => `${f.player}: ${f.upgrade}`).join(", ")}
        </div>
    `;
}

export function renderSurvivalChallenge(data) {
    applyMapTheme(data.map);

    $("result").innerHTML = `
        <div class="challenge-section-title">Survival of the Fit</div>
        <div class="challenge-line"><strong>Map:</strong> ${data.map}</div>
        <div class="challenge-line"><strong>Round:</strong> ${data.round}</div>

        <div class="challenge-line"><strong>Relics:</strong>
            ${data.relics.length ? data.relics.join(", ") : "None"}
        </div>

        <div class="challenge-line"><strong>Field Upgrades:</strong>
            ${data.fieldUpgrades.map(f => `${f.player}: ${f.upgrade}`).join(", ")}
        </div>
    `;
}

export function renderTrailChallenge(data) {
    applyMapTheme(data.map);

    $("result").innerHTML = `
        <div class="challenge-section-title">Relic Trail</div>
        <div class="challenge-line"><strong>Map:</strong> ${data.map}</div>

        <div class="challenge-line"><strong>Required Relic:</strong>
            ${data.requiredRelic}
        </div>
    `;
}



