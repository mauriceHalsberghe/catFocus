const SPRITE_DIR = '../../../assets/cat';
const FRAME_W = 100; // width of one frame in px

const STATES = {
  sleeping: { sprite: 'sleep.png', frames: 4, total: 3, hold: 2, loop: true },
  sitting: { sprite: 'default.png', frames: 1 },
  blinking: { sprite: 'blink.png', frames: 2, frameMs: 150, weight: 5 },
  tail:     { sprite: 'tail.png',  frames: 4, frameMs: 250, weight: 3 },
  licking:  { sprite: 'lick.png',  frames: 4, frameMs: 250, weight: 2 },
};

function pickIdleAction() {
  const entries = Object.entries(STATES).filter(([, s]) => s.weight);
  const total = entries.reduce((sum, [, s]) => sum + s.weight, 0);

  let roll = Math.random() * total;
  for (const [name, s] of entries) {
    roll -= s.weight;
    if (roll < 0) return name;
  }
  return entries[0][0];
}

const IDLE_MIN_MS = 2000;
const IDLE_MAX_MS = 8000;

function preloadSprites(spriteDir, catType) {
  const files = new Set(Object.values(STATES).map((s) => s.sprite));

  return Promise.all(
    [...files].map((file) => {
      const img = new Image();
      img.src = `${spriteDir}/${catType}/${file}`;
      return img.decode().catch(() => {}); // ignore missing files, don't block
    })
  );
}
export function createCatAnimator(el, catType = 'default') {
  let current = null;
  let baseState = null;
  let idleTimer = null;
  let frameTimer = null;
  let ready = preloadSprites(SPRITE_DIR, catType);

  function setFrame(i) {
    el.style.backgroundPositionX = `${-i * FRAME_W}px`;
  }

  function apply(name) {
    const s = STATES[name];
    if (!s) return;

    clearTimeout(frameTimer);
    current = name;
    el.style.backgroundImage = `url('${SPRITE_DIR}/${catType}/${s.sprite}')`;
    el.style.setProperty('--frames', s.frames);

    if (s.loop) {
      // CSS-driven loop
      el.style.setProperty('--total', s.total);
      el.style.setProperty('--hold', s.hold);
      el.style.backgroundPositionX = ''; // let the CSS formula drive it
      el.style.animation = 'none';
      void el.offsetWidth; // force reflow
      el.style.animation = '';
      return;
    }

    // JS-driven: turn the CSS animation off and show frame 0
    el.style.animation = 'none';
    setFrame(0);

    if (s.frames > 1) playOnce(s);
  }

  function playOnce(s) {
    let i = 0;
    const next = () => {
      i++;
      if (i >= s.frames) {
        // Done: back to the resting state
        apply(baseState);
        scheduleIdleAction();
        return;
      }
      setFrame(i);
      frameTimer = setTimeout(next, s.frameMs);
    };
    frameTimer = setTimeout(next, s.frameMs);
  }

  function clearIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = null;
  }

  function scheduleIdleAction() {
    clearIdleTimer();
    if (baseState !== 'sitting') return;

    const delay = IDLE_MIN_MS + Math.random() * (IDLE_MAX_MS - IDLE_MIN_MS);
    idleTimer = setTimeout(() => {
      apply(pickIdleAction());
    }, delay);
  }

  // Called by cat.js when main sends 'cat:state'
  function setState(name) {
    baseState = name;
    clearIdleTimer();
    ready.then(() => {
      if (baseState !== name) return; // a newer state arrived while loading
      apply(name);
      scheduleIdleAction();
    });
  }

  function setCatType(type) {
    catType = type;
    ready = preloadSprites(SPRITE_DIR, catType);
    ready.then(() => { if (current) apply(current); });
  }

  return { setState, setCatType };
}