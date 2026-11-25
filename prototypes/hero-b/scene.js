// Первый экран B «Плашки из букв».
// 1) Заголовок собирается из тёмных осколков, затем подменяется настоящим текстом (резкость, доступность).
// 2) Буква за буквой отдаёт осколки: они вылетают к зрителю, переливаются плёнкой и складываются в плашку сообщения.
// 3) Плашки живут роем, при прокрутке встают в очередь и уходят в бота (логика как в hero-a).
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

window.heroB = true; // сцена загрузилась, запасной показ текста не нужен
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = innerWidth < 760;
const h1 = document.querySelector('.copy h1');
const canvas = document.getElementById('c');

// ---------- Текст: буквы в span, целый текст для скринридера ----------
function split() {
  const parts = [...h1.childNodes].map(n => ({ text: n.textContent, muted: n.nodeType === 1 }));
  const full = h1.textContent;
  h1.textContent = '';
  const sr = document.createElement('span');
  sr.className = 'sr'; sr.textContent = full;
  const vis = document.createElement('span');
  vis.setAttribute('aria-hidden', 'true');
  h1.append(sr, vis);
  const out = [];
  for (const p of parts) {
    const g = document.createElement('span');
    g.className = p.muted ? 'g muted' : 'g';
    p.text.split(/(\s+)/).forEach(chunk => {
      if (!chunk) return;
      if (/^\s+$/.test(chunk)) { g.append(' '); return; }
      const w = document.createElement('span');
      w.className = 'w';
      for (const ch of chunk) {
        const l = document.createElement('span');
        l.className = 'l'; l.textContent = ch;
        w.append(l);
        if (/[\p{L}\p{N}]/u.test(ch)) out.push({ el: l, ch, muted: p.muted });
      }
      g.append(w);
    });
    vis.append(g);
  }
  return out;
}

// шрифт заголовка задаёт CSS (переключатель ?f=0..3), здесь ждём именно его
const hcs = getComputedStyle(h1);
const fonts = Promise.race([
  document.fonts ? document.fonts.load(`${hcs.fontWeight} 60px ${hcs.fontFamily}`, 'Твой бизнес') : Promise.resolve(),
  new Promise(r => setTimeout(r, 1500)),
]);

// ---------- Three.js ----------
let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); }
catch (e) { h1.classList.add('ready'); throw e; }
renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
camera.position.set(0, 0, 18);
const key = new THREE.DirectionalLight(0xffffff, 1.4);
key.position.set(4, 8, 10);
const rim = new THREE.DirectionalLight(0xdfe8ff, 0.8);
rim.position.set(-8, -3, 6);
// тёплый отражённый свет снизу: плашки не проваливаются в серое по нижней грани
const bounce = new THREE.DirectionalLight(0xfff0dc, 0.35);
bounce.position.set(1, -7, 5);
scene.add(key, rim, bounce, new THREE.AmbientLight(0xffffff, 0.4));

// Мягкие тени: невидимая плоскость за плашками ловит только тень (холст прозрачный, фон страницы виден).
// VSM даёт размытый край; радиус и смещение плоскости подобраны так, чтобы тень читалась как свет из окна сверху справа.
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
key.castShadow = true;
key.shadow.mapSize.setScalar(mobile ? 1024 : 2048);
key.shadow.radius = mobile ? 8 : 12;
key.shadow.blurSamples = 16;
key.shadow.bias = -0.0004;
key.shadow.camera.near = 1; key.shadow.camera.far = 40;
const ground = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.ShadowMaterial({ color: 0x2b2416, opacity: 0.12 }));
ground.position.z = -1.3; // ближе к плашкам: тень прилегает, а не отлетает
ground.receiveShadow = true;
scene.add(ground);

