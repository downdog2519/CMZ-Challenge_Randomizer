# CMZ Challenge Generator - Project Build Guide

## Project Overview

**CMZ Challenge Generator** is a desktop application built with Electron that generates randomized gaming challenges with relics. It features multiple players, configurable challenge stages, different game modes, and persistent session tracking.

**Technology Stack:**
- **Frontend:** Vanilla JavaScript, HTML5, CSS3 with modular architecture
- **Desktop Framework:** Electron 32.x
- **Data Persistence:** electron-store v9.x
- **Build Tool:** electron-builder v26.x
- **Dev Tools:** electronmon (live reload), ESLint (linting), Jest (testing)

## New Features (v2.1.0)
- **Ashwood Map:** Added to Survival of the Fittest mode.
- **New Relics:** Rocket Grim, Summoning Key Sinister, Mangler Helmet Wicked.
- **Dark Mode Toggle:** Switch between dark and light themes.
- **Security Enhancements:** Enabled context isolation in Electron.
- **Code Quality:** Added ESLint and Jest for better development.

---

## Project Structure

```
project-root/
├── app/                          # Frontend application code
│   ├── index.html               # Main game interface
│   ├── settings.html            # Settings UI
│   ├── summary.html             # Game summary/stats
│   ├── css/                     # Modular stylesheets
│   │   ├── base.css             # Global styles, colors, typography
│   │   ├── layout.css           # Main layout grid system
│   │   ├── components.css       # Reusable button, form, panel styles
│   │   ├── animations.css       # Transitions and animations
│   │   ├── theme-bo7.css        # Game-specific theme (BO7)
│   │   ├── maps.css             # Map-specific styles
│   │   ├── relics.css           # Relic UI styling
│   │   └── settings-bo7.css     # Settings-specific overrides
│   ├── images/
│   │   ├── icon.ico             # Windows executable icon
│   │   ├── relics/              # Relic icon images
│   │   └── themes/              # Theme/banner images
│   └── js/                      # JavaScript modules
│       ├── main.js              # App orchestration & event wiring
│       ├── state.js             # State management & persistence
│       ├── logic.js             # Game logic (challenge generation, scoring)
│       ├── ui.js                # UI rendering functions
│       ├── renderers.js         # Complex renderers (maps, themes)
│       ├── settings.js          # Settings window logic
│       ├── summary.js           # Summary/stats display
│       ├── data.js              # Static data (maps, relics, challenges)
│       └── utils.js             # Utility functions
├── electron/                    # Electron main process
│   ├── main.js                  # Electron app lifecycle & window management
│   └── preload.js               # IPC bridge (secure inter-process communication)
│   └── [other build resources]
├── dist/                        # Build output directory (generated)
├── package.json                 # Project manifest & build config
├── package-lock.json            # Dependency lock file
└── node_modules/                # Dependencies (generated)
```

---

## Core Architecture

### 1. **Frontend Architecture (app/js/)**

#### State Management Pattern (`state.js`)
- Maintains application state using a centralized state object
- Handles profile data (players, gamertags, relic unlocks)
- Manages session tracking (wins/failures)
- Implements localStorage/electron-store persistence
- Provides state save/restore functions

```javascript
// Example state structure
{
  players: [],
  gamertags: ["Player1", "Player2"],
  unlockedRelics: {
    grim: [relic1, relic2],
    sinister: [relic3],
    wicked: []
  },
  sessionWins: 0,
  sessionFails: 0
}
```

#### Module Organization
- **main.js**: Orchestrates user interactions, wires event listeners
- **logic.js**: Core game logic (challenge generation, rules, difficulty calculation)
- **ui.js**: DOM manipulation and rendering (not data transformation)
- **renderers.js**: Complex rendering logic (theme application, map displays)
- **data.js**: Static game data (maps array, relics definitions, challenge types)
- **utils.js**: Helper functions (array utilities, formatting, validation)

#### Event Flow
```
User Interaction (Button Click)
  ↓
Event Listener in main.js
  ↓
Call logic.js function (generates data)
  ↓
Call ui.js function (updates DOM)
  ↓
Optionally save state via state.js
```

### 2. **CSS Architecture (app/css/)**

**Modular CSS Strategy:**
- **base.css**: CSS variables, global colors, typography, reset
- **layout.css**: Grid system, flexbox layout, responsiveness
- **components.css**: Reusable button styles, form inputs, panels
- **theme-bo7.css**: Game-specific theme colors/styling
- **Specialty files**: animations.css, maps.css, relics.css (feature-specific)

**Best Practice:** Keep CSS modular and use CSS variables for theming. Load in this order to maintain proper cascade.

### 3. **Electron Integration (electron/)**

#### Main Process (`electron/main.js`)
- Creates and manages windows (main window, settings window)
- Handles app lifecycle events (ready, window-all-closed, activate)
- Sets up IPC listeners for inter-process communication
- Loads preload.js for security

#### Preload Script (`electron/preload.js`)
- Acts as bridge between main process and renderer
- Exposes safe IPC methods for renderer to call
- Prevents direct access to Node.js APIs from frontend

#### IPC Communication Pattern
```javascript
// Frontend → Main (invoke)
const result = await window.electronAPI.saveSettings(settingsData);

// Main → Frontend (send)
settingsWindow.webContents.send('load-settings', savedSettings);
```

### 4. **Data Persistence**

**electron-store Usage:**
- Stores settings, profiles, session history
- Auto-syncs with filesystem
- Simple key-value API
- Survives app restarts

```javascript
const Store = require('electron-store');
const store = new Store();
store.set('settings.difficulty', 'hard');
const value = store.get('settings.difficulty');
```

