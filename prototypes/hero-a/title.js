// Живой заголовок первого экрана: 4 варианта для выбора глазами.
// 0 «Сейчас»   — Manrope, статично (для сравнения).
// 1 «Линза»    — Geologica: буквы всплывают, у курсора становятся тоньше, наклоняются и зеленеют.
// 2 «Дыхание»  — Unbounded: буквы расшифровываются, «даже когда ты спишь» медленно дышит толщиной.
// 3 «Бот пишет» — Onest: текст набирается, как ответ бота, свежие буквы зелёные.
// Толщина меняется только вниз от базовой: слова не становятся шире и строки не перескакивают.

export const VARIANTS = [
  { id: 0, name: 'Сейчас', family: 'Manrope', base: 800 },
  { id: 1, name: 'Линза', family: 'Geologica', base: 780 },
  { id: 2, name: 'Дыхание', family: 'Unbounded', base: 700 },
  { id: 3, name: 'Бот пишет', family: 'Onest', base: 800 },
];

const ACCENT = [31, 138, 91];
const INK = [17, 17, 17];
const MUTED = [107, 107, 102];
const mix = (a, b, t) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`;

// Разбивает h1 на буквы. Живой текст для скринридера лежит отдельно и не анимируется.
function split(h1) {
  const parts = [...h1.childNodes].map(n => ({ text: n.textContent, muted: n.nodeType === 1 }));
  const full = h1.textContent;
  h1.textContent = '';
  const sr = document.createElement('span');
  sr.className = 'sr'; sr.textContent = full;
  const vis = document.createElement('span');
  vis.setAttribute('aria-hidden', 'true');
  h1.append(sr, vis);
  const letters = [];
  for (const p of parts) {
    const group = document.createElement('span');
    if (p.muted) group.className = 'muted';
    p.text.split(/(\s+)/).forEach(chunk => {
      if (!chunk) return;
      if (/^\s+$/.test(chunk)) { group.append(' '); return; }
      const w = document.createElement('span');
      w.className = 'w';
      for (const ch of chunk) {
        const l = document.createElement('span');
        l.className = 'l'; l.textContent = ch;
        w.append(l);
        letters.push({ el: l, ch, muted: p.muted, i: letters.length });
      }
      group.append(w);
    });
    vis.append(group);
  }
  return letters;
}

function fontsReady(family, weight) {
  const load = document.fonts ? document.fonts.load(`${weight} 40px "${family}"`, 'Бизнес') : Promise.resolve();
  return Promise.race([load, new Promise(r => setTimeout(r, 2500))]);
}

export async function initTitle(h1, id, { reduce }) {
  const v = VARIANTS.find(x => x.id === id) || VARIANTS[1];
  h1.dataset.variant = v.id;
  h1.style.fontFamily = `"${v.family}", system-ui, sans-serif`;
  h1.style.fontWeight = v.base;
  await fontsReady(v.family, v.base);
  if (v.id === 0) { h1.classList.add('ready'); return; }
  const letters = split(h1);
  h1.classList.add('ready');
  if (reduce) return;
  ({ 1: lens, 2: breathe, 3: typing })[v.id](h1, letters, v);
}

// 1. Линза
function lens(h1, letters, v) {
  letters.forEach(L => {
    L.el.style.cssText = `opacity:0;transform:translateY(.55em);filter:blur(8px)`;
    L.el.animate(
      [{ opacity: 0, transform: 'translateY(.55em)', filter: 'blur(8px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }],
      { duration: 900, delay: 150 + L.i * 22, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }
    );
  });
  const start = performance.now() + 150 + letters.length * 22 + 700;
  let px = -1e4, py = -1e4, lastMove = 0, centers = [];
  const measure = () => { centers = letters.map(L => { const r = L.el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }); };
  addEventListener('resize', measure);
  addEventListener('scroll', measure, { passive: true });
  addEventListener('pointermove', e => { if (e.pointerType === 'mouse') { px = e.clientX; py = e.clientY; lastMove = performance.now(); } });
  const box = () => h1.getBoundingClientRect();
  const tick = now => {
    requestAnimationFrame(tick);
    if (now < start) return;
    if (!centers.length) measure();
    let x = px, y = py;
    // Без мыши (телефон или курсор ушёл) линза сама медленно проходит по строкам.
    if (now - lastMove > 2500) {
      const b = box(), t = (now - start) / 1000;
      const lines = Math.max(1, Math.round(b.height / parseFloat(getComputedStyle(h1).lineHeight)));
      const k = (t * 0.22) % lines;
      const line = Math.floor(k), f = k - line;
      x = b.left - 80 + (b.width + 160) * (line % 2 ? 1 - f : f);
      y = b.top + (line + 0.5) * (b.height / lines);
    }
    const sigma = Math.max(70, h1.getBoundingClientRect().height / 3.2);
    letters.forEach((L, i) => {
      const [cx, cy] = centers[i] || [0, 0];
      const d2 = (cx - x) ** 2 + ((cy - y) * 1.6) ** 2;
      const t = Math.exp(-d2 / (2 * sigma * sigma));
      if (t < 0.01 && L.t < 0.01) return;
      L.t = t;
      L.el.style.fontWeight = Math.round(v.base - 500 * t);
      L.el.style.fontVariationSettings = `"slnt" ${(-11 * t).toFixed(1)}`;
      L.el.style.color = mix(L.muted ? MUTED : INK, ACCENT, t);
    });
  };
  requestAnimationFrame(tick);
}

// 2. Дыхание
function breathe(h1, letters, v) {
  const GLYPHS = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЭЮЯ0123456789';
  // Ширина буквы фиксируется на время расшифровки, чтобы строка не дрожала.
  letters.forEach(L => { L.el.style.width = L.el.getBoundingClientRect().width + 'px'; L.el.classList.add('fix'); });
  const t0 = performance.now() + 200;
  const done = new Set();
  const tick = now => {
    const t = now - t0;
    letters.forEach(L => {
      if (done.has(L.i)) return;
      const end = L.i * 28 + 420;
      if (t < L.i * 28) { L.el.style.opacity = 0; return; }
      L.el.style.opacity = 1;
      if (t >= end) { L.el.textContent = L.ch; L.el.style.width = ''; L.el.classList.remove('fix'); done.add(L.i); return; }
      L.el.textContent = GLYPHS[(Math.random() * GLYPHS.length) | 0];
      L.el.style.color = 'rgb(31,138,91)';
      L.el.style.fontWeight = 400;
    });
    letters.forEach(L => { if (done.has(L.i) && !L.settled) { L.settled = true; L.el.style.color = ''; L.el.style.fontWeight = ''; } });
    if (done.size < letters.length) requestAnimationFrame(tick); else requestAnimationFrame(loop);
  };
  const sleepers = letters.filter(L => L.muted);
  const loop = now => {
    requestAnimationFrame(loop);
    const s = now / 1000;
    sleepers.forEach((L, j) => {
      // Вдох около 4 секунд, волна идёт слева направо.
      const b = 0.5 + 0.5 * Math.sin(s * (Math.PI * 2 / 4.2) - j * 0.32);
      L.el.style.fontWeight = Math.round(v.base - 480 * b);
      L.el.style.opacity = (1 - 0.25 * b).toFixed(3);
    });
  };
  requestAnimationFrame(tick);
}

// 3. Бот пишет
function typing(h1, letters) {
  letters.forEach(L => { L.el.style.visibility = 'hidden'; });
  const caret = document.createElement('span');
  caret.className = 'caret';
  let i = 0;
  const step = () => {
    if (i >= letters.length) {
      letters.at(-1).el.after(caret);
      caret.classList.add('blink');
      setTimeout(() => caret.remove(), 3200);
      return;
    }
    const L = letters[i++];
    L.el.style.visibility = '';
    L.el.after(caret);
    L.el.animate(
      [{ color: 'rgb(31,138,91)', transform: 'translateY(-.12em)' }, { color: L.muted ? 'rgb(107,107,102)' : 'rgb(17,17,17)', transform: 'none' }],
      { duration: 700, easing: 'cubic-bezier(.2,.8,.2,1)' }
    );
    const next = letters[i];
    let pause = 28 + Math.random() * 34;
    if (next && next.el.parentNode !== L.el.parentNode) pause += 60;
    if (next && next.muted && !L.muted) pause += 520;
    setTimeout(step, pause);
  };
  setTimeout(step, 350);
}
