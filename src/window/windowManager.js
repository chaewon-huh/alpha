const { BrowserWindow, screen } = require('electron');
const path = require('path');
const os = require('os');

// Optional liquid glass support
let liquidGlass = null;
let shouldUseLiquidGlass = false;

// Check if we're on macOS
if (os.platform() === 'darwin') {
    try {
        liquidGlass = require('electron-liquid-glass');
        shouldUseLiquidGlass = true;
    } catch (e) {
        // Liquid glass not available
    }
}

function createTimerWindow() {
    // Create window - minimal size
    const win = new BrowserWindow({
        width: 300,
        height: 200,
        frame: false,
        transparent: true,
        backgroundColor: '#141414',
        resizable: true,
        fullscreen: false,
        alwaysOnTop: true,
        hasShadow: false,
        vibrancy: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, '../preload.js')
        }
    });
    
    // Set visibility and hide window buttons on macOS
    win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    if (os.platform() === 'darwin') {
        win.setWindowButtonVisibility(false);
    }
    
    // Apply liquid glass effect if available
    if (shouldUseLiquidGlass && liquidGlass) {
        win.webContents.once('did-finish-load', () => {
            try {
                const glassId = liquidGlass.addView(win.getNativeWindowHandle(), {
                    cornerRadius: 16,
                    tintColor: '#00000010'
                });
                
                // Apply glass variant
                if (glassId !== null && liquidGlass.GlassMaterialVariant) {
                    liquidGlass.unstable_setVariant(glassId, liquidGlass.GlassMaterialVariant.bubbles || 2);
                }
                
                // Add glass class to body for CSS adjustments
                win.webContents.executeJavaScript(`
                    document.body.classList.add('glass-effect');
                `);
            } catch (error) {
                // Failed to apply liquid glass
            }
        });
    }
    
    // Load the timer UI
    win.loadFile(path.join(__dirname, '../ui/timer/timer.html'));
    
    // Open DevTools in development
    if (process.env.NODE_ENV === 'development') {
        win.webContents.openDevTools();
    }
    
    return win;
}

module.exports = {
    createTimerWindow
};