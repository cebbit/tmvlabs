import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, MessageSquare, Box, Bell, CheckCircle2, Camera, Calendar,
  Sliders, Tag, Star, Send, Bot, ArrowRight,
} from 'lucide-react';
import { SIM_SCENARIOS, ALL_BOTS } from '../data/content';
import { SpotlightCard } from './MagicEffects';

const ICON_MAP = {
  zap: Zap,
  message: MessageSquare,
  box: Box,
  bell: Bell,
  check: CheckCircle2,
  camera: Camera,
  calendar: Calendar,
  sliders: Sliders,
  tag: Tag,
  star: Star,
  send: Send,
};

const CATEGORIES = [
  { id: 'all', label: 'Все боты (11)' },
  { id: 'sales', label: 'Продажи и Авито (4)' },
  { id: 'ops', label: 'Сервис, CRM и сводки (4)' },
  { id: 'content', label: 'Контент, отзывы и база (3)' },
];

export function BotsSection() {
  const [simIdx, setSimIdx] = useState(0);
  const [typing, setTyping] = useState(false);
  const [cat, setCat] = useState('all');

  const triggerSim = (idx) => {
    setSimIdx(idx);
    setTyping(true);
  };

  useEffect(() => {
    if (!typing) return;
    const t = setTimeout(() => setTyping(false), 520);
    return () => clearTimeout(t);
  }, [typing, simIdx]);

  const scenario = SIM_SCENARIOS[simIdx];
  const filtered = cat === 'all' ? ALL_BOTS : ALL_BOTS.filter((b) => b.cat === cat);

  return (
    <section id="bots" className="py-16 lg:py-22 bg-[#f7f9fc] border-y border-slate-900/8 scroll-mt-20">
      <div className="mx-auto w-[min(1240px,calc(100%-32px))]">
        <div className="max-w-[760px] mb-9">
          <p className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-[#2357c6] mb-2">
            ИИ-боты и автоматизация
          </p>
          <h2 className="font-[var(--font-display)] text-[28px] sm:text-[46px] font-extrabold leading-[1.06] tracking-[-0.035em] text-slate-900">
            11 форматов ботов, которые забирают рутину
          </h2>
          <p className="mt-3 text-[17px] text-slate-600">
            Нажми на любой сценарий ниже, чтобы увидеть, как ИИ-агент отрабатывает задачу вживую.
          </p>
        </div>

        {/* Live AI Bot Simulator */}
        <div className="mb-10 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-7 items-center rounded-[26px] border border-[#2357c6]/20 bg-white p-6 sm:p-8 shadow-[0_20px_54px_-24px_rgba(35,87,198,0.2)]">
          <div>
            <div className="flex items-center gap-3.5 mb-5">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2357c6] to-[#3b82f6] text-white shadow-[0_12px_24px_-8px_rgba(35,87,198,0.6)]"
              >
                <Bot className="h-7 w-7" />
              </motion.div>
              <div>
                <div className="font-[var(--font-display)] text-[18px] font-extrabold text-slate-900">
                  Живой симулятор ИИ-бота
                </div>
                <div className="text-[13px] font-semibold text-slate-500">Выбери реальный рабочий сценарий</div>
              </div>
            </div>

            <div className="grid gap-2">
              {SIM_SCENARIOS.map((s, i) => {
                const active = i === simIdx;
                return (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => triggerSim(i)}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-[13px] font-bold transition-all cursor-pointer ${
                      active
                        ? 'border-[#2357c6] bg-[#eef4ff] text-[#2357c6] translate-x-1'
                        : 'border-slate-900/10 bg-slate-50 text-slate-800 hover:border-[#2357c6]/45'
                    }`}
                  >
                    <span>{s.label}</span>
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className="min-h-[250px] rounded-2xl border border-slate-900/10 dot-grid bg-slate-50/90 p-5 flex flex-col justify-center gap-3"
            aria-live="polite"
          >
            <motion.div
              key={`u-${simIdx}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="self-end max-w-[88%] rounded-2xl rounded-br-sm border border-slate-900/10 bg-white px-4 py-3 text-[14px] font-medium text-slate-900 shadow-xs"
            >
              {scenario.user}
            </motion.div>

            <AnimatePresence mode="wait">
              {typing ? (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="self-start rounded-2xl rounded-bl-sm bg-[#2357c6] px-4 py-3 text-white text-[13px] font-bold inline-flex items-center gap-2"
                >
                  <span className="h-2 w-2 rounded-full bg-white animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-white animate-bounce [animation-delay:120ms]" />
                  <span className="h-2 w-2 rounded-full bg-white animate-bounce [animation-delay:240ms]" />
                </motion.div>
              ) : (
                <motion.div
                  key={`b-${simIdx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="max-w-[90%] rounded-2xl rounded-bl-sm bg-[#2357c6] px-4 py-3 text-[14px] font-medium text-white shadow-md">
                    {scenario.bot}
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 }}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[#2357c6]/30 bg-white px-4 py-2.5 text-[13px] font-bold text-slate-900"
                  >
                    <span>{scenario.tg}</span>
                    <span className="shrink-0 text-[#2357c6]">✓ Выполнено</span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-6" role="tablist">
          {CATEGORIES.map((c) => {
            const active = c.id === cat;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCat(c.id)}
                className={`rounded-full border px-4 py-2 text-[13px] font-bold transition-all cursor-pointer ${
                  active
                    ? 'border-[#2357c6] bg-[#2357c6] text-white shadow-sm'
                    : 'border-slate-900/12 bg-white text-slate-600 hover:border-[#2357c6] hover:text-[#2357c6]'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Animated 11-Bot Bento Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((b) => {
              const Icon = ICON_MAP[b.icon] || Zap;
              return (
                <motion.div
                  key={b.title}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.22 }}
                >
                  <SpotlightCard className="group h-full p-6">
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-900/8 bg-slate-50 text-slate-600 transition-all group-hover:scale-105 group-hover:border-[#2357c6] group-hover:bg-[#2357c6] group-hover:text-white group-hover:shadow-[0_0_22px_rgba(35,87,198,0.5)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${
                          b.live
                            ? 'bg-[#eef4ff] text-[#2357c6]'
                            : 'border border-slate-900/10 bg-slate-50 text-slate-500'
                        }`}
                      >
                        {b.tag}
                      </span>
                    </div>
                    <h3 className="font-[var(--font-display)] text-[18px] font-extrabold tracking-[-0.02em] text-slate-900 mb-2">
                      {b.title}
                    </h3>
                    <p className="text-[14px] leading-relaxed text-slate-600">{b.text}</p>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
