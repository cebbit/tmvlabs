// Блок 2 «Экран собирается из блоков» (как igloo).
// Каждый блок экрана (сообщение, строка прайса, столбик графика) собирается пазлом из плиток и подменяется настоящей вёрсткой.
// При смене услуги те же плитки срываются с мест и перестраиваются в следующий экран; лишние улетают к зрителю, недостающие прилетают издалека.
// Темп пазла как в hero-b, принят Максимом 19.11: блок 0,62 с, волна слева направо, плитка 0,26 с с перелётом и щелчком.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.getElementById('c');
const scrs = [...document.querySelectorAll('.scr')];
if (reduce) throw new Error('reduced motion: экраны переключаются без сборки');

// без WebGL конструктор бросит ошибку, класса gl не будет, ui.js просто проявляет блоки
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
document.documentElement.classList.add('gl');

const mobile = innerWidth < 760;
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
const bounce = new THREE.DirectionalLight(0xfff0dc, 0.35);
bounce.position.set(1, -7, 5);
scene.add(key, rim, bounce, new THREE.AmbientLight(0xffffff, 0.5));

// Мягкая тень от плиток в полёте, как в hero-b. Когда экран собран, плиток нет, тень дают сами блоки (CSS).
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
key.castShadow = true;
key.shadow.mapSize.setScalar(mobile ? 1024 : 2048);
key.shadow.radius = mobile ? 8 : 12;
key.shadow.blurSamples = 16;
key.shadow.bias = -0.0004;
key.shadow.camera.near = 1; key.shadow.camera.far = 40;
const ground = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.ShadowMaterial({ color: 0x2b2416, opacity: 0.12 }));
ground.position.z = -1.3;
ground.receiveShadow = true;
scene.add(ground);

let view = { w: 10, h: 6 }, cw = 1, ch = 1;
function layout() {
  cw = canvas.clientWidth; ch = canvas.clientHeight;
  renderer.setSize(cw, ch, false);
  camera.aspect = cw / ch; camera.updateProjectionMatrix();
  const vh = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
  view = { w: vh * camera.aspect, h: vh };
  ground.scale.set(view.w * 1.4, view.h * 1.4, 1);
  const sc = key.shadow.camera, half = Math.max(view.w, view.h) * 0.75;
  sc.left = -half; sc.right = half; sc.top = half; sc.bottom = -half; sc.updateProjectionMatrix();
}
const k = () => view.w / cw; // css px в мир

// ---------- Плитки ----------
const MAXT = 1400;
const geo = new RoundedBoxGeometry(1, 1, 1, 2, 0.14);
const mat = new THREE.MeshPhysicalMaterial({
  color: 0xffffff, roughness: 0.26, metalness: 0.08, clearcoat: 1, clearcoatRoughness: 0.12,
  iridescence: 0.9, iridescenceIOR: 1.4, iridescenceThicknessRange: [180, 700],
});
const tiles = new THREE.InstancedMesh(geo, mat, MAXT);
tiles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
tiles.frustumCulled = false;
tiles.castShadow = true;
scene.add(tiles);

// состояние плитки: 0 не нужна, 1 летит, 2 на месте (её закрывает настоящий блок)
const st = new Uint8Array(MAXT);
const cur = new Float32Array(MAXT * 5);  // x, y, z, sx, sy: где плитка сейчас
const from = new Float32Array(MAXT * 5), to = new Float32Array(MAXT * 5);
const lag = new Float32Array(MAXT), seed = new Float32Array(MAXT * 3), leave = new Uint8Array(MAXT);
const cFrom = [], cTo = [], cCur = [];
for (let i = 0; i < MAXT; i++) {
  seed.set([Math.random(), Math.random(), Math.random()], i * 3);
  cFrom.push(new THREE.Color()); cTo.push(new THREE.Color()); cCur.push(new THREE.Color('#ffffff'));
}
const PEARL = new THREE.Color('#ffffff');

const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), P = new THREE.Vector3(), SC = new THREE.Vector3();
function hide(i) { M.compose(P.set(0, 0, -50), Q.identity(), SC.setScalar(0.0001)); tiles.setMatrixAt(i, M); }
for (let i = 0; i < MAXT; i++) hide(i);
const clamp01 = t => Math.min(Math.max(t, 0), 1);
const back = t => { const c = 1.9, u = t - 1; return 1 + (c + 1) * u * u * u + c * u * u; };

