// leaderboard.js — Handles leaderboard data and rendering

const STORAGE_KEY = 'cmz_leaderboard';

export function getLeaderboard() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

export function saveLeaderboard(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function addLeaderboardEntry(entry) {
    let entries = getLeaderboard();
    entries.push(entry);
    saveLeaderboard(entries);
}
