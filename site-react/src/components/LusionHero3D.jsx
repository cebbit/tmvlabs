import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export function LusionHero3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const width = container.clientWidth || 1200;
    const height = container.clientHeight || 580;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0d0f14');

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0, 10.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Studio metallic reflections (zero external HDRI load time)
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;

    // Dramatic studio lighting (pure cobalt blue + crisp white, zero violet)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(6, 8, 9);
    scene.add(keyLight);

    const cobaltLight = new THREE.PointLight(0x1040ff, 22, 24);
    cobaltLight.position.set(-4.5, -2.5, 4.5);
    scene.add(cobaltLight);

    const cyanRim = new THREE.PointLight(0x38bdf8, 14, 22);
    cyanRim.position.set(5.2, 3.2, 3.5);
    scene.add(cyanRim);

    const sculptureGroup = new THREE.Group();
    scene.add(sculptureGroup);

    // 1. Extravagant Liquid-Chrome Kinetic Core (smooth indexed sphere, deforms live in 3D)
    const coreGeo = new THREE.SphereGeometry(2.15, 96, 64);
    const posAttr = coreGeo.attributes.position;
    const basePos = new Float32Array(posAttr.array.length);
    basePos.set(posAttr.array);

    const coreMat = new THREE.MeshPhysicalMaterial({
      color: '#dce8ff',
      metalness: 0.96,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      envMapIntensity: 1.7,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    sculptureGroup.add(coreMesh);

    // 2. Three Precision Gyroscopic 3D Rings (Cobalt, Obsidian, Titanium)
    const ringConfigs = [
      { r: 3.15, tube: 0.065, color: '#1034ff', metal: 0.35, rough: 0.14, rot: [0.6, 0.2, 0] },
      { r: 3.65, tube: 0.045, color: '#e5eaf5', metal: 0.92, rough: 0.12, rot: [-0.7, 0.5, 0.4] },
      { r: 4.1, tube: 0.055, color: '#1c2333', metal: 0.85, rough: 0.18, rot: [0.25, -0.8, 0.6] },
    ];
    const rings = ringConfigs.map((cfg) => {
      const geo = new THREE.TorusGeometry(cfg.r, cfg.tube, 24, 120);
      const mat = new THREE.MeshPhysicalMaterial({
        color: cfg.color,
        metalness: cfg.metal,
        roughness: cfg.rough,
        clearcoat: 1.0,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.set(...cfg.rot);
      sculptureGroup.add(mesh);
      return { mesh, geo, mat };
    });

    // 3. Orbiting Faceted Cobalt & Chrome Shards (respond physically to cursor & click)
    const shardGeo = new THREE.OctahedronGeometry(0.32, 0);
    const shardBlueMat = new THREE.MeshPhysicalMaterial({
      color: '#1034ff',
      metalness: 0.25,
      roughness: 0.12,
      clearcoat: 1.0,
    });
    const shardChromeMat = new THREE.MeshPhysicalMaterial({
      color: '#eef3ff',
      metalness: 0.96,
      roughness: 0.08,
    });

    const shardCount = width < 720 ? 8 : 12;
    const shards = [];
    for (let i = 0; i < shardCount; i++) {
      const mesh = new THREE.Mesh(shardGeo, i % 2 === 0 ? shardBlueMat : shardChromeMat);
      const angle = (i / shardCount) * Math.PI * 2;
      const dist = 3.1 + (i % 3) * 0.62;
      const yOff = ((i % 5) - 2) * 0.55;
      mesh.scale.setScalar(0.7 + (i % 4) * 0.26);
      sculptureGroup.add(mesh);
      shards.push({
        mesh,
        angle,
        baseDist: dist,
        dist,
        yOff,
        speed: (i % 2 === 0 ? 1 : -1) * (0.28 + (i % 3) * 0.1),
        boost: 0,
      });
    }

    // Pointer tracking
    const targetMouse = new THREE.Vector2(0, 0);
    const smoothMouse = new THREE.Vector2(0, 0);
    let pulseEnergy = 0;

    const onPointerMove = (e) => {
      const r = renderer.domElement.getBoundingClientRect();
      targetMouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      targetMouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    };
    const onPointerLeave = () => {
      targetMouse.set(0, 0);
    };
    const onClick = () => {
      if (reduce) return;
      pulseEnergy = 1.0;
      for (const s of shards) s.boost = 1.45;
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerleave', onPointerLeave);
    renderer.domElement.addEventListener('click', onClick);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let rafId = 0;

    const animate = () => {
      const t = clock.getElapsedTime();

      if (!reduce) {
        smoothMouse.lerp(targetMouse, 0.06);
        pulseEnergy *= 0.93;

        // Kinetic vertex wave deformation on liquid-chrome core
        const amp = 0.24 + pulseEnergy * 0.22 + Math.hypot(smoothMouse.x, smoothMouse.y) * 0.08;
        const arr = posAttr.array;
        for (let i = 0; i < arr.length; i += 3) {
          const bx = basePos[i];
          const by = basePos[i + 1];
          const bz = basePos[i + 2];
          const len = Math.sqrt(bx * bx + by * by + bz * bz) || 1;
          const nx = bx / len;
          const ny = by / len;
          const nz = bz / len;

          const wave =
            Math.sin(nx * 2.8 + t * 1.45 + smoothMouse.x * 2.2) *
            Math.cos(ny * 2.6 - t * 1.2 + smoothMouse.y * 2.2) *
            Math.sin(nz * 2.4 + t * 0.9);

          const scale = 1 + wave * amp;
          arr[i] = bx * scale;
          arr[i + 1] = by * scale;
          arr[i + 2] = bz * scale;
        }
        posAttr.needsUpdate = true;
        coreGeo.computeVertexNormals();

        // Subtle sculptural tilt toward cursor
        sculptureGroup.rotation.y = smoothMouse.x * 0.45 + t * 0.14;
        sculptureGroup.rotation.x = -smoothMouse.y * 0.32 + Math.sin(t * 0.4) * 0.08;

        // Gyroscopic rings motion
        rings[0].mesh.rotation.z = t * 0.32;
        rings[0].mesh.rotation.x = 0.6 + smoothMouse.y * 0.35;
        rings[1].mesh.rotation.y = -t * 0.26;
        rings[2].mesh.rotation.x = 0.25 + t * 0.2;

        // Shards orbit & spring back after click
        for (const s of shards) {
          s.boost *= 0.92;
          const curDist = s.baseDist + s.boost;
          const a = s.angle + t * s.speed;
          s.mesh.position.set(
            Math.cos(a) * curDist,
            s.yOff + Math.sin(t * 1.3 + s.angle) * 0.35,
            Math.sin(a) * curDist
          );
          s.mesh.rotation.x = t * 0.9 + s.angle;
          s.mesh.rotation.y = t * 0.7;
        }
      }

      renderer.render(scene, camera);
      if (!reduce) rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
      renderer.domElement.removeEventListener('click', onClick);
      coreGeo.dispose();
      coreMat.dispose();
      rings.forEach((r) => {
        r.geo.dispose();
        r.mat.dispose();
      });
      shardGeo.dispose();
      shardBlueMat.dispose();
      shardChromeMat.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="relative h-full w-full cursor-pointer"
      aria-label="Кинетическая 3D-скульптура TMV Labs"
    />
  );
}
