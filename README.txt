================================================================================
  CMZ CHALLENGE GENERATOR — README
  For: Call of Duty: Black Ops 7 Zombies
================================================================================

WHAT IS THIS?
-------------
CMZ Challenge Generator is a desktop app that randomly creates zombie challenge
runs for 1 to 4 players. Instead of deciding what to do each game, the app
picks your challenge for you — map, round, relics, field upgrades, and more —
based on what players actually own and which tier they qualify for.

It runs as a standalone Windows app (built with Electron). No internet
connection is required once installed.

--------------------------------------------------------------------------------
GETTING STARTED
--------------------------------------------------------------------------------

1. LAUNCH THE APP
   Double-click the app shortcut or executable to open it.
   You will land on the Main Menu.

2. ADD YOUR PLAYER PROFILES  (do this first before starting a run)
   - Click "Manage Profiles" from the Main Menu.
   - Type a gamer name (2–18 characters, letters/numbers/spaces/hyphens) and
     click "Add Player".
   - Up to 10 profiles can be saved.

3. SET YOUR OWNED RELICS ON EACH PROFILE
   - Each profile card shows a row of all 18 relics.
   - Click "Edit Relics" on a profile to expand the relic grid.
   - Click each relic image you own to highlight it (it will glow).
   - Click "Confirm" to save. The card collapses back to a summary
     e.g. "3 Grim · 2 Sinister · 1 Wicked".
   - This is important — the app uses your owned relics to determine what
     tier you qualify for and which relics appear in your challenges.

4. START A RUN
   - Click "Start Run" from the Main Menu.
   - Follow the step-by-step flow (described below).

--------------------------------------------------------------------------------
RELIC TYPES
--------------------------------------------------------------------------------

There are 18 relics split into 3 tiers of difficulty:

  GRIM (purple) — 6 relics
    Lawyers Pen, Dragon Wings, Teddy Bear, Gong, Seed, Rocket
    Each Grim relic is worth 33% toward your tier score.
    You need 3 Grim relics to reach 100%.

  SINISTER (orange) — 6 relics
    Vril Sphere, Samantha's Drawing, Focusing Stone,
    Spider Fang, Matryoshika Doll, Summoning Key
    Each Sinister relic is worth 50% toward your tier score.
    You need 2 Sinister relics to reach 100%.

  WICKED (red) — 6 relics
    Dragon, Bus, Blood Vials, Civil Protector Head,
    Golden Spork, Mangler Helmet
    Each Wicked relic is worth 100% toward your tier score.
    You only need 1 Wicked relic to reach 100%.

--------------------------------------------------------------------------------
TIER SYSTEM
--------------------------------------------------------------------------------

Your owned relics determine your highest qualifying tier.
The tier unlocks certain game modes and controls how many relics appear
in your challenge.

  TIER 0   — No relics owned. Basic challenges only.
  TIER 1   — 100%+ relic score  (e.g. 3 Grim, or 2 Sinister, or 1 Wicked)
  TIER 2   — 200%+ relic score  (e.g. 6 Grim, or 4 Sinister, or 2 Wicked)
  TIER 3   — 300%+ relic score  (e.g. 3 Wicked, or mix of high-value relics)

Mix and match relic types — what matters is hitting the % threshold.
Example: 1 Wicked (100%) + 2 Sinister (100%) = 200% = Tier 2.

--------------------------------------------------------------------------------
GAME MODES
--------------------------------------------------------------------------------

When you start a run you choose players, then a mode. Here are all modes:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUICK PLAY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Jump straight in — no relic selection needed. Relics are loaded automatically
from your profile.

  BOSS MODE (Quick)
    A random boss challenge on one of the three boss maps.
    No relics, no tier requirement.
    Maps: Astra, Ashes of the Damned, Paradox Junction.

  STARTING ROOM (Quick)
    Survive in the starting area up to a randomly chosen round (11–31).
    Weighted toward lower rounds.

  SURVIVAL (Quick)
    Choose Standard or Cursed:
    - Standard: no relics, just survive a random round (11–31).
    - Cursed: select your tier, and relics are randomly picked from your
      owned collection based on that tier. Rounds default to 31–71.

  RELIC TRAIL (Quick)
    A Grim relic hunt challenge on a random map.
    The app picks which Grim relics are required for that map.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NORMAL MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
More detailed runs with full relic and tier selection.
Your owned relics are pre-loaded from your profile but can be adjusted
on this screen before continuing.

  BOSS MODE (Normal)
    Tier-based boss fight. The app shows which tiers you qualify for.
    Select your tier, then start — relics are randomly assigned.

  SURVIVAL (Normal, Cursed)
    Like Quick Cursed Survival but over more stages.
    Rounds default to 31–71.

  RELIC TRAIL (Normal)
    Harder version of the trail challenge using your full relic pool.

  STARTING ROOM (Normal)
    Rounds 31–71, weighted toward mid-high rounds.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ROUND 101 BOSS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
