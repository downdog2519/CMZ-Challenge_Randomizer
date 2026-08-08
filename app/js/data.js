/* ============================================================
   DATA.JS — Maps, Relics, Challenges, Unlock Codex
   ============================================================ */

/* ============================================================
   RELIC POOLS BY TIER
   ============================================================ */

export const grimRelics = [
    "Lawyers Pen",
    "Dragon Wings",
    "Teddy Bear",
    "Gong",
    "Seed",
    "Rocket",
    "Power Switch",
    "Wrestler's Belt",
    "Gramophone",
    "Druid Stone",
];

export const sinisterRelics = [
    "Vril Sphere",
    "Samantha's Drawing",
    "Focusing Stone",
    "Spider Fang",
    "Matryoshika Doll",
    "Summoning Key",
    "Stuffed Elephant",
    "Dancing Arnie",
    "Film Reel",
    "Valkyrie Helmet",
];

export const wickedRelics = [
    "Dragon",
    "Bus",
    "Blood Vials",
    "Civil Protector Head",
    "Golden Spork",
    "Mangler Helmet",
    "Agarthan Device",
    "Music Box",
    "Mannequin Turret",
    "Dragon Egg",
];

export const allRelics = [
    ...grimRelics,
    ...sinisterRelics,
    ...wickedRelics,
];

export const relicTier = {
    Grim: grimRelics,
    Sinister: sinisterRelics,
    Wicked: wickedRelics,
};

/* ============================================================
   RELIC CODEX — map, tier, effect, requirements, unlock steps
   ============================================================ */

