const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let settingsWindow;
let readmeWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1600,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile('app/index.html');
}

function createSettingsWindow() {
    if (settingsWindow) {
        settingsWindow.focus();
        return;
    }

    settingsWindow = new BrowserWindow({
        width: 700,
        height: 860,
        resizable: true,
        title: "CMZ Settings",
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    settingsWindow.loadFile('app/settings.html');

    // Send saved settings to the window once it loads
    settingsWindow.webContents.on('did-finish-load', () => {
        const Store = require('electron-store');
        const store = new Store();
        const saved = store.get('settings') || {};

        settingsWindow.webContents.send('load-settings', saved);
    });

    settingsWindow.on('closed', () => {
        settingsWindow = null;
    });
}

ipcMain.on('open-settings', () => {
    createSettingsWindow();
});

ipcMain.on('save-settings', (event, data) => {
    // Save to config file (electron-store)
    const Store = require('electron-store');
    const store = new Store();
    store.set('settings', data);

    // Apply resolution
    if (data.resolution !== 'fullscreen') {
        const [w, h] = data.resolution.split('x').map(Number);
        mainWindow.setSize(w, h);
    } else {
        mainWindow.setFullScreen(true);
    }
});

ipcMain.on('open-external', (_event, url) => {
    shell.openExternal(url);
});

ipcMain.on('open-readme', () => {
    if (readmeWindow) {
        readmeWindow.focus();
        return;
    }

    readmeWindow = new BrowserWindow({
        width: 820,
        height: 780,
        resizable: true,
        title: 'CMZ — README',
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    readmeWindow.setMenu(null);
    readmeWindow.loadFile('app/readme.html');

    readmeWindow.webContents.on('did-finish-load', () => {
        const readmePath = path.join(__dirname, '..', 'README.txt');
        let text = '';
        try { text = fs.readFileSync(readmePath, 'utf8'); } catch (_) {}
        readmeWindow.webContents.send('readme-content', text);
    });

    readmeWindow.on('closed', () => {
        readmeWindow = null;
    });
});

app.whenReady().then(createMainWindow);