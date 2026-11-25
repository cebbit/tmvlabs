import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';

/* ---------- Clerk Spotlight Card ---------- */
export function SpotlightCard({ children, className = '', ...props }) {
  const ref = useRef(null);
  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className={`spotlight-card rounded-[22px] border border-slate-900/10 bg-white shadow-[0_12px_34px_-20px_rgba(15,23,42,0.16)] transition-colors hover:border-[#2357c6]/35 hover:shadow-[0_24px_54px_-24px_rgba(35,87,198,0.28)] ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Magic UI Border Beam Card ---------- */
export function BorderBeamCard({ children, className = '', innerClassName = '' }) {
  return (
    <div className={`border-beam-wrap rounded-[26px] p-[1.5px] shadow-[0_24px_60px_-24px_rgba(35,87,198,0.32)] ${className}`}>
      <div className={`border-beam-inner h-full w-full rounded-[24.5px] bg-white ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
}

/* ---------- React Bits Magnetic Button ---------- */
export function MagneticButton({ href, children, variant = 'blue', className = '', onClick, type }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 280, damping: 18 });
  const sy = useSpring(y, { stiffness: 280, damping: 18 });

  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.16);
    y.set((e.clientY - r.top - r.height / 2) * 0.16);
  };
  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    variant === 'blue'
      ? 'shimmer-btn bg-[#2357c6] text-white border-[#2357c6] shadow-[0_14px_28px_-10px_rgba(35,87,198,0.65)] hover:bg-[#1944a5]'
      : 'bg-white text-slate-900 border-slate-900/15 hover:border-[#2357c6] hover:text-[#2357c6]';

  const cls = `inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-xl border font-extrabold text-[14px] transition-colors cursor-pointer select-none ${base} ${className}`;

  if (href) {
    const external = href.startsWith('http');
    return (
      <motion.a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        style={{ x: sx, y: sy }}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        whileTap={{ scale: 0.97 }}
        className={cls}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type || 'button'}
      onClick={onClick}
      style={{ x: sx, y: sy }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      whileTap={{ scale: 0.97 }}
      className={cls}
    >
      {children}
    </motion.button>
  );
}

/* ---------- Magic UI Number Ticker ---------- */
export function NumberTicker({ value, decimals = 0, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView) return;
    let frame;
    const duration = 1100;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) frame = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {decimals > 0 ? display.toFixed(decimals) : Math.round(display)}
      {suffix}
    </span>
  );
}

/* ---------- Magic UI Safari Mockup ---------- */
export function SafariMockup({ url, badge, children, className = '' }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-slate-900/10 bg-white shadow-sm ${className}`}>
      <div className="flex items-center justify-between gap-2 border-b border-slate-900/8 bg-slate-50/90 px-3.5 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#2357c6]" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        </div>
        <div className="truncate rounded-md bg-white px-2.5 py-0.5 text-[11px] font-bold text-slate-500 border border-slate-900/6">
          {url}
        </div>
        {badge ? (
          <span className="shrink-0 rounded-full bg-[#eef4ff] px-2.5 py-0.5 text-[10px] font-extrabold text-[#2357c6]">
            {badge}
          </span>
        ) : (
          <span className="w-8" />
        )}
      </div>
      <div className="relative overflow-hidden bg-slate-50">{children}</div>
    </div>
  );
}

/* ---------- Interactive 2D Pixel Assembly: TMV LABS ---------- */
export function PixelAssemblyCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let rafId = 0;

    const start = () => {
      const W = canvas.width;
      const H = canvas.height;
      const mask = document.createElement('canvas');
      mask.width = W;
      mask.height = H;
      const mctx = mask.getContext('2d');
      mctx.fillStyle = '#000';
      mctx.textAlign = 'center';
      mctx.textBaseline = 'middle';
      mctx.font = '900 158px Onest, Manrope, sans-serif';
      mctx.fillText('TMV', W / 2, H * 0.35);
      mctx.font = '700 102px Unbounded, Onest, sans-serif';
      mctx.fillText('LABS', W / 2, H * 0.72);

      const data = mctx.getImageData(0, 0, W, H).data;
      const step = 10;
      const size = 7.4;
      const pts = [];

      for (let y = 8; y < H - 8; y += step) {
        for (let x = 8; x < W - 8; x += step) {
          if (data[(y * W + x) * 4 + 3] > 90) {
            const isTop = y < H * 0.54;
            const spread = reduce ? 0 : 160;
            pts.push({
              ox: x,
              oy: y,
              x: x + (Math.random() - 0.5) * spread,
              y: y + (Math.random() - 0.5) * spread,
              phase: (x + y) * 0.016,
              isBlue: isTop ? Math.random() > 0.22 : Math.random() > 0.58,
            });
          }
        }
      }

      let mx = -9999;
      let my = -9999;
      const onMove = (e) => {
        const r = canvas.getBoundingClientRect();
        mx = ((e.clientX - r.left) * W) / r.width;
        my = ((e.clientY - r.top) * H) / r.height;
      };
      const onLeave = () => {
        mx = -9999;
        my = -9999;
      };
      canvas.addEventListener('pointermove', onMove);
      canvas.addEventListener('pointerleave', onLeave);

      const draw = (now = 0) => {
        ctx.clearRect(0, 0, W, H);
        const t = now * 0.0022;
        for (const p of pts) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.hypot(dx, dy);
          const radius = 128;
          let tx = p.ox;
          let ty = p.oy;
          if (!reduce) {
            tx += Math.sin(t + p.phase) * 1.8;
            ty += Math.cos(t * 0.9 + p.phase) * 1.8;
          }
          if (dist < radius && dist > 0.1) {
            const force = (1 - dist / radius) * 64;
            tx += (dx / dist) * force;
            ty += (dy / dist) * force;
          }
          p.x += (tx - p.x) * (reduce ? 1 : 0.14);
          p.y += (ty - p.y) * (reduce ? 1 : 0.14);

          const glow = dist < radius ? 1 - dist / radius : 0;
          ctx.fillStyle = glow > 0.2 ? '#3b82f6' : p.isBlue ? '#2357c6' : '#0f172a';
          ctx.globalAlpha = glow > 0.2 ? 1 : p.isBlue ? 0.94 : 0.88;
          ctx.beginPath();
          ctx.roundRect(p.x - size / 2, p.y - size / 2, size, size, 2.2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        if (!reduce) rafId = requestAnimationFrame(draw);
      };
      draw();

      return () => {
        cancelAnimationFrame(rafId);
        canvas.removeEventListener('pointermove', onMove);
        canvas.removeEventListener('pointerleave', onLeave);
      };
    };

    let cleanup;
    document.fonts.ready.then(() => {
      cleanup = start();
    });
    return () => {
      cancelAnimationFrame(rafId);
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={680}
      height={380}
      className="block w-full h-auto aspect-[17/9.5] cursor-crosshair"
      aria-label="Интерактивная сборка TMV LABS"
    />
  );
}