let view = { w: 10, h: 6 }, cw = 1, ch = 1;
const swarm = new THREE.Vector3(), botPos = new THREE.Vector3(), lineDir = new THREE.Vector3();
let wall = { x: -99, y: 99 };
function layout() {
  cw = Number.isFinite(canvas.clientWidth) ? canvas.clientWidth : 0;
  ch = Number.isFinite(canvas.clientHeight) ? canvas.clientHeight : 0;
  if (!renderer || cw <= 0 || ch <= 0) return false;
  renderer.setSize(cw, ch, false);
  const aspect = cw / ch;
  if (!Number.isFinite(aspect) || aspect <= 0) return false;
  camera.aspect = aspect; camera.updateProjectionMatrix();
  const vh = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
  if (!Number.isFinite(vh) || vh <= 0) return false;
  view = { w: vh * aspect, h: vh };
  // плоскость теней шире кадра (она дальше камеры), камера тени накрывает весь кадр
  ground.scale.set(view.w * 1.4, view.h * 1.4, 1);
  const sc = key.shadow.camera, half = Math.max(view.w, view.h) * 0.75;
  if (!sc || !Number.isFinite(half) || half <= 0) return false;
  sc.left = -half; sc.right = half; sc.top = half; sc.bottom = -half; sc.updateProjectionMatrix();
  if (cw < 760) {
    // Телефон: рой живёт под кнопкой Telegram и подписью к ней. Граница берётся из вёрстки,
    // а не долей экрана: высота текста зависит от ширины и шрифта.
    const below = document.querySelector('.note') || document.querySelector('.cta');
    const top = below ? below.getBoundingClientRect().bottom - canvas.getBoundingClientRect().top + 14 : ch * 0.42;
    const wallY = view.h / 2 - Math.min(top, ch * 0.8) / ch * view.h;
    swarm.set(0, (wallY - view.h / 2) / 2 - view.h * 0.03, 0); botPos.set(view.w * 0.2, -view.h * 0.1, 0);
    lineDir.set(-0.55, -1, 0).normalize(); wall = { x: -99, y: wallY };
  } else {
    swarm.set(view.w * 0.24, -view.h * 0.04, 0); botPos.set(view.w * 0.26, view.h * 0.1, 0);
    lineDir.set(-0.35, -1, 0).normalize(); wall = { x: -view.w / 2 + view.w * 0.5, y: 99 };
  }
  return true;
}
// Пиксель экрана в мир на плоскости z = 0
const toWorld = (x, y, v = new THREE.Vector3()) => {
  if (!cw || !ch || !Number.isFinite(view.w) || !Number.isFinite(view.h)) return v.set(0, 0, 0);
  return v.set((x / cw - .5) * view.w, -(y / ch - .5) * view.h, 0);
};

// ---------- Плашки ----------
const CH = [
  { n: 'Авито', c: '#00aaff' }, { n: 'Telegram', c: '#2aabee' }, { n: 'Instagram', c: '#e1306c' },
  { n: 'MAX', c: '#7b5cff' }, { n: 'Сайт', c: '#1f8a5b' },
];
const MSG = ['Сколько стоит?', 'Есть в наличии?', 'Запишите на субботу', 'Доставка есть?', 'Можно в рассрочку?',
  'Во сколько работаете?', 'Пришлите прайс', 'А скидка будет?', 'Почините экран?', 'Готов мой заказ?',
  'Сделаете сегодня?', 'Какая гарантия?', 'Где вы находитесь?', 'Есть другой цвет?'];
function label(text, c) {
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 160;
  const g = cv.getContext('2d');
  g.fillStyle = c.c; g.beginPath(); g.arc(46, 54, 12, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#7a7a75'; g.font = '600 30px Manrope, sans-serif'; g.fillText(c.n, 70, 64);
  g.fillStyle = '#111'; g.font = '700 42px Manrope, sans-serif'; g.fillText(text, 34, 122);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}
const N = reduce ? 12 : (mobile ? 14 : 22);
const W = 3.2, H = 1.0, D = 0.34;
const boxGeo = new RoundedBoxGeometry(W, H, D, 4, 0.22);
const planeGeo = new THREE.PlaneGeometry(W * 0.94, H * 0.92);
const plates = [];
for (let i = 0; i < N; i++) {
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, roughness: 0.28, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.15,
    iridescence: 1, iridescenceIOR: 1.35, iridescenceThicknessRange: [180, 620],
  });
  const g = new THREE.Group();
  const body = new THREE.Mesh(boxGeo, mat);
  body.castShadow = true;
  g.add(body);
  const faceMat = new THREE.MeshBasicMaterial({ map: label(MSG[i % MSG.length], CH[i % CH.length]), transparent: true, opacity: 0 });
  const face = new THREE.Mesh(planeGeo, faceMat);
  face.position.z = D / 2 + 0.002;
  g.add(face);
  g.visible = false;
  scene.add(g);
  plates.push({ g, mat, faceMat, born: -1, pos: new THREE.Vector3(), vel: new THREE.Vector3(),
    rot: new THREE.Vector3((Math.random() - .5) * .6, (Math.random() - .5) * .8, (Math.random() - .5) * .5),
    spin: (Math.random() - .5) * 0.4, ph: Math.random() * 6.28 });
}

