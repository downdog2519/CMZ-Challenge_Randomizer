import {
    grimRelics,
    sinisterRelics,
    wickedRelics
} from "./data.js";

/* ============================================================
   COLOR HELPERS
============================================================ */

function getRelicClass(name) {
    if (grimRelics.includes(name)) return "relic-grim";
    if (sinisterRelics.includes(name)) return "relic-sinister";
    if (wickedRelics.includes(name)) return "relic-wicked";
    return "";
}

function getMapClass(map) {
    if (map === "Astra") return "map-astra";
    if (map === "Ashes of the Damned") return "map-ashes";
    if (map === "Paradox Junction") return "map-paradox";
    return "";
}

function getPlayerClass(index) {
    return `player${index + 1}`;
}

/* ============================================================
   RENDER SUMMARY
============================================================ */

function renderSummary() {
    const container = document.getElementById("summaryContent");
    if (!container) return;

    const saved = sessionStorage.getItem("completedRun");
    if (!saved) {
        container.innerHTML = "<p>No summary data found.</p>";
        return;
    }

    const summary = JSON.parse(saved);
    const challenges = summary.challenges || [];

    let html = "";

    /* ===================== PLAYERS ===================== */
    html += `<p><strong>Players:</strong> ${
        summary.players
            .map((p, i) => `<span class="${getPlayerClass(i)}">${p}</span>`)
            .join(", ")
    }</p>`;

    html += `<hr>`;

    /* ===================== CHALLENGES ===================== */
    challenges.forEach((c, idx) => {
        const seconds = c.timeSeconds || 0;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const timeStr = seconds > 0 ? `${mins}:${secs.toString().padStart(2, "0")}` : "N/A";

        html += `
            <div class="challenge-section">
                <div class="challenge-section-title">Challenge ${idx + 1} (${c.mode} - ${c.type})</div>

                ${c.map ? `
                    <div class="challenge-line">
                        <strong>Map:</strong>
                        <span class="${getMapClass(c.map)}">${c.map}</span>
                    </div>` : ""}

                ${c.round ? `
                    <div class="challenge-line">
                        <strong>Round:</strong> ${c.round}
                    </div>` : ""}

                ${c.tier ? `
                    <div class="challenge-line">
                        <strong>Tier:</strong> ${c.tier}
                    </div>` : ""}

                ${c.requiredRelic ? `
                    <div class="challenge-line">
                        <strong>Required Relic:</strong>
                        <span class="${getRelicClass(c.requiredRelic)}">${c.requiredRelic}</span>
                    </div>` : ""}

                ${c.relics && c.relics.length ? `
                    <div class="challenge-line">
                        <strong>Relics:</strong>
                        ${c.relics.map(r => `<span class="${getRelicClass(r)}">${r}</span>`).join(", ")}
                    </div>` : ""}

                ${c.fieldUpgrades ? `
                    <div class="challenge-line">
                        <strong>Field Upgrades:</strong>
                        ${c.fieldUpgrades.map(f => `<span class="field-upgrade">${f.upgrade}</span>`).join(", ")}
                    </div>` : ""}

                <div class="challenge-line"><strong>Time:</strong> ${timeStr}</div>
            </div>
        `;
    });

    container.innerHTML = html;
}

/* ============================================================
   BUTTONS
============================================================ */

document.getElementById("backBtn")?.addEventListener("click", () => {
    window.location.href = "index.html";
});

document.getElementById("saveScreenshotBtn")?.addEventListener("click", () => {
    html2canvas(document.body).then(canvas => {
        const link = document.createElement("a");
        link.download = "cmz-summary.png";
        link.href = canvas.toDataURL();
        link.click();
    });
});

/* ============================================================
   INIT
============================================================ */

renderSummary();





