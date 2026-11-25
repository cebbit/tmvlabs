import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Send, Camera, Globe, BarChart3, Bell, Box, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { TG, SHOWCASE_TABS, MAP_INPUTS, MAP_OUTPUTS } from '../data/content';
import { MagneticButton, SafariMockup } from './MagicEffects';

const IN_ICONS = [Tag, Send, Camera, Globe, BarChart3];
const OUT_ICONS = [Bell, Box, Zap, CheckCircle2];
const IN_Y = [46, 118, 190, 262, 334];
const OUT_Y = [72, 150, 228, 306];

export function ShowcaseAndMap() {
  const [tabIdx, setTabIdx] = useState(0);
  const [routeIdx, setRouteIdx] = useState(0);
  const [mapPaused, setMapPaused] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const id = setInterval(() => {
      if (!mapPaused) setRouteIdx((prev) => (prev + 1) % MAP_INPUTS.length);
    }, 3200);
    return () => clearInterval(id);
  }, [mapPaused]);

  const activeTab = SHOWCASE_TABS[tabIdx];
  const activeRoute = MAP_INPUTS[routeIdx];

  return (
    <>
      {/* CLERK INTERACTIVE SHOWCASE */}
      <section id="showcase" className="py-16 lg:py-20 bg-white border-b border-slate-900/8 scroll-mt-20">
        <div className="mx-auto w-[min(1240px,calc(100%-32px))]">
          <div className="flex flex-wrap items-end justify-between gap-5 mb-7">
            <div>
              <p className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-[#2357c6] mb-2">Живая витрина</p>
              <h2 className="font-[var(--font-display)] text-[28px] sm:text-[40px] font-extrabold leading-[1.08] tracking-[-0.035em] text-slate-900">
                Что сделаю для твоего бизнеса
              </h2>
            </div>

            {/* Motion layoutId pill tabs (Clerk style) */}
            <div className="flex flex-wrap gap-1.5 rounded-2xl border border-slate-900/10 bg-slate-50 p-1.5" role="tablist">
              {SHOWCASE_TABS.map((tab, i) => {
                const isActive = i === tabIdx;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setTabIdx(i)}
                    className={`relative rounded-xl px-3.5 py-2.5 text-[13px] font-bold transition-colors cursor-pointer ${
                      isActive ? 'text-[#2357c6]' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="showcase-pill"
                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                        className="absolute inset-0 rounded-xl bg-white border border-[#2357c6]/20 shadow-sm"
                      />
                    )}
                    <span className="relative z-10 inline-flex items-center gap-1.5">
                      <span className="text-[11px] font-extrabold opacity-60">{tab.num}</span>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[26px] border border-slate-900/12 bg-white p-6 sm:p-8 shadow-[0_20px_54px_-24px_rgba(15,23,42,0.14)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.24 }}
                className="grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr] gap-8 items-center"
              >
                <div>
                  <span className="inline-block rounded-full bg-[#eef4ff] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#2357c6] mb-3">
                    Сценарий {activeTab.num}
                  </span>
                  <h3 className="font-[var(--font-display)] text-[24px] sm:text-[30px] font-extrabold leading-[1.15] tracking-[-0.03em] text-slate-900">
                    {activeTab.title}
                  </h3>
                  <p className="mt-3 text-[16px] leading-relaxed text-slate-600">{activeTab.text}</p>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#eef4ff] px-3.5 py-2 text-[13px] font-bold text-slate-900">
                    <span className="text-[#2357c6]">Работает:</span> {activeTab.works}
                  </div>
                  <div className="mt-6">
                    <MagneticButton href={TG} variant="blue">
                      Запустить у себя
                      <ArrowRight className="h-4 w-4" />
                    </MagneticButton>
                  </div>
                </div>

                <SafariMockup url={activeTab.screenTitle} badge={activeTab.status}>
                  {activeTab.shot ? (
                    <img
                      src={activeTab.shot}
                      alt={activeTab.label}
                      className="w-full aspect-[16/10] object-cover"
                    />
                  ) : (
                    <div className="p-4 sm:p-5 space-y-2.5 dot-grid bg-gradient-to-b from-[#f7faff] to-white min-h-[260px] flex flex-col justify-center">
                      {activeTab.rows.map((row, idx) => (
                        <motion.div
                          key={row.left}
                          initial={{ opacity: 0, x: 14 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.08 }}
                          className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-[14px] ${
                            row.accent
                              ? 'border-[#2357c6] bg-[#2357c6] text-white shadow-md'
                              : 'border-slate-900/8 bg-white text-slate-900'
                          }`}
                        >
                          <div>
                            <div className="font-bold">{row.left}</div>
                            <div className={`text-[12px] ${row.accent ? 'text-blue-100' : 'text-slate-500'}`}>
                              {row.sub}
                            </div>
                          </div>
                          <span className="shrink-0 font-extrabold text-[13px]">{row.right}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </SafariMockup>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* RAMP + MAGIC UI ANIMATED BEAM MAP */}
      <section id="system" className="py-16 lg:py-22 bg-white scroll-mt-20">
        <div className="mx-auto w-[min(1240px,calc(100%-32px))]">
          <div className="max-w-[740px] mb-9">
            <p className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-[#2357c6] mb-2">Карта автоматизации</p>
            <h2 className="font-[var(--font-display)] text-[28px] sm:text-[46px] font-extrabold leading-[1.06] tracking-[-0.035em] text-slate-900">
              Из разрозненных каналов в понятный результат
            </h2>
            <p className="mt-3 text-[17px] text-slate-600">
              Схема работает сама по циклу или при наведении: выбери любой канал слева и смотри живой маршрут данных.
            </p>
          </div>

          <div
            onMouseEnter={() => setMapPaused(true)}
            onMouseLeave={() => setMapPaused(false)}
            className="rounded-[28px] border border-slate-900/12 dot-grid bg-[#f9fbff] p-5 sm:p-8 shadow-[0_20px_54px_-24px_rgba(15,23,42,0.14)]"
          >
            <div className="relative grid grid-cols-1 lg:grid-cols-[260px_1fr_260px] gap-6 items-center min-h-[370px]">
              {/* Animated SVG Beams */}
              <svg
                className="pointer-events-none absolute inset-0 hidden lg:block h-full w-full"
                viewBox="0 0 1000 380"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="beam-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="50%" stopColor="#2357c6" />
                    <stop offset="100%" stopColor="#60a5fa" />
                  </linearGradient>
                </defs>
                {IN_Y.map((y, i) => {
                  const d = `M 260 ${y} C 365 ${y}, 385 190, 495 190`;
                  const on = i === routeIdx;
                  return (
                    <g key={`in-${i}`}>
                      <path
                        d={d}
                        fill="none"
                        stroke={on ? 'url(#beam-grad)' : 'rgba(15,23,42,0.13)'}
                        strokeWidth={on ? 3 : 1.5}
                      />
                      {on && (
                        <circle r="5" fill="#2357c6">
                          <animateMotion dur="1.4s" repeatCount="indefinite" path={d} />
                        </circle>
                      )}
                    </g>
                  );
                })}
                {OUT_Y.map((y, i) => {
                  const d = `M 505 190 C 615 190, 635 ${y}, 740 ${y}`;
                  const on = activeRoute.outIdx.includes(i);
                  return (
                    <g key={`out-${i}`}>
                      <path
                        d={d}
                        fill="none"
                        stroke={on ? 'url(#beam-grad)' : 'rgba(15,23,42,0.13)'}
                        strokeWidth={on ? 3 : 1.5}
                      />
                      {on && (
                        <circle r="5" fill="#2357c6">
                          <animateMotion dur="1.4s" begin="0.3s" repeatCount="indefinite" path={d} />
                        </circle>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Inputs */}
              <div className="relative z-10 grid gap-2.5">
                {MAP_INPUTS.map((item, i) => {
                  const Icon = IN_ICONS[i];
                  const active = i === routeIdx;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onMouseEnter={() => setRouteIdx(i)}
                      onClick={() => setRouteIdx(i)}
                      className={`group flex items-center gap-3 rounded-2xl border bg-white px-3.5 py-3 text-left text-[14px] font-bold transition-all cursor-pointer ${
                        active
                          ? 'border-[#2357c6] text-[#2357c6] shadow-[0_10px_24px_-10px_rgba(35,87,198,0.45),0_0_0_3px_rgba(35,87,198,0.1)]'
                          : 'border-slate-900/12 text-slate-800 hover:border-[#2357c6]/50'
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all ${
                          active
                            ? 'bg-[#2357c6] text-white border-[#2357c6] shadow-[0_0_18px_rgba(35,87,198,0.55)]'
                            : 'bg-slate-50 text-slate-500 border-slate-900/8 group-hover:text-[#2357c6]'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Core */}
              <div className="relative z-10 flex justify-center">
                <motion.div
                  animate={{ scale: [1, 1.025, 1] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-full max-w-[225px] rounded-3xl border-2 border-[#2357c6] bg-white p-6 text-center shadow-[0_0_0_10px_rgba(35,87,198,0.08),0_24px_48px_-18px_rgba(35,87,198,0.38)]"
                >
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef4ff]">
                    <img src="./assets/logo/mark.svg" alt="" className="h-7 w-7" />
                  </div>
                  <div className="font-[var(--font-display)] text-[18px] font-extrabold text-slate-900">TMV Labs</div>
                  <div className="mt-1 text-[12px] font-bold text-slate-500">ИИ-бот · сверка цен · правила</div>
                </motion.div>
              </div>

              {/* Outputs */}
              <div className="relative z-10 grid gap-2.5">
                {MAP_OUTPUTS.map((item, i) => {
                  const Icon = OUT_ICONS[i];
                  const active = activeRoute.outIdx.includes(i);
                  return (
                    <div
                      key={item.label}
                      className={`flex items-center gap-3 rounded-2xl border bg-white px-3.5 py-3 text-[14px] font-bold transition-all ${
                        active
                          ? 'border-[#2357c6] text-[#2357c6] shadow-[0_10px_24px_-10px_rgba(35,87,198,0.4),0_0_0_3px_rgba(35,87,198,0.08)]'
                          : 'border-slate-900/10 text-slate-700'
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all ${
                          active
                            ? 'bg-[#2357c6] text-white border-[#2357c6] shadow-[0_0_16px_rgba(35,87,198,0.5)]'
                            : 'bg-slate-50 text-slate-500 border-slate-900/8'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Route Info Footer */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#2357c6]/22 bg-white px-5 py-4">
              <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-[12px] font-extrabold uppercase tracking-wider text-[#2357c6]">
                {activeRoute.tag}
              </span>
              <p className="flex-1 min-w-[220px] text-[15px] font-bold text-slate-900">{activeRoute.desc}</p>
              <MagneticButton href={TG} variant="blue" className="min-h-[42px] px-5 py-2.5">
                Собрать под свой бизнес
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