---

## Setup & Development

### Prerequisites
- **Node.js** 16+
- **npm** or **yarn**
- Windows OS (for NSIS installer building)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Verify electron is installed
npm list electron

# 3. Start development with live reload
npm run dev

# 4. Build installer
npm run build
```

### Development Workflow

```bash
# Terminal 1: Start app with live reload
npm run dev

# Make code changes - app auto-refreshes
# Edit CSS: Changes visible immediately
# Edit JS: App reloads
# Edit HTML: App reloads
```

### Build Output
- Installer: `dist/CMZ Challenge Generator Setup 2.0.0.exe`
- Portable: `dist/CMZ Challenge Generator 2.0.0.exe` (if configured)

---

## File Organization Best Practices

### JavaScript Module Pattern
```javascript
// Each module should have clear exports and imports
import { otherFunction } from "./other-module.js";

export function myFunction() {
  // Implementation
}
```

### Naming Conventions
- **HTML elements:** `camelCase` with descriptive prefixes
  - `#playerCountInput`, `#setupContainer`, `.panel-left`
- **CSS classes:** `kebab-case`, namespace by feature
  - `.challenge-result`, `.relic-column`, `.fog-layer`
- **JavaScript variables:** `camelCase`
  - `playerCount`, `unlockedRelics`, `sessionWins`

### CSS Class Organization
```css
/* Structure: element/component name + state/modifier */
.button { /* base */ }
.button.primary { /* theme */ }
.button:hover { /* state */ }
.button.disabled { /* state */ }
```

---

## Key Implementation Details

### Multi-Player Support
- Store array of player objects with gamertags and individual stats
- Dynamically generate gamertag input fields based on player count
- Update UI to show all players' scores/status

### Challenge Generation
- Maintain data.js with all possible challenges, maps, and relics
- Logic.js implements algorithm to:
  - Select random challenges
  - Apply relic modifiers
  - Calculate difficulty scaling
  - Generate player-to-challenge assignments

### Session Persistence
- Auto-save wins/failures to state
- Provide "Reset Session" button to clear current session
- Maintain persistent profile data across app restarts

### Settings Window
- Separate Electron window (modal recommended)
- Uses IPC to send/receive settings data
- Settings saved via electron-store
- Settings changes should trigger UI updates in main window

---

## Building a Similar Project

### Phase 1: Setup
1. Create project folder structure (app/, electron/, build/)
2. Create package.json with dependencies and scripts
3. Install Electron and build tools
4. Create minimal main.js and index.html to verify setup

### Phase 2: Frontend UI
1. Design HTML layout (main panels, controls, display areas)
2. Create modular CSS (base → layout → components → theme)
3. Add responsive grid system in CSS
4. Create reusable component styles (buttons, inputs, panels)

### Phase 3: Data & State
1. Create data.js with static game data
2. Implement state.js with centralized state object
3. Set up electron-store persistence
4. Create UI rendering functions in ui.js

### Phase 4: Game Logic
1. Implement core logic in logic.js
2. Create utility functions in utils.js
3. Add event listeners in main.js
4. Wire events to logic → ui flow

### Phase 5: Polish & Features
1. Add animations (animations.css)
2. Implement settings system
3. Add summary/stats page
4. Create build resources (icons, installer branding)

### Phase 6: Build & Package
1. Configure build settings in package.json
2. Add application icon (icon.ico)
3. Test build locally: `npm run build`
4. Create installer

---

## Dependencies Explained

| Package | Purpose | Version |
|---------|---------|---------|
| **electron** | Desktop app framework | 30.0.0+ |
| **electron-builder** | Package & build installers | 24.6.0+ |
| **electron-store** | Persistent data storage | 8.1.0+ |
| **electronmon** | Live reload dev tool | 2.0.2+ |

---

## Common Customization Points

For a new project, modify:

1. **package.json**
   - Change `name`, `description`, `author`
   - Update `appId` for Windows registry
   - Change `productName` for installer display
   
2. **data.js**
   - Replace relics with your game items
   - Update map list
   - Define challenge types
   
3. **theme-*.css**
   - Change color scheme
   - Update fonts and typography
   - Adjust component sizes
   
4. **electron/main.js**
   - Adjust window sizes
   - Add additional IPC handlers
   - Configure app menu if needed
   
5. **state.js**
   - Add new data fields
   - Implement custom logic for state transformations

---

## Performance Optimization Tips

1. **Lazy load complex renderers** - Don't render all at once
2. **Use CSS transforms** - Animate position/scale, not layout
3. **Debounce state saves** - Don't save on every keystroke
4. **Minimize DOM operations** - Batch updates
5. **Code split JavaScript** - Load modules only when needed

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| App won't start | Check `npm run dev` output for errors; verify electron installed |
| Changes not reflecting | Try `npm run dev` again; clear cache in DevTools |
| Settings not persisting | Check electron-store path; verify IPC communication |
| Build failed | Ensure icon.ico exists; check build directory permissions |
| IPC not working | Verify preload.js is loaded; check console for security errors |

---

## Next Steps for Improvement

1. **TypeScript Migration** - Add type safety with TypeScript
2. **Component Library** - Extract UI into reusable components
3. **Testing** - Add Jest tests for logic modules
4. **CI/CD Pipeline** - Automate builds and releases
5. **Cross-Platform** - Make installer for macOS/Linux
6. **Analytics** - Track user behavior and crashes
7. **Auto-Updates** - Implement electron-updater
8. **Theming System** - Make themes user-switchable at runtime

---

## License
MIT - See LICENSE file for details

## Author
Downdog2519

---

**Last Updated:** April 2026
**Current Version:** 2.0.0
