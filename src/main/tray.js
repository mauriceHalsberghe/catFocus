//tray.js is optional but nice for this kind of app:
// a tray icon with "Settings" and "Quit" so users 
//can reach the app when the cat is hidden.

// src/main/tray.js
const { Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const timer = require('./services/timer');

let tray = null;

function createTray({ onShowCat, onOpenSettings, onQuit }) {
  const icon = nativeImage.createFromPath(
    path.join(__dirname, '../../assets/tray.png')
  );
  tray = new Tray(icon);
  tray.setToolTip('Focus Cat');

  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Show cat', click: onShowCat },
    { label: 'Settings', click: onOpenSettings },
    { label: 'Reset Timer', click: () => timer.reset() },
    { type: 'separator' },
    { label: 'Quit', click: onQuit },
  ]));

  // Left click also brings the cat back
  tray.on('click', onShowCat);
}

module.exports = { createTray };