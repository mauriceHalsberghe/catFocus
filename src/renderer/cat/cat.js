//cat.js is the entry script that connects everything and listens for events from window.api.
import { createCatAnimator } from './catAnimator.js';
import { enableDrag } from './dragWindow.js';

import { initTheme } from '../shared/theme.js';
initTheme();

enableDrag(document.getElementById('cat'), window.catApi);

const cat = createCatAnimator(document.getElementById('cat'));
const timerTime = document.getElementById('timer-time');
const focusButton = document.getElementById('timer-focus');
const pauseButton = document.getElementById('timer-pause');
let timerPhase = 'focus-ready';
let currentState = 'sitting';
let meowEnabled = true;
const meow = new Audio(new URL('../../../assets/sounds/cat_meow.mp3', import.meta.url));

cat.setState('sitting');

window.settingsApi.getSettings().then((settings) => {
  meowEnabled = settings.meowEnabled;
});
window.settingsApi.onSettingsChanged((settings) => {
  meowEnabled = settings.meowEnabled;
});

window.catApi.onState((state) => {
  if (meowEnabled && currentState === 'sleeping' && state === 'sitting') {
    meow.currentTime = 0;
    meow.play().catch((error) => {
      console.error('Could not play the cat wake-up sound:', error);
    });
  }
  currentState = state;
  cat.setState(state);
});

window.catApi.onTick((seconds) => {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  timerTime.textContent = `${m}:${s}`;
});

window.catApi.onTimerPhase((phase) => {
  timerPhase = phase;
  const isRunning = phase.endsWith('-running');
  focusButton.hidden = isRunning || phase !== 'focus-ready';
  pauseButton.hidden = isRunning || phase !== 'pause-ready';
  timerTime.hidden = !isRunning;

  if (!isRunning) {
    timerTime.textContent = '';
  }
});

focusButton.onclick = () => {
  if (timerPhase === 'focus-ready') window.catApi.startTimer();
};

pauseButton.onclick = () => {
  if (timerPhase === 'pause-ready') window.catApi.startPause();
};

document.getElementById('settings').onclick = () => window.catApi.toggleSettings();
document.getElementById('close').onclick = () => window.catApi.close();