// startrun.js — Handles Start Run flow, player selection, mode, tier, and relic logic
import { getProfiles } from './profiles.js';
import { getSettings } from './settings.js';
import { grimRelics, sinisterRelics, wickedRelics } from './data.js';

export function getTierRequirements(tier) {
    // Example: return { grim: 3, sinister: 2, wicked: 1 } for tier 2
    if (tier === 0) return { grim: 0, sinister: 0, wicked: 0 };
    if (tier === 1) return [
        { grim: 3, sinister: 0, wicked: 0 },
        { grim: 0, sinister: 2, wicked: 0 },
        { grim: 0, sinister: 0, wicked: 1 }
    ];
    if (tier === 2) return [
        { grim: 6, sinister: 0, wicked: 0 },
        { grim: 0, sinister: 4, wicked: 2 },
        { grim: 0, sinister: 0, wicked: 2 }
    ];
    if (tier === 3) return [
        { grim: 6, sinister: 5, wicked: 0 },
        { grim: 4, sinister: 6, wicked: 0 },
        { grim: 0, sinister: 6, wicked: 3 },
        { grim: 0, sinister: 0, wicked: 3 }
    ];
    return [];
}
