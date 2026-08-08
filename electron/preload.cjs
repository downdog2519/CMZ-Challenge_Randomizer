const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("electronAPI", {
    saveSettings: (data) => ipcRenderer.send("save-settings", data),
    loadSettings: (callback) => ipcRenderer.on("load-settings", (_, data) => callback(data)),
    openSettings: () => ipcRenderer.send("open-settings"),
    openExternal: (url) => ipcRenderer.send("open-external", url),
    openReadme: () => ipcRenderer.send("open-readme"),
    onReadmeContent: (callback) => ipcRenderer.once("readme-content", (_, text) => callback(text))
});
