/* ============================================================
   RENDERERS.JS — UI Rendering (No Logic, No State Mutations)
   ============================================================ */

import { getRelicClass, getMapClass } from "./utils.js";
import { grimRelics, sinisterRelics, wickedRelics } from "./data.js";

/* Cached DOM references */
const resultBox = document.getElementById("result");
const challengeArea = document.getElementById("challengeArea");

/* ============================================================
   CLEAR PANEL
   ============================================================ */

export function clearChallengePanel() {
    if (resultBox) resultBox.innerHTML = "";
}

/* ============================================================
   MAP THEME APPLICATION
   ============================================================ */

export function applyMapTheme(mapName) {
    const className = getMapClass(mapName);

    challengeArea.className = "panel panel-right";

    if (className) challengeArea.classList.add(className);

    if (!challengeArea.querySelector(".fog-layer")) {
        const fog = document.createElement("div");
        fog.className = "fog-layer";
        challengeArea.appendChild(fog);
    }
}

/* ============================================================
   RENDER HELPERS
   ============================================================ */

function addLine(text, cssClass = "") {
    const div = document.createElement("div");
    div.className = `challenge-line ${cssClass}`;
    div.textContent = text;
    resultBox.appendChild(div);
}

function addTitle(text) {
    const div = document.createElement("div");
    div.className = "challenge-section-title chalk-text";
    div.textContent = text;
    resultBox.appendChild(div);
}

/* ============================================================
   FIELD UPGRADE RENDERER (NEW)
   ============================================================ */

function renderFieldUpgrades(list) {
    if (!list || list.length === 0) return;

    addLine("Field Upgrades:");

    list.forEach(item => {
        // item = { player: "Ghost", upgrade: "Aether Shroud" }
        addLine(`• ${item.player}: ${item.upgrade}`);
    });
}

/* ============================================================
   BOSS CHALLENGE RENDERER
   ============================================================ */

export function renderBossChallenge(data) {
    clearChallengePanel();

    addTitle("Boss Challenge");

    addLine(`Map: ${data.map}`);
    addLine(`Tier: ${data.tier}`);

    if (data.relics?.length > 0) {
        addLine("Required Active Relics:");
        data.relics.forEach(r => {
            const relicClass = getRelicClass(r, grimRelics, sinisterRelics, wickedRelics);
            addLine(`• ${r}`, relicClass);
        });
    }

    renderFieldUpgrades(data.fieldUpgrades);
}

/* ============================================================
   SURVIVAL CHALLENGE RENDERER
   ============================================================ */

export function renderSurvivalChallenge(data) {
    clearChallengePanel();

    addTitle("Survival of the Fit");

    addLine(`Map: ${data.map}`);
    addLine(`Survive until Round ${data.round}`);

    if (data.relics?.length > 0) {
        addLine("Active Relics:");
        data.relics.forEach(r => {
            const relicClass = getRelicClass(r, grimRelics, sinisterRelics, wickedRelics);
            addLine(`• ${r}`, relicClass);
        });
    }

    renderFieldUpgrades(data.fieldUpgrades);
}

/* ============================================================
   TRAIL CHALLENGE RENDERER
   ============================================================ */

export function renderTrailChallenge(data) {
    clearChallengePanel();

    addTitle("Relic Trail");

    addLine(`Map: ${data.map}`);

    addLine(
        `Relic to Obtain: ${data.requiredRelic}`,
        getRelicClass(data.requiredRelic, grimRelics, sinisterRelics, wickedRelics)
    );
}

/* ============================================================
   STARTING ROOM CHALLENGE RENDERER
   ============================================================ */

export function renderStartingRoomChallenge(data) {
    clearChallengePanel();

    addTitle("Starting Room");

    addLine(`Map: ${data.map}`);
    addLine(`Survive until Round ${data.round}`);

    renderFieldUpgrades(data.fieldUpgrades);
}

/* ============================================================
   SUMMARY RENDERER — CLEAN, BORDERED, COLOUR‑CODED
   ============================================================ */

export function renderSummaryData(summary) {
    const container = document.getElementById("summaryContent");
    if (!container) return;

    container.innerHTML = "THANKS FOR PLAYING";

    /* --- Title --- */
    const title = document.createElement("h2");
    title.className = "chalk-text neon-pulse-purple";
    title.textContent = "";
    container.appendChild(title);

    /* --- Basic Run Info --- */
    const info = document.createElement("div");
    info.className = "summary-info";

    info.innerHTML = `
        <p class="chalk-text"><strong>Mode:</strong> ${summary.mode}</p>
        <p class="chalk-text"><strong>Total Time:</strong> ${summary.time}</p>
        <p class="chalk-text"><strong>Players:</strong> ${summary.stages[0]?.fieldUpgrades?.length ?? 1}</p>
    `;

    container.appendChild(info);

    /* --- Completed Stages Title --- */
    const stagesTitle = document.createElement("h3");
    stagesTitle.className = "chalk-text neon-pulse-blue";
    stagesTitle.style.marginTop = "20px";
    stagesTitle.textContent = "Completed Challenges";
    container.appendChild(stagesTitle);

    /* --- Stage List --- */
    const stageList = document.createElement("div");
    stageList.className = "summary-stage-list";
    container.appendChild(stageList);

    summary.stages.forEach((stage, index) => {
        const box = document.createElement("div");
        box.className = "summary-stage-box bordered-box";

        let details = `
            <div class="chalk-text"><strong>Map:</strong> ${stage.map}</div>
        `;

        if (stage.tier)
            details += `<div class="chalk-text"><strong>Tier:</strong> ${stage.tier}</div>`;

        if (stage.round)
            details += `<div class="chalk-text"><strong>Round:</strong> ${stage.round}</div>`;

        if (stage.requiredRelic)
            details += `<div class="chalk-text"><strong>Relic to Obtain:</strong> ${stage.requiredRelic}</div>`;

        /* --- Relics with colour pills --- */
        if (stage.relics?.length > 0) {
            const relicList = stage.relics
                .map(r => {
                    const cls = getRelicClass(r, grimRelics, sinisterRelics, wickedRelics);
                    return `<span class="summary-pill ${cls}">${r}</span>`;
                })
                .join(" ");
            details += `<div class="chalk-text"><strong>Active Relics:</strong> ${relicList}</div>`;
        }

        /* --- Field Upgrades with player names --- */
        if (stage.fieldUpgrades?.length > 0) {
            const upgList = stage.fieldUpgrades
                .map(u => `<span class="summary-pill field-pill">${u.player}: ${u.upgrade}</span>`)
                .join(" ");
            details += `<div class="chalk-text"><strong>Field Upgrades:</strong> ${upgList}</div>`;
        }

        box.innerHTML = `
            <div class="summary-stage-header chalk-text neon-pulse-blue">
                Stage ${index + 1}: ${stage.type.toUpperCase()}
            </div>
            ${details}
        `;

        stageList.appendChild(box);
    });
}