// Сборка страницы: первый экран и блок услуг берутся из их прототипов как есть (hero-b, services-b),
// поэтому правки там сразу видны здесь. Ниже рисуется выбранный вариант (?v=0..3) и подключаются твики.
import { VARIANTS } from './render.js';
import { TG, fin } from './content.js';

const q = new URLSearchParams(location.search);
const SHOW_TWEAKS = q.get('tweaks') === '1';
const num = (k, d, max) => Math.min(Math.max(parseInt(q.get(k) ?? d, 10) || 0, 0), max);
const V = num('v', 0, 3);
const ACC = [['Зелёный', '#1f8a5b'], ['Синий', '#2357c6'], ['Терракота', '#c2501d'], ['Графит', '#3a3a38']];
const GND = [['Тёплый', '#f5f4ef'], ['Белый', '#fbfbf9'], ['Холодный', '#eef1f3']];
const DEN = [['Просторно', 1], ['Плотно', .78]];
const st = { a: num('a', 0, 3), g: num('g', 0, 2), d: num('d', 0, 1), b2: num('b2', 1, 1), gr: num('gr', 1, 1) };
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;

function applyTweaks() {
  root.style.setProperty('--accent', ACC[st.a][1]);
  root.style.setProperty('--bg', GND[st.g][1]);
  root.style.setProperty('--d', DEN[st.d][1]);
  document.body.classList.toggle('no-grain', !st.gr);
}
function url(extra = {}) {
  const p = new URLSearchParams({ v: V, ...st, ...extra });
  if (SHOW_TWEAKS) p.set('tweaks', '1');
  return '?' + p.toString();
}

/* ---------- блоки из прототипов ---------- */
async function pull(path, sel) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const css = [...doc.querySelectorAll('style')].map((s) => s.textContent).join('\n');
  const node = doc.querySelector(sel);
  if (!node) throw new Error(`Selector ${sel} not found in ${path}`);
  return { css, node };
}
function mount(host, { css, node }) {
  if (!host || !node) return false;
  const style = document.createElement('style');
  style.textContent = css;
  host.before(style);
  host.replaceWith(document.importNode(node, true));
  return true;
}

/* ---------- твики ---------- */
function tweaks() {
  const opts = (name, list, cur) => list.map(([l, val], i) => `<label>${name === 'a' ? `<i class="v-tw-sw" style="background:${val}"></i>` : ''}<input type="radio" name="${name}" value="${i}" ${i === cur ? 'checked' : ''}>${l}</label>`).join('');
  const el = document.createElement('div');
  el.className = 'v-tw';
  el.innerHTML = `<div class="v-tw-panel" id="v-tw-p" hidden>
      <fieldset class="v-tw-vars"><legend>Вариант</legend><div class="v-tw-opts">${VARIANTS.map((x, i) => `<a data-v="${i}" href="${url({ v: i })}" ${i === V ? 'aria-current="page"' : ''}>${i + 1} ${x.name}</a>`).join('')}</div></fieldset>
      <fieldset><legend>Акцент</legend><div class="v-tw-opts">${opts('a', ACC, st.a)}</div></fieldset>
      <fieldset><legend>Фон</legend><div class="v-tw-opts">${opts('g', GND, st.g)}</div></fieldset>
      <fieldset><legend>Плотность</legend><div class="v-tw-opts">${opts('d', DEN, st.d)}</div></fieldset>
      <fieldset><legend>Блоки</legend><div class="v-tw-opts">
        <label><input type="checkbox" name="b2" ${st.b2 ? 'checked' : ''}>Блок услуг 3D</label>
        <label><input type="checkbox" name="gr" ${st.gr ? 'checked' : ''}>Зерно</label></div></fieldset>
      <p class="v-tw-hint">Всё сохраняется в адресе: ссылку можно переслать.</p>
    </div>
    <nav class="v-tw-bar" aria-label="Вариант дизайна">${VARIANTS.map((x, i) => `<a data-v="${i}" href="${url({ v: i })}" ${i === V ? 'aria-current="page"' : ''}>${i + 1}<span class="v-tw-name">&nbsp;${x.name}</span></a>`).join('')}
      <button type="button" aria-expanded="false" aria-controls="v-tw-p"><span class="v-tw-cur">${V + 1}&nbsp;·&nbsp;</span>Твики</button></nav>`;
  document.body.append(el);
  const btn = el.querySelector('button'), panel = el.querySelector('.v-tw-panel');
  btn.addEventListener('click', () => { panel.hidden = !panel.hidden; btn.setAttribute('aria-expanded', String(!panel.hidden)); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); btn.focus(); } });
  panel.addEventListener('change', (e) => {
    const t = e.target;
    st[t.name] = t.type === 'checkbox' ? +t.checked : +t.value;
    history.replaceState(null, '', url());
    el.querySelectorAll('.v-tw-bar a, .v-tw-vars a').forEach((a) => { a.href = url({ v: a.dataset.v }); });
    if (t.name === 'b2') location.reload(); // 3D-блок подключается при загрузке
    else applyTweaks();
  });
}

