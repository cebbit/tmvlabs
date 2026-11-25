// Блок 2: свободный скролл, переключение услуг по клику на табы + мягкий автоцикл с паузой при наведении.
(() => {
  const sec = document.getElementById('svc');
  if (!sec) return;
  const cards = [...sec.querySelectorAll('.card')];
  const scrs = [...sec.querySelectorAll('.scr')];
  const tabs = [...sec.querySelectorAll('.svc-tabs button')];
  const n = scrs.length;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  scrs.forEach(s => s.querySelectorAll('.b').forEach((b, i) => b.style.setProperty('--i', i)));

  let cur = -1;
  let paused = false;
  let timer = null;

  function setStep(s) {
    if (s < 0 || s >= n || s === cur) return;
    const from = cur;
    cur = s;
    cards.forEach((c, i) => { c.classList.toggle('active', i === s); c.inert = i !== s; });
    scrs.forEach((c, i) => c.classList.toggle('active', i === s));
    tabs.forEach((t, i) => {
      t.classList.toggle('on', i === s);
      t.setAttribute('aria-selected', String(i === s));
    });
    window.svcStep = s;
    dispatchEvent(new CustomEvent('svc-step', { detail: { from, to: s } }));
  }

  tabs.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      paused = true;
      setStep(i);
    });
  });

  sec.addEventListener('mouseenter', () => { paused = true; });
  sec.addEventListener('mouseleave', () => { paused = false; });
  sec.addEventListener('focusin', () => { paused = true; });

  setStep(0);

  if (!reduce) {
    timer = setInterval(() => {
      if (paused || document.hidden) return;
      const r = sec.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      setStep((cur + 1) % n);
    }, 6000);
  }
})();
