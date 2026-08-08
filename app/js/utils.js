/* ============================================================
   UTILS.JS — Pure Helper Functions (No DOM, No State)
   ============================================================ */

/** Cryptographically strong float in [0, 1). Falls back to Math.random. */
export function randomFloat() {
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
        const buf = new Uint32Array(1);
        crypto.getRandomValues(buf);
        // >>> 0 keeps it unsigned; divide by 2^32 for [0, 1)
        return buf[0] / 0x100000000;
    }
    return Math.random();
}

/** Inclusive integer in [min, max]. */
export function randomInt(min, max) {
    const lo = Math.ceil(min);
    const hi = Math.floor(max);
    if (hi < lo) return lo;
    return lo + Math.floor(randomFloat() * (hi - lo + 1));
}

/** In-place Fisher–Yates shuffle (unbiased). Returns the same array. */
export function shuffleInPlace(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = randomInt(0, i);
        const tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
    return arr;
}

/** New shuffled copy. */
export function shuffle(arr) {
    return shuffleInPlace([...arr]);
}

export function pickRandom(arr) {
    if (!arr || arr.length === 0) return undefined;
    return arr[randomInt(0, arr.length - 1)];
}

export function pickUnique(arr, count) {
    if (!arr || arr.length === 0 || count <= 0) return [];
    const copy = shuffle(arr);
    return copy.slice(0, Math.min(count, copy.length));
}

export function weightedPick(values, weights) {
    if (!values?.length) return undefined;
    if (!weights?.length || weights.length !== values.length) {
        return pickRandom(values);
    }

    const safe = weights.map((w) => (Number.isFinite(w) && w > 0 ? w : 0));
    const total = safe.reduce((a, b) => a + b, 0);
    if (total <= 0) return pickRandom(values);

    let r = randomFloat() * total;
    for (let i = 0; i < values.length; i++) {
        if (r < safe[i]) return values[i];
        r -= safe[i];
    }
    return values[values.length - 1];
}

export function getRelicClass(name, grim, sinister, wicked) {
    if (grim.includes(name)) return "relic-grim";
    if (sinister.includes(name)) return "relic-sinister";
    if (wicked.includes(name)) return "relic-wicked";
    return "";
}

export function getMapClass(map) {
    switch (map) {
        case "Astra":
        case "Astra Malorum":
            return "map-Astra";
        case "Ashes of the Damned":
            return "map-AshesoftheDamned";
        case "Paradox Junction":
            return "map-ParadoxJunction";
        case "Totenreich":
            return "map-Totenreich";
        case "Kowakujo":
            return "map-Kowakujo";
        case "Vandorn Farm":
            return "map-VandornFarm";
        case "Exit 115":
            return "map-Exit115";
        case "Zarya Cosmodrome":
            return "map-ZaryaCosmodrome";
        case "Mars":
            return "map-Mars";
        case "Ashwood":
            return "map-Ashwood";
        default:
            return "";
    }
}

export function getPlayerClass(index) {
    return `player${index + 1}`;
}

export const relicImages = {
    "Blood Vials": "blood_vials.png",
    Bus: "bus.png",
    "Civil Protector Head": "civil_head_protector.png",
    Dragon: "dragon.png",
    "Dragon Wings": "dragon_wings.png",
    "Focusing Stone": "focusing_stone.png",
    "Golden Spork": "golden_spork.png",
    Gong: "gong.png",
    "Lawyers Pen": "Lawyers_pen.png",
    "Mangler Helmet": "mangler_helmet.png",
    "Matryoshika Doll": "matryoshika_doll.png",
    Rocket: "rocket.png",
    "Samantha's Drawing": "samanthas_drawing.png",
    Seed: "seed.png",
    "Spider Fang": "spider_fang.png",
    "Summoning Key": "summoning_key.png",
    "Teddy Bear": "teddy_bear.png",
    "Vril Sphere": "vril_sphere.png",
    // Season 3 — Totenreich
    "Power Switch": "power_switch.png",
    "Wrestler's Belt": "wrestlers_belt.png",
    "Stuffed Elephant": "stuffed_elephant.png",
    "Dancing Arnie": "dancing_arnie.png",
    "Agarthan Device": "agarthan_device.png",
    "Music Box": "music_box.png",
    // Season 4 — Kowakujo
    Gramophone: "gramophone.png",
    "Druid Stone": "druid_stone.png",
    "Film Reel": "film_reel.png",
    "Valkyrie Helmet": "valkyrie_helmet.png",
    "Dragon Egg": "dragon_egg.png",
    "Mannequin Turret": "mannequin_turret.png",
};

export function getRelicImage(name) {
    return relicImages[name] || `${name}.png`;
}