// Раскладка экрана в плитки: каждый блок режется на ячейки около cell px, плитка берёт цвет фона блока.
function targets(s) {
  const cr = canvas.getBoundingClientRect();
  const fw = scrs[s].getBoundingClientRect().width;
  const blocks = [...scrs[s].querySelectorAll('.b')].map(el => ({ el, r: el.getBoundingClientRect() }));
  blocks.sort((a, b) => (a.r.top - b.r.top) || (a.r.left - b.r.left));
  let cell = fw / (mobile ? 15 : 19);
  const area = blocks.reduce((a, b) => a + b.r.width * b.r.height, 0);
  if (area / (cell * cell) > MAXT * 0.95) cell = Math.sqrt(area / (MAXT * 0.95));
  const out = [];
  blocks.forEach((b, bi) => {
    const cols = Math.max(1, Math.round(b.r.width / cell)), rows = Math.max(1, Math.round(b.r.height / cell));
    const tw = b.r.width / cols, th = b.r.height / rows;
    const col = new THREE.Color(getComputedStyle(b.el).backgroundColor);
    b.n = 0;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      out.push({
        x: (b.r.left - cr.left + (c + .5) * tw), y: (b.r.top - cr.top + (r + .5) * th),
        w: tw * 0.9, h: th * 0.9, col, bi, c, r, cols, rows,
      });
      b.n++;
    }
  });
  return { list: out, blocks };
}

// ---------- Сценарий ----------
const HOLD = 0.035, FLY = 0.26, SWEEP = 0.21, CLICK = 0.105, GAP = 0.07, FADE = 0.12;
let tr = null;          // текущая перестройка
let shown = -1;         // какой экран сейчас стоит

function toW(x, y) { return [(x / cw - .5) * view.w, -(y / ch - .5) * view.h]; }

function start(s) {
  if (s < 0 || s >= scrs.length) return;
  const now = performance.now();
  // прерванная перестройка: плитки стартуют оттуда, где они сейчас
  document.querySelectorAll('.b.on').forEach(el => el.classList.remove('on'));
  const T = targets(s);
  const n = Math.min(T.list.length, MAXT);
  const kk = k();
  const blockEnd = T.blocks.map((b, bi) => bi * GAP + HOLD + SWEEP + 0.044 + 0.035 + FLY + CLICK * 0.5);
  for (let i = 0; i < MAXT; i++) {
    const j = i * 5;
    const had = st[i] !== 0;
    if (i < n) {
      const t = T.list[i];
      const [wx, wy] = toW(t.x, t.y);
      if (had) from.set(cur.subarray(j, j + 5), j);
      else {
        // недостающие плитки прилетают издалека, из тумана за спиной зрителя
        const a = seed[i * 3] * Math.PI * 2, rr = 5 + seed[i * 3 + 1] * 9;
        from.set([wx + Math.cos(a) * rr, wy + Math.sin(a) * rr * 0.6, 5 + seed[i * 3 + 2] * 8, t.w * kk * 0.3, t.h * kk * 0.3], j);
        cFrom[i].copy(PEARL);
      }
      if (had) cFrom[i].copy(cCur[i]);
      to.set([wx, wy, 0, t.w * kk, t.h * kk], j);
      cTo[i].copy(t.col);
      lag[i] = t.bi * GAP + HOLD + t.c / t.cols * SWEEP + t.r / t.rows * 0.044 + seed[i * 3] * 0.035;
      leave[i] = 0; st[i] = 1;
    } else if (had) {
      // лишние плитки улетают к зрителю и тают
      from.set(cur.subarray(j, j + 5), j);
      to.set([cur[j] + (seed[i * 3] - .5) * 6, cur[j + 1] + (seed[i * 3 + 1] - .2) * 4, 7 + seed[i * 3 + 2] * 5, 0, 0], j);
      cFrom[i].copy(cCur[i]); cTo[i].copy(PEARL);
      lag[i] = seed[i * 3 + 1] * 0.18;
      leave[i] = 1; st[i] = 1;
    }
  }
  tr = { t0: now, n, blocks: T.blocks, blockEnd, s, end: Math.max(...blockEnd) + FADE + 0.05 };
  shown = s;
  wake();
}

