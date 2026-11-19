// Блок 2: прокрутка выбирает услугу (0..4). Работает и без WebGL: тексты и экраны переключаются классами.
// Сцена (scene.js) слушает событие svc-step и собирает экран пазлом.
(() => {
  const sec = document.getElementById('svc');
  const cards = [...sec.querySelectorAll('.card')];
  const scrs = [...sec.querySelectorAll('.scr')];
  const segs = [...sec.querySelectorAll('.bar i')];
  const n = scrs.length;
  scrs.forEach(s => s.querySelectorAll('.b').forEach((b, i) => b.style.setProperty('--i', i)));
  let cur = -1;
  function tick() {
    const r = sec.getBoundingClientRect();
    // блок начинает собираться, когда верх сцены поднялся до трети экрана
    if (cur < 0 && r.top > innerHeight * 0.35) return;
    const p = Math.min(Math.max(-r.top / (r.height - innerHeight), 0), 0.9999);
    const s = Math.floor(p * n);
    if (s === cur) return;
    const from = cur;
    cur = s;
    cards.forEach((c, i) => { c.classList.toggle('active', i === s); c.inert = i !== s; });
    scrs.forEach((c, i) => c.classList.toggle('active', i === s));
    segs.forEach((c, i) => c.classList.toggle('on', i <= s));
    window.svcStep = s;
    dispatchEvent(new CustomEvent('svc-step', { detail: { from, to: s } }));
  }
  addEventListener('scroll', tick, { passive: true });
  addEventListener('resize', tick);
  tick();
})();
