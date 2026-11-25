import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, Tag, Box, Globe, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react';
import { TG, LIVE_FEED, TICKER_ITEMS } from '../data/content';
import { BorderBeamCard, MagneticButton, PixelAssemblyCanvas } from './MagicEffects';

const ORBIT_ICONS = [
  { Icon: Send, label: 'Telegram', angle: 0, radius: 132, rev: false },
  { Icon: Tag, label: 'Авито', angle: 90, radius: 132, rev: false },
  { Icon: Box, label: 'CRM', angle: 180, radius: 132, rev: false },
  { Icon: BarChart3, label: 'Valyx', angle: 270, radius: 132, rev: false },
  { Icon: Globe, label: 'Яндекс', angle: 45, radius: 174, rev: true },
  { Icon: Bot, label: 'ИИ-бот', angle: 225, radius: 174, rev: true },
];

export function HeroSection() {
  const [feedIdx, setFeedIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setFeedIdx((prev) => (prev + 1) % LIVE_FEED.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  const visibleFeed = [
    LIVE_FEED[feedIdx % LIVE_FEED.length],
    LIVE_FEED[(feedIdx + 1) % LIVE_FEED.length],
  ];

  return (
    <>
      <section
        id="hero"
        className="relative overflow-hidden pt-28 pb-14 lg:pt-32 lg:pb-16 dot-grid-subtle bg-gradient-to-b from-white via-[#f8faff] to-[#f2f6ff] border-b border-slate-900/8"
      >
        {/* Soft ambient radial glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-[6%] h-[520px] w-[520px] rounded-full bg-[#3b82f6]/12 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-[4%] h-[360px] w-[360px] rounded-full bg-[#2357c6]/8 blur-3xl"
        />

        <div className="relative mx-auto w-[min(1240px,calc(100%-32px))] grid grid-cols-1 lg:grid-cols-[1.02fr_0.98fr] gap-10 lg:gap-12 items-center">
          {/* Left column */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-[#2357c6]/20 bg-[#eef4ff] px-3.5 py-1.5 text-[13px] font-extrabold text-[#2357c6]"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2357c6] opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#2357c6]" />
              </span>
              ИИ-агенты, боты и сайты для малого бизнеса
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="mt-5 font-[var(--font-display)] text-[36px] sm:text-[48px] lg:text-[60px] font-extrabold leading-[1.03] tracking-[-0.04em] text-slate-900"
            >
              Твой бизнес отвечает клиентам,{' '}
              <span className="bg-gradient-to-r from-[#2357c6] via-[#3b82f6] to-[#1d4ed8] bg-clip-text text-transparent">
                даже когда ты спишь
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, delay: 0.16 }}
              className="mt-5 max-w-[540px] text-[17px] sm:text-[18px] leading-relaxed text-slate-600"
            >
              21 год в технике и собственный магазин с сервисом ПроГаджет. Сначала проверяю ИИ-ботов, сайты и CRM на своём бизнесе, потом внедряю тебе.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.24 }}
              className="mt-7 flex flex-wrap gap-3"
            >
              <MagneticButton href={TG} variant="blue" className="w-full sm:w-auto">
                Обсудить проект в Telegram
                <ArrowRight className="h-4 w-4" />
              </MagneticButton>
              <MagneticButton href="#bots" variant="light" className="w-full sm:w-auto">
                <Sparkles className="h-4 w-4 text-[#2357c6]" />
                Попробовать ИИ-бота
              </MagneticButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-bold text-slate-500"
            >
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#2357c6]" /> Цена фиксируется до старта
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#2357c6]" /> Запуск от 3 дней
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#2357c6]" /> Все доступы на тебя
              </span>
            </motion.div>
          </div>

          {/* Right column: BorderBeam + TMV LABS Pixel Assembly + Orbiting Circles + AnimatedList */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="relative space-y-4"
          >
            <BorderBeamCard innerClassName="p-4 bg-white/95 backdrop-blur">
              <div className="flex items-center justify-between px-1 pb-3 text-[12px] font-bold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#2357c6]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                </div>
                <span className="inline-flex items-center gap-1.5 text-[#2357c6]">
                  <Sparkles className="h-3.5 w-3.5" /> Наведи курсор на блоки TMV LABS
                </span>
              </div>

              {/* Pixel Canvas + Orbiting Circles overlay */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-900/8 dot-grid bg-gradient-to-b from-[#eef4ff]/65 to-white">
                {/* Orbit rings */}
                <div className="pointer-events-none absolute inset-0 hidden sm:flex items-center justify-center opacity-55">
                  <div className="h-[264px] w-[264px] rounded-full border border-dashed border-[#2357c6]/25" />
                  <div className="absolute h-[348px] w-[348px] rounded-full border border-[#2357c6]/12" />
                </div>
                {/* Orbiting icons */}
                <div className="pointer-events-none absolute inset-0 hidden sm:flex items-center justify-center">
                  {ORBIT_ICONS.map(({ Icon, label, angle, radius, rev }) => (
                    <div
                      key={label}
                      style={{ '--angle': angle, '--radius': radius, '--duration': rev ? '30s' : '24s' }}
                      className={`absolute flex h-9 w-9 items-center justify-center rounded-xl border border-[#2357c6]/20 bg-white/95 text-[#2357c6] shadow-md ${
                        rev ? 'animate-orbit-reverse' : 'animate-orbit'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                  ))}
                </div>

                <div className="relative z-10">
                  <PixelAssemblyCanvas />
                </div>
              </div>

              {/* AnimatedList: live incoming AI events (Magic UI + Ramp style) */}
              <div className="mt-3.5 space-y-2">
                <div className="flex items-center justify-between px-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  <span>Живой поток событий</span>
                  <span className="text-[#2357c6]">● Работает 24/7</span>
                </div>
                <div className="relative min-h-[126px] space-y-2 overflow-hidden">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {visibleFeed.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: -18, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 18, scale: 0.96 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-900/8 bg-slate-50/90 px-3.5 py-2.5"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2357c6] text-white shadow-sm">
                            <Bot className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-[13px] font-extrabold text-slate-900">{item.title}</div>
                            <div className="truncate text-[11px] font-semibold text-slate-500">{item.sub}</div>
                          </div>
                        </div>
                        <span className="shrink-0 rounded-full bg-[#eef4ff] px-2.5 py-1 text-[11px] font-extrabold text-[#2357c6]">
                          {item.tag}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </BorderBeamCard>
          </motion.div>
        </div>
      </section>

      {/* Magic UI Marquee */}
      <div className="marquee-shell relative overflow-hidden border-b border-slate-900/8 bg-white py-3.5" aria-hidden="true">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />
        <div className="animate-marquee flex w-max gap-8">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map(([tag, text], i) => (
            <div key={i} className="inline-flex items-center gap-2.5 whitespace-nowrap text-[13px] font-bold text-slate-800">
              <span className="rounded-full bg-[#eef4ff] px-2.5 py-0.5 text-[11px] font-extrabold text-[#2357c6]">
                {tag}
              </span>
              {text}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