// Бот
const bot = new THREE.Group();
const botCore = new THREE.Mesh(new RoundedBoxGeometry(2.2, 2.2, 2.2, 6, 0.6),
  new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.22, clearcoat: 1, iridescence: 0.6, iridescenceThicknessRange: [200, 500] }));
const ringMat = new THREE.MeshStandardMaterial({ color: 0x1f8a5b, emissive: 0x1f8a5b, emissiveIntensity: 0.6 });
const ring = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.08, 16, 80), ringMat);
const botFace = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.8), new THREE.MeshBasicMaterial({ map: (() => {
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = 128; const g = cv.getContext('2d');
  g.fillStyle = '#111'; g.font = '800 64px Manrope, sans-serif'; g.textAlign = 'center'; g.fillText('бот', 128, 84);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t; })(), transparent: true }));
botFace.position.z = 1.11;
botCore.castShadow = true; ring.castShadow = true;
bot.add(botCore, ring, botFace);
bot.scale.setScalar(0.0001);
scene.add(bot);

// ---------- Осколки букв ----------
// Каждый осколок: маленькая плитка с плёнкой. Дом: пиксель глифа. Цвет: чернила в букве, перламутр в полёте.
let letters = [], shards = null, S = 0;
let home, scatter, tgt, seed;              // Float32Array по 3 на осколок
const INK = new THREE.Color('#111111'), MUTED = new THREE.Color('#6b6b66'), PEARL = new THREE.Color('#ffffff');

function sample() {
  const step = mobile ? 2.6 : 3.2;           // шаг сетки в css px
  const cs = getComputedStyle(h1);
  const font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const off = document.createElement('canvas');
  const cr = canvas.getBoundingClientRect();
  const pts = [];
  letters.forEach((L, li) => {
    const r = L.el.getBoundingClientRect();
    const pad = 4, w = Math.ceil(r.width + pad * 2), h = Math.ceil(r.height + pad * 2);
    off.width = w; off.height = h;
    const g = off.getContext('2d', { willReadFrequently: true });
    g.clearRect(0, 0, w, h);
    g.font = font; g.textBaseline = 'alphabetic'; g.fillStyle = '#000';
    const m = g.measureText(L.ch);
    const asc = m.fontBoundingBoxAscent ?? m.actualBoundingBoxAscent, desc = m.fontBoundingBoxDescent ?? m.actualBoundingBoxDescent;
    const base = pad + (r.height - (asc + desc)) / 2 + asc;
    g.fillText(L.ch, pad, base);
    const data = g.getImageData(0, 0, w, h).data;
    L.start = pts.length / 2;
    let sx = 0, sy = 0, n = 0;
    for (let y = step / 2; y < h; y += step) for (let x = step / 2; x < w; x += step) {
      if (data[((y | 0) * w + (x | 0)) * 4 + 3] > 140) {
        const px = r.left - cr.left - pad + x, py = r.top - cr.top - pad + y;
        pts.push(px, py); sx += px; sy += py; n++;
      }
    }
    L.count = n; L.cx = sx / Math.max(n, 1); L.cy = sy / Math.max(n, 1); L.li = li;
  });
  return { pts, step };
}

