/* ============================================================
   SUMMARY.JS — Summary Rendering + Neon Screenshot Frame
   ============================================================ */

import { renderSummaryData } from "./renderers.js";

/* ============================================================
   LOAD SUMMARY DATA
   ============================================================ */

function loadSummary() {
    try {
        const raw = sessionStorage.getItem("summaryData");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

/* ============================================================
   RENDER SUMMARY
   ============================================================ */

function render() {
    const data = loadSummary();
    if (!data) return;

    renderSummaryData(data);
}

/* ============================================================
   SCREENSHOT WITH NEON FRAME
   ============================================================ */

async function saveScreenshot() {
    const panel = document.getElementById("summaryContent");
    if (!panel) return;

    // Create neon frame overlay
    const frame = document.createElement("div");
    frame.style.position = "absolute";
    frame.style.inset = "0";
    frame.style.border = "2px solid rgba(125, 44, 255, 0.6)";
    frame.style.boxShadow = "0 0 22px rgba(125, 44, 255, 0.6)";
    frame.style.pointerEvents = "none";
    frame.style.borderRadius = "6px";
    frame.classList.add("fade-in");

    // Ensure panel is positioned for overlay
    panel.style.position = "relative";
    panel.appendChild(frame);

    // Capture screenshot
    const canvas = await html2canvas(panel, {
        backgroundColor: null,
        scale: 2
    });

    // Remove frame
    panel.removeChild(frame);

    // Trigger download
    const link = document.createElement("a");
    link.download = "CMZ_Summary.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}

/* ============================================================
   NAVIGATION
   ============================================================ */

function goBack() {
    window.location.href = "index.html";
}

/* ============================================================
   EVENT LISTENERS
   ============================================================ */

document.getElementById("saveScreenshotBtn")
    .addEventListener("click", saveScreenshot);

document.getElementById("backBtn")
    .addEventListener("click", goBack);

/* ============================================================
   STARTUP
   ============================================================ */

render();