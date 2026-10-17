// timer.js holds the countdown state (running, paused, remaining time) 
// and emits events like tick and finished. If you'd 
// rather keep the timer in the renderer, you can drop this, but 
// having it in main means it keeps running reliably even if a window is busy.

const EventEmitter = require('events');
const { DEFAULT_SETTINGS } = require('../../shared/defaultSettings');

class Timer extends EventEmitter {
  constructor(focusMinutes, pauseMinutes) {
    super();
    this.setDurations(focusMinutes, pauseMinutes);
    this.interval = null;
    this.nextDue = null;
    this.currentPhase = null;
    this.phase = 'focus-ready';
  }

  setDurations(focusMinutes, pauseMinutes) {
    if (!Number.isFinite(focusMinutes) || focusMinutes <= 0 ||
        !Number.isFinite(pauseMinutes) || pauseMinutes <= 0) {
      throw new RangeError('Timer durations must be positive numbers of minutes');
    }
    this.durationsMs = {
      focus: focusMinutes * 60 * 1000,
      pause: pauseMinutes * 60 * 1000,
    };
  }

  start() {
    if (this.phase !== 'focus-ready') return;
    this.startPhase('focus');
  }

  startPause() {
    if (this.phase !== 'pause-ready') return;
    this.startPhase('pause');
  }

  startPhase(phase) {
    this.currentPhase = phase;
    this.phase = `${phase}-running`;
    this.nextDue = Date.now() + this.durationsMs[phase];
    this.emit('phase', this.phase);
    this.tick();
    this.interval = setInterval(() => this.tick(), 1000);
  }

  restart() {
    clearInterval(this.interval);
    this.interval = null;
    this.phase = 'focus-ready';
    this.start();
  }

  reset() {
    clearInterval(this.interval);
    this.interval = null;
    this.nextDue = null;
    this.currentPhase = null;
    this.phase = 'focus-ready';
    this.emit('phase', this.phase);
  }

  tick() {
    if (this.nextDue === null) return;

    const remaining = Math.max(0, Math.round((this.nextDue - Date.now()) / 1000));

    this.emit('tick', remaining);

    if (remaining === 0) {
      clearInterval(this.interval);
      this.interval = null;
      this.nextDue = null;
      this.phase = this.currentPhase === 'focus' ? 'pause-ready' : 'focus-ready';
      this.currentPhase = null;
      this.emit('phase', this.phase);
    }
  }
}

module.exports = new Timer(DEFAULT_SETTINGS.focusTime, DEFAULT_SETTINGS.pauseTime);