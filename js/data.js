/* ============================================================
   DATA.JS — Structured Game Data (Fully Segmented)
   ============================================================ */

/* ============================================================
   RELIC POOLS (Your Real Relics)
   ============================================================ */

export const grimRelics = [
    "Lawyers Pen",
    "Dragon Wings",
    "Teddy Bear",
    "Gong",
    "Seed",
    "Rocket"
];

export const sinisterRelics = [
    "Vril Sphere",
    "Samantha's Drawing",
    "Focusing Stone",
    "Spider Fang",
    "Matryoshika Doll",
    "Summoning Key"
];

export const wickedRelics = [
    "Dragon",
    "Bus",
    "Blood Vials",
    "Civil Protector Head",
    "Golden Spork",
    "Mangler Helmet"
];

/* All relics combined */
export const allRelics = [
    ...grimRelics,
    ...sinisterRelics,
    ...wickedRelics
];

/* ============================================================
   FIELD UPGRADES
   ============================================================ */

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

/* ============================================================
   SURVIVAL MODE — CORRECT ROUND VALUES
   ============================================================ */

export const survivalRoundValues = [
    11, 16, 21, 26, 31, 36, 41, 46,
    51, 56, 61, 66, 71, 76
];

/* ============================================================
   STANDARD MODE — Low + Mid common, High rare
   ============================================================ */

export const survivalRoundWeightsStandard = [
    14, // 11
    14, // 16
    12, // 21
    12, // 26
    10, // 31
    10, // 36
    8,  // 41
    8,  // 46
    6,  // 51
    4,  // 56
    3,  // 61
    2,  // 66
    1,  // 71
    1   // 76
];

/* ============================================================
   EXTREME MODE — Mid + High common, Low rare
   ============================================================ */

export const survivalRoundWeightsExtreme = [
    1,  // 11
    1,  // 16
    2,  // 21
    3,  // 26
    4,  // 31
    6,  // 36
    8,  // 41
    10, // 46
    12, // 51
    12, // 56
    10, // 61
    8,  // 66
    6,  // 71
    4   // 76
];

/* ============================================================
   BOSS TIERS (Label Only — Logic is in logic.js)
   ============================================================ */

export const bossTiers = {
    T1: { label: "Tier I", minRelics: 1 },
    T2: { label: "Tier II", minRelics: 2 },
    T3: { label: "Tier III", minRelics: 3 }
};

/* ============================================================
   TRAIL RULES — REQUIRED RELIC POOLS PER MAP
   ============================================================ */

const paradoxPool = [
    "Rocket",          // grim
    "Summoning Key",   // sinister
    "Mangler Helmet"   // wicked
];

const astraPool = [
    "Civil Protector Head", // wicked
    "Golden Spork",         // wicked
    "Spider Fang",          // sinister
    "Gong",                 // grim
    "Seed",                 // grim
    "Matryoshika Doll"      // sinister
];

const ashesPool = allRelics.filter(
    r => !paradoxPool.includes(r) && !astraPool.includes(r)
);

/* Relic-type lookups for trail: quick play uses grim only. */
export const trailMapGrimRelics = {
    "Paradox Junction":     paradoxPool.filter(r => grimRelics.includes(r)),
    "Astra":                astraPool.filter(r => grimRelics.includes(r)),
    "Ashes of the Damned":  ashesPool.filter(r => grimRelics.includes(r))
};

export const trailRules = {
    "Paradox Junction": { pool: paradoxPool },
    Astra:              { pool: astraPool },
    "Ashes of the Damned": { pool: ashesPool }
};

/* ============================================================
   SURVIVAL MAPS
   ============================================================ */

export const survivalMaps = [
    "Vandorn Farm",
    "Exit 115",
    "Zarya Cosmodrome",
    "Mars",
    "Ashwood"
];

/* ============================================================
   STARTING ROOM ROUND TABLES
   ============================================================ */

export const startingRoomRounds = [
    11, 16, 21, 26, 31, 36, 41, 46, 51
];

export const startingRoomWeightsStandard = [
    45, 60, 65, 70, 50, 33, 21, 18, 5
];

export const startingRoomWeightsExtreme = [
    15, 18, 23, 28, 34, 45, 48, 52, 35
];

/* Quick Play: 11-31 only, weighted toward lower rounds */
export const startingRoomRoundsQuick   = [11, 16, 21, 26, 31];
export const startingRoomWeightsQuick  = [30, 28, 22, 14, 6];

/* Normal Mode: 31-71 weighted toward mid-high */
export const startingRoomRoundsNormal  = [31, 36, 41, 46, 51, 56, 61, 66, 71];
export const startingRoomWeightsNormal = [8, 10, 13, 16, 16, 14, 12, 8, 3];

/* Quick Play Survival: 11-31 only */
export const survivalRoundsQuick  = [11, 16, 21, 26, 31];
export const survivalWeightsQuick = [25, 28, 24, 16, 7];