function buildShards() {
  if (shards) { scene.remove(shards); shards.geometry.dispose(); }
  const { pts, step } = sample();
  S = pts.length / 2;
  if (!S || !cw || !ch || !Number.isFinite(view.w) || !Number.isFinite(view.h)) return;
  const size = step * view.w / cw * 0.92;
  if (!Number.isFinite(size) || size <= 0) return;
  const geo = new THREE.BoxGeometry(size, size, size * 0.5);
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, roughness: 0.18, metalness: 0.55, clearcoat: 1,
    iridescence: 1, iridescenceIOR: 1.5, iridescenceThicknessRange: [150, 900],
  });
  shards = new THREE.InstancedMesh(geo, mat, S);
  shards.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  shards.frustumCulled = false;
  home = new Float32Array(S * 3); scatter = new Float32Array(S * 3); tgt = new Float32Array(S * 3); seed = new Float32Array(S * 3);
  const v = new THREE.Vector3();
  for (let i = 0; i < S; i++) {
    toWorld(pts[i * 2], pts[i * 2 + 1], v);
    home.set([v.x, v.y, 0], i * 3);
    const a = Math.random() * Math.PI * 2, rr = 4 + Math.random() * 9;
    scatter.set([v.x + Math.cos(a) * rr, v.y + Math.sin(a) * rr * 0.6, 4 + Math.random() * 9], i * 3);
    seed.set([Math.random(), Math.random(), Math.random()], i * 3);
  }
  letters.forEach(L => {
    const c = L.muted ? MUTED : INK;
    for (let k = 0; k < L.count; k++) { shards.setColorAt(L.start + k, c); setInst(L.start + k, null); }
  });
  shards.instanceColor.setUsage(THREE.DynamicDrawUsage);
  // во время сборки тени нет: иначе при подмене осколков текстом пропадала бы тень заголовка
  shards.castShadow = introDone;
  scene.add(shards);
}

const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), P = new THREE.Vector3(), SC = new THREE.Vector3();
const ZERO = new THREE.Vector3(0, 0, 0), ONE = new THREE.Vector3(1, 1, 1), COL = new THREE.Color();
function setInst(i, pos, rx = 0, ry = 0, rz = 0, s = 1) {
  if (!pos) { M.compose(P.set(0, 0, -50), Q.identity(), ZERO); shards.setMatrixAt(i, M); return; }
  Q.setFromEuler(E.set(rx, ry, rz));
  M.compose(pos, Q, SC.setScalar(Math.max(s, 0.0001)));
  shards.setMatrixAt(i, M);
}
const clamp01 = t => Math.min(Math.max(t, 0), 1);
// перелёт с возвратом: деталь пазла чуть проскакивает место и защёлкивается
const back = t => { const c = 1.9, u = t - 1; return 1 + (c + 1) * u * u * u + c * u * u; };

// ---------- Сценарий ----------
let t0 = 0;                         // старт сборки заголовка
const INTRO = 1.32;                 // осколки на месте; дальше видим настоящий текст
const events = [];                  // буква → плашка
let nextEmit = 0, born = 0, introDone = false, shineAt = 0;

function emit(now, forceLetter) {
  const p = plates[born];
  if (!p || !letters.length) return;
  // буквы первой строки чаще: они ближе к рою на десктопе
  const pool = letters.filter(L => L.count > 6 && !L.busy);
  if (!pool.length) return;
  const L = forceLetter && !forceLetter.busy ? forceLetter : pool[(Math.random() * pool.length) | 0];
  L.busy = true;
  const c = toWorld(L.cx, L.cy);
  // плашка рождается рядом с буквой, ближе к зрителю, и уходит в рой
  const C = new THREE.Vector3(c.x + W * 0.35, c.y - 0.15, 2.2);
  const cols = Math.max(2, Math.round(Math.sqrt(L.count * W / H)));
  const rows = Math.ceil(L.count / cols);
  for (let k = 0; k < L.count; k++) {
    const u = (k % cols + .5) / cols - .5, v = ((k / cols | 0) + .5) / rows - .5;
    tgt.set([C.x + u * W * 0.96, C.y - v * H * 0.9, C.z + D / 2], (L.start + k) * 3);
  }
  events.push({ L, p, C, cols, rows, t: now });
  p.born = -2; // зарезервирована
  born++;
  L.el.classList.add('gone');
}

