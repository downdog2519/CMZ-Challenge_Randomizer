// Load saved settings from main process
window.electronAPI.loadSettings((saved) => {
    if (!saved) return;

    // Auto-select saved resolution
    const resolutionSelect = document.getElementById("resolutionSelect");
    if (saved.resolution) {
        resolutionSelect.value = saved.resolution;
    }

    // Auto-check saved toggles
    document.getElementById("allowDuplicates").checked = saved.allowDuplicates ?? false;
    document.getElementById("weightedBoss").checked = saved.weightedBoss ?? false;
    document.getElementById("enableRelicRestrictions").checked = saved.enableRelicRestrictions ?? false;
});

document.getElementById("saveSettingsBtn").addEventListener("click", () => {
    const settings = {
        resolution: document.getElementById("resolutionSelect").value,
        allowDuplicates: document.getElementById("allowDuplicates").checked,
        weightedBoss: document.getElementById("weightedBoss").checked,
        enableRelicRestrictions: document.getElementById("enableRelicRestrictions").checked
    };

    window.electronAPI.saveSettings(settings);
    window.close();
});