/* ---------- общее поведение ---------- */
function forms() {
  document.querySelectorAll('.v-form').forEach((f) => f.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = f.querySelector('.v-form-msg');
    const bad = [...f.elements].filter((x) => x.required && !x.value.trim());
    f.querySelectorAll('[aria-invalid]').forEach((x) => x.removeAttribute('aria-invalid'));
    bad.forEach((x) => x.setAttribute('aria-invalid', 'true'));
    msg.classList.toggle('err', bad.length > 0);
    // Приёмник заявок на de ещё не построен (STATE п.6): форма в прототипе никуда не отправляет
    msg.textContent = bad.length ? 'Заполни имя, контакт и задачу.' : 'Прототип: приёмник заявок ещё не подключён, ничего не отправлено.';
    if (bad.length) bad[0].focus();
  }));
}
function sticky() {
  if (V === 2) return; // у «Переписки» своя липкая строка ввода
  const a = document.createElement('a');
  a.className = 'v-sticky'; a.href = TG; a.rel = 'noopener'; a.textContent = fin.sticky;
  document.body.append(a);
  const hero = document.getElementById('hero'), end = document.getElementById('final');
  const on = () => {
    const past = hero ? hero.getBoundingClientRect().bottom < innerHeight * 0.6 : true;
    const atEnd = end && end.getBoundingClientRect().top < innerHeight * 0.8;
    a.classList.toggle('on', past && !atEnd);
  };
  addEventListener('scroll', on, { passive: true }); on();
}
const seen = (els, cb, margin = '0px 0px -25% 0px') => {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { cb(e.target); io.unobserve(e.target); } }), { rootMargin: margin });
  els.forEach((el) => io.observe(el));
};

