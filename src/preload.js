const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Window controls
    minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
    closeWindow: () => ipcRenderer.invoke('window:close'),
    createNewTimer: () => ipcRenderer.invoke('window:createNew'),
    createSFTimeWindow: () => ipcRenderer.invoke('window:createSFTime')
});