function runIntro(now) {
  const t = (now - t0) / 1000;
  const hide = clamp01((t - INTRO) / 0.35);
  for (let i = 0; i < S; i++) {
    const j = i * 3;
    const d = 0.044 + (home[j] / view.w + .5) * 0.53 + seed[j] * 0.176;
    const e = back(clamp01((t - d) / 0.48));
    const sw = Math.sin(e * Math.PI) * 0.6;
    P.set(scatter[j] + (home[j] - scatter[j]) * e + Math.cos(seed[j + 1] * 6.28) * sw,
      scatter[j + 1] + (home[j + 1] - scatter[j + 1]) * e + Math.sin(seed[j + 1] * 6.28) * sw,
      scatter[j + 2] * (1 - e));
    const r = (1 - e) * 6;
    setInst(i, P, seed[j] * r, seed[j + 1] * r, seed[j + 2] * r, (0.3 + e * 0.7) * (1 - hide));
  }
  letters.forEach(L => {
    for (let k = 0; k < L.count; k++) {
      const i = L.start + k, j = i * 3;
      const d = 0.044 + (home[j] / view.w + .5) * 0.53 + seed[j] * 0.176;
      const e = clamp01((t - d - 0.13) / 0.35);
      shards.setColorAt(i, COL.copy(PEARL).lerp(L.muted ? MUTED : INK, e));
    }
  });
  shards.instanceColor.needsUpdate = true;
  if (t > INTRO - 0.15) h1.classList.add('ready');
  if (hide >= 1) {
    for (let i = 0; i < S; i++) setInst(i, null);
    introDone = true; nextEmit = now + 120;
    shards.castShadow = true; // осколки в полёте к плашке отбрасывают тень
  }
}

// Плашка собирается пазлом: осколки влетают волной слева направо по ячейкам плашки,
// каждый с перелётом и щелчком на месте, поворот доворачивается четвертями.
const HOLD = 0.035, FLY = 0.26, SWEEP = 0.21, CLICK = 0.105;
function runEvent(ev, now) {
  const t = (now - ev.t) / 1000, L = ev.L;
  const fade = clamp01((t - 0.65) / 0.14);
  for (let k = 0; k < L.count; k++) {
    const i = L.start + k, j = i * 3;
    const lag = HOLD + (k % ev.cols) / ev.cols * SWEEP + (k / ev.cols | 0) / ev.rows * 0.044 + seed[j] * 0.035;
    const f = clamp01((t - lag) / FLY), pe = back(f);
    const hx = home[j], hy = home[j + 1], tx = tgt[j], ty = tgt[j + 1], tz = tgt[j + 2];
    const mx = hx + (seed[j + 1] - .5) * 1.4, my = hy + 0.6 + seed[j + 2] * 0.8, mz = 3 + seed[j] * 2.5;
    // дуга через точку перед буквой; после места проскок по прямой к цели
    const g = Math.min(pe, 1), a = 1 - g, over = pe - g;
    P.set(a * a * hx + 2 * a * g * mx + g * g * tx, a * a * hy + 2 * a * g * my + g * g * ty, 2 * a * g * mz + g * g * tz - over * 0.6);
    // щелчок: короткий толчок вглубь и раздув при посадке
    const land = clamp01((t - lag - FLY) / CLICK), click = Math.sin(land * Math.PI);
    P.z -= click * 0.12;
    const q = 1 - Math.min(pe, 1);
    const turn = ((seed[j + 2] * 4 | 0) + 1) * Math.PI / 2;
    setInst(i, P, seed[j] * 3 * q, seed[j + 1] * 3 * q, turn * q, (1 - fade) * (1 + Math.sin(f * Math.PI) * 0.8 + click * 0.35));
    shards.setColorAt(i, COL.copy(L.muted ? MUTED : INK).lerp(PEARL, clamp01(f * 2.5)));
  }
  shards.instanceColor.needsUpdate = true;
  const p = ev.p;
  if (t >= 0.62 && p.born < 0) {
    p.born = now; p.pos.copy(ev.C); p.vel.copy(swarm).sub(ev.C).setLength(4); p.g.visible = true;
  }
  if (t >= 0.4 && !ev.back) {
    ev.back = true;
    L.el.classList.remove('gone');
    shine(L.el);
  }
  if (fade >= 1) {
    for (let k = 0; k < L.count; k++) setInst(L.start + k, null);
    L.busy = false;
    return true;
  }
  return false;
}

function shine(el, delay = 0) {
  el.classList.remove('shine');
  void el.offsetWidth;
  el.style.animationDelay = delay + 'ms';
  el.classList.add('shine');
  clearTimeout(el._sh);
  el._sh = setTimeout(() => { el.classList.remove('shine'); el.style.animationDelay = ''; }, 1400 + delay);
}

// Наведение на букву: она переливается
h1.addEventListener('pointerover', e => { if (e.target.classList?.contains('l') && !e.target.classList.contains('gone')) shine(e.target); });

