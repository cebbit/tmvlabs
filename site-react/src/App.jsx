import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { motion, useScroll, useSpring } from 'framer-motion';
import { TG } from './data/content';
import { HeroSection } from './components/HeroSection';
import { ShowcaseAndMap } from './components/ShowcaseAndMap';
import { BotsSection } from './components/BotsSection';
import { CasesPricingRest } from './components/CasesPricingRest';

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  const [showSticky, setShowSticky] = useState(false);

  // Lenis buttery smooth scroll
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Mobile sticky CTA visibility (only after Hero, hide near Final)
  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('hero');
      const finalSec = document.getElementById('final');
      if (!hero) return;
      const pastHero = hero.getBoundingClientRect().bottom < window.innerHeight * 0.35;
      const nearFinal = finalSec && finalSec.getBoundingClientRect().top < window.innerHeight * 0.85;
      setShowSticky(Boolean(pastHero && !nearFinal));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Top scroll progress bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-[#2357c6] via-[#3b82f6] to-[#2357c6]"
      />

      {/* Floating Glass Topbar */}
      <header className="fixed top-3 left-1/2 z-50 w-[min(1240px,calc(100%-24px))] -translate-x-1/2 rounded-2xl border border-slate-900/10 bg-white/88 px-3.5 py-2.5 pl-4 backdrop-blur-xl shadow-[0_10px_30px_-12px_rgba(15,23,42,0.1)] flex items-center justify-between gap-6">
        <a href="#hero" className="inline-flex items-center gap-2.5 font-[var(--font-display)] text-[16px] font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
          <img src="./assets/logo/mark.svg" alt="" className="h-6 w-6" />
          TMV Labs
        </a>

        <nav className="hidden md:flex items-center gap-6 ml-auto" aria-label="Навигация">
          {[
            ['#showcase', 'Витрина'],
            ['#system', 'Система'],
            ['#bots', 'ИИ-боты'],
            ['#cases', 'Кейсы'],
            ['#prices', 'Цены'],
            ['#about', 'Обо мне'],
          ].map(([href, label]) => (
            <a key={href} href={href} className="text-[14px] font-bold text-slate-600 hover:text-[#2357c6] transition-colors">
              {label}
            </a>
          ))}
        </nav>

        <a
          href={TG}
          target="_blank"
          rel="noopener noreferrer"
          className="shimmer-btn inline-flex items-center justify-center rounded-xl bg-[#2357c6] px-4 py-2.5 text-[13px] font-extrabold text-white shadow-[0_10px_20px_-8px_rgba(35,87,198,0.6)] hover:bg-[#1944a5] transition-colors"
        >
          Telegram
        </a>
      </header>

      <main>
        <HeroSection />
        <ShowcaseAndMap />
        <BotsSection />
        <CasesPricingRest />
      </main>

      <footer className="border-t border-slate-900/8 py-7 pb-24 md:pb-10 text-[13px] font-semibold text-slate-500">
        <div className="mx-auto w-[min(1240px,calc(100%-32px))] flex flex-wrap items-center justify-between gap-4">
          <span>TMV Labs · Максим, разработка и автоматизация для малого бизнеса</span>
          <a href={TG} target="_blank" rel="noopener noreferrer" className="hover:text-[#2357c6]">
            Telegram @tmv1301
          </a>
          <span>© 2026</span>
        </div>
      </footer>

      {/* Mobile sticky Telegram button */}
      <a
        href={TG}
        target="_blank"
        rel="noopener noreferrer"
        className={`md:hidden fixed bottom-3 left-3.5 right-3.5 z-40 flex min-h-[48px] items-center justify-center rounded-2xl bg-[#2357c6] text-[15px] font-extrabold text-white shadow-[0_14px_32px_rgba(35,87,198,0.45)] transition-all ${
          showSticky ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        Обсудить проект в Telegram
      </a>
    </div>
  );
}
