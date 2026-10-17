//settingsStore.js reads and writes the settings JSON file in 
//app.getPath('userData'), merges with defaults, and validates values.

const { app } = require('electron');
const fs = require('fs');
const path = require('path');
const { DEFAULT_SETTINGS } = require('../../shared/defaultSettings');

let settings = null;

const filePath = () => path.join(app.getPath('userData'), 'settings.json');

function load() {
  try {
    const saved = JSON.parse(fs.readFileSync(filePath(), 'utf8'));
    settings = { ...DEFAULT_SETTINGS, ...saved };
    for (const key of ['focusTime', 'pauseTime']) {
      if (!isValidDuration(key, settings[key])) {
        settings[key] = DEFAULT_SETTINGS[key];
      }
    }
    if (typeof settings.meowEnabled !== 'boolean') {
      settings.meowEnabled = DEFAULT_SETTINGS.meowEnabled;
    }
  } catch {
    settings = { ...DEFAULT_SETTINGS }; // no file yet, or it's corrupt
  }
}

function isValidDuration(key, value) {
  if (!Number.isInteger(value)) return false;
  if (key === 'focusTime') return value >= 5 && value % 5 === 0;
  if (key === 'pauseTime') return value >= 1;
  return false;
}

// Only accept known keys with valid values
function validate(patch) {
  const clean = {};
  if (/^#[0-9a-f]{6}$/i.test(patch?.primaryColor)) {
    clean.primaryColor = patch.primaryColor;
  }
  if (/^#[0-9a-f]{6}$/i.test(patch?.secondaryColor)) {
    clean.secondaryColor = patch.secondaryColor;
  }
  for (const key of ['focusTime', 'pauseTime']) {
    if (isValidDuration(key, patch?.[key])) {
      clean[key] = patch[key];
    }
  }
  if (typeof patch?.meowEnabled === 'boolean') {
    clean.meowEnabled = patch.meowEnabled;
  }
  
  return clean;
}

function get() {
  if (!settings) load();
  return settings;
}

function set(patch) {
  settings = { ...get(), ...validate(patch) };
  fs.writeFileSync(filePath(), JSON.stringify(settings, null, 2));
  return settings;
}

module.exports = { get, set };