export const relicCodex = [
    // -------------------- Ashes of the Damned --------------------
    {
        name: "Lawyers Pen",
        tier: "Grim",
        map: "Ashes of the Damned",
        points: 1,
        effect: "Mimic props infiltrate the map (floor props can become Shock Mimics).",
        requires: "Cursed Mode · any Tier · Round 20+ · Ashes EE + Mysterious Object unlocked",
        steps: [
            "Survive to Round 20+.",
            "Get Napalm Burst (Arsenal) or Molotovs (Crafting Table / Ashwood garage barrel).",
            "Light 3 red candles with fire (any order): (1) Vandorn Farmhouse upstairs bedside cabinet; (2) Ruby Rabbit / Ashwood shelf by Jugger-Nog; (3) Lost Cabins southwest cabin table by the couch.",
            "Hear Mr. Peeks laugh, then enter the green portal on the northeast Barn wall at Vandorn Farm.",
        ],
        trial: "4 waves — all zombies are Shock Mimics (focus HVTs on waves 2 & 4). Brain Rot helps.",
    },
    {
        name: "Dragon Wings",
        tier: "Grim",
        map: "Ashes of the Damned",
        points: 1,
        effect: "Normal Power-Up spawns are disabled (including Ravager Max Ammos).",
        requires: "Cursed Mode · any Tier · Round 20+ · Vandorn Farm power restored",
        steps: [
            "Survive to Round 20+.",
            "At Vandorn Farm, take the Jump Pad to Janus Towers Plaza.",
            "While flying, shoot 3 purple orbs: left pylon/power tower, right rubble/destroyed tower, then above Janus Tower lobby.",
            "Hear the laugh, then enter the green portal on the southeast Farmhouse wall at Vandorn Farm.",
        ],
        trial: "4 waves — Power-Ups drop constantly but damage you if touched (they don't grant the power-up).",
    },
    {
        name: "Teddy Bear",
        tier: "Grim",
        map: "Ashes of the Damned",
        points: 1,
        effect: "Round start delay reduced by 75% (zombies spawn much faster).",
        requires: "Cursed Mode · any Tier · Round 20+ for final doll · Aether Shroud + Necrofluid Gauntlet",
        steps: [
            "Equip Aether Shroud and build the Necrofluid Gauntlet.",
            "Find 10 hidden Mr. Peeks dolls: stand at the spawn, pop Aether Shroud, shoot with the Gauntlet, then reload to pull it. Locations: Janus exit gate sign; Vandorn Barn silo; Grounded Ship barrel; Blackwater Cabin toilet (Speed Cola room); Lost Cabins log shelter roof; Ashwood Church rafters; Ashwood Rabbit Alley high cabinet; Zarya electricity pole; Zarya Support Systems lower electrical box; Exit 115 highway sign from Diner rooftop (Round 20+ only).",
            "Do not Save & Quit mid-hunt (resets dolls / delays the final spawn).",
            "Enter the green portal on the north wall of the small Armor Wall-Buy shed at Vandorn Farm.",
        ],
        trial: "4 waves — every gunshot costs 100 Essence (you can still shoot at 0 Essence).",
    },
    {
        name: "Vril Sphere",
        tier: "Sinister",
        map: "Ashes of the Damned",
        points: 2,
        effect: "You can only carry 4 Perk-a-Colas (extra drinks replace the oldest).",
        requires: "Cursed Tier 1+ · Round 40+",
        steps: [
            "Survive to Round 40+ (Doppelghasts spawn).",
            "Lure a Doppelghast onto a Jump Pad and kill it with Jump Pad damage (weaken first, then spam the pad).",
            "Enter the orange/yellow portal on the southeast rocket wall at Zarya Cosmodrome.",
        ],
        trial: "5 waves — all purchases disabled (Wall Buys, Ammo Caches, Perks). Bring Vulture Aid / Cache Back.",
    },
    {
        name: "Samantha's Drawing",
        tier: "Sinister",
        map: "Ashes of the Damned",
        points: 2,
        effect: "Every round your weapons swap to different ones (rarity & PaP level kept).",
        requires: "Cursed Tier 1+ · Round 40+ for Wonder Weapon trade",
        steps: [
            "Find Chompy (trash can) — melee to open; only one POI is active at a time.",
            "Feed weapons in rarity order: Common → Uncommon → Rare → Epic → Legendary. Start with your grey pistol, then upgrade/trade up each rarity.",
            "On Round 40+, feed Chompy a Wonder Weapon (Ray Gun / Mark II recommended; keep Necrofluid Gauntlet for the trial).",
            "Enter the orange portal on the northwest wall of Zarya Cosmodrome next to Yuri's Lab.",
        ],
        trial: "5 waves — Ammo Caches and Max Ammo Power-Ups disabled. War Machine + Necrofluid Gauntlet help.",
    },
    {
        name: "Focusing Stone",
        tier: "Sinister",
        map: "Ashes of the Damned",
        points: 2,
        effect: "Self-Revive kits are unavailable.",
        requires: "Cursed Tier 1+ · Round 40+",
        steps: [
            "Survive to Round 40+.",
            "Kill a Zursa Bear with a melee finishing blow (Melee Macchiato + PaP Gauntlet recommended). Pick up the dropped wine bottle.",
            "Complete any T.E.D.D. Task at Legendary (max) reward rank — a second bottle drops when T.E.D.D. leaves.",
            "Take both bottles to the bar in Blackwater Lake Cabin (north wall). Place them, watch the 5 bottles explode, then shoot them in that exact order.",
            "Enter the orange portal on the west Flame Trench wall in lower Zarya Cosmodrome.",
        ],
        trial: "5 waves — Essence is set to 0 for the whole trial (spend everything before entering).",
    },
    {
        name: "Bus",
        tier: "Wicked",
        map: "Ashes of the Damned",
        points: 3,
        effect: "Enemy health regenerates.",
        requires: "Cursed Tier 2+ · Round 60+",
        steps: [
            "Survive to Round 60+ on Tier 2+.",
            "Clear an entire round with trap/equipment kills only — do not shoot. Best: wait for a Ravager round, activate the Ashwood Shops Saw Blade trap, and let Ravagers die in it. Taking damage fails the step.",
            "Enter the red portal on the south wall of the Blackwater Lake fishing hut / boathouse (Armor Wall-Buy side).",
        ],
        trial: "6 waves — only Brain-Rot charmed zombies can kill other zombies. Caustic Fumes + Explosive/Super Serum Brain Rot recommended.",
    },
    {
        name: "Dragon",
        tier: "Wicked",
        map: "Ashes of the Damned",
        points: 3,
        effect: "All Ammo Crates / Ammo Caches are disabled.",
        requires: "Cursed Tier 2+ · Round 60+ · defeat Veytharion on Round 60+",
        steps: [
            "Progress Ashes Main EE early, then wait until Round 60+ before starting the boss.",
            "Talk to Klaus at Blackwater Lake, finish the Ol' Tessie wisp trial, defeat Veytharion on Round 60+.",
            "Hit Continue on the end screen — hear Mr. Peeks laugh.",
            "Enter the red portal on the west wall of the Blackwater Lake Cabin.",
        ],
        trial: "6 waves — zombies only take explosive damage (Ray Gun, Monkey Bombs, PaP Necrofluid Gauntlet explosions).",
    },
    {
        name: "Blood Vials",
        tier: "Wicked",
        map: "Ashes of the Damned",
        points: 3,
        effect: "All Augments are disabled.",
        requires: "Cursed Tier 2+ · answer phones on Rounds 20 / 30 / 40 / 50 / 60",
        steps: [
            "Start Tier 2+. From Round 20, listen for a loud ringing red telephone (every ~10 rounds: 20, 30, 40, 50, 60). Round Off gum can help double a phone round.",
            "Hold / spam Interact until the phone vanishes and you hear a laugh. Repeat for all 5 phones.",
            "Known phone spots: Janus Server Room desk; Vandorn Farmhouse upstairs desk; Blackwater Toolshed / Lost Cabins shelves; Ashwood Market Square ruin opposite Vulture Aid; Zarya Control Room; Exit 115 McDougal's / Reba's Diner.",
            "Enter the red portal inside Blackwater Lake Cabin (west wall).",
        ],
        trial: "6 waves — your weapons deal 50% damage. Fire Works / Kill Joy help vs Shock Mimic & Doppelghast HVTs.",
    },

    // -------------------- Astra Malorum --------------------
    {
        name: "Seed",
        tier: "Grim",
        map: "Astra Malorum",
        points: 1,
        effect: "Mystery Box is disabled (Fire Sale / Immolation Liquidation can still spawn a temporary box).",
        requires: "Cursed Mode · any Tier · Round 20+ · Astra EE done once",
        steps: [
            "Survive to Round 20+ and find the grey-rarity pistol (Jager 45 / Velox 5.7 / Coda 9) in Observatory Dome, Luminarium, Archive of Orbis, or Machina Astralis.",
            "Do NOT Pack-a-Punch or rarity-upgrade it. Get kills with it equal to the current Round number (Round 20 → 20 kills).",
            "Switch to another weapon and finish the round — hear Mr. Peeks laugh.",
            "Enter the green portal in Observatory Dome (north, by ammo cache).",
        ],
        trial: "4 waves — you only get a provided PaP pistol (rarity/ammo mods OK at Arsenal). Traps / Disciple Injection help.",
    },
    {
        name: "Gong",
        tier: "Grim",
        map: "Astra Malorum",
        points: 1,
        effect: "Field Upgrades only charge from Full Power Power-Ups.",
        requires: "Cursed Mode · any Tier · Round 20+ · Tesla Storm + Dead Wire (no lethal Augments preferred)",
        steps: [
            "Equip Tesla Storm Field Upgrade and Dead Wire Ammo Mod (avoid lethal Augments so you don't kill the rod zombie).",
            "On Round 20+, find the zombie with a lightning rod in its back (“Rodney”) — it never despawns. Train in Observatory Dome, teleporter-clear, then return to isolate it.",
            "Over 3 rounds, at each doorway: Dead Wire stun the rod zombie, then activate Tesla Storm so electricity charges the lightbulb above: (1) Observatory Dome east door into Veilwalk; (2) Archive of Orbis south door into Machina Astralis; (3) Luminarium east door into Stargazer's Courtyard.",
            "Enter the green portal at Observatory Dome entrance by the destroyed northeast pillar.",
        ],
        trial: "Electric damage only (Dead Wire required). Waves include Core Uber Klauses / HVT Uber Klaus.",
    },
    {
        name: "Spider Fang",
        tier: "Sinister",
        map: "Astra Malorum",
        points: 2,
        effect: "Perk machine prices never decrease.",
        requires: "Cursed Tier 1+ · Round 40+ · Wisp Tea + melee finish on O.S.C.A.R.",
        steps: [
            "Reach Round 40+. Prefer an early-spawn O.S.C.A.R. (health doesn't scale if he spawned early).",
            "Use Wisp Tea with no Major Augment (so it targets O.S.C.A.R. without melting him). Extension/Haste minors help.",
            "While Wisp Tea is actively attacking O.S.C.A.R., land the killing blow with a knife / melee (Melee Macchiato + PaP knife recommended).",
            "Enter the orange portal on the west wall of Archive of Orbis.",
        ],
        trial: "5 waves — all Perks disabled. HVT Uber Klaus (wave 2) and HVT O.S.C.A.R. (wave 5). Apogee Annihilator trap helps.",
    },
    {
        name: "Matryoshika Doll",
        tier: "Sinister",
        map: "Astra Malorum",
        points: 2,
        effect: "Salvage drop rates are halved.",
        requires: "Cursed Tier 1+ · Round 40+ · Mars portal open · C4",
        steps: [
            "Progress Astra Main EE until Mars is accessible. Reach Round 40+ with C4 as Lethal.",
            "On Mars, at the central altar: place C4 on the three meat piles, herd a large horde onto the altar, and detonate (~50+ C4 kills in the circle).",
            "Hear Mr. Peeks laugh, then enter the yellow portal on the south Machina Astralis wall by the cryo pod.",
        ],
        trial: "Enemies only die while a Field Upgrade is active (~15s auto recharge). Frenzied Guard + War Machine for HVTs.",
    },
    {
        name: "Golden Spork",
        tier: "Wicked",
        map: "Astra Malorum",
        points: 3,
        effect: "Enemies deal double damage.",
        requires: "Cursed Tier 2+ · Round 60+ · Mars access · Mangler Cannon Scorestreak",
        steps: [
            "Reach Round 60+ and open Mars via Main EE.",
            "Buy a Mangler Cannon. On Mars, shoot the Cannon into the return teleporter, then immediately teleport back to Astra Malorum.",
            "Within ~10 seconds the shot lands in the red ritual circle in Machina Astralis (north of portal) — it must kill 10+ zombies. Train a horde there before the shot lands.",
            "Enter the red portal at Crash Site, left of Quick Revive on the wall toward Museum Infinitum.",
        ],
        trial: "Kills must be hip-fire only. Prepare for HVT Uber Klaus / O.S.C.A.R. on later waves.",
    },
    {
        name: "Civil Protector Head",
        tier: "Wicked",
        map: "Astra Malorum",
        points: 3,
        effect: "Every 100 kills you lose 1 Perk.",
        requires: "Cursed Tier 2+ · Round 60+ · PhD Flopper + Energy Mine",
        steps: [
            "Reach Round 60+ on Tier 2+.",
            "At Crash Site by Ol' Tessie, place an Energy Mine — Tessie's lights flash 3 times, then headlights (A/B front) and brake lights (C/D rear) flash a repeating order. Note the order.",
            "In Museum Infinitum, extinguish chandelier candles with PhD Flopper explosive flops in that light order: Front-Left (A), Front-Right (B), Back-Left (C), Back-Right (D).",
            "Enter the red portal next to the Rampage Inducer at Crash Site.",
        ],
        trial: "6 waves — all zombies are super sprinters. Uber Klaus / O.S.C.A.R. HVTs — bring War Machine.",
    },

    // -------------------- Paradox Junction --------------------
    {
        name: "Rocket",
        tier: "Grim",
        map: "Paradox Junction",
        points: 1,
        effect: "Scorestreaks are disabled.",
        requires: "Cursed Mode · any Tier · Round 20+ · Paradox EE done once",
        steps: [
            "Survive to Round 20+.",
            "In Clean Nuketown: Brain Rot / Charm a Rad-Hound, then Interact to pet it (easiest at end of a Max Ammo / dog round).",
            "In Destroyed Nuketown: buy a D.A.W.G. Scorestreak (2,250 Salvage) and Interact to pet it.",
            "Enter the green portal on the south wall of the Green House upstairs bedroom.",
        ],
        trial: "4 waves — kill only with matching Ammo Mods: Rad-Hounds/Acid Zombies → Shadow Rift; Shock Mimics → Brain Rot; Doppelghasts → Light Mend. Mule Kick for 3 guns.",
    },
    {
        name: "Summoning Key",
        tier: "Sinister",
        map: "Paradox Junction",
        points: 2,
        effect: "Zombies explode on death.",
        requires: "Cursed Tier 1+ · Round 40+",
        steps: [
            "Destroyed Nuketown: from Cul-de-Sac facing Green House right side, throw a Grenade into the destroyed chimney by the clock tower → pick up Dog Collar.",
            "Clean Nuketown Yellow House backyard: Charm a Rad-Hound (Brain Rot / Psyche Grenade) so it digs up the Tennis Ball — pick it up.",
            "Round 40+: down yourself against the west fence in Destroyed Green House backyard, Interact the gravestone to place Collar + Ball (Aftertaste / Self-Revive recommended).",
            "Enter the portal on the right side of Clean Nuketown Yellow House.",
        ],
        trial: "5 waves — each wave must be finished within 90 seconds (including HVTs). War Machine / Sundergat / Kazimirs.",
    },
    {
        name: "Mangler Helmet",
        tier: "Wicked",
        map: "Paradox Junction",
        points: 3,
        effect: "The Arsenal is disabled.",
        requires: "Cursed Tier 2+ · Round 60+ · Mister Peeks Field Upgrade · Mystery Box (do not equip Seed)",
        steps: [
            "Equip Mister Peeks Field Upgrade. Spin the Mystery Box until Mister Peeks appears, then activate the Field Upgrade and pick him up. Repeat in both Clean and Destroyed Nuketown.",
            "Place both Mister Peeks on the Yellow House mailboxes (Clean + Destroyed).",
            "On Round 60, open the mailbox that reveals an Ultra rarity Knife — Pack-a-Punch it and kill the Red-Mouth Shock Mimic with the knife.",
            "Enter the portal above the Green House door in Destroyed Nuketown.",
        ],
        trial: "6 waves — armor plates removed and max health set to 50 (~2-hit downs). Iron Core Jug + Aether Shroud recommended.",
    },

    // -------------------- Totenreich --------------------
    {
        name: "Power Switch",
        tier: "Grim",
        map: "Totenreich",
        points: 1,
        effect: "Tactical and Lethal equipment randomize each round.",
        requires: "Cursed Mode · any Tier/Round · Combat Axe + scoped sniper · Totenreich EE done once",
        steps: [
            "Craft a Combat Axe. Bring a scoped sniper (Shadow SK on Tyr's Shoulder works).",
            "Scope 4 off-map altars and count deer skulls on each — that number is the altar's order (1–4 skulls): Eidskallen Landing (SW shore); Core Foundry/Dry Dock (west cliff by War Factory); Tyr's Foot (NW from the foot); Burial Grounds (NE cliff).",
            "In Blodheim Hall, throw the Combat Axe at the 4 bear pelts in skull-count order (1 skull → first pelt … 4 skulls → fourth pelt).",
            "Enter the green portal between the south bear pelts in Blodheim Hall.",
        ],
        trial: "3 waves — Flammefallen / trap kills only (no HVTs). Keep ~1,000 Essence per trap use (Eidskallen Square / Beacon Island).",
    },
    {
        name: "Wrestler's Belt",
        tier: "Grim",
        map: "Totenreich",
        points: 1,
        effect: "Weapon Wall Buys randomize each round.",
        requires: "Cursed Mode · Totenreich EE done once · unlock method still unsolved by the community",
        steps: [
            "Confirmed so far: in Cursed Mode after the Main EE, pick up the Mr. Peeks magazine at the top of the Lighthouse (same room as the Jotunn Star). It is datamined as linked to this relic.",
            "No verified follow-up steps exist yet (community still testing Wildfire Field Upgrade + ammo mod / wall-buy combos).",
            "When solved, a green Grim trial portal will spawn — complete that trial to unlock the relic.",
        ],
        trial: "Unknown until the unlock is solved. Effect when equipped: randomizes Wall Buys each round.",
    },
    {
        name: "Stuffed Elephant",
        tier: "Sinister",
        map: "Totenreich",
        points: 2,
        effect: "Health regen delay is increased.",
        requires: "Cursed Tier 1+ · Round 40 · ZERO Perks from Round 1–40 (machines, gums, T.E.D.D., Mr. Peeks eggs)",
        steps: [
            "From Round 1 to 40, never obtain a Perk from any source. One Perk fails the run for this relic.",
            "On Round 40 with a clean perkless run, the portal spawns on Fishery Island behind the Jugger-Nog building. Buy Perks after it appears.",
            "Enter the portal when ready.",
        ],
        trial: "Find 4 Mr. Peeks eggs (3:00 base timer; +3:00 per egg/HVT): Skallen Market white-house windowsill (Necropincer); Storm Bridge on Tyr's knee opposite Deadshot (Doppelghast); Dry Dock Mystery Box warehouse SW beam (Amalgam); Beacon Island lighthouse ledge SW of Flammenfalle (Zursa). Kill each HVT.",
    },
    {
        name: "Dancing Arnie",
        tier: "Sinister",
        map: "Totenreich",
        points: 2,
        effect: "Perk-a-Cola machines dispense random Perks.",
        requires: "Cursed Tier 1+ · Round 40+ · stew ingredients before finishing Jotunn (need Chilly Chunks)",
        steps: [
            "Skallen Market: go prone by the stall behind Mule Kick and pick up the metal pot. Place it on the Blodheim Hall fire pit opposite Vulture Aid.",
            "Eidskallen Square: grab the tankard from the barrel SW of the boat/antique store → put in pot. Storm Bridge: take Chilly Chunks from the crate behind the truck (right of Deadshot) → put in pot. (You can still explode the truck for a second Chilly Chunks can for Jotunn Star.)",
            "Kill a Necropincer with Flammenfalle finishing fire → pick up the red lobster → add to pot.",
            "Fish with a rod at any fishing spot; on Round 39+ special rounds at Fishery Island catch the red fish → add to pot to spawn dancing Mr. Peeks.",
            "Get ~75+ Jotunn Star melee kills near Mr. Peeks to feed him. Portal appears above Pack-a-Punch on Fishery Island.",
        ],
        trial: "Melee damage only. Bring PaP Jotunn Star + Melee Macchiato. HVTs on waves 2 & 5.",
    },
    {
        name: "Agarthan Device",
        tier: "Wicked",
        map: "Totenreich",
        points: 3,
        effect: "Different zombie types spawn each round (Acid / Frost / Normal, etc.).",
        requires: "Cursed Tier 2+ · Richtofen on the team · collect Helmet + Mr. Peeks + Walkie-Talkie · finish Richtofen side EE",
        steps: [
            "Must play as Richtofen (or have Richtofen on the team).",
            "Enter Tyr's Shoulder/Foot each round for random teleports: Requiem crew room → crouch south bottom shelf for Helmet; Liberty Falls hotel room → prone right of bed for Mr. Peeks.",
            "ARC-XD the northeast Core Foundry vent → detonate in the secret room to open Group 935 Genetic Lab left of PaP. Read radiation numbers → matching letter jars → purple gas → Necrospike → lockpick cell → prone for Walkie-Talkie.",
            "With all 3 items: Melee Macchiato + Jotunn smack the south Core Foundry barrel, take the medal, place Mr. Peeks on Von List's throne, finish the Richtofen side EE.",
            "Enter the portal in Dry Dock east of PhD Flopper.",
        ],
        trial: "Zombies only take damage while you are indoors. Lighthouse 2F + Toxic Growth + PaP Jotunn is a strong camp.",
    },
    {
        name: "Music Box",
        tier: "Wicked",
        map: "Totenreich",
        points: 3,
        effect: "Enemies only take critical (headshot) damage.",
        requires: "Cursed Tier 2+ · Round 60+ · do NOT finish Main Quest rune/arrow step that blocks Tyr's Head view",
        steps: [
            "Reach Round 60+ on Tier 2+.",
            "Grab Shadow SK from Tyr's Shoulder. Optional: Temporal Gift + Kill Joy for a long Insta-Kill.",
            "Enter Tyr's Head in one visit and get 5 sniper headshots looking toward Skallen Market before leaving.",
            "Enter the portal on the SW wall opposite Melee Macchiato in Dry Dock.",
        ],
        trial: "Chase purple sky columns / Mr. Peeks holdouts (~25s to reach each). Typical order: Fishery Island → Tyr's Foot → Dry Dock → Beacon Island → Eidskallen Square → Skallen Market. Zones shrink; no HVTs.",
    },

    // -------------------- Kowakujo --------------------
    {
        name: "Gramophone",
        tier: "Grim",
        map: "Kowakujo",
        points: 1,
        effect: "Bullets deal more damage, but each shot consumes 2 ammo.",
        requires: "Cursed Mode · any Tier/Round · Kowakujo EE done once",
        steps: [
            "Pick up both drumsticks: Gatehouse west-facing window (near Speed Cola); Workshop open windows opposite the Arsenal.",
            "Kitchens (stairs up from Flower Garden): face south — two drums by the door. Interact the glowing drum and melee-repeat the Simon Says pattern 3 times without failing.",
            "Enter the green portal by the left drum.",
        ],
        trial: "Sniper rifles only. Grab XR-3 ION wall buy in Shogun's Sanctum or box a sniper.",
    },
    {
        name: "Druid Stone",
        tier: "Grim",
        map: "Kowakujo",
        points: 1,
        effect: "No bleedout bar; Self-Revives instantly revive you.",
        requires: "Cursed Tier 1+ · reach Round 20 with zero HP damage (armor damage OK)",
        steps: [
            "From Round 1–20 take no health damage (Turtle Shell Jug helps — armor can break). HP damage fails; Save & Quit to retry.",
            "Shortcut: have a friend join mid Round 19 so they spawn on Round 20 and the portal still opens.",
            "Enter the portal by Wisp Tea in the Flower Gardens.",
        ],
        trial: "Zombies only die while you are overhealed. Use Light Mend, Stims, or hit cherry blossom trees 3× for overheal.",
    },
    {
        name: "Film Reel",
        tier: "Sinister",
        map: "Kowakujo",
        points: 2,
        effect: "You can only carry one Pack-a-Punch weapon.",
        requires: "Cursed Tier 1+ · any Round",
        steps: [
            "Pack-a-Punch 10 different weapons in one game (PaP machine or upgrade crystals from T.E.D.D. / Mr. Peeks eggs count). Same gun PaP'd multiple times does not count.",
            "Mule Kick helps cycle throwaway guns. Shotguns farm Essence fast.",
            "Hear Mr. Peeks laugh, then enter the portal in the Tea Garden.",
        ],
        trial: "Kill only with the HUD-required Scorestreak each wave (ARC-XD, LDBR, D.A.W.G., Ion Core, HKD, etc.). ~3 minutes per wave; stock ~9,000+ Salvage.",
    },
    {
        name: "Valkyrie Helmet",
        tier: "Sinister",
        map: "Kowakujo",
        points: 2,
        effect: "Lingering in one area spawns damaging electric fields on you.",
        requires: "Cursed Tier 1+ · Upgraded Maneki-Neko + Nekomancer · Cat Cafe side EE",
        steps: [
            "Upgrade Maneki-Neko. While inside its shield bubble, get Nekomancer kills to drop a ceramic shard. Repeat in different zones until you have 4 shards.",
            "Place shards in the Kitchens fireplace and light with a Molotov — pick up the reforged bowl pieces.",
            "Start the Cat Cafe side EE; collect catnip from the Tea Gardens cat tree.",
            "Place bowl + catnip on the rock by the big tree in Central Courtyard.",
            "Fail Assault Waves in Flower Garden / Training Area until an Assault hits Central Courtyard — get 50 Nekomancer kills at the tree (letting zombies take the area extends time).",
            "Enter the portal in the Training Area ammo-box room.",
        ],
        trial: "Every reload explodes you for ~30–40 HP. Time reloads; Frenzied Guard helps.",
    },
    {
        name: "Dragon Egg",
        tier: "Wicked",
        map: "Kowakujo",
        points: 3,
        effect: "Elites/specials on normal rounds spawn randomly.",
        requires: "Cursed Tier 2+ · Main EE to Path of Sorrows · murder mystery first try",
        steps: [
            "Progress Main EE to the murder mystery — solve it first try (failing spawns an Oni; Save & Quit if you mess up).",
            "After the Onryo miniboss, take Path of Sorrows from the PaP room.",
            "Find 3 blue Japanese symbols. Parry an Oni's lightning (R3) to charge the blade, then hit each symbol. Spawns vary (Storage, Workshop, Stables, Flower Garden, Outer Ward, Tenshu roofs, etc.).",
            "Enter the portal upstairs in the Onsen Baths.",
        ],
        trial: "Mr. Peeks' 6 Tiers: (1) Flower Garden Assault 2:00; (2) find Peeks in Gatehouse + 2 HVT Abominations; (3) escort Peeks to Keep; (4) charged Path of Sorrows / Oninikubami vs Oni; (5) Doppelghasts in Ash Storm Courtyard; (6) kill Nyxara in 11:00 (capture Oni flags for damage phase).",
    },
    {
        name: "Mannequin Turret",
        tier: "Wicked",
        map: "Kowakujo",
        points: 3,
        effect: "Start with no armor; only Golden Armor wall buys are available.",
        requires: "Cursed Tier 2+ · Round 60 · never fully fail an Assault Wave flag",
        steps: [
            "Play Tier 2+ and reach Round 60 without fully failing a flag defense on Assault Waves (statue failures are OK; losing the flag fails the relic — Save & Quit if a flag is about to fall).",
            "No Main EE steps required during the run once Cursed is unlocked for the map.",
            "On Round 60, enter the portal inside the War Room.",
        ],
        trial: "Health regen off (heal at end of each wave; Light Mend / Stims still work). Multiple waves with HVT Onryo on later waves.",
    },
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
    "Mister Peeks",
];

