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
  function setStep(s) {
    if (s === cur) return;
    const from = cur;
    cur = s;
    cards.forEach((c, i) => { c.classList.toggle('active', i === s); c.inert = i !== s; });
    scrs.forEach((c, i) => c.classList.toggle('active', i === s));
    segs.forEach((c, i) => { c.classList.toggle('on', i <= s); c.setAttribute('aria-selected', String(i === s)); });
    window.svcStep = s;
    dispatchEvent(new CustomEvent('svc-step', { detail: { from, to: s } }));
  }
  function tick() {
    const r = sec.getBoundingClientRect();
    const range = r.height - innerHeight;
    if (range <= 0) { setStep(0); return; }
    if (cur < 0 && r.top > innerHeight * 0.45) { setStep(0); return; }
    const p = Math.min(Math.max(-r.top / range, 0), 0.9999);
    setStep(Math.floor(p * n));
  }
  segs.forEach((seg, i) => {
    const go = () => {
      const r = sec.getBoundingClientRect();
      const range = Math.max(r.height - innerHeight, 0);
      const targetY = window.scrollY + r.top + (range * (i + 0.15)) / n;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
      setStep(i);
    };
    seg.addEventListener('click', go);
    seg.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });
  addEventListener('scroll', tick, { passive: true });
  addEventListener('resize', tick);
  tick();
})();
