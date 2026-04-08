// profiles.js — Manage player profiles (add, delete, list, localStorage)

const MAX_PROFILES = 10;
const STORAGE_KEY = 'cmz_profiles';

export function getProfiles() {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    // Migrate old string-only entries to object format
    return raw.map(p =>
        typeof p === 'string'
            ? { name: p, relics: { grim: [], sinister: [], wicked: [] } }
            : p
    );
}

export function saveProfiles(profiles) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

export function addProfile(name) {
    const profiles = getProfiles();
    if (profiles.length >= MAX_PROFILES) return false;
    if (profiles.some(p => p.name.toLowerCase() === name.toLowerCase())) return false;
    profiles.push({ name, relics: { grim: [], sinister: [], wicked: [] } });
    saveProfiles(profiles);
    return true;
}

export function deleteProfile(name) {
    const profiles = getProfiles().filter(p => p.name !== name);
    saveProfiles(profiles);
}

export function updateProfileRelics(name, relics) {
    const profiles = getProfiles();
    const p = profiles.find(pr => pr.name === name);
    if (!p) return;
    p.relics = { grim: [...relics.grim], sinister: [...relics.sinister], wicked: [...relics.wicked] };
    saveProfiles(profiles);
}