const mouse = new THREE.Vector3(999, 999, 0);
addEventListener('pointermove', e => toWorld(e.clientX, e.clientY, mouse));
addEventListener('pointerleave', () => mouse.set(999, 999, 0));

const hero = document.getElementById('hero');
const tg = document.getElementById('tg');
const steps = [...document.querySelectorAll('.phase i')];
const progress = () => { const r = hero.getBoundingClientRect(), range = r.height - innerHeight; return range > 0 && Number.isFinite(range) ? clamp01(-r.top / range) : 0; };
const ss = (a, b, x) => THREE.MathUtils.smoothstep(x, a, b);
const tmp = new THREE.Vector3(), slot = new THREE.Vector3();
let last = performance.now(), sp = 0;

function frame(now) {
  const dt = Math.min((now - last) / 1000, 1 / 30); last = now;
  const target = reduce ? 0.72 : progress();
  sp += (target - sp) * (reduce ? 1 : 0.12);

  if (!introDone && shards) { runIntro(now); shards.instanceMatrix.needsUpdate = true; }
  else if (shards) {
    const gap = born < 6 ? 245 : 460;
    if (born < N && sp > 0.04) {
      // начал листать раньше, чем родились все плашки: остальные проявляются сразу в рою, без разлёта букв
      for (; born < N; born++) { const p = plates[born]; p.born = now - Math.random() * 300; p.pos.copy(swarm).add(tmp.set((Math.random() - .5) * 4, (Math.random() - .5) * 3, 0)); p.g.visible = true; }
    } else if (born < N && now > nextEmit && events.length < 3) { emit(now); nextEmit = now + gap; }
    for (let k = events.length - 1; k >= 0; k--) if (runEvent(events[k], now)) events.splice(k, 1);
    if (born >= N && !events.length && now > shineAt) {
      // редкая волна перелива по всему заголовку
      letters.forEach((L, i) => shine(L.el, i * 28));
      shineAt = now + 7000;
    }
    shards.instanceMatrix.needsUpdate = true;
  }

  const order = ss(0.08, 0.3, sp), flow = ss(0.24, 0.8, sp), botIn = ss(0.2, 0.34, sp);
  const spread = mobile ? 0.8 : 1;
  const live = plates.filter(p => p.born > 0);
  live.forEach((p, i) => {
    const age = (now - p.born) / 1000;
    tmp.copy(swarm).sub(p.pos).multiplyScalar(0.9 + 1.6 * (1 - Math.min(age / 2, 1)));
    p.vel.addScaledVector(tmp, dt);
    for (let j = i + 1; j < live.length; j++) {
      const q = live[j];
      tmp.copy(p.pos).sub(q.pos); tmp.y *= 2.2;
      const d = tmp.length();
      if (d < 3.4 * spread && d > 0.001) { tmp.multiplyScalar((3.4 * spread - d) * 2.2 * dt / d); p.vel.add(tmp); q.vel.sub(tmp); }
    }
    tmp.copy(p.pos).sub(mouse); tmp.z = 0;
    const md = tmp.length();
    if (md < 3.2) p.vel.addScaledVector(tmp.normalize(), (3.2 - md) * 14 * dt);
    // На телефоне стена включается сразу после отскока и жёстче: иначе молодые плашки висят на кнопке Telegram
    if (age > (mobile ? 0.35 : 1.2)) {
      const left = p.pos.x - W * 0.5 * (mobile ? 0.62 : 1), top = p.pos.y + H * 0.5;
      if (left < wall.x) p.vel.x += (wall.x - left) * 9 * dt;
      if (top > wall.y) p.vel.y -= (top - wall.y) * (mobile ? 30 : 9) * dt;
    }
    p.vel.z += -p.pos.z * 0.8 * dt;
    p.vel.multiplyScalar(0.94);
    p.pos.addScaledVector(p.vel, dt * 2.2);

    const k = plates.indexOf(p) / N;
    const s = k * 1.1 - flow * 1.25;
    slot.copy(botPos).addScaledVector(lineDir, 1.8 + Math.max(s, 0) * view.h * (mobile ? 0.85 : 1.6));
    if (s < 0) slot.copy(botPos);
    const w = reduce ? 1 : order;
    tmp.lerpVectors(p.pos, slot, w);
    p.g.position.copy(tmp);
    if (w > 0.5) p.pos.lerp(slot, 0.05);

    const grow = reduce ? 1 : back(clamp01(age / 0.28));
    const absorbed = clamp01(-s * 8);
    const sc = grow * (1 - absorbed) * (1 - order * 0.35) * (mobile ? 0.62 : 1);
    p.g.scale.set(Math.max(sc, 1e-4), Math.max(sc * (0.6 + grow * 0.4), 1e-4), Math.max(sc, 1e-4));
    p.g.visible = sc > 0.01;
    p.faceMat.opacity = reduce ? 1 : clamp01((age - 0.044) / 0.16);
    // плёнка переливается: толщина гуляет, у новорождённой сильнее
    const flash = 1 - clamp01(age / 1.6);
    const th = 380 + Math.sin(now * 0.0011 + p.ph) * 160 + flash * 260;
    p.mat.iridescenceThicknessRange[0] = th - 180; p.mat.iridescenceThicknessRange[1] = th + 260;
    p.mat.iridescence = 0.75 + flash * 0.25;

    const free = (1 - order) * Math.min(age / 1.5, 1);
    p.g.rotation.set(
      p.rot.x * free + p.vel.y * 0.08,
      p.rot.y * free + Math.sin(now * 0.0004 + p.ph) * 0.15 * free - p.vel.x * 0.05,
      p.rot.z * free + p.spin * Math.sin(now * 0.0003 + p.ph) * free);
  });

  bot.position.copy(botPos);
  const doneK = ss(0.82, 0.9, sp);
  bot.scale.setScalar(Math.max(botIn * (mobile ? 0.6 - doneK * 0.25 : 1), 0.0001));
  if (mobile) bot.position.y += doneK * view.h * 0.03;
  bot.rotation.y = Math.sin(now * 0.0006) * 0.35;
  bot.rotation.x = Math.sin(now * 0.0005) * 0.15;
  ring.rotation.set(0.25, -0.2, now * 0.001);
  ringMat.emissiveIntensity = 0.5 + Math.sin(now * 0.008) * 0.3 * flow * (1 - ss(0.75, 0.85, sp));

  const done = sp > 0.84 || reduce;
  tg.classList.toggle('on', done);
  steps.forEach((el, n) => el.classList.toggle('on', n === (done ? 2 : sp > 0.18 ? 1 : 0)));

  renderer.render(scene, camera);
  if (!reduce || now < stillUntil) requestAnimationFrame(frame);
}
let stillUntil = 0;

