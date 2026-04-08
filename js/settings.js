/* settings.js — standalone settings window */

const ROUND_VALUES = [11, 16, 21, 26, 31, 36, 41, 46, 51, 56, 61, 66, 71, 76];

const DEFAULTS = {
    _settingsVersion:      2,
    resolution:            '1600x900',
    allowDuplicates:       false,
    bossFieldUpgrades:     true,
    bossRelicSettings:     false,
    bossRelicLevel:        3,
    survivalFieldUpgrades: true,
    survivalRelicSettings: false,
    survivalRelicLevel:    3,
    quickStandardMinRound: 0,
    quickStandardMaxRound: 4,
    cursedMinRound:        4,
    cursedMaxRound:        12
};

const RELIC_INFO = {
    1: 'Tier 0 — No relics.',
    2: 'Tier 1 and 2 only — 1 relic extra selected.',
    3: 'Default.',
    4: 'Tier 3 only — Relic selection increased by 300%.',
    5: 'Tier 3 only — Relic selection increased by 800%.'
};

function el(id) { return document.getElementById(id); }

function setRoundSlider(sliderId, valId, index) {
    el(sliderId).value = index;
    el(valId).textContent = ROUND_VALUES[index] ?? ROUND_VALUES[ROUND_VALUES.length - 1];
}

function toggleSubPanel(panelId, show) {
    const panel = el(panelId);
    if (!panel) return;
    panel.classList.toggle('sub-panel--hidden', !show);
}

function applyRelicInfo(mode, level) {
    const infoEl = el(mode + 'RelicInfo');
    if (infoEl) infoEl.textContent = RELIC_INFO[level] ?? '';
}

function applyToUI(s) {
    el('resolutionSelect').value = s.resolution ?? DEFAULTS.resolution;
    el('allowDuplicates').checked = s.allowDuplicates ?? DEFAULTS.allowDuplicates;

    // Boss
    el('bossFieldUpgrades').checked = s.bossFieldUpgrades ?? DEFAULTS.bossFieldUpgrades;
    el('bossRelicSettings').checked = s.bossRelicSettings ?? DEFAULTS.bossRelicSettings;
    const bossLvl = s.bossRelicLevel ?? DEFAULTS.bossRelicLevel;
    el('bossRelicLevel').value = bossLvl;
    el('bossRelicLevelVal').textContent = bossLvl;
    applyRelicInfo('boss', bossLvl);
    toggleSubPanel('bossRelicPanel', s.bossRelicSettings ?? DEFAULTS.bossRelicSettings);

    // Survival
    el('survivalFieldUpgrades').checked = s.survivalFieldUpgrades ?? DEFAULTS.survivalFieldUpgrades;
    el('survivalRelicSettings').checked = s.survivalRelicSettings ?? DEFAULTS.survivalRelicSettings;
    const survLvl = s.survivalRelicLevel ?? DEFAULTS.survivalRelicLevel;
    el('survivalRelicLevel').value = survLvl;
    el('survivalRelicLevelVal').textContent = survLvl;
    applyRelicInfo('survival', survLvl);
    toggleSubPanel('survivalRelicPanel', s.survivalRelicSettings ?? DEFAULTS.survivalRelicSettings);

    // Round ranges
    setRoundSlider('qpStdMin', 'qpStdMinVal', s.quickStandardMinRound ?? DEFAULTS.quickStandardMinRound);
    setRoundSlider('qpStdMax', 'qpStdMaxVal', s.quickStandardMaxRound ?? DEFAULTS.quickStandardMaxRound);
    setRoundSlider('qpCrsMin', 'qpCrsMinVal', s.cursedMinRound ?? DEFAULTS.cursedMinRound);
    setRoundSlider('qpCrsMax', 'qpCrsMaxVal', s.cursedMaxRound ?? DEFAULTS.cursedMaxRound);
}

function collectSettings() {
    return {
        resolution:            el('resolutionSelect').value,
        allowDuplicates:       el('allowDuplicates').checked,
        bossFieldUpgrades:     el('bossFieldUpgrades').checked,
        bossRelicSettings:     el('bossRelicSettings').checked,
        bossRelicLevel:        Number(el('bossRelicLevel').value),
        survivalFieldUpgrades: el('survivalFieldUpgrades').checked,
        survivalRelicSettings: el('survivalRelicSettings').checked,
        survivalRelicLevel:    Number(el('survivalRelicLevel').value),
        quickStandardMinRound: Number(el('qpStdMin').value),
        quickStandardMaxRound: Number(el('qpStdMax').value),
        cursedMinRound:        Number(el('qpCrsMin').value),
        cursedMaxRound:        Number(el('qpCrsMax').value)
    };
}

