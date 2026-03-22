/* ============================================================
   UI.JS — UI Interaction Layer (Smooth Transitions + Player Panels)
   ============================================================ */

import { state, saveProfile, saveSession } from "./state.js";
import { grimRelics, sinisterRelics, wickedRelics } from "./data.js";
import { getRelicClass, getRelicImage, getPlayerClass } from "./utils.js";

/* Cached DOM references */
const setupContainer = document.getElementById("setupContainer");
const challengeArea = document.getElementById("challengeArea");
const gamertagInputs = document.getElementById("gamertagInputs");

const sessionWinsValue = document.getElementById("sessionWinsValue");
const sessionFailsValue = document.getElementById("sessionFailsValue");

const challengeButtons = document.getElementById("challengeButtons");
const beginBtn = document.getElementById("beginBtn");
const passFailContainer = document.getElementById("passFailContainer");

/* ============================================================
   PANEL LOCKING
   ============================================================ */

export function lockSetupPanel() {
    setupContainer.classList.add("locked");
}

export function unlockSetupPanel() {
    setupContainer.classList.remove("locked");
}

/* ============================================================
   SHOW / HIDE WITH SMOOTH TRANSITIONS
   ============================================================ */

function smoothShow(el) {
    clearTimeout(el._hideTimer);
    el.style.display = "block";
    el.classList.remove("fade-out");
    el.classList.add("fade-in");
}

function smoothHide(el) {
    el.classList.remove("fade-in");
    el.classList.add("fade-out");

    el._hideTimer = setTimeout(() => {
        el.style.display = "none";
    }, 250);
}

/* ============================================================
   GAMERTAG INPUTS
   ============================================================ */

export function renderGamertagInputs() {
    gamertagInputs.innerHTML = "";

    for (let i = 0; i < state.playerCount; i++) {
        const input = document.createElement("input");
        input.className = "gamertag-input";
        input.placeholder = `Player ${i + 1} Gamertag`;
        input.value = state.gamertags[i] || "";

        input.addEventListener("input", () => {
            state.gamertags[i] = input.value;
            saveProfile();
        });

        gamertagInputs.appendChild(input);
    }
}

/* ============================================================
   RELIC OWNERSHIP GRID
   ============================================================ */

export function renderRelicOwnership() {
    const grimCol = document.getElementById("grimColumn");
    const sinisterCol = document.getElementById("sinisterColumn");
    const wickedCol = document.getElementById("wickedColumn");

    grimCol.innerHTML = "";
    sinisterCol.innerHTML = "";
    wickedCol.innerHTML = "";

    const makeTile = (name, poolClass) => {
        const tile = document.createElement("div");
        tile.className = `relic-option ${poolClass}`;
        if (state.unlockedRelics.includes(name)) tile.classList.add("selected");

        tile.addEventListener("click", () => {
            if (state.unlockedRelics.includes(name)) {
                state.unlockedRelics = state.unlockedRelics.filter(r => r !== name);
            } else {
                state.unlockedRelics.push(name);
            }
            saveProfile();
            renderRelicOwnership();
        });

        const img = document.createElement("img");
        img.className = "relic-img";
        img.src = `./images/relics/${getRelicImage(name)}`;
        img.alt = name;

        tile.appendChild(img);
        return tile;
    };

    grimRelics.forEach(r => grimCol.appendChild(makeTile(r, "relic-grim")));
    sinisterRelics.forEach(r => sinisterCol.appendChild(makeTile(r, "relic-sinister")));
    wickedRelics.forEach(r => wickedCol.appendChild(makeTile(r, "relic-wicked")));
}

/* ============================================================
   MODE TOGGLE TEXT
   ============================================================ */

export function updateModeToggleText() {
    const btn = document.getElementById("modeToggleBtn");
    if (!btn) return;

    btn.textContent =
        state.challengeModeType === "standard"
            ? "Mode: Standard Challenges"
            : "Mode: Extreme Challenges";
}

/* ============================================================
   SESSION STATS
   ============================================================ */

export function updateSessionStats() {
    sessionWinsValue.textContent = state.sessionWins;
    sessionFailsValue.textContent = state.sessionFails;
}

/* ============================================================
   CHALLENGE CONTROLS
   ============================================================ */

export function showChallengeButtons() {
    smoothShow(challengeButtons);
}

export function hideChallengeButtons() {
    smoothHide(challengeButtons);
}

export function showBeginButton() {
    smoothShow(beginBtn);
}

export function hideBeginButton() {
    smoothHide(beginBtn);
}

export function showPassFail() {
    smoothShow(passFailContainer);
}

export function hidePassFail() {
    smoothHide(passFailContainer);
}

/* ============================================================
   SWITCH TO CHALLENGE PANEL
   ============================================================ */

export function showChallengePanel() {
    smoothShow(challengeArea);
}

export function hideChallengePanel() {
    smoothHide(challengeArea);
}

/* ============================================================
   PLAYER PANELS (NEW)
   ============================================================ */

export function renderPlayerPanels(fieldUpgrades) {
    let panelContainer = document.getElementById("playerPanels");

    if (!panelContainer) {
        panelContainer = document.createElement("div");
        panelContainer.id = "playerPanels";
        panelContainer.className = "player-panels-container";
        challengeArea.prepend(panelContainer);
    }

    panelContainer.innerHTML = "";

    fieldUpgrades.forEach((item, index) => {
        const panel = document.createElement("div");
        panel.className = `player-panel ${getPlayerClass(index)}`;

        panel.innerHTML = `
            <div class="player-name chalk-text">${item.player}</div>
            <div class="player-upgrade">${item.upgrade}</div>
        `;

        panelContainer.appendChild(panel);
    });

    smoothShow(panelContainer);
}