// Знак TMV Labs из осколков: те же плитки, материал и свет, что в первом экране B.
// Плитки слетаются в букву (или слово TMV), затем одна вырывается и становится перламутровой плашкой.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.getElementById('c');

// Сетки совпадают с assets/logo/*.svg: 1 = плитка, p = плитка, которая станет плашкой.
const SHAPES = {
  mark: { rows: ['111', '010', '01p'], pop: [0.14, 0.14] },
  word: {
    rows: ['111 10001 1000p', '010 11011 10001', '010 10101 10001', '010 10001 01010', '010 10001 00100'].map(r => r.replace(/ /g, '0')),
    pop: [0.16, 0.2],
  },
};

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
camera.position.set(0, 0, 16);
const key = new THREE.DirectionalLight(0xffffff, 1.5);
key.position.set(4, 8, 10);
key.castShadow = true;
key.shadow.mapSize.setScalar(1024);
key.shadow.radius = 10; key.shadow.blurSamples = 16; key.shadow.bias = -0.0004;
Object.assign(key.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10, near: 1, far: 40 });
const rim = new THREE.DirectionalLight(0xdfe8ff, 0.8); rim.position.set(-8, -3, 6);
const bounce = new THREE.DirectionalLight(0xfff0dc, 0.35); bounce.position.set(1, -7, 5);
scene.add(key, rim, bounce, new THREE.AmbientLight(0xffffff, 0.4));
const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 40), new THREE.ShadowMaterial({ color: 0x2b2416, opacity: 0.16 }));
ground.position.z = -0.9; ground.receiveShadow = true;
scene.add(ground);

const tileGeo = new RoundedBoxGeometry(0.86, 0.86, 0.34, 4, 0.16);
const inkMat = new THREE.MeshPhysicalMaterial({
  color: 0x151515, roughness: 0.32, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.2,
  iridescence: 0.45, iridescenceIOR: 1.5, iridescenceThicknessRange: [150, 900],
});
// тот же градиент, что у плитки в assets/logo/*.svg, плёнка поверх даёт живой перелив
const pearlTex = (() => {
  const cv = document.createElement('canvas'); cv.width = cv.height = 128;
  const g = cv.getContext('2d'), gr = g.createLinearGradient(0, 0, 128, 128);
  [['0', '#6fd3ff'], ['.38', '#b59bff'], ['.68', '#ffb7d5'], ['1', '#ffe08a']].forEach(([o, c]) => gr.addColorStop(+o, c));
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
})();
const pearlMat = new THREE.MeshPhysicalMaterial({
  map: pearlTex,
  // плёнка толще и с большим IOR, чем у плашек первого экрана: на одной плитке перелив должен читаться сразу
  color: 0xffffff, roughness: 0.14, metalness: 0.15, clearcoat: 1, clearcoatRoughness: 0.05,
  iridescence: 0.7, iridescenceIOR: 1.6, iridescenceThicknessRange: [300, 1100],
});

const group = new THREE.Group();
scene.add(group);
let tiles = [], pearl = null, t0 = 0, shape = 'mark';

function build(name) {
  shape = name;
  group.clear();
  const { rows, pop } = SHAPES[name];
  const cols = rows[0].length, nr = rows.length;
  tiles = [];
  rows.forEach((row, r) => [...row].forEach((v, c) => {
    if (v === '0') return;
    const m = new THREE.Mesh(tileGeo, v === 'p' ? pearlMat : inkMat);
    m.castShadow = true;
    const home = new THREE.Vector3(c - (cols - 1) / 2, -(r - (nr - 1) / 2), 0);
    const a = Math.random() * Math.PI * 2, rr = 7 + Math.random() * 6;
    const t = {
      m, home, from: new THREE.Vector3(Math.cos(a) * rr, Math.sin(a) * rr * 0.6, 3 + Math.random() * 6),
      spin: new THREE.Vector3(Math.random() * 6, Math.random() * 6, Math.random() * 6),
      d: (c / cols) * 0.5 + Math.random() * 0.25, isPearl: v === 'p',
    };
    if (t.isPearl) { pearl = t; t.pop = new THREE.Vector3(home.x + pop[0] * 1.0 + 0.15, home.y + pop[1] * 1.6 + 0.2, 0.45); }
    tiles.push(t); group.add(m);
  }));
  // масштаб под ширину кадра
  const vh = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
  const fit = Math.min((vh * camera.aspect * 0.62) / cols, (vh * 0.62) / nr);
  group.scale.setScalar(fit);
  t0 = performance.now();
}

function resize() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
  build(shape);
}

const ease = t => 1 - Math.pow(1 - t, 3);
const easeIO = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const clamp01 = t => Math.min(Math.max(t, 0), 1);
const mouse = new THREE.Vector2();
let hover = 0, hoverT = 0;
canvas.addEventListener('pointermove', e => {
  const r = canvas.getBoundingClientRect();
  mouse.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height * 2 - 1));
  hoverT = 1;
});
canvas.addEventListener('pointerleave', () => { mouse.set(0, 0); hoverT = 0; });
const P = new THREE.Vector3();

function frame(now) {
  const t = reduce ? 99 : (now - t0) / 1000;
  hover += (hoverT - hover) * 0.08;
  for (const k of tiles) {
    const e = easeIO(clamp01((t - k.d) / 1.1));
    P.lerpVectors(k.from, k.home, e);
    const r = (1 - e);
    k.m.rotation.set(k.spin.x * r, k.spin.y * r, k.spin.z * r);
    if (k.isPearl) {
      // через 0,4 с после сборки плитка вырывается вперёд и вверх, потом дышит; при наведении выходит дальше
      const out = ease(clamp01((t - 2.0) / 0.7));
      P.lerp(k.pop, out);
      P.z += out * (Math.sin(now * 0.0018) * 0.08 + hover * 0.5);
      k.m.rotation.x += out * (-0.25 + Math.sin(now * 0.0011) * 0.08);
      k.m.rotation.y += out * (0.35 + Math.sin(now * 0.0009) * 0.1);
      const th = 650 + Math.sin(now * 0.0011) * 250 + (1 - clamp01((t - 2.0) / 1.6)) * 300;
      pearlMat.iridescenceThicknessRange[0] = th - 350; pearlMat.iridescenceThicknessRange[1] = th + 450;
    } else {
      // лёгкая волна по плиткам после сборки, как перелив по заголовку
      const wave = Math.max(0, Math.sin((now * 0.0012) - k.home.x * 0.6 + k.home.y * 0.3));
      P.z += clamp01(t - 1.8) * Math.pow(wave, 8) * 0.12;
    }
    k.m.position.copy(P);
  }
  inkMat.iridescenceThicknessRange[1] = 700 + Math.sin(now * 0.0007) * 200;
  group.rotation.y += ((mouse.x * 0.35) - group.rotation.y) * 0.06;
  group.rotation.x += ((-mouse.y * 0.25) - group.rotation.x) * 0.06;
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

document.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('.tabs button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  build(b.dataset.m);
}));
const q = new URLSearchParams(location.search).get('m');
if (q === 'word') document.querySelector('[data-m="word"]').click();
addEventListener('resize', resize);
resize();
requestAnimationFrame(frame);
