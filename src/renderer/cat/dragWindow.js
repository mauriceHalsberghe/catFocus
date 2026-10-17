export function enableDrag(el, { dragStart, moveBy }) {
  let origin = null;

  el.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    origin = { x: e.screenX, y: e.screenY };
    dragStart();
  });

  window.addEventListener('mousemove', (e) => {
    if (!origin) return;
    moveBy(e.screenX - origin.x, e.screenY - origin.y);
  });

  window.addEventListener('mouseup', () => { origin = null; });
}