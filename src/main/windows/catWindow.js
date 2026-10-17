// createCatWindow() that creates the BrowserWindow with its size, 
// transparency, always-on-top, frameless options, and loads its HTML. 
// This is where all your new BrowserWindow({...}) blocks go, plus
//  window-specific behaviour like dragging or remembering position.

const { BrowserWindow, screen } = require('electron');
const path = require('path');

let catWin = null;

function createCatWindow() {
  const { workArea } = screen.getPrimaryDisplay();
  const size = 100;

  catWin = new BrowserWindow({
    width: size,
    height: size,
    x: workArea.x + workArea.width - size - 10,
    y: workArea.y + workArea.height - size - 10,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, '../../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      autoplayPolicy: 'no-user-gesture-required',
    },
  });

  catWin.setAlwaysOnTop(true, 'screen-saver');
  catWin.loadFile(path.join(__dirname, '../../renderer/cat/index.html'));
  //catWin.webContents.openDevTools({ mode: 'detach' });
  catWin.once('ready-to-show', () => catWin.showInactive());

  return catWin;
}

function getCatWindow() {
  return catWin && !catWin.isDestroyed() ? catWin : null;
}

function showCatWindow() {
  const win = getCatWindow();
  if (win) win.show();
}

function hideCatWindow() {
  const win = getCatWindow();
  if (win) win.hide();
}

module.exports = { createCatWindow, getCatWindow, showCatWindow, hideCatWindow };