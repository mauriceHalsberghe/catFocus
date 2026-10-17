//preload.js is the secure bridge. It uses contextBridge.exposeInMainWorld('api', {...}) 
// to expose only the specific functions the renderer needs, like api.getSettings(),
//  api.startTimer(), and api.onTick(cb). Keep it small and free of logic.

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('catApi', {
  onState: (cb) => ipcRenderer.on('cat:state', (_e, state) => cb(state)),
  onTick: (cb) => ipcRenderer.on('cat:tick', (_e, seconds) => cb(seconds)),
  onTimerPhase: (cb) => ipcRenderer.on('cat:timer-phase', (_e, phase) => cb(phase)),
  startTimer: () => ipcRenderer.send('cat:start'),
  startPause: () => ipcRenderer.send('cat:start-pause'),
  restart: () => ipcRenderer.send('cat:restart'),
  close: () => ipcRenderer.send('window:close'),
  toggleSettings: () => ipcRenderer.send('window:toggle-settings'),
  dragStart: () => ipcRenderer.send('window:drag-start'),
  moveBy: (dx, dy) => ipcRenderer.send('window:move', { dx, dy }),
});

contextBridge.exposeInMainWorld('settingsApi', {
  getSettings: () => ipcRenderer.invoke('settings:get'),
  setSettings: (patch) => ipcRenderer.invoke('settings:set', patch),
  onSettingsChanged: (cb) =>
    ipcRenderer.on('settings:changed', (_event, settings) => cb(settings)),
});