/* ---------- движение вариантов: одно авторское на вариант ---------- */
const MOTION = [
  // Схема: линия прорисовывается от узла к узлу, узел загорается, когда линия до него дошла
  (main) => {
    const svg = main.querySelector('.v0-wire svg'), base = svg.querySelector('.v0-path'), ink = svg.querySelector('.v0-ink');
    const pins = [...main.querySelectorAll('.v-node')];
    let H = 0;
    const size = () => { H = main.offsetHeight; svg.setAttribute('viewBox', `0 0 4 ${H}`); base.setAttribute('d', `M2 0V${H}`); ink.setAttribute('d', `M2 0V${H}`); ink.style.strokeDasharray = `${H} ${H}`; tick(); };
    const tick = () => {
      const top = main.getBoundingClientRect().top;
      const y = Math.min(Math.max(innerHeight * 0.62 - top, 0), H);
      ink.style.strokeDashoffset = reduce ? 0 : H - y;
      pins.forEach((n) => n.classList.toggle('lit', reduce || n.offsetTop + 100 < y));
    };
    addEventListener('scroll', tick, { passive: true }); addEventListener('resize', size); size();
    new ResizeObserver(size).observe(main);
    seen(main.querySelectorAll('.v0-routes'), (el) => el.classList.add('go'));
  },
  // Сутки: часы идут от 00:00 к текущему времени посетителя, фон чуть меняется по времени суток
  (main) => {
    const clock = main.querySelector('.v1-clock'), out = clock.querySelector('b');
    const hh = clock.querySelector('.v1-hh'), mm = clock.querySelector('.v1-mm');
    const now = new Date(), nowMin = now.getHours() * 60 + now.getMinutes();
    const hours = [...main.querySelectorAll('.v1-hour')].map((el) => {
      const t = el.dataset.time; const m = /^(\d\d):(\d\d)$/.exec(t);
      return { el, min: m ? +m[1] * 60 + +m[2] : Math.max(nowMin, 23 * 60) };
    });
    hours.at(-1).min = Math.max(nowMin, hours.at(-2).min + 30);
    // Реальное время в штампе только после 22:30, иначе часы покажут 23:00, а штамп 18:40
    const fin = main.querySelector('.v1-final time'); if (fin && hours.at(-1).min === nowMin) fin.textContent = now.toTimeString().slice(0, 5);
    // свет суток: ночь прохладнее, утро и вечер теплее; всё светлое
    const tone = (m) => { const h = m / 60; return h < 6 ? '#eef0f2' : h < 11 ? '#f7f2e8' : h < 17 ? '#f8f7f3' : '#f4ede4'; };
    const fmt = (m) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(Math.floor(m % 60)).padStart(2, '0')}`;
    const tick = () => {
      const c = innerHeight * 0.5;
      let m = 0;
      for (let i = 0; i < hours.length; i++) {
        const r = hours[i].el.getBoundingClientRect();
        const prev = i ? hours[i - 1].min : 0;
        if (r.top <= c) m = hours[i].min;
        else { const pr = i ? hours[i - 1].el.getBoundingClientRect() : null; if (pr) { const k = Math.min(Math.max((c - pr.top) / (r.top - pr.top), 0), 1); m = prev + (hours[i].min - prev) * k * k; } break; }
      }
      out.textContent = fmt(m);
      hh.style.transform = `rotate(${(m / 720) * 360}deg)`;
      mm.style.transform = `rotate(${(m % 60) * 6}deg)`;
      main.style.backgroundColor = tone(m);
    };
    addEventListener('scroll', tick, { passive: true }); tick();
  },
  // Переписка: на каждую группу сначала «печатает», потом сообщения выскакивают по одному
  (main) => {
    main.querySelectorAll('.v2-group').forEach((g) => [...g.querySelectorAll('.v2-msg, .v2-replies')].forEach((m, k) => m.style.setProperty('--k', k)));
    if (reduce) return;
    main.classList.add('anim');
    seen(main.querySelectorAll('.v2-group'), (g) => { g.classList.add('typing', 'seen'); setTimeout(() => g.classList.remove('typing'), 380); }, '0px 0px -15% 0px');
  },
  // Наряд-заказ: штамп ложится на бланк, когда он доходит до середины экрана
  (main) => {
    if (reduce) return;
    main.classList.add('anim');
    seen(main.querySelectorAll('.v3-sheet, .v3-order, .v3-pricewrap'), (el) => el.classList.add('lit'), '0px 0px -35% 0px');
  },
];

/* ---------- старт ---------- */
document.body.dataset.v = V;
applyTweaks();
const main = document.getElementById('main');
main.classList.add('v' + V);
main.innerHTML = VARIANTS[V].render();
document.title = `TMV Labs · ${VARIANTS[V].name}`;
if (SHOW_TWEAKS) tweaks();
forms();
MOTION[V](main);

// Первый экран: hero-b целиком. Его сцена берёт холст #c при загрузке модуля, поэтому блок услуг (тоже #c) монтируется после.
const fallback = setTimeout(() => { if (!window.heroB) document.querySelector('.copy h1')?.classList.add('ready'); }, 3000);
try {
  mount(document.getElementById('hero-host'), await pull('../hero-b/index.html', '#hero'));
  document.querySelector('#hero .top a')?.setAttribute('href', '#cases');
  sticky();
  try { await import('../hero-b/scene.js'); } catch (e) { console.warn('hero-b', e); document.querySelector('.copy h1')?.classList.add('ready'); }
  const heroCanvas = document.querySelector('#hero canvas');
  if (heroCanvas) heroCanvas.id = 'c-hero';
} catch (e) {
  console.warn('hero-b mount failed', e);
  sticky();
}
clearTimeout(fallback);

const svcHost = document.getElementById('svc-host');
if (st.b2 && svcHost) {
  try {
    mount(svcHost, await pull('../services-b/index.html', '#svc'));
    await new Promise((r) => { const s = document.createElement('script'); s.src = '../services-b/ui.js'; s.onload = r; s.onerror = r; document.body.append(s); });
    try { await import('../services-b/scene.js'); } catch (e) { console.warn('services-b', e); }
  } catch (e) {
    console.warn('services-b mount failed', e);
    svcHost.remove();
  }
} else svcHost?.remove();