/* ============================================================
   ROUND TABLES
   ============================================================ */

export const survivalRoundValues = [
    11, 16, 21, 26, 31, 36, 41, 46,
    51, 56, 61, 66, 71, 76,
];

export const survivalRoundWeightsStandard = [
    14, 14, 12, 12, 10, 10, 8, 8, 6, 4, 3, 2, 1, 1,
];

export const survivalRoundWeightsExtreme = [
    1, 1, 2, 3, 4, 6, 8, 10, 12, 12, 10, 8, 6, 4,
];

export const bossTiers = {
    T1: { label: "Tier I", minRelics: 1 },
    T2: { label: "Tier II", minRelics: 2 },
    T3: { label: "Tier III", minRelics: 3 },
};

/* ============================================================
   TRAIL RULES — relics by map
   ============================================================ */

const ashesPool = [
    "Lawyers Pen", "Dragon Wings", "Teddy Bear",
    "Vril Sphere", "Samantha's Drawing", "Focusing Stone",
    "Bus", "Dragon", "Blood Vials",
];

const astraPool = [
    "Seed", "Gong",
    "Spider Fang", "Matryoshika Doll",
    "Golden Spork", "Civil Protector Head",
];

const paradoxPool = [
    "Rocket",
    "Summoning Key",
    "Mangler Helmet",
];

