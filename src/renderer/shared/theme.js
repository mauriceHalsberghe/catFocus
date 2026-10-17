//theme.js takes the settings object and applies it 
// (CSS variables for color, font, size) so the cat window 
// and settings preview look identical. 

export function applyTheme(settings) {
  document.documentElement.style.setProperty('--primary', settings.primaryColor);
  document.documentElement.style.setProperty('--secondary', settings.secondaryColor);
}

export async function initTheme() {
  applyTheme(await window.settingsApi.getSettings());
  window.settingsApi.onSettingsChanged(applyTheme);
}