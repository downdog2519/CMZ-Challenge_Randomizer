// app.js — Single entry point for all page logic
import { setupNav } from './nav.js';
import { getProfiles, addProfile, deleteProfile, updateProfileRelics } from './profiles.js';
import { getLeaderboard } from './leaderboard.js';
import { grimRelics, sinisterRelics, wickedRelics } from './data.js';
import { relicImages } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    setupNav();
    initProfiles();
    initLeaderboard();
    initSettings();
    initStartRun();
});

/* ============================================================
   PROFILES
   ============================================================ */
function initProfiles() {
    const list  = document.getElementById('profilesList');
    const msg   = document.getElementById('profilesMsg');
    const input = document.getElementById('profileNameInput');
    const form  = document.getElementById('addProfileForm');

    function renderProfiles() {
        const profiles = getProfiles();
        list.innerHTML = '';
        if (!profiles.length) {
            const empty = document.createElement('span');
            empty.className = 'info-text';
            empty.textContent = 'No profiles yet. Add one above.';
            list.appendChild(empty);
            return;
        }
        profiles.forEach(profile => {
            const tile = document.createElement('div');
            tile.className = 'profile-tile';

            // ── Header row ──
            const header = document.createElement('div');
            header.className = 'profile-tile-header';

            const span = document.createElement('span');
            span.className = 'profile-name';
            span.textContent = profile.name;

            const headerRight = document.createElement('div');
            headerRight.className = 'profile-tile-header-right';

            const del = document.createElement('button');
            del.className = 'secondary-btn small-btn';
            del.textContent = 'Delete';
            del.dataset.del = profile.name;

            headerRight.appendChild(del);
            header.appendChild(span);
            header.appendChild(headerRight);
            tile.appendChild(header);

            // ── Relic tab (collapsed state) ──
            const relicTab = document.createElement('div');
            relicTab.className = 'profile-relic-tab';

            const summary = document.createElement('span');
            summary.className = 'profile-relic-summary';
            summary.textContent = buildRelicSummary(profile.relics);

            const editBtn = document.createElement('button');
            editBtn.className = 'secondary-btn small-btn';
            editBtn.textContent = 'Edit Relics';

            relicTab.appendChild(summary);
            relicTab.appendChild(editBtn);
            tile.appendChild(relicTab);

            // ── Relic panel (expanded state, hidden initially) ──
            const relicPanel = document.createElement('div');
            relicPanel.className = 'profile-relic-panel hidden';

            const relicGrid = document.createElement('div');
            relicPanel.appendChild(relicGrid);

            const confirmBtn = document.createElement('button');
            confirmBtn.className = 'primary-btn small-btn profile-relic-confirm';
            confirmBtn.textContent = 'Confirm';
            relicPanel.appendChild(confirmBtn);

            tile.appendChild(relicPanel);

            // ── Edit: expand panel, build/refresh grid ──
            editBtn.addEventListener('click', () => {
                buildRelicGrid(relicGrid, profile.relics, null);
                relicTab.classList.add('hidden');
                relicPanel.classList.remove('hidden');
            });

            // ── Confirm: save, collapse, refresh summary ──
            confirmBtn.addEventListener('click', () => {
                updateProfileRelics(profile.name, profile.relics);
                summary.textContent = buildRelicSummary(profile.relics);
                relicPanel.classList.add('hidden');
                relicTab.classList.remove('hidden');
            });

            list.appendChild(tile);
        });
    }

    function buildRelicSummary(relics) {
        const parts = [];
        if (relics.grim.length)     parts.push(`${relics.grim.length} Grim`);
        if (relics.sinister.length) parts.push(`${relics.sinister.length} Sinister`);
        if (relics.wicked.length)   parts.push(`${relics.wicked.length} Wicked`);
        return parts.length ? parts.join(' · ') : 'No relics set';
    }

    list.addEventListener('click', e => {
        const btn = e.target.closest('[data-del]');
        if (!btn) return;
        deleteProfile(btn.dataset.del);
        msg.textContent = '';
        renderProfiles();
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        const name = input.value.trim();
        if (!name) { msg.textContent = 'Please enter a name.'; return; }
        if (!/^[\w\s-]{2,18}$/.test(name)) {
            msg.textContent = '2–18 letters, numbers, spaces or – only.';
            return;
        }
        if (!addProfile(name)) {
            msg.textContent = 'Name already exists or 10-profile limit reached.';
            return;
        }
        input.value = '';
        msg.textContent = '';
        renderProfiles();
    });

    // Re-render whenever the profiles page is navigated to
    document.getElementById('profilesPage').addEventListener('cmz:show', renderProfiles);
    renderProfiles();
}

