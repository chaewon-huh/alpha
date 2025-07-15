const { BrowserWindow, screen } = require('electron');
const path = require('path');
const os = require('os');

// Optional liquid glass support
let liquidGlass = null;
let shouldUseLiquidGlass = false;

// Check if we're on macOS
if (os.platform() === 'darwin') {
    try {
        const liquidGlassModule = require('electron-liquid-glass');
        liquidGlass = liquidGlassModule.default || liquidGlassModule;
        shouldUseLiquidGlass = true;
    } catch (e) {
        console.error('Failed to load liquid glass:', e);
    }
}

function createTimerWindow() {
    // Create window - minimal size
    const win = new BrowserWindow({
        width: 300,
        height: 200,
        frame: false,
        transparent: true,
        // backgroundColor: '#141414', // Remove this - it blocks liquid glass!
        resizable: true,
        fullscreen: false,
        alwaysOnTop: true,
        hasShadow: false,
        vibrancy: false, // Must be false for liquid glass
        focusable: true,  // Keep window focusable
        webPreferences: {
            nodeIntegration: true,     // Changed to match example
            contextIsolation: false,    // Changed to match example
            preload: path.join(__dirname, '../preload.js')
        }
    });
    
    // Set visibility on all workspaces
    win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    
    // Load the timer UI FIRST
    win.loadFile(path.join(__dirname, '../ui/timer/timer.html'));
    
    // Apply liquid glass effect after content loads
    win.webContents.once('did-finish-load', () => {
        if (shouldUseLiquidGlass && liquidGlass) {
            try {
                const glassId = liquidGlass.addView(win.getNativeWindowHandle(), {
                    cornerRadius: 24
                });
                
                if (glassId !== -1) {
                    liquidGlass.unstable_setVariant(glassId, 3); // appIcons variant
                    liquidGlass.unstable_setScrim(glassId, 0);
                    liquidGlass.unstable_setSubdued(glassId, 0);
                }
                
                // Add glass class to body for CSS adjustments
                win.webContents.executeJavaScript(`
                    document.body.classList.add('glass-effect');
                `);
            } catch (error) {
                console.error('Failed to apply liquid glass:', error);
            }
        }
    });
    
    // Open DevTools in development
    if (process.env.NODE_ENV === 'development') {
        win.webContents.openDevTools();
    }
    
    return win;
}

function createSFTimeWindow() {
    // Create window for SF time display
    const win = new BrowserWindow({
        width: 340,
        height: 180,
        frame: false,
        transparent: true,
        // backgroundColor: '#141414', // Remove this - it blocks liquid glass!
        resizable: true,
        fullscreen: false,
        alwaysOnTop: true,
        hasShadow: false,
        vibrancy: false, // Must be false for liquid glass
        webPreferences: {
            nodeIntegration: true,     // Changed to match example
            contextIsolation: false,    // Changed to match example
            preload: path.join(__dirname, '../preload.js')
        }
    });
    
    // Set visibility on all workspaces
    win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    
    // Load the SF time UI FIRST
    win.loadFile(path.join(__dirname, '../ui/sftime/sftime.html'));
    
    // Apply liquid glass effect after content loads
    win.webContents.once('did-finish-load', () => {
        if (shouldUseLiquidGlass && liquidGlass) {
            try {
                const glassId = liquidGlass.addView(win.getNativeWindowHandle(), {
                    cornerRadius: 24
                });
                
                if (glassId !== -1) {
                    liquidGlass.unstable_setVariant(glassId, 3); // appIcons variant
                    liquidGlass.unstable_setScrim(glassId, 0);
                    liquidGlass.unstable_setSubdued(glassId, 0);
                }
                
                // Add glass class to body for CSS adjustments
                win.webContents.executeJavaScript(`
                    document.body.classList.add('glass-effect');
                `);
            } catch (error) {
                console.error('Failed to apply liquid glass:', error);
            }
        }
    });
    
    // Open DevTools in development
    if (process.env.NODE_ENV === 'development') {
        win.webContents.openDevTools();
    }
    
    return win;
}

module.exports = {
    createTimerWindow,
    createSFTimeWindow
};