/* ── Toggle panels ── */
el('bossRelicSettings').addEventListener('change', e => toggleSubPanel('bossRelicPanel', e.target.checked));
el('survivalRelicSettings').addEventListener('change', e => toggleSubPanel('survivalRelicPanel', e.target.checked));

/* ── Level sliders ── */
el('bossRelicLevel').addEventListener('input', e => {
    const v = Number(e.target.value);
    el('bossRelicLevelVal').textContent = v;
    applyRelicInfo('boss', v);
});
el('survivalRelicLevel').addEventListener('input', e => {
    const v = Number(e.target.value);
    el('survivalRelicLevelVal').textContent = v;
    applyRelicInfo('survival', v);
});

/* ── Round range sliders ── */
[
    { min: 'qpStdMin', max: 'qpStdMax', minVal: 'qpStdMinVal', maxVal: 'qpStdMaxVal' },
    { min: 'qpCrsMin', max: 'qpCrsMax', minVal: 'qpCrsMinVal', maxVal: 'qpCrsMaxVal' }
].forEach(({ min, max, minVal, maxVal }) => {
    el(min).addEventListener('input', () => {
        let lo = Number(el(min).value), hi = Number(el(max).value);
        if (lo > hi) { el(max).value = lo; hi = lo; }
        el(minVal).textContent = ROUND_VALUES[lo];
        el(maxVal).textContent = ROUND_VALUES[hi];
    });
    el(max).addEventListener('input', () => {
        let lo = Number(el(min).value), hi = Number(el(max).value);
        if (hi < lo) { el(min).value = hi; lo = hi; }
        el(minVal).textContent = ROUND_VALUES[lo];
        el(maxVal).textContent = ROUND_VALUES[hi];
    });
});

/* ── Reset to Defaults ── */
el('resetDefaultsBtn').addEventListener('click', () => {
    applyToUI(DEFAULTS);
    localStorage.setItem('cmz_settings', JSON.stringify(DEFAULTS));
});

/* ── Complete Reset ── */
const completeResetModal = el('completeResetModal');
el('completeResetBtn').addEventListener('click', () => {
    completeResetModal.classList.remove('hidden');
});
el('confirmResetCancelBtn').addEventListener('click', () => {
    completeResetModal.classList.add('hidden');
});
el('confirmResetOkBtn').addEventListener('click', () => {
    localStorage.removeItem('cmz_profiles');
    localStorage.removeItem('cmz_leaderboard');
    localStorage.setItem('cmz_settings', JSON.stringify(DEFAULTS));
    applyToUI(DEFAULTS);
    completeResetModal.classList.add('hidden');
    window.electronAPI.saveSettings(DEFAULTS);
    window.close();
});

/* ── Save ── */
el('saveSettingsBtn').addEventListener('click', () => {
    const settings = collectSettings();
    window.electronAPI.saveSettings(settings);
    // Also sync to localStorage so the main window / logic.js can read immediately
    try { localStorage.setItem('cmz_settings', JSON.stringify(settings)); } catch {}
    window.close();
});

/* ── Load saved settings on open ── */
function migrateSettings(s) {
    // v2: cursed round defaults changed from (0,4) to (4,12)
    if ((s._settingsVersion ?? 1) < 2) {
        if (!s.cursedMinRound || s.cursedMinRound === 0) s.cursedMinRound = DEFAULTS.cursedMinRound;
        if (!s.cursedMaxRound || s.cursedMaxRound <= 4)  s.cursedMaxRound = DEFAULTS.cursedMaxRound;
        s._settingsVersion = 2;
        try { localStorage.setItem('cmz_settings', JSON.stringify(s)); } catch {}
    }
    return s;
}

window.electronAPI.loadSettings((saved) => {
    const s = saved && Object.keys(saved).length ? migrateSettings(saved) : DEFAULTS;
    applyToUI(s);
});