import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

function createLusionCrossGeometry() {
  const group = new THREE.Group();
  const armLen = 1.95;
  const armRad = 0.42;
  const holeRad = 0.16;

  const cylGeo = new THREE.CylinderGeometry(armRad, armRad, armLen, 28);
  const capGeo = new THREE.SphereGeometry(armRad * 0.99, 24, 16);
  const holeGeo = new THREE.CylinderGeometry(holeRad, holeRad, armLen + 0.04, 18);

  return { cylGeo, capGeo, holeGeo };
}

export function LusionHero3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const width = container.clientWidth || 1200;
    const height = container.clientHeight || 560;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#131418');

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0, 12.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Studio reflections without external HDR files (instant load)
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;

    // Soft studio lighting
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(7, 9, 10);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x4f7cff, 1.5);
    rimLight.position.set(-8, -5, 6);
    scene.add(rimLight);

    const fillLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(fillLight);

    // Materials matching Lusion's tactile glossy/matte crosses
    const mats = [
      new THREE.MeshPhysicalMaterial({
        color: '#0e2be8',
        roughness: 0.24,
        metalness: 0.08,
        clearcoat: 0.85,
        clearcoatRoughness: 0.18,
      }),
      new THREE.MeshPhysicalMaterial({
        color: '#dfe2ec',
        roughness: 0.26,
        metalness: 0.04,
        clearcoat: 0.65,
        clearcoatRoughness: 0.22,
      }),
      new THREE.MeshPhysicalMaterial({
        color: '#15171d',
        roughness: 0.16,
        metalness: 0.12,
        clearcoat: 1.0,
        clearcoatRoughness: 0.12,
      }),
    ];

    const holeMat = new THREE.MeshBasicMaterial({ color: '#090a0d' });
    const { cylGeo, holeGeo } = createLusionCrossGeometry();

    const isMobile = width < 720;
    const count = isMobile ? 12 : 18;
    const bodies = [];

    for (let i = 0; i < count; i++) {
      const mat = mats[i % 3];
      const cross = new THREE.Group();

      const mX = new THREE.Mesh(cylGeo, mat);
      mX.rotation.z = Math.PI / 2;
      const mY = new THREE.Mesh(cylGeo, mat);
      const mZ = new THREE.Mesh(cylGeo, mat);
      mZ.rotation.x = Math.PI / 2;

      const hX = new THREE.Mesh(holeGeo, holeMat);
      hX.rotation.z = Math.PI / 2;
      const hY = new THREE.Mesh(holeGeo, holeMat);
      const hZ = new THREE.Mesh(holeGeo, holeMat);
      hZ.rotation.x = Math.PI / 2;

      cross.add(mX, mY, mZ, hX, hY, hZ);

      const scale = (isMobile ? 0.88 : 1.08) + (i % 4) * 0.08;
      cross.scale.setScalar(scale);

      const angle = (i / count) * Math.PI * 2;
      const spreadX = isMobile ? 2.6 : 4.8;
      const spreadY = isMobile ? 2.2 : 2.6;
      const pos = new THREE.Vector3(
        Math.cos(angle) * spreadX * (0.4 + Math.random() * 0.65),
        Math.sin(angle) * spreadY * (0.4 + Math.random() * 0.65),
        (Math.random() - 0.5) * 3.4
      );
      cross.position.copy(pos);
      cross.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);

      scene.add(cross);
      bodies.push({
        mesh: cross,
        vel: new THREE.Vector3((Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, 0),
        rotVel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.012,
          (Math.random() - 0.5) * 0.012,
          (Math.random() - 0.5) * 0.012
        ),
        radius: 1.28 * scale,
      });
    }

    // Mouse interaction in 3D world coordinates
    const pointer = new THREE.Vector3(999, 999, 0);
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    const onPointerMove = (e) => {
      const r = renderer.domElement.getBoundingClientRect();
      ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      raycaster.ray.intersectPlane(plane, pointer);
    };

    const onPointerLeave = () => {
      pointer.set(999, 999, 0);
    };

    const onClick = () => {
      if (reduce) return;
      for (const b of bodies) {
        const dir = b.mesh.position.clone().normalize();
        b.vel.addScaledVector(dir, 0.22 + Math.random() * 0.14);
        b.rotVel.x += (Math.random() - 0.5) * 0.06;
        b.rotVel.y += (Math.random() - 0.5) * 0.06;
      }
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

    const tmpDiff = new THREE.Vector3();
    let rafId = 0;

    const animate = () => {
      if (!reduce) {
        // 1. Center gravity + pointer repulsion
        for (const b of bodies) {
          // Gentle elliptical pull to center so crosses fill the frame cleanly
          b.vel.x += -b.mesh.position.x * 0.0022;
          b.vel.y += -b.mesh.position.y * 0.0042;
          b.vel.z += -b.mesh.position.z * 0.005;

          // Pointer push
          tmpDiff.subVectors(b.mesh.position, pointer);
          const dist = tmpDiff.length();
          const pushR = 3.6;
          if (dist < pushR && dist > 0.001) {
            const force = (1 - dist / pushR) * 0.085;
            b.vel.addScaledVector(tmpDiff.normalize(), force);
            b.rotVel.x += (Math.random() - 0.5) * 0.01;
            b.rotVel.y += (Math.random() - 0.5) * 0.01;
          }
        }

        // 2. Pairwise soft collision so crosses roll over each other
        for (let i = 0; i < bodies.length; i++) {
          for (let j = i + 1; j < bodies.length; j++) {
            const a = bodies[i];
            const b = bodies[j];
            tmpDiff.subVectors(b.mesh.position, a.mesh.position);
            const dist = tmpDiff.length();
            const minDist = a.radius + b.radius;
            if (dist < minDist && dist > 0.001) {
              const overlap = (minDist - dist) * 0.045;
              tmpDiff.normalize();
              a.vel.addScaledVector(tmpDiff, -overlap);
              b.vel.addScaledVector(tmpDiff, overlap);
            }
          }
        }

        // 3. Integrate & damp
        for (const b of bodies) {
          b.vel.multiplyScalar(0.93);
          b.mesh.position.add(b.vel);

          b.rotVel.multiplyScalar(0.985);
          b.mesh.rotation.x += b.rotVel.x + 0.0025;
          b.mesh.rotation.y += b.rotVel.y + 0.0032;
          b.mesh.rotation.z += b.rotVel.z;
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
      cylGeo.dispose();
      holeGeo.dispose();
      mats.forEach((m) => m.dispose());
      holeMat.dispose();
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
      className="relative h-full w-full cursor-grab active:cursor-grabbing"
      aria-label="Интерактивная 3D-сцена TMV Labs: двигай курсором или кликни"
    />
  );
}
