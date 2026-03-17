import { $, state, saveSession } from "./state.js";
import { grimRelics, sinisterRelics, wickedRelics, relicImages } from "./data.js";

/* ===================== COLOR HELPERS ===================== */

function getRelicColorClass(relic) {
    if (grimRelics.includes(relic)) return "relic-grim";
    if (sinisterRelics.includes(relic)) return "relic-sinister";
    if (wickedRelics.includes(relic)) return "relic-wicked";
    return "";
}

function getPlayerColorClass(index) {
    return ["player1", "player2", "player3", "player4"][index] || "";
}

/* ===================== GAMERTAG INPUTS ===================== */

export function renderGamertagInputs() {
    const container = $("gamertagInputs");
    if (!container) return;
    container.innerHTML = "";

    for (let i = 0; i < state.playerCount; i++) {
        const row = document.createElement("div");
        row.className = "gamertag-row";

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = `Player ${i + 1} Gamertag`;
        input.value = state.gamertags[i] || "";
        input.className = "gamertag-input";

        input.addEventListener("input", () => {
            state.gamertags[i] = input.value;
            saveSession();
        });

        row.appendChild(input);
        container.appendChild(row);
    }
}

/* ===================== RELIC OWNERSHIP ===================== */

export function renderRelicOwnership() {
    const grimCol = $("grimColumn");
    const sinCol = $("sinisterColumn");
    const wickCol = $("wickedColumn");

    grimCol.innerHTML = `<h3 class="relic-header grim-header">GRIM</h3>`;
    sinCol.innerHTML = `<h3 class="relic-header sinister-header">SINISTER</h3>`;
    wickCol.innerHTML = `<h3 class="relic-header wicked-header">WICKED</h3>`;

    function createTile(relic, poolClass) {
        const div = document.createElement("div");
        div.className = `relic-option ${poolClass}`;

        if (state.unlockedRelics.includes(relic)) {
            div.classList.add("selected");
        }

        const img = document.createElement("img");
        img.src = `./images/${relicImages[relic]}`;
        img.alt = relic;
        img.className = "relic-img";

        div.appendChild(img);

        div.addEventListener("click", () => {
            const idx = state.unlockedRelics.indexOf(relic);
            if (idx === -1) {
                state.unlockedRelics.push(relic);
                div.classList.add("selected");
            } else {
                state.unlockedRelics.splice(idx, 1);
                div.classList.remove("selected");
            }
            saveSession();
        });

        return div;
    }

    grimRelics.forEach(r => grimCol.appendChild(createTile(r, "relic-grim")));
    sinisterRelics.forEach(r => sinCol.appendChild(createTile(r, "relic-sinister")));
    wickedRelics.forEach(r => wickCol.appendChild(createTile(r, "relic-wicked")));
}

/* ===================== SESSION STATS ===================== */

export function updateSessionStats() {
    const winsEl = $("sessionWinsValue");
    const failsEl = $("sessionFailsValue");

    if (winsEl) winsEl.textContent = state.sessionWins;
    if (failsEl) failsEl.textContent = state.sessionFails;
}

/* ===================== MODE LABEL ===================== */

export function updateModeLabel() {
    const btn = $("modeToggleBtn");
    if (!btn) return;

    btn.textContent =
        state.challengeModeType === "standard"
            ? "Mode: Standard Challenges"
            : "Mode: Extreme Challenges";
}

/* ===================== BOSS CHALLENGE RENDER ===================== */

export function renderBossChallenge(data) {
    const result = $("result");
    if (!result) return;

    const relicHTML = data.relics.length
        ? data.relics.map(r => `<span class="${getRelicColorClass(r)}">${r}</span>`).join(", ")
        : "None";

    const fieldLines = data.fieldUpgrades.map((f, i) =>
        `<span class="${getPlayerColorClass(i)}">${f.player}</span>: ${f.upgrade}`
    ).join("<br>");

    result.innerHTML = `
        <div class="challenge-section">
            <div class="challenge-section-title">Boss Challenge (${data.tier})</div>
            <div class="challenge-line"><span class="map-title">Map:</span> ${data.map}</div>
            <div class="challenge-line"><span class="relic-title">Relics:</span> ${relicHTML}</div>
            <div class="challenge-line"><span class="field-title">Field Upgrades:</span><br>${fieldLines}</div>
        </div>
    `;
}

/* ===================== SURVIVAL CHALLENGE RENDER ===================== */

export function renderSurvivalChallenge(data) {
    const result = $("result");
    if (!result) return;

    const relicHTML = data.relics.length
        ? data.relics.map(r => `<span class="${getRelicColorClass(r)}">${r}</span>`).join(", ")
        : "None";

    const fieldLines = data.fieldUpgrades.map((f, i) =>
        `<span class="${getPlayerColorClass(i)}">${f.player}</span>: ${f.upgrade}`
    ).join("<br>");

    result.innerHTML = `
        <div class="challenge-section">
            <div class="challenge-section-title">Survival of the Fit</div>
            <div class="challenge-line"><span class="map-title">Map:</span> ${data.map}</div>
            <div class="challenge-line"><strong>Target Round:</strong> ${data.round}</div>
            <div class="challenge-line"><span class="relic-title">Relics:</span> ${relicHTML}</div>
            <div class="challenge-line"><span class="field-title">Field Upgrades:</span><br>${fieldLines}</div>
        </div>
    `;
}

/* ===================== TRAIL CHALLENGE RENDER ===================== */

export function renderTrailChallenge(data) {
    const result = $("result");
    if (!result) return;

    const relicHTML = `<span class="${getRelicColorClass(data.requiredRelic)}">${data.requiredRelic}</span>`;

    result.innerHTML = `
        <div class="challenge-section">
            <div class="challenge-section-title">Relic Trail: ${data.map}</div>
            <div class="challenge-line"><span class="relic-title">Required Relic:</span> ${relicHTML}</div>
        </div>
    `;
}

/* ===================== STOPWATCH RENDER ===================== */

export function renderStopwatch() {
    const el = $("stopwatchTimer");
    if (!el) return;

    if (!state.stopwatchActive && state.stopwatchTime === 0) {
        el.textContent = "";
        return;
    }

    const seconds = state.stopwatchTime;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    el.textContent = `Time: ${mins}:${secs.toString().padStart(2, "0")}`;
}

/* ===================== CLEAR PANEL ===================== */

export function clearChallengePanel() {
    const result = $("result");
    if (result) result.innerHTML = "";
}

/* ===================== SUMMARY PAGE RENDER ===================== */

export function renderSummaryData(summary) {
    const container = $("summaryContent");
    if (!container) return;

    container.innerHTML = `
        <p><strong>Mode:</strong> ${summary.mode || "N/A"}</p>
        <p><strong>Type:</strong> ${summary.type || "N/A"}</p>
        ${summary.map ? `<p><strong>Map:</strong> ${summary.map}</p>` : ""}
        ${summary.round ? `<p><strong>Round:</strong> ${summary.round}</p>` : ""}
        ${summary.tier ? `<p><strong>Tier:</strong> ${summary.tier}</p>` : ""}
        ${summary.requiredRelic ? `<p><strong>Required Relic:</strong> ${summary.requiredRelic}</p>` : ""}
        ${summary.relics.length ? `<p><strong>Relics:</strong> ${summary.relics.join(", ")}</p>` : ""}
        ${summary.time ? `<p><strong>Time:</strong> ${summary.time}</p>` : ""}
    `;
}