/* ============================================================
   LEADERBOARD
   ============================================================ */
function initLeaderboard() {
    const tbody   = document.querySelector('#lbTable tbody');
    const msg     = document.getElementById('lbMsg');
    const details = document.getElementById('lbDetails');
    const sortEl  = document.getElementById('lbSort');

    function renderLeaderboard() {
        let entries = getLeaderboard();
        details.innerHTML = '';

        if (!entries.length) {
            tbody.innerHTML = '';
            msg.textContent = 'No runs recorded yet.';
            return;
        }
        msg.textContent = '';

        const s = sortEl.value;
        if      (s === 'stage')     entries.sort((a, b) => (a.stage ?? 0) - (b.stage ?? 0));
        else if (s === 'stageDesc') entries.sort((a, b) => (b.stage ?? 0) - (a.stage ?? 0));
        else if (s === 'name')      entries.sort((a, b) => a.player.localeCompare(b.player));
        else if (s === 'top')       entries.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

        tbody.innerHTML = '';
        entries.forEach((entry, i) => {
            const tr = document.createElement('tr');

            // Player name cell — click to expand detail box
            const nameTd  = document.createElement('td');
            const nameBtn = document.createElement('button');
            nameBtn.className   = 'secondary-btn small-btn';
            nameBtn.textContent = entry.player;
            nameBtn.dataset.lbidx = i;
            nameTd.appendChild(nameBtn);
            tr.appendChild(nameTd);

            // Remaining columns: Mode | Tier | Map | Relics Used | Time | Date
            ['mode', 'tier', 'map', 'relics', 'time', 'date'].forEach(key => {
                const td = document.createElement('td');
                td.textContent = entry[key] ?? '—';
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });
    }

    tbody.addEventListener('click', e => {
        const btn = e.target.closest('[data-lbidx]');
        if (!btn) return;
        const idx   = +btn.dataset.lbidx;
        const entry = getLeaderboard()[idx];
        if (!entry) return;

        const box = document.createElement('div');
        box.className = 'lb-detail-box';

        [
            ['Player',      entry.player],
            ['Mode',        entry.mode   ?? '—'],
            ['Tier',        entry.tier   ?? '—'],
            ['Map',         entry.map    ?? '—'],
            ['Relics Used', entry.relics ?? 'None'],
            ['Time',        entry.time   ?? '—'],
            ['W / L',       `${entry.score ?? 0} / ${entry.fails ?? 0}`],
            ['Date',        entry.date   ?? '—'],
        ].forEach(([label, value]) => {
            const p = document.createElement('p');
            const strong = document.createElement('strong');
            strong.textContent = label + ': ';
            p.appendChild(strong);
            p.appendChild(document.createTextNode(String(value)));
            box.appendChild(p);
        });

        details.innerHTML = '';
        details.appendChild(box);
    });

    sortEl.addEventListener('change', renderLeaderboard);
    document.getElementById('leaderboardPage').addEventListener('cmz:show', renderLeaderboard);
    renderLeaderboard();
}

/* ============================================================
   SETTINGS
   ============================================================ */
function initSettings() {
    const STORAGE_KEY = 'cmz_settings';
    const form = document.getElementById('settingsForm');
    const msg  = document.getElementById('settingsMsg');

    /* Round values that map index → displayed round number */
    const ROUND_VALUES = [11, 16, 21, 26, 31, 36, 41, 46, 51, 56, 61, 66, 71, 76];

    const DEFAULTS = {
        _settingsVersion:        2,
        resolution:              '1600x900',
        allowDuplicates:         false,
        bossFieldUpgrades:       true,
        bossRelicSettings:       false,
        bossRelicLevel:          3,
        survivalFieldUpgrades:   true,
        survivalRelicSettings:   false,
        survivalRelicLevel:      3,
        quickStandardMinRound:   0,
        quickStandardMaxRound:   4,
        cursedMinRound:          4,
        cursedMaxRound:          12
    };

    const RELIC_INFO = {
        1: 'Tier 0 — No relics.',
        2: 'Tier 1 and 2 only — 1 relic extra selected.',
        3: 'Default.',
        4: 'Tier 3 only — Relic selection increased by 300%.',
        5: 'Tier 3 only — Relic selection increased by 800%.'
    };

    const el = id => document.getElementById(id);

    function getSettings() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
        catch { return {}; }
    }

    function persistSettings(settings) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }

    function migrateSettings(s) {
        // v2: cursed round defaults changed from (0,4) to (4,12)
        if ((s._settingsVersion ?? 1) < 2) {
            if (!s.cursedMinRound || s.cursedMinRound === 0) s.cursedMinRound = DEFAULTS.cursedMinRound;
            if (!s.cursedMaxRound || s.cursedMaxRound <= 4)  s.cursedMaxRound = DEFAULTS.cursedMaxRound;
            s._settingsVersion = 2;
            persistSettings(s);
        }
        return s;
    }

    function setRoundSlider(sliderId, valId, index) {
        el(sliderId).value = index;
        el(valId).textContent = ROUND_VALUES[index] ?? ROUND_VALUES[ROUND_VALUES.length - 1];
    }

    function applyRelicLevelInfo(mode, level) {
        const infoEl = el(mode + 'RelicInfo');
        if (infoEl) infoEl.textContent = RELIC_INFO[level] ?? '';
    }

    function toggleSubPanel(panelId, show) {
        const panel = el(panelId);
        if (!panel) return;
        panel.classList.toggle('mode-sub-panel--hidden', !show);
    }

    function applyToUI(s) {
        el('resolutionSelect').value       = s.resolution           ?? DEFAULTS.resolution;
        el('allowDuplicates').checked      = s.allowDuplicates      ?? DEFAULTS.allowDuplicates;

        // Boss Mode
        el('bossFieldUpgrades').checked    = s.bossFieldUpgrades    ?? DEFAULTS.bossFieldUpgrades;
        el('bossRelicSettings').checked    = s.bossRelicSettings    ?? DEFAULTS.bossRelicSettings;
        const bossLvl = s.bossRelicLevel ?? DEFAULTS.bossRelicLevel;
        el('bossRelicLevel').value         = bossLvl;
        el('bossRelicLevelVal').textContent = bossLvl;
        applyRelicLevelInfo('boss', bossLvl);
        toggleSubPanel('bossRelicPanel', s.bossRelicSettings ?? DEFAULTS.bossRelicSettings);

        // Survival Mode
        el('survivalFieldUpgrades').checked = s.survivalFieldUpgrades ?? DEFAULTS.survivalFieldUpgrades;
        el('survivalRelicSettings').checked = s.survivalRelicSettings ?? DEFAULTS.survivalRelicSettings;
        const survLvl = s.survivalRelicLevel ?? DEFAULTS.survivalRelicLevel;
        el('survivalRelicLevel').value      = survLvl;
        el('survivalRelicLevelVal').textContent = survLvl;
        applyRelicLevelInfo('survival', survLvl);
        toggleSubPanel('survivalRelicPanel', s.survivalRelicSettings ?? DEFAULTS.survivalRelicSettings);

        // Round Range sliders
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

    /* ── Wire relic-settings toggles ── */
    el('bossRelicSettings').addEventListener('change', e => {
        toggleSubPanel('bossRelicPanel', e.target.checked);
    });
    el('survivalRelicSettings').addEventListener('change', e => {
        toggleSubPanel('survivalRelicPanel', e.target.checked);
    });

    /* ── Wire relic-level sliders ── */
    el('bossRelicLevel').addEventListener('input', e => {
        const v = Number(e.target.value);
        el('bossRelicLevelVal').textContent = v;
        applyRelicLevelInfo('boss', v);
    });
    el('survivalRelicLevel').addEventListener('input', e => {
        const v = Number(e.target.value);
        el('survivalRelicLevelVal').textContent = v;
        applyRelicLevelInfo('survival', v);
    });

    /* ── Wire round-range sliders ── */
    const roundSliderPairs = [
        { min: 'qpStdMin', max: 'qpStdMax', minVal: 'qpStdMinVal', maxVal: 'qpStdMaxVal' },
        { min: 'qpCrsMin', max: 'qpCrsMax', minVal: 'qpCrsMinVal', maxVal: 'qpCrsMaxVal' }
    ];
    roundSliderPairs.forEach(({ min, max, minVal, maxVal }) => {
        el(min).addEventListener('input', () => {
            let lo = Number(el(min).value);
            let hi = Number(el(max).value);
            if (lo > hi) { el(max).value = lo; hi = lo; }
            el(minVal).textContent = ROUND_VALUES[lo];
            el(maxVal).textContent = ROUND_VALUES[hi];
        });
        el(max).addEventListener('input', () => {
            let lo = Number(el(min).value);
            let hi = Number(el(max).value);
            if (hi < lo) { el(min).value = hi; lo = hi; }
            el(minVal).textContent = ROUND_VALUES[lo];
            el(maxVal).textContent = ROUND_VALUES[hi];
        });
    });

    /* ── Reset to Defaults ── */
    el('resetDefaultsBtn').addEventListener('click', () => {
        applyToUI(DEFAULTS);
        persistSettings(DEFAULTS);
    });

    /* ── README / Discord ── */
    el('readmeBtn').addEventListener('click', () => {
        window.electronAPI.openReadme();
    });
    el('discordBtn').addEventListener('click', () => {
        window.electronAPI.openExternal('https://discord.gg/YNmhCSk48A');
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
        persistSettings(DEFAULTS);
        applyToUI(DEFAULTS);
        completeResetModal.classList.add('hidden');
        msg.textContent = 'Complete reset done.';
        setTimeout(() => { msg.textContent = ''; }, 3000);
        // Refresh live lists immediately if their pages are rendered
        document.getElementById('profilesPage').dispatchEvent(new CustomEvent('cmz:show'));
        document.getElementById('leaderboardPage').dispatchEvent(new CustomEvent('cmz:show'));
    });

    /* ── Save ── */
    form.addEventListener('submit', e => {
        e.preventDefault();
        const settings = collectSettings();
        persistSettings(settings);
        msg.textContent = 'Settings saved!';
        setTimeout(() => { msg.textContent = ''; }, 2500);
    });

    applyToUI(migrateSettings(getSettings()));
}

/* ============================================================
   RELIC GRID BUILDER (shared by Manage Profiles + Start Run)
   ============================================================ */
function buildRelicGrid(containerEl, ownedRef, onToggle) {
    containerEl.innerHTML = '';
    [
        { key: 'grim',     label: 'Grim',     list: grimRelics },
        { key: 'sinister', label: 'Sinister', list: sinisterRelics },
        { key: 'wicked',   label: 'Wicked',   list: wickedRelics },
    ].forEach(({ key, label, list }) => {
        const heading = document.createElement('p');
        heading.className = `relic-type-label relic-${key}`;
        heading.textContent = label;
        containerEl.appendChild(heading);

        const row = document.createElement('div');
        row.className = 'relic-row';
        list.forEach(name => {
            const tile = document.createElement('div');
            tile.className = `relic-option relic-${key}`;
            if (ownedRef[key].includes(name)) tile.classList.add('selected');

            const img = document.createElement('img');
            img.className = 'relic-img';
            img.src = `./images/relics/${relicImages[name] || name + '.png'}`;
            img.alt = name;
            img.title = name;
            tile.appendChild(img);

            tile.addEventListener('click', () => {
                if (ownedRef[key].includes(name)) {
                    ownedRef[key] = ownedRef[key].filter(r => r !== name);
                } else {
                    ownedRef[key].push(name);
                }
                buildRelicGrid(containerEl, ownedRef, onToggle);
                if (onToggle) onToggle();
            });
            row.appendChild(tile);
        });
        containerEl.appendChild(row);
    });
}

/* ============================================================
   START RUN
   ============================================================ */
function initStartRun() {
    /* ---- DOM refs ---- */
    const step1         = document.getElementById('srStep1');
    const step2         = document.getElementById('srStep2');
    const step3QP       = document.getElementById('srStep3QP');
    const step4QPSurv   = document.getElementById('srStep4QPSurv');
    const step5QPCursed = document.getElementById('srStep5QPCursed');
    const step3NM       = document.getElementById('srStep3NM');
    const step4NM       = document.getElementById('srStep4NM');
    const step3R101     = document.getElementById('srStep3R101');
    const step4R101     = document.getElementById('srStep4R101');
    const step5R101     = document.getElementById('srStep5R101');

    const profilesEl  = document.getElementById('srProfiles');
    const noProfilesEl = document.getElementById('srNoProfiles');
    const nextBtn     = document.getElementById('srNextBtn');

    const ALL_STEPS = [
        step1, step2, step3QP, step4QPSurv, step5QPCursed,
        step3NM, step4NM, step3R101, step4R101, step5R101
    ].filter(Boolean);

    /* ---- run state ---- */
    let selectedPlayers = [];
    let owned           = { grim: [], sinister: [], wicked: [] };
    let selectedTier    = 0;
    let nmChallengeType = null;
    let nmStageCount    = 3;

    /* ---- helpers ---- */
    function showStep(el) {
        ALL_STEPS.forEach(s => s.classList.add('hidden'));
        if (el) el.classList.remove('hidden');
    }

    function getOwnedFromProfiles(playerNames) {
        const profiles = getProfiles();
        const result = { grim: [], sinister: [], wicked: [] };
        playerNames.forEach(playerName => {
            const p = profiles.find(pr => pr.name === playerName);
            if (!p) return;
            ['grim', 'sinister', 'wicked'].forEach(key => {
                p.relics[key].forEach(r => {
                    if (!result[key].includes(r)) result[key].push(r);
                });
            });
        });
        return result;
    }

    /* Tier qualification using relic % values:
       Grim   = 100/3 % each  (3 grims  = 100%)
       Sinister = 50% each    (2 sinisters = 100%)
       Wicked = 100% each     (1 wicked = 100%)
       Thresholds: >= 300% → T3 | >= 200% → T2 | >= 100% → T1
       T0 requires zero owned relics — locked if player owns ANY relic. */
    function highestQualifyingTier() {
        const g = owned.grim.length;
        const s = owned.sinister.length;
        const w = owned.wicked.length;

        if (g + s + w === 0) return 0;

        const pct = (g * 100 / 3) + (s * 50) + (w * 100);

        if (pct >= 300) return 3;
        if (pct >= 200) return 2;
        if (pct >= 100) return 1;
        // Has relics but < 100% — Tier 0 still locked since player owns relics
        return 1;
    }

    /* Tier grid for Normal Mode — only the highest qualifying tier and above are enabled */
    function buildTierGrid(tiersEl, onSelect) {
        const minTier = highestQualifyingTier();
        tiersEl.innerHTML = '';
        ['Tier 0', 'Tier 1', 'Tier 2', 'Tier 3'].forEach((label, i) => {
            const btn = document.createElement('button');
            btn.className = 'secondary-btn tier-btn';
            btn.textContent = label;
            const enabled = i >= minTier;
            btn.disabled = !enabled;
            if (!enabled) btn.classList.add('tier-locked');
            if (i === selectedTier) btn.classList.add('active');
            btn.addEventListener('click', () => {
                if (btn.disabled) return;
                selectedTier = i;
                buildTierGrid(tiersEl, onSelect);
                if (onSelect) onSelect(i);
            });
            tiersEl.appendChild(btn);
        });
    }

    /* ====================================================
       STEP 1: Player selection
    ==================================================== */
    function renderPlayerButtons() {
        profilesEl.innerHTML = '';
        const profiles = getProfiles();
        if (!profiles.length) {
            noProfilesEl.classList.remove('hidden');
            nextBtn.disabled = true;
            return;
        }
        noProfilesEl.classList.add('hidden');
        profiles.forEach(profile => {
            const btn = document.createElement('button');
            btn.className = 'secondary-btn player-btn';
            btn.textContent = profile.name;
            btn.classList.toggle('selected', selectedPlayers.includes(profile.name));
            btn.addEventListener('click', () => {
                if (selectedPlayers.includes(profile.name)) {
                    selectedPlayers = selectedPlayers.filter(n => n !== profile.name);
                } else if (selectedPlayers.length < 4) {
                    selectedPlayers.push(profile.name);
                }
                renderPlayerButtons();
                nextBtn.disabled = selectedPlayers.length < 1;
            });
            profilesEl.appendChild(btn);
        });
        nextBtn.disabled = selectedPlayers.length < 1;
    }

    nextBtn.addEventListener('click', () => showStep(step2));
    document.getElementById('srBackToStep1').addEventListener('click', () => showStep(step1));

    /* ====================================================
       STEP 2: Mode selection
    ==================================================== */
    document.querySelectorAll('[data-mode]').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            if (mode === 'quick') {
                showStep(step3QP);
            } else if (mode === 'normal') {
                owned = getOwnedFromProfiles(selectedPlayers);
                buildRelicGrid(document.getElementById('srRelics'), owned);
                showStep(step3NM);
            } else if (mode === 'round101') {
                showStep(step3R101);
            }
        });
    });

    /* ====================================================
       STEP 3-QP: Quick Play sub-mode picker
    ==================================================== */
    document.getElementById('srBackToStep2FromQP').addEventListener('click', () => showStep(step2));

    document.querySelectorAll('[data-qpmode]').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.qpmode;
            if (mode === 'survival') {
                showStep(step4QPSurv);
            } else if (mode === 'boss') {
                launchRun(selectedPlayers, { grim: [], sinister: [], wicked: [] }, 1, 'quickBoss', 0);
            } else if (mode === 'starting') {
                launchRun(selectedPlayers, { grim: [], sinister: [], wicked: [] }, 1, 'quickStarting', 0);
            } else if (mode === 'trail') {
                launchRun(selectedPlayers, { grim: [], sinister: [], wicked: [] }, 1, 'quickTrail', 0);
            }
        });
    });

    /* ====================================================
       STEP 4-QP-SURV: Quick Survival — Cursed or Standard
    ==================================================== */
    document.getElementById('srBackToStep3QPFromSurv').addEventListener('click', () => showStep(step3QP));

    document.querySelectorAll('[data-survmode]').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.survmode;
            if (mode === 'standard') {
                launchRun(selectedPlayers, { grim: [], sinister: [], wicked: [] }, 1, 'quickSurvivalStandard', 0);
            } else {
                owned = getOwnedFromProfiles(selectedPlayers);
                selectedTier = highestQualifyingTier();
                buildQPCursedTierGrid();
                showStep(step5QPCursed);
            }
        });
    });

    /* ====================================================
       STEP 5-QP-CURSED: Tier selection then launch
    ==================================================== */
    function buildQPCursedTierGrid() {
        const tiersEl   = document.getElementById('srTiersQPCursed');
        const hintEl    = document.getElementById('srQPCursedHint');
        const launchBtn = document.getElementById('srLaunchQPCursed');
        const minTier   = highestQualifyingTier();

        tiersEl.innerHTML = '';
        ['Tier 0', 'Tier 1', 'Tier 2', 'Tier 3'].forEach((label, i) => {
            const btn = document.createElement('button');
            btn.className = 'secondary-btn tier-btn';
            btn.textContent = label;
            const enabled = i >= minTier;
            btn.disabled = !enabled;
            if (!enabled) btn.classList.add('tier-locked');
            if (i === selectedTier) btn.classList.add('active');
            btn.addEventListener('click', () => {
                if (btn.disabled) return;
                selectedTier = i;
                buildQPCursedTierGrid();
            });
            tiersEl.appendChild(btn);
        });

        hintEl.textContent = `Your relics qualify for Tier ${minTier}. Tiers below are locked.`;
        launchBtn.disabled = false;
    }

    document.getElementById('srBackToStep4QPSurv').addEventListener('click', () => showStep(step4QPSurv));
    document.getElementById('srLaunchQPCursed').addEventListener('click', () => {
        launchRun(selectedPlayers, owned, 1, 'quickSurvivalCursed', selectedTier);
    });

    /* ====================================================
       STEP 3-NM: Normal Mode relic selection
    ==================================================== */
    document.getElementById('srBackToStep2FromNM').addEventListener('click', () => showStep(step2));
    document.getElementById('srNextToTierBtn').addEventListener('click', () => {
        selectedTier = highestQualifyingTier();
        nmChallengeType = null;
        nmStageCount = 3;
        document.getElementById('srStartNormalBtn').disabled = true;
        document.getElementById('srNMTierSection').classList.add('hidden');
        document.getElementById('srTierHint').textContent = '';
        document.querySelectorAll('[data-nmtype]').forEach(b => b.classList.remove('selected'));
        // Reset stage picker back to 3
        document.querySelectorAll('[data-stages]').forEach(b => {
            b.classList.toggle('active', b.dataset.stages === '3');
        });
        showStep(step4NM);
    });

    /* Stage count picker */
    document.querySelectorAll('[data-stages]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-stages]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            nmStageCount = Number(btn.dataset.stages);
        });
    });

    /* ====================================================
       STEP 4-NM: Challenge type + optional tier
    ==================================================== */
    document.getElementById('srBackToStep3NM').addEventListener('click', () => showStep(step3NM));

    document.querySelectorAll('[data-nmtype]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-nmtype]').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            nmChallengeType = btn.dataset.nmtype;

            const tierSection = document.getElementById('srNMTierSection');
            const hintEl      = document.getElementById('srTierHint');
            const startBtn    = document.getElementById('srStartNormalBtn');

            if (nmChallengeType === 'boss') {
                selectedTier = highestQualifyingTier();
                tierSection.classList.remove('hidden');
                hintEl.textContent = `Your relics qualify for Tier ${selectedTier}. Tiers below are locked.`;
                buildTierGrid(document.getElementById('srTiers'), tier => {
                    selectedTier = tier;
                });
                startBtn.disabled = false;
            } else {
                tierSection.classList.add('hidden');
                hintEl.textContent = '';
                startBtn.disabled = false;
            }
        });
    });

    document.getElementById('srStartNormalBtn').addEventListener('click', () => {
        if (!nmChallengeType) return;
        const modeMap = {
            boss:     'normalBoss',
            survival: 'normalSurvival',
            trail:    'normalTrail',
            starting: 'normalStarting'
        };
        const rm = modeMap[nmChallengeType];

        // Build stage sequence: user's chosen type first, then random picks from the rest
        const ALL_TYPES = ['boss', 'survival', 'trail', 'starting'];
        const remaining = ALL_TYPES.filter(t => t !== nmChallengeType)
            .map(t => ({ t, r: Math.random() }))
            .sort((a, b) => a.r - b.r)
            .map(o => o.t);
        const sequence = [nmChallengeType, ...remaining].slice(0, nmStageCount);

        launchRun(selectedPlayers, owned, nmStageCount, rm, selectedTier, sequence);
    });

    /* ====================================================
       STEP 3-R101: Round 101 Cursed or Standard
    ==================================================== */
    document.getElementById('srBackToStep2FromR101').addEventListener('click', () => showStep(step2));

    document.querySelectorAll('[data-r101mode]').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.r101mode;
            if (mode === 'standard') {
                launchRun(selectedPlayers, { grim: [], sinister: [], wicked: [] }, 1, 'round101Standard', 3);
            } else {
                owned = getOwnedFromProfiles(selectedPlayers);
                buildRelicGrid(document.getElementById('srRelicsR101'), owned);
                showStep(step4R101);
            }
        });
    });

    /* ====================================================
       STEP 4-R101: R101 Cursed relic selection
    ==================================================== */
    document.getElementById('srBackToStep3R101').addEventListener('click', () => showStep(step3R101));
    document.getElementById('srR101ToTierBtn').addEventListener('click', () => {
        buildR101TierGrid();
        showStep(step5R101);
    });

    /* ====================================================
       STEP 5-R101: Tier confirmation — must reach T3
    ==================================================== */
    function buildR101TierGrid() {
        const tiersEl   = document.getElementById('srTiersR101');
        const msgEl     = document.getElementById('srR101TierMsg');
        const launchBtn = document.getElementById('srLaunchR101Cursed');
        const minTier   = highestQualifyingTier();

        tiersEl.innerHTML = '';
        ['Tier 0', 'Tier 1', 'Tier 2', 'Tier 3'].forEach((label, i) => {
            const btn = document.createElement('button');
            btn.className = 'secondary-btn tier-btn';
            btn.textContent = label;
            // Round 101 requires T3; T0-T2 always locked; T3 enabled only if player qualifies
            const enabled = (i === 3) && (minTier === 3);
            btn.disabled = !enabled;
            if (!enabled) btn.classList.add('tier-locked');
            tiersEl.appendChild(btn);
        });

        if (minTier < 3) {
            msgEl.textContent = `Round 101 requires Tier 3. You currently qualify for Tier ${minTier}. Add more relics.`;
            launchBtn.disabled = true;
        } else {
            msgEl.textContent = 'Tier 3 confirmed — ready to launch.';
            launchBtn.disabled = false;
            selectedTier = 3;
        }
    }

    document.getElementById('srBackToStep4R101').addEventListener('click', () => showStep(step4R101));
    document.getElementById('srLaunchR101Cursed').addEventListener('click', () => {
        launchRun(selectedPlayers, owned, 1, 'round101Cursed', 3);
    });

    /* ====================================================
       Reset on page show
    ==================================================== */
    document.getElementById('startRunPage').addEventListener('cmz:show', () => {
        selectedPlayers = [];
        owned           = { grim: [], sinister: [], wicked: [] };
        selectedTier    = 0;
        nmChallengeType = null;
        nmStageCount    = 3;
        showStep(step1);
        renderPlayerButtons();
    });

    renderPlayerButtons();
}

/* ============================================================
   LAUNCH RUN
   ============================================================ */
function launchRun(players, ownedObj, stageCount, runMode, tier, stageSequence) {
    const unlockedRelics = [...ownedObj.grim, ...ownedObj.sinister, ...ownedObj.wicked];
    localStorage.setItem('gamertags',           JSON.stringify(players));
    localStorage.setItem('playerCount',         JSON.stringify(players.length));
    localStorage.setItem('unlockedRelics',       JSON.stringify(unlockedRelics));
    localStorage.setItem('challengeStageCount', JSON.stringify(stageCount));
    localStorage.setItem('challengeModeType',   JSON.stringify('standard'));
    sessionStorage.setItem('cmz_runMode', runMode);
    sessionStorage.setItem('cmz_tier',    String(tier ?? 0));
    if (stageSequence && stageSequence.length) {
        sessionStorage.setItem('cmz_stageSequence', JSON.stringify(stageSequence));
    } else {
        sessionStorage.removeItem('cmz_stageSequence');
    }
    window.location.href = './run.html';
}