An elite boss challenge always played at Round 101.

  Standard: no relics required.
  Cursed: requires Tier 3. Your relics are automatically loaded from your
          profile and the app confirms you meet the Tier 3 requirement.

--------------------------------------------------------------------------------
HOW RELICS ARE RANDOMLY ASSIGNED (SURVIVAL MODE)
--------------------------------------------------------------------------------

When a cursed survival run starts, the app randomly picks relics from your
owned collection. How many it picks depends on your chosen tier and the
relic level set in Settings (default is Level 3):

  TIER 0   -> No relics assigned.

  TIER 1   -> Randomly picks relics until 100% score is accumulated,
              then adds 1 extra Grim or Sinister relic on top.

  TIER 2   -> Randomly picks relics until 200% score is accumulated,
              then adds up to 80% of your remaining owned relics as a bonus.

  TIER 3   -> Randomly picks relics until 300% score is accumulated,
              then adds 1 extra relic on top (total ~350%).

  LEVEL 4 (Settings) -> Tier 3 only. Picks until 600% is reached.
  LEVEL 5 (Settings) -> Any tier. Picks until 800% is reached.

Relics are always picked in a random shuffled order so you never get the
same selection twice.

--------------------------------------------------------------------------------
FIELD UPGRADES
--------------------------------------------------------------------------------

Field upgrades are special abilities that are randomly assigned to each player
at the start of a challenge. Each player gets a unique upgrade — no two players
will receive the same one in the same run.

Available upgrades:
  Energy Mine, Dark Flare, Frenzied Guard, Healing Aura, Toxic Growth,
  Aether Shroud, Frost Blast, Tesla Storm, Mister Peeks

Field upgrades can be toggled off for Boss Mode and Survival Mode separately
in Settings.

--------------------------------------------------------------------------------
LEADERBOARDS
--------------------------------------------------------------------------------

After each run finishes you can record your result. The leaderboard tracks:
  - Player name
  - Mode & Tier
  - Map played
  - Relics used
  - Time taken
  - Win / Loss score
  - Date

You can sort the leaderboard by stage, player, mode, and more.
Click a player's name in the table to see their full run details.

--------------------------------------------------------------------------------
SETTINGS
--------------------------------------------------------------------------------

Open Settings from the Main Menu (or via the Settings window button).

  BOSS MODE SETTINGS
    Field Upgrades        — Toggle whether field upgrades appear in boss runs.
    Relic Level (1–5)     — Controls how many relics are assigned in boss mode.
                            Level 3 is default standard rules.

  SURVIVAL MODE SETTINGS
    Field Upgrades        — Toggle field upgrades in survival runs.
    Relic Level (1–5)     — Controls relic selection for survival mode.
                            Level 3 is default. Level 4–5 increase selection
                            (Tier 3 only for Level 4).

  ROUND RANGES
    Quick Play Standard   — Set the min/max round for standard quick survival.
                            Default: Round 11 to Round 31.
    Cursed                — Set the min/max round for all cursed survival modes.
                            Default: Round 31 to Round 71.

  RESOLUTION                Change the display resolution of the app window.

  ALLOW DUPLICATES          Allow the same challenge type to appear more than
                            once in a multi-stage run.

  RESET TO DEFAULTS         Restores all settings to their original default
                            values. Does NOT affect profiles or leaderboard.

  COMPLETE RESET (red)      Deletes ALL player profiles, clears the leaderboard,
                            and restores all settings to default.
                            A confirmation prompt appears before this runs.
                            THIS CANNOT BE UNDONE.

--------------------------------------------------------------------------------
TIPS FOR NEW PLAYERS
--------------------------------------------------------------------------------

• Set up your profiles and mark your owned relics BEFORE starting a run.
  The game pre-loads your relics automatically from your profile — you won't
  need to select them every time.

• If you are new and don't own many relics yet, start with Quick Play Boss
  Mode or Quick Survival Standard — these don't require relics at all.

• Your tier is worked out automatically. If you pick a mode that requires
  a tier you don't qualify for, that tier button will be greyed out.

• Round 101 Cursed is the hardest mode and requires full Tier 3. Work your
  way up through Normal Mode Tier 1 -> 2 -> 3 first.

• The leaderboard is per-device only — it's stored locally and not shared
  online.

• If something looks wrong with your settings (e.g. rounds showing old
  values), click Reset to Defaults. The app will apply and save the correct
  defaults immediately.

• Join our Discord for community challenges, updates and support:
  https://discord.gg/YNmhCSk48A

--------------------------------------------------------------------------------
MAPS
--------------------------------------------------------------------------------

Boss Maps:
  Astra, Ashes of the Damned, Paradox Junction

Survival Maps:
  Vandorn Farm, Exit 115, Zarya Cosmodrome, Mars, Ashwood

--------------------------------------------------------------------------------
VERSION HISTORY
--------------------------------------------------------------------------------

  v1.0  — Initial release
  v2.0  — Profile relic storage, tier-based survival system, collapsible relic
           grids, Complete Reset, cursed round defaults updated to 31–71,
           level 4/5 relic selection reworked (600%/800%)

================================================================================