const totenreichPool = [
    "Power Switch", "Wrestler's Belt",
    "Stuffed Elephant", "Dancing Arnie",
    "Agarthan Device", "Music Box",
];

const kowakujoPool = [
    "Gramophone", "Druid Stone",
    "Film Reel", "Valkyrie Helmet",
    "Dragon Egg", "Mannequin Turret",
];

export const trailMapGrimRelics = {
    "Ashes of the Damned": ashesPool.filter((r) => grimRelics.includes(r)),
    "Astra Malorum": astraPool.filter((r) => grimRelics.includes(r)),
    // Alias kept for older saves / lookups — never used as a separate map pick
    Astra: astraPool.filter((r) => grimRelics.includes(r)),
    "Paradox Junction": paradoxPool.filter((r) => grimRelics.includes(r)),
    Totenreich: totenreichPool.filter((r) => grimRelics.includes(r)),
    Kowakujo: kowakujoPool.filter((r) => grimRelics.includes(r)),
};

/** Canonical trail maps (no aliases — equal weight when randomizing). */
export const trailMaps = [
    "Ashes of the Damned",
    "Astra Malorum",
    "Paradox Junction",
    "Totenreich",
    "Kowakujo",
];

export const trailRules = {
    "Ashes of the Damned": { pool: ashesPool },
    "Astra Malorum": { pool: astraPool },
    Astra: { pool: astraPool },
    "Paradox Junction": { pool: paradoxPool },
    Totenreich: { pool: totenreichPool },
    Kowakujo: { pool: kowakujoPool },
};

