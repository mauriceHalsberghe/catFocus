//settingsHandlers.js handles "get settings" and "save settings"

const { ipcMain, BrowserWindow } = require('electron');
const store = require('../services/settingsStore');
const timer = require('../services/timer');
const { SETTINGS_GET, SETTINGS_SET, SETTINGS_CHANGED } = require('../../shared/ipcChannels');

function registerSettingsHandlers() {
  const settings = store.get();
  timer.setDurations(settings.focusTime, settings.pauseTime);

  ipcMain.handle(SETTINGS_GET, () => store.get());

  ipcMain.handle(SETTINGS_SET, (event, patch) => {
    const updated = store.set(patch);
    timer.setDurations(updated.focusTime, updated.pauseTime);
    // Tell every open window, so the cat updates live
    for (const win of BrowserWindow.getAllWindows()) {
      win.webContents.send(SETTINGS_CHANGED, updated);
    }
    return updated;
  });
}

module.exports = { registerSettingsHandlers };