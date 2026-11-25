// Сборка страницы TMV Labs: hero-b + services-b (без залипания скролла) + полноширинный Bento-сайт + гиперанимации.
import { VARIANTS } from './render.js';
import { TG, fin } from './content.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;

/* ---------- подключение блоков из прототипов ---------- */
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

/* ---------- форма заявки ---------- */
function forms() {
  document.querySelectorAll('.v-form').forEach((f) =>
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = f.querySelector('.v-form-msg');
      const bad = [...f.elements].filter((x) => x.required && !x.value.trim());
      f.querySelectorAll('[aria-invalid]').forEach((x) => x.removeAttribute('aria-invalid'));
      bad.forEach((x) => x.setAttribute('aria-invalid', 'true'));
      msg.classList.toggle('err', bad.length > 0);
      msg.textContent = bad.length
        ? 'Заполни имя, контакт и задачу.'
        : 'Форма готова к подключению к Пульсу — пока можешь написать напрямую в @tmv1301.';
      if (bad.length) bad[0].focus();
    })
  );
}

/* ---------- мобильная липкая кнопка ---------- */
function sticky() {
  const a = document.createElement('a');
  a.className = 'v-sticky';
  a.href = TG;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.textContent = fin.sticky;
  document.body.append(a);
  const hero = document.getElementById('hero');
  const end = document.getElementById('final');
  const on = () => {
    const past = hero ? hero.getBoundingClientRect().bottom < innerHeight * 0.45 : true;
    const atEnd = end && end.getBoundingClientRect().top < innerHeight * 0.85;
    a.classList.toggle('on', past && !atEnd);
  };
  addEventListener('scroll', on, { passive: true });
  on();
}

/* ---------- гиперанимации: scroll-reveal + 3D tilt + spotlight ---------- */
function initMotion(main) {
  const els = [...main.querySelectorAll('[data-reveal]')];
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.04 }
    );
    els.forEach((el) => io.observe(el));
    // Гарантированный fallback на случай быстрого прыжка по якорю
    setTimeout(() => {
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < innerHeight * 1.2) el.classList.add('is-in');
      });
    }, 600);
  }

  if (!reduce && finePointer) {
    main.querySelectorAll('.v-tilt').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rx = (0.5 - py) * 5;
        const ry = (px - 0.5) * 6;
        card.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
        card.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
        card.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }
}

/* ---------- старт ---------- */
document.documentElement.style.setProperty('--accent', '#2357c6');
const main = document.getElementById('main');
main.innerHTML = VARIANTS[0].render();
document.title = 'TMV Labs — сайты, боты, CRM и автоматизация для бизнеса';
forms();
initMotion(main);

// Первый экран (hero-b)
const fallback = setTimeout(() => {
  if (!window.heroB) document.querySelector('.copy h1')?.classList.add('ready');
}, 2500);

try {
  mount(document.getElementById('hero-host'), await pull('../hero-b/index.html', '#hero'));
  sticky();
  try {
    await import('../hero-b/scene.js');
  } catch (e) {
    console.warn('hero-b', e);
    document.querySelector('.copy h1')?.classList.add('ready');
  }
  const heroCanvas = document.querySelector('#hero canvas');
  if (heroCanvas) heroCanvas.id = 'c-hero';
} catch (e) {
  console.warn('hero-b mount failed', e);
  sticky();
}
clearTimeout(fallback);

// Блок услуг (services-b) — без залипания скролла, с табами и 3D-пазлом
const svcHost = document.getElementById('svc-host');
if (svcHost) {
  try {
    mount(svcHost, await pull('../services-b/index.html', '#svc'));
    await new Promise((r) => {
      const s = document.createElement('script');
      s.src = '../services-b/ui.js';
      s.onload = r;
      s.onerror = r;
      document.body.append(s);
    });
    try {
      await import('../services-b/scene.js');
    } catch (e) {
      console.warn('services-b', e);
    }
  } catch (e) {
    console.warn('services-b mount failed', e);
    svcHost.remove();
  }
}