/** Round-based boss maps used by Boss challenges */
export const bossMaps = [
    "Ashes of the Damned",
    "Astra Malorum",
    "Paradox Junction",
    "Totenreich",
    "Kowakujo",
];

/** Starting-room holdout maps */
export const startingRoomMaps = [
    "Ashes of the Damned",
    "Astra Malorum",
    "Paradox Junction",
    "Totenreich",
    "Kowakujo",
];

/* ============================================================
   SURVIVAL MAPS
   ============================================================ */

export const survivalMaps = [
    "Vandorn Farm",
    "Exit 115",
    "Zarya Cosmodrome",
    "Mars",
    "Ashwood",
];

/* ============================================================
   STARTING ROOM ROUND TABLES
   ============================================================ */

export const startingRoomRounds = [11, 16, 21, 26, 31, 36, 41, 46, 51];

export const startingRoomWeightsStandard = [45, 60, 65, 70, 50, 33, 21, 18, 5];

export const startingRoomWeightsExtreme = [15, 18, 23, 28, 34, 45, 48, 52, 35];

export const startingRoomRoundsQuick = [11, 16, 21, 26, 31];
export const startingRoomWeightsQuick = [30, 28, 22, 14, 6];

export const startingRoomRoundsNormal = [31, 36, 41, 46, 51, 56, 61, 66, 71];
export const startingRoomWeightsNormal = [8, 10, 13, 16, 16, 14, 12, 8, 3];

export const survivalRoundsQuick = [11, 16, 21, 26, 31];
export const survivalWeightsQuick = [25, 28, 24, 16, 7];
