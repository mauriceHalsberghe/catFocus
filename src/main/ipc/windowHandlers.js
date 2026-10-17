const { ipcMain, BrowserWindow } = require('electron');
const { toggleSettingsWindow } = require('../windows/settingsWindow');
const { WINDOW_CLOSE, WINDOW_DRAG_START, WINDOW_MOVE, WINDOW_TOGGLE_SETTINGS } = require('../../shared/ipcChannels');

function registerWindowHandlers() {
  let startBounds = null;

  ipcMain.on(WINDOW_CLOSE, (event) => {
    BrowserWindow.fromWebContents(event.sender)?.hide();
  });

  // Remember the size and position once, when the drag begins
  ipcMain.on(WINDOW_DRAG_START, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) startBounds = win.getBounds();
  });

  // dx/dy are the total distance since the drag started
  ipcMain.on(WINDOW_MOVE, (event, { dx, dy }) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win || !startBounds) return;

    win.setBounds({
      x: Math.round(startBounds.x + dx),
      y: Math.round(startBounds.y + dy),
      width: startBounds.width,   // never re-read from the window
      height: startBounds.height,
    });
  });

  ipcMain.on(WINDOW_TOGGLE_SETTINGS, () => toggleSettingsWindow());
}

module.exports = { registerWindowHandlers };