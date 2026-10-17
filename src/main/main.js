const { app } = require('electron');
const { registerIpcHandlers } = require('./ipc');
const { createTray } = require('./tray');

const { createCatWindow, showCatWindow } = require('./windows/catWindow');
const { toggleSettingsWindow } = require('./windows/settingsWindow');

app.whenReady().then(() => {
  registerIpcHandlers();
  createCatWindow();

  createTray({
    onShowCat: showCatWindow,
    onOpenSettings: toggleSettingsWindow,
    onQuit: () => app.quit(),
  });
});

// Keep the app alive when windows are hidden or closed.
// Without a listener here, Electron quits by default.
app.on('window-all-closed', () => {});