layout();
await fonts;
layout(); // шрифты меняют переносы, а с ними низ подписи под кнопкой
// подписи плашек перерисовываем, когда Manrope точно загружен
await Promise.race([document.fonts.load('700 42px Manrope', 'Сколько'), new Promise(r => setTimeout(r, 800))]);
plates.forEach((p, i) => { p.faceMat.map?.dispose(); p.faceMat.map = label(MSG[i % MSG.length], CH[i % CH.length]); p.faceMat.needsUpdate = true; });
letters = split();
if (reduce) {
  h1.classList.add('ready');
  plates.forEach((p, i) => { p.born = 1; p.faceMat.opacity = 1; p.pos.copy(swarm).add(new THREE.Vector3((i % 4 - 1.5) * 2, (i / 4 | 0) - 1, 0)); p.g.visible = true; });
  born = N;
  stillUntil = performance.now() + 1200; // статичный кадр, несколько кадров на загрузку текстур
  requestAnimationFrame(frame);
  addEventListener('resize', () => { layout(); frame(performance.now()); });
} else {
  buildShards();
  t0 = performance.now();
  addEventListener('resize', () => {
    layout();
    // после изменения размера переснимаем глифы; текущие полёты сбрасываем
    events.forEach(ev => { ev.L.el.classList.remove('gone'); ev.L.busy = false; if (ev.p.born < 0) { ev.p.born = performance.now(); ev.p.pos.copy(ev.C); ev.p.g.visible = true; } });
    events.length = 0;
    buildShards();
    if (!introDone) { introDone = true; h1.classList.add('ready'); for (let i = 0; i < S; i++) setInst(i, null); }
  });
  requestAnimationFrame(frame);
}
