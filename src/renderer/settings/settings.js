//settings.js reads the form inputs (color, font, size, cat type), 
// sends them via window.api.saveSettings(), and fills the form from current settings on load.

import { initTheme } from '../shared/theme.js';

initTheme();

const COLOR_KEYS = ['primaryColor', 'secondaryColor'];
const durationRules = {
  focusTime: { min: 5, step: 5 },
  pauseTime: { min: 1, step: 1 },
};
const meowInput = document.getElementById('meowEnabled');
const saveButton = document.getElementById('save-settings');
const status = document.getElementById('settings-status');
const inputs = [
  ...COLOR_KEYS.map((key) => document.getElementById(key)),
  ...Object.keys(durationRules).map((key) => document.getElementById(key)),
  meowInput,
];

for (const [key, rule] of Object.entries(durationRules)) {
  const input = document.getElementById(key);
  input.min = String(rule.min);
  input.step = String(rule.step);
}

window.settingsApi.getSettings().then((settings) => {
  for (const key of COLOR_KEYS) {
    document.getElementById(key).value = settings[key];
  }
  for (const key of Object.keys(durationRules)) {
    document.getElementById(key).value = String(settings[key]);
  }
  meowInput.checked = settings.meowEnabled;
}).catch((error) => {
  console.error('Could not load settings:', error);
  status.textContent = 'Could not load settings';
});

saveButton.addEventListener('click', async () => {
  const invalidInput = inputs.find((input) => !input.checkValidity());
  if (invalidInput) {
    invalidInput.reportValidity();
    status.textContent = 'Check the highlighted settings';
    return;
  }

  const patch = {
    primaryColor: document.getElementById('primaryColor').value,
    secondaryColor: document.getElementById('secondaryColor').value,
    focusTime: Number(document.getElementById('focusTime').value),
    pauseTime: Number(document.getElementById('pauseTime').value),
    meowEnabled: meowInput.checked,
  };

  saveButton.disabled = true;
  try {
    await window.settingsApi.setSettings(patch);
    window.close();
  } catch (error) {
    console.error('Could not save settings:', error);
    status.textContent = 'Could not save settings';
    saveButton.disabled = false;
  }
});