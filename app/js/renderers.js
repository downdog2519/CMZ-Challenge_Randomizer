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
    if (!challengeArea) return;
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
    if (!resultBox) return;
    const div = document.createElement("div");
    div.className = `challenge-line ${cssClass}`;
    div.textContent = text;
    resultBox.appendChild(div);
}

function addTitle(text) {
    if (!resultBox) return;
    const div = document.createElement("div");
    div.className = "challenge-section-title chalk-text";
    div.textContent = text;
    resultBox.appendChild(div);
}

/* ============================================================
   FIELD UPGRADE RENDERER
   ============================================================ */

function renderFieldUpgrades(list) {
    if (!list || list.length === 0) return;

    addLine("Field Upgrades:");

    list.forEach((item) => {
        addLine(`• ${item.player}: ${item.upgrade}`);
    });
}

/* ============================================================
   BOSS / SURVIVAL / TRAIL / STARTING
   ============================================================ */

export function renderBossChallenge(data) {
    clearChallengePanel();
    addTitle("Boss Challenge");
    addLine(`Map: ${data.map}`);
    addLine(`Tier: ${data.tier}`);
    if (data.round) addLine(`Round: ${data.round}`);

    if (data.relics?.length > 0) {
        addLine("Required Active Relics:");
        data.relics.forEach((r) => {
            addLine(`• ${r}`, getRelicClass(r, grimRelics, sinisterRelics, wickedRelics));
        });
    }

    renderFieldUpgrades(data.fieldUpgrades);
}

export function renderSurvivalChallenge(data) {
    clearChallengePanel();
    addTitle("Survival of the Fittest");
    addLine(`Map: ${data.map}`);
    addLine(`Survive until Round ${data.round}`);

    if (data.relics?.length > 0) {
        addLine("Active Relics:");
        data.relics.forEach((r) => {
            addLine(`• ${r}`, getRelicClass(r, grimRelics, sinisterRelics, wickedRelics));
        });
    }

    renderFieldUpgrades(data.fieldUpgrades);
}

export function renderTrailChallenge(data) {
    clearChallengePanel();
    addTitle("Relic Trail");
    addLine(`Map: ${data.map}`);
    addLine(
        `Relic to Obtain: ${data.requiredRelic}`,
        getRelicClass(data.requiredRelic, grimRelics, sinisterRelics, wickedRelics),
    );
}

export function renderStartingRoomChallenge(data) {
    clearChallengePanel();
    addTitle("Starting Room");
    addLine(`Map: ${data.map}`);
    addLine(`Survive until Round ${data.round}`);
    renderFieldUpgrades(data.fieldUpgrades);
}

/* ============================================================
   SUMMARY RENDERER — CMZ VICTORY / DEFEAT
   ============================================================ */

function outcomeCopy(outcome) {
    switch (outcome) {
        case "perfect":
            return { title: "PERFECT RUN", sub: "Every challenge cleared. Absolute cinema." };
        case "victory":
            return { title: "VICTORY", sub: "You outlasted the Dark Aether." };
        case "mixed":
            return { title: "HARD FOUGHT", sub: "Wins and losses — still standing." };
        default:
            return { title: "DEFEATED", sub: "The relics remain out of reach… for now." };
    }
}

export function renderSummaryData(summary) {
    const container = document.getElementById("summaryContent");
    if (!container) return;

    container.innerHTML = "";

    const wins = summary.wins ?? 0;
    const fails = summary.fails ?? 0;
    const outcome = summary.outcome
        || (wins > 0 && fails === 0 ? "perfect"
            : wins >= fails && wins > 0 ? "victory"
            : wins > 0 ? "mixed"
            : "defeat");
    const copy = outcomeCopy(outcome);

    const hero = document.createElement("section");
    hero.className = `summary-hero outcome-${outcome}`;

    if (outcome === "perfect" || outcome === "victory") {
        const confetti = document.createElement("div");
        confetti.className = "summary-confetti";
        const colors = ["#d4af37", "#f3e3a8", "#00ff88", "#00c8ff", "#fff"];
        for (let i = 0; i < 18; i++) {
            const s = document.createElement("span");
            s.style.setProperty("--left", `${8 + Math.random() * 84}%`);
            s.style.setProperty("--d", `${(Math.random() * 1.8).toFixed(2)}s`);
            s.style.setProperty("--c", colors[i % colors.length]);
            confetti.appendChild(s);
        }
        hero.appendChild(confetti);
    }

    hero.innerHTML += `
        <img class="summary-hero-seal" src="./images/cmz-logo.webp" alt="CMZ">
        <div class="summary-outcome chalk-text">${copy.title}</div>
        <p class="summary-outcome-sub">${copy.sub}</p>
        <div class="summary-score-row">
            <div class="summary-score-chip wins"><span class="label">Wins</span><span class="value">${wins}</span></div>
            <div class="summary-score-chip fails"><span class="label">Losses</span><span class="value">${fails}</span></div>
            <div class="summary-score-chip time"><span class="label">Time</span><span class="value">${summary.time || "0:00"}</span></div>
        </div>
    `;
    container.appendChild(hero);

    const info = document.createElement("div");
    info.className = "summary-info";
    info.innerHTML = `
        <p class="chalk-text"><strong>Mode:</strong> ${summary.mode || "—"}</p>
        <p class="chalk-text"><strong>Players:</strong> ${summary.stages?.[0]?.fieldUpgrades?.length ?? 1}</p>
    `;
    container.appendChild(info);

    const stagesTitle = document.createElement("h3");
    stagesTitle.className = "chalk-text";
    stagesTitle.style.marginTop = "20px";
    stagesTitle.textContent = "Completed Challenges";
    container.appendChild(stagesTitle);

    const stageList = document.createElement("div");
    stageList.className = "summary-stage-list";
    container.appendChild(stageList);

    (summary.stages || []).forEach((stage, index) => {
        const box = document.createElement("div");
        const result = stage.result;
        box.className = `summary-stage-box bordered-box${result === "pass" ? " is-pass" : ""}${result === "fail" ? " is-fail" : ""}`;

        let details = `<div class="chalk-text"><strong>Map:</strong> ${stage.map}</div>`;
        if (stage.tier) details += `<div class="chalk-text"><strong>Tier:</strong> ${stage.tier}</div>`;
        if (stage.round) details += `<div class="chalk-text"><strong>Round:</strong> ${stage.round}</div>`;
        if (stage.requiredRelic) {
            details += `<div class="chalk-text"><strong>Relic to Obtain:</strong> ${stage.requiredRelic}</div>`;
        }

        if (stage.relics?.length > 0) {
            const relicList = stage.relics
                .map((r) => {
                    const cls = getRelicClass(r, grimRelics, sinisterRelics, wickedRelics);
                    return `<span class="summary-pill ${cls}">${r}</span>`;
                })
                .join(" ");
            details += `<div class="chalk-text"><strong>Active Relics:</strong> ${relicList}</div>`;
        }

        if (stage.fieldUpgrades?.length > 0) {
            const upgList = stage.fieldUpgrades
                .map((u) => `<span class="summary-pill field-pill">${u.player}: ${u.upgrade}</span>`)
                .join(" ");
            details += `<div class="chalk-text"><strong>Field Upgrades:</strong> ${upgList}</div>`;
        }

        const badge = result
            ? `<span class="summary-result-badge ${result}">${result}</span>`
            : "";

        box.innerHTML = `
            <div class="summary-stage-header chalk-text">
                Stage ${index + 1}: ${(stage.type || "challenge").toUpperCase()}${badge}
            </div>
            ${details}
        `;
        stageList.appendChild(box);
    });
}
