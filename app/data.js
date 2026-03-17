/* ===================== RELIC POOLS ===================== */

export const grimRelics = [
    "Lawyers Pen",
    "Dragon Wings",
    "Teddy Bear",
    "Gong",
    "Seed",
    "Rocket" // NEW
];

export const sinisterRelics = [
    "Vril Sphere",
    "Samantha's Drawing",
    "Focusing Stone",
    "Spider Fang",
    "Matryoshika Doll",
    "Summoning Key" // NEW
];



export const wickedRelics = [
    "Dragon",
    "Bus",
    "Blood Vials",
    "Civil Protector Head",
    "Golden Spork"
];

export const allRelics = [
    ...grimRelics,
    ...sinisterRelics,
    ...wickedRelics
];

/* ===================== TRAIL RELICS ===================== */

export const astraTrailRelics = [
    "Gong",
    "Seed",
    "Spider Fang",
    "Matryoshika Doll",
    "Golden Spork",
    "Civil Protector Head"
];

export const ashesTrailRelics = [
    "Lawyers Pen",
    "Dragon Wings",
    "Teddy Bear",
    "Vril Sphere",
    "Samantha's Drawing",
    "Focusing Stone",
    "Bus",
    "Blood Vials"
];

export const paradoxTrailRelics = [
    "Rocket",
    "Summoning Key" // NEW
];

/* ===================== FIELD UPGRADES ===================== */

export const fieldUpgrades = [
    "Energy Mine",
    "Dark Flare",
    "Frenzied Guard",
    "Healing Aura",
    "Toxic Growth",
    "Aether Shroud",
    "Frost Blast",
    "Tesla Storm",
    "Mister Peeks"
];

/* ===================== SURVIVAL MAPS ===================== */

export const survivalMaps = [
    "Vandorn Farm",
    "Exit 115",
    "Zarya Cosmodrome",
    "Mars"
];

/* ===================== SURVIVAL ROUND WEIGHTS ===================== */

export const survivalRoundValues = [
    11, 16, 21, 26, 31, 36, 41,
    46, 51, 56, 61, 66, 71, 76
];

export const survivalRoundWeights = [
    3, 5, 8, 12, 41, 67, 77,
    65, 39, 27, 12, 18, 6, 7
];

/* ===================== BOSS TIERS ===================== */

export const bossTiers = {
    T1: { label: "Tier 1", minRelics: 2 },
    T2: { label: "Tier 2", minRelics: 3 },
    T3: { label: "Tier 3", minRelics: 4 }
};

/* ===================== EXTREME MODE RELIC RANGE ===================== */

export const extremeRelicRange = {
    min: 10,
    max: 15
};

/* ===================== TRAIL RULES ===================== */

export const trailRules = {
    grim: {},
    astra: { pool: astraTrailRelics },
    ashes: { pool: ashesTrailRelics },
    paradox: { pool: paradoxTrailRelics } // NEW
};

/* ===================== UTILITY HELPERS ===================== */

export function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function pickUnique(arr, count) {
    const copy = [...arr];
    const result = [];
    while (result.length < count && copy.length > 0) {
        const i = Math.floor(Math.random() * copy.length);
        result.push(copy.splice(i, 1)[0]);
    }
    return result;
}

export function weightedPick(values, weights) {
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < values.length; i++) {
        if (r < weights[i]) return values[i];
        r -= weights[i];
    }
    return values[values.length - 1];
}

export const relicImages = {
    "Lawyers Pen": "Lawyers-pen.png",
    "Gong": "gong.png",
    "Teddy Bear": "teddy-bear.png",
    "Dragon Wings": "dragon-wings.png",
    "Seed": "seed.png",
    "Rocket": "rocket.png",
    "Vril Sphere": "vril-sphere.png",
    "Samantha's Drawing": "samanthas-drawing.png",
    "Focusing Stone": "focusing-stone.png",
    "Spider Fang": "spider-fang.png",
    "Matryoshika Doll": "matryoshika-doll.png",
    "Bus": "bus.png",
    "Dragon": "dragon.png",
    "Blood Vials": "blood-vials.png",
    "Civil Protector Head": "civil-head-protector.png",
    "Golden Spork": "golden-spork.png",
    "Summoning Key": "summoning-key.png" // NEW
};