function step(now) {
  if (!tr) return false;
  const t = (now - tr.t0) / 1000;
  for (let i = 0; i < MAXT; i++) {
    if (st[i] !== 1) continue;
    const j = i * 5;
    const f = clamp01((t - lag[i]) / FLY), pe = back(f), g = Math.min(pe, 1), a = 1 - g, over = pe - g;
    const fx = from[j], fy = from[j + 1], fz = from[j + 2], tx = to[j], ty = to[j + 1], tz = to[j + 2];
    // дуга к зрителю и обратно: плитка отрывается от старого места, проходит перед экраном и садится на новое
    const mx = (fx + tx) / 2 + (seed[i * 3 + 1] - .5) * 1.2, my = (fy + ty) / 2 + 0.5 + seed[i * 3 + 2] * 0.7;
    const mz = Math.max(fz, tz) * 0.5 + 2.5 + seed[i * 3] * 2;
    P.set(a * a * fx + 2 * a * g * mx + g * g * tx, a * a * fy + 2 * a * g * my + g * g * ty, a * a * fz + 2 * a * g * mz + g * g * tz - over * 0.6);
    const land = clamp01((t - lag[i] - FLY) / CLICK), click = leave[i] ? 0 : Math.sin(land * Math.PI);
    P.z -= click * 0.12;
    let sx = from[j + 3] + (to[j + 3] - from[j + 3]) * g, sy = from[j + 4] + (to[j + 4] - from[j + 4]) * g;
    const puff = 1 + Math.sin(f * Math.PI) * 0.25 + click * 0.18;
    // блок проявился: его плитки быстро тают, под ними уже настоящая вёрстка
    let fade = 0;
    if (!leave[i]) {
      const b = targetBlock(i);
      fade = clamp01((t - tr.blockEnd[b]) / FADE);
    }
    sx *= puff * (1 - fade); sy *= puff * (1 - fade);
    const q = 1 - g, turn = ((seed[i * 3 + 2] * 4 | 0) + 1) * Math.PI / 2;
    Q.setFromEuler(E.set(seed[i * 3] * 2.4 * q, seed[i * 3 + 1] * 2.4 * q, turn * q));
    const depth = Math.min(Math.abs(sx), Math.abs(sy)) * 0.55;
    M.compose(P, Q, SC.set(Math.max(sx, 1e-4), Math.max(sy, 1e-4), Math.max(depth, 1e-4)));
    tiles.setMatrixAt(i, M);
    cCur[i].copy(cFrom[i]).lerp(PEARL, clamp01(f * 2.2)).lerp(cTo[i], clamp01((f - 0.45) / 0.55));
    tiles.setColorAt(i, cCur[i]);
    cur.set([P.x, P.y, Math.max(P.z, 0), to[j + 3] * (leave[i] ? 1 - g : 1), to[j + 4] * (leave[i] ? 1 - g : 1)], j);
    if (leave[i]) { if (f >= 1) { st[i] = 0; hide(i); } }
    else if (fade >= 1) { st[i] = 2; cur.set(to.subarray(j, j + 5), j); hide(i); }
  }
  tr.blocks.forEach((b, bi) => { if (t >= tr.blockEnd[bi] && !b.on) { b.on = true; b.el.classList.add('on'); } });
  tiles.instanceMatrix.needsUpdate = true;
  if (tiles.instanceColor) tiles.instanceColor.needsUpdate = true;
  if (t > tr.end + FLY + 0.3) { tr = null; return false; }
  return true;
}
// номер блока для плитки: плитки разложены по блокам подряд
function targetBlock(i) {
  let acc = 0;
  for (let b = 0; b < tr.blocks.length; b++) { acc += tr.blocks[b].n; if (i < acc) return b; }
  return tr.blocks.length - 1;
}

// плёнка переливается, пока плитки в полёте
function film(now) {
  const th = 420 + Math.sin(now * 0.0012) * 180;
  mat.iridescenceThicknessRange[0] = th - 200; mat.iridescenceThicknessRange[1] = th + 260;
}

let running = false;
function wake() { if (!running) { running = true; requestAnimationFrame(frame); } }
function frame(now) {
  film(now);
  const busy = step(now);
  renderer.render(scene, camera);
  if (busy) requestAnimationFrame(frame); else running = false; // экран собран: сцена спит, батарея не тратится
}

// Изменение размера: экран встаёт на место без анимации
function snap() {
  layout();
  if (shown < 0) return;
  tr = null;
  for (let i = 0; i < MAXT; i++) { st[i] = 0; hide(i); }
  const T = targets(shown), kk = k();
  T.list.slice(0, MAXT).forEach((t, i) => {
    const [wx, wy] = toW(t.x, t.y);
    cur.set([wx, wy, 0, t.w * kk, t.h * kk], i * 5); cCur[i].copy(t.col); st[i] = 2;
  });
  document.querySelectorAll('.b.on').forEach(el => el.classList.remove('on'));
  T.blocks.forEach(b => b.el.classList.add('on'));
  renderer.render(scene, camera);
}

layout();
await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1200))]);
tiles.setColorAt(0, PEARL); // создаёт instanceColor
addEventListener('svc-step', e => start(e.detail.to));
let rz;
addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(snap, 120); });
if (window.svcStep >= 0) start(window.svcStep);
window.servicesB = true;
