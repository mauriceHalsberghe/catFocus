// ipcChannels.js defines channel names in one place
//  (SETTINGS_GET, TIMER_START, ...) so you never have typos in string names.

module.exports = {
  CAT_STATE: 'cat:state',
  CAT_TICK: 'cat:tick',
  CAT_START: 'cat:start',
  CAT_START_PAUSE: 'cat:start-pause',
  CAT_TIMER_PHASE: 'cat:timer-phase',
  CAT_RESTART: 'cat:restart',
  WINDOW_CLOSE: 'window:close',
  WINDOW_DRAG_START: 'window:drag-start',
  WINDOW_MOVE: 'window:move',
  WINDOW_TOGGLE_SETTINGS: 'window:toggle-settings',
  SETTINGS_GET: 'settings:get',
  SETTINGS_SET: 'settings:set',
  SETTINGS_CHANGED: 'settings:changed',
};