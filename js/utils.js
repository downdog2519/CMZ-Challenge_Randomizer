/* ============================================================
   UTILS.JS — Pure Helper Functions (No DOM, No State)
   ============================================================ */

/* ---------- RANDOM PICK ---------- */
export function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/* ---------- UNIQUE RANDOM PICK ---------- */
export function pickUnique(arr, count) {
    const copy = [...arr];
    const result = [];

    while (result.length < count && copy.length > 0) {
        const i = Math.floor(Math.random() * copy.length);
        result.push(copy.splice(i, 1)[0]);
    }
    return result;
}

/* ---------- WEIGHTED RANDOM PICK ---------- */
export function weightedPick(values, weights) {
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;

    for (let i = 0; i < values.length; i++) {
        if (r < weights[i]) return values[i];
        r -= weights[i];
    }
    return values[values.length - 1];
}

/* ============================================================
   CLASS HELPERS — Used by UI + Summary Rendering
   ============================================================ */

/* ---------- RELIC CLASS ---------- */
export function getRelicClass(name, grim, sinister, wicked) {
    if (grim.includes(name)) return "relic-grim";
    if (sinister.includes(name)) return "relic-sinister";
    if (wicked.includes(name)) return "relic-wicked";
    return "";
}

/* ---------- MAP CLASS ---------- */
export function getMapClass(map) {
    switch (map) {
        case "Astra": return "map-Astra";
        case "Ashes of the Damned": return "map-AshesoftheDamned";
        case "Paradox Junction": return "map-ParadoxJunction";

        case "Vandorn Farm": return "map-VandornFarm";
        case "Exit 115": return "map-Exit115";
        case "Zarya Cosmodrome": return "map-ZaryaCosmodrome";
        case "Mars": return "map-Mars";

        default: return "";
    }
}

/* ---------- PLAYER COLOR CLASS ---------- */
export function getPlayerClass(index) {
    return `player${index + 1}`;
}

/* ============================================================
   RELIC IMAGE FILENAME MAP (Your Real Filenames)
   ============================================================ */

export const relicImages = {
    "Blood Vials": "blood_vials.png",
    "Bus": "bus.png",
    "Civil Protector Head": "civil_head_protector.png",
    "Dragon": "dragon.png",
    "Dragon Wings": "dragon_wings.png",
    "Focusing Stone": "focusing_stone.png",
    "Golden Spork": "golden_spork.png",
    "Gong": "gong.png",
    "Lawyers Pen": "Lawyers_pen.png",
    "Mangler Helmet": "mangler_helmet.png",
    "Matryoshika Doll": "matryoshika_doll.png",
    "Rocket": "rocket.png",
    "Samantha's Drawing": "samanthas_drawing.png",
    "Seed": "seed.png",
    "Spider Fang": "spider_fang.png",
    "Summoning Key": "summoning_key.png",
    "Teddy Bear": "teddy_bear.png",
    "Vril Sphere": "vril_sphere.png"
};

/* ============================================================
   GET RELIC IMAGE FILENAME
   ============================================================ */

export function getRelicImage(name) {
    return relicImages[name] || `${name}.png`;
}