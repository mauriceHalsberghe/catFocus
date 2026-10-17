//index.js just imports both and exports one registerIpcHandlers() that main.js calls

const { registerTimerHandlers } = require('./timerHandlers');
const { registerWindowHandlers } = require('./windowHandlers');
const { registerSettingsHandlers } = require('./settingsHandlers');

function registerIpcHandlers() {
  registerTimerHandlers();
  registerWindowHandlers();
  registerSettingsHandlers();
}

module.exports = { registerIpcHandlers };