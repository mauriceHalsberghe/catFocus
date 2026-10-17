//timerHandlers.js handles start, pause, and reset.

const { ipcMain } = require('electron');
const timer = require('../services/timer');
const { getCatWindow } = require('../windows/catWindow');
const {
  CAT_STATE,
  CAT_TICK,
  CAT_START,
  CAT_START_PAUSE,
  CAT_TIMER_PHASE,
  CAT_RESTART,
} = require('../../shared/ipcChannels');

function send(channel, payload) {
  const win = getCatWindow();
  if (win) win.webContents.send(channel, payload);
}

function registerTimerHandlers() {
  // main -> renderer: push timer events to the cat window
  timer.on('tick', (remaining) => send(CAT_TICK, remaining));
  timer.on('phase', (phase) => {
    send(CAT_TIMER_PHASE, phase);
    if (phase === 'focus-running') {
      send(CAT_STATE, 'sleeping');
    } else if (
      phase === 'pause-ready' ||
      phase === 'pause-running' ||
      phase === 'focus-ready'
    ) {
      send(CAT_STATE, 'sitting');
    }
  });

  ipcMain.on(CAT_START, () => {
    timer.start();
  });

  ipcMain.on(CAT_START_PAUSE, () => {
    timer.startPause();
  });

  // renderer -> main: the "Restart" button
  ipcMain.on(CAT_RESTART, () => {
    send(CAT_STATE, 'sleeping');
    timer.restart();
  });

  
}

module.exports = { registerTimerHandlers };