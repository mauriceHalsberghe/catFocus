const { BrowserWindow } = require('electron');
const path = require('path');

let settingsWin = null;

function createSettingsWindow() {
  settingsWin = new BrowserWindow({
    width: 220,
    height: 325,
    icon: path.join(__dirname, '../../../assets/icon.ico'),
    resizable: false,
    minimizable: false,
    maximizable: false,
    
    autoHideMenuBar: true,
    title: 'Focus Cat Settings',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  settingsWin.loadFile(path.join(__dirname, '../../renderer/settings/index.html'));
  settingsWin.once('ready-to-show', () => settingsWin.show());

  // Forget the window when it's closed, so the next toggle opens a new one
  settingsWin.on('closed', () => { settingsWin = null; });
}

function toggleSettingsWindow() {
  if (settingsWin && !settingsWin.isDestroyed()) {
    settingsWin.close();
  } else {
    createSettingsWindow();
  }
}

module.exports = { toggleSettingsWindow };