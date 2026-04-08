// run.js — Entry point for run.html (the active challenge/run page)
import { state } from './state.js';
import {
    beginRun,
    beginChallenge,
    markPass,
    markFail
} from './logic.js';
import {
    showChallengeButtons,
    hideBeginButton,
    updateSessionStats
} from './ui.js';

/* Map from cmz_runMode → challenge type string used by beginChallenge() */
const AUTO_LAUNCH_MAP = {
    quickBoss:             'boss',
    quickSurvivalStandard: 'survival',
    quickSurvivalCursed:   'survival',
    quickTrail:            'trail',
    quickStarting:         'starting',
    normalBoss:            'boss',
    normalSurvival:        'survival',
    normalTrail:           'trail',
    normalStarting:        'starting',
    round101Standard:      'boss',
    round101Cursed:        'boss',
};

document.addEventListener('DOMContentLoaded', () => {
    const runMode  = sessionStorage.getItem('cmz_runMode') || 'normalBoss';
    const autoType = AUTO_LAUNCH_MAP[runMode] ?? null;

    // Initialise the run — reads cmz_runMode & cmz_tier, resets state, shows begin button
    beginRun();

    if (autoType) {
        // All modes: auto-launch challenge immediately (skip topic-select)
        // Normal mode uses cmz_stageSequence[0] as the first type
        const rawSeq = sessionStorage.getItem('cmz_stageSequence');
        const seq = rawSeq ? JSON.parse(rawSeq) : null;
        const firstType = (seq && seq.length) ? seq[0] : autoType;
        setTimeout(() => beginChallenge(firstType), 0);
    }

    // Normal-mode challenge type buttons (only visible if no auto-launch)
    document.getElementById('bossBtn')
        ?.addEventListener('click', () => beginChallenge('boss'));
    document.getElementById('survivalBtn')
        ?.addEventListener('click', () => beginChallenge('survival'));
    document.getElementById('trailBtn')
        ?.addEventListener('click', () => beginChallenge('trail'));
    document.getElementById('startingBtn')
        ?.addEventListener('click', () => beginChallenge('starting'));

    // Begin button — normal mode shows challenge-type buttons
    document.getElementById('beginBtn')?.addEventListener('click', () => {
        showChallengeButtons();
        hideBeginButton();
    });

    // Pass / Fail
    document.getElementById('passBtn')?.addEventListener('click', () => markPass());
    document.getElementById('failBtn')?.addEventListener('click', () => markFail());

    // Return to main menu
    document.getElementById('homeBtn')?.addEventListener('click', () => {
        window.location.href = './index.html';
    });

    updateSessionStats();
});
