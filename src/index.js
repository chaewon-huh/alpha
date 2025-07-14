if (require('electron-squirrel-startup')) {
    process.exit(0);
}

const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path');
const windowManager = require('./window/windowManager');

// Allow multiple instances for multiple timers
app.requestSingleInstanceLock = () => true;

// Store all windows
const windows = new Set();

// App event handlers
app.whenReady().then(() => {
    // Create the first timer window
    createNewTimer();
    
    // Register global shortcut for new timer
    globalShortcut.register('CommandOrControl+N', () => {
        createNewTimer();
    });
    
    // Set up IPC handlers
    setupIpcHandlers();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createNewTimer();
    }
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

// Create new timer window
function createNewTimer() {
    const win = windowManager.createTimerWindow();
    windows.add(win);
    
    win.on('closed', () => {
        windows.delete(win);
    });
    
    return win;
}

// Create San Francisco time window
function createSFTimeWindow() {
    const win = windowManager.createSFTimeWindow();
    windows.add(win);
    
    win.on('closed', () => {
        windows.delete(win);
    });
    
    return win;
}

// IPC Handlers
function setupIpcHandlers() {
    ipcMain.handle('window:minimize', (event) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (win && !win.isDestroyed()) {
            win.minimize();
        }
    });
    
    ipcMain.handle('window:close', (event) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (win && !win.isDestroyed()) {
            win.close();
        }
    });
    
    ipcMain.handle('window:createNew', () => {
        createNewTimer();
    });
    
    ipcMain.handle('window:createSFTime', () => {
        createSFTimeWindow();
    });
}