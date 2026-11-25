import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { TG, CASES, ALL_BOTS, PRICES, STEPS, TOOLS, TRUST_STATS } from './data/content';
import { LusionHero3D } from './components/LusionHero3D';

const BOT_TABS = [
  { id: 'all', label: 'Все (11)' },
  { id: 'sales', label: 'Продажи и Авито' },
  { id: 'ops', label: 'Сервис и CRM' },
  { id: 'content', label: 'Контент и база' },
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [botCat, setBotCat] = useState('all');
  const [formMsg, setFormMsg] = useState('');

  // Buttery smooth Lenis scroll (Lusion signature)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
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

  // Close menu on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const filteredBots = botCat === 'all' ? ALL_BOTS : ALL_BOTS.filter((b) => b.cat === botCat);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      setFormMsg('Заполни имя, контакт и задачу.');
      form.reportValidity();
      return;
    }
    setFormMsg('Форма готова к подключению к Пульсу. Пока можно написать напрямую в @tmv1301.');
    form.reset();
  };

  return (
    <div className="min-h-screen bg-[#f0f1fa] text-[#0b0c10]">
      {/* LUSION MINIMAL HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 px-5 sm:px-10 py-4 bg-[#f0f1fa]/82 backdrop-blur-md flex items-center justify-between">
        <a
          href="#top"
          className="pointer-events-auto font-[var(--font-display)] text-[18px] sm:text-[21px] font-bold tracking-[0.06em] uppercase text-[#0b0c10]"
        >
          TMV LABS
        </a>

        <div className="pointer-events-auto flex items-center gap-2.5">
          <a
            href={TG}
            target="_blank"
            rel="noopener noreferrer"
            className="lusion-pill inline-flex items-center gap-2.5 rounded-full bg-[#131418] px-5 py-2.5 text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.08em] text-white hover:bg-[#1b3bff]"
          >
            Написать
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            className="lusion-pill inline-flex items-center gap-2 rounded-full bg-[#e3e5f2] px-5 py-2.5 text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.08em] text-[#0b0c10] hover:bg-white cursor-pointer"
          >
            {menuOpen ? 'Закрыть' : 'Меню'}
            <span className="inline-flex gap-1">
              <span className="h-1 w-1 rounded-full bg-[#0b0c10]" />
              <span className="h-1 w-1 rounded-full bg-[#0b0c10]" />
            </span>
          </button>
        </div>
      </header>

      {/* STUDIO OVERLAY MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-40 bg-[#0b0c10]/35 backdrop-blur-sm flex justify-end p-4 sm:p-6 pt-20"
          >
            <motion.nav
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[360px] self-start rounded-3xl bg-white p-7 shadow-2xl"
              aria-label="Меню"
            >
              <div className="grid gap-1">
                {[
                  ['#work', 'Кейсы'],
                  ['#bots', '11 ИИ-ботов'],
                  ['#prices', 'Цены'],
                  ['#about', 'О подходе'],
                  ['#contact', 'Связаться'],
                ].map(([href, label]) => (
                  <a
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="group flex items-center justify-between py-3 font-[var(--font-display)] text-[26px] font-medium tracking-[-0.02em] text-[#0b0c10] hover:text-[#1b3bff] transition-colors"
                  >
                    <span>{label}</span>
                    <ArrowUpRight className="h-5 w-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-black/10 flex items-center justify-between text-[12px] font-bold uppercase tracking-wider text-black/50">
                <span>Telegram</span>
                <a href={TG} target="_blank" rel="noopener noreferrer" className="text-[#1b3bff] hover:underline">
                  @tmv1301 ↗
                </a>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. LUSION HERO (1-in-1 composition) */}
      <section id="top" className="min-h-[100svh] flex flex-col justify-between px-5 sm:px-10 pt-20 pb-6">
        {/* Editorial headline centered-top like Lusion */}
        <div className="mx-auto w-full max-w-[1440px] flex justify-center py-2 sm:py-4">
          <h1 className="max-w-[660px] font-[var(--font-display)] text-[22px] sm:text-[30px] lg:text-[34px] font-normal leading-[1.22] tracking-[-0.02em] text-[#0b0c10]">
            Делаем сайты, ИИ-ботов и CRM, которые отвечают клиентам, даже когда ты спишь
          </h1>
        </div>

        {/* Giant rounded 3D Interactive Stage */}
        <div className="mx-auto w-full max-w-[1440px] flex-1 min-h-[420px] sm:min-h-[500px] max-h-[680px] relative rounded-[20px] sm:rounded-[24px] overflow-hidden bg-[#0d0f14] shadow-[0_24px_60px_-24px_rgba(11,12,16,0.28)]">
          <LusionHero3D />
        </div>

        {/* Clean minimal scroll cue (no decorative pluses) */}
        <div className="mx-auto w-full max-w-[1440px] pt-5 flex items-center justify-center text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0b0c10]/60">
          <a href="#work" className="hover:text-[#102ef5] transition-colors">
            Листай вниз
          </a>
        </div>
      </section>

      {/* 2. EDITORIAL STATEMENT */}
      <section className="px-5 sm:px-10 py-20 sm:py-28">
        <div className="mx-auto w-full max-w-[1440px] grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-16 items-end">
          <h2 className="font-[var(--font-display)] text-[34px] sm:text-[52px] lg:text-[66px] font-medium leading-[1.04] tracking-[-0.035em] text-[#0b0c10]">
            Сначала проверяю системы на своём бизнесе, потом внедряю тебе
          </h2>

          <div className="space-y-6">
            <p className="text-[17px] sm:text-[19px] leading-[1.55] text-[#0b0c10]/75">
              21 год в технике, собственный магазин и сервис ПроГаджет. Каждый бот, CRM и сайт сначала отработали вживую на реальных заявках, прайсах и клиентах.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={TG}
                target="_blank"
                rel="noopener noreferrer"
                className="lusion-pill inline-flex items-center gap-3 rounded-full bg-[#131418] px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.08em] text-white hover:bg-[#1b3bff]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                Обсудить проект
                <ArrowRight className="h-4 w-4" />
              </a>
              <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#0b0c10]/55">
                Запуск от 3 дней · цена до старта
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED WORK (Lusion 2-column clean media grid, 1-in-1 like frame_04) */}
      <section id="work" className="px-5 sm:px-10 py-14 sm:py-20 scroll-mt-20">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12 pb-6 border-b border-black/10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#0b0c10]/55 mb-2">
                Избранные проекты
              </p>
              <h2 className="font-[var(--font-display)] text-[34px] sm:text-[54px] font-medium leading-[1.02] tracking-[-0.035em]">
                Сделано и работает
              </h2>
            </div>
            <p className="max-w-[380px] text-[15px] text-[#0b0c10]/65">
              Реальные скриншоты сайтов, CRM, аналитики и ботов. Без выдуманных мокапов.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14">
            {CASES.map((c) => (
              <a
                key={c.name}
                href={TG}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="overflow-hidden rounded-[18px] bg-[#0d0f14] aspect-[16/10]">
                  {c.video ? (
                    <video
                      src={c.video}
                      poster={c.shot}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  ) : c.shot ? (
                    <img
                      src={c.shot}
                      alt={c.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="h-full w-full p-8 sm:p-10 bg-[#131418] text-white flex flex-col justify-between">
                      <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#5c7cff]">
                        Авито · 24/7
                      </div>
                      <div className="font-[var(--font-display)] text-[26px] sm:text-[34px] font-medium leading-[1.12] tracking-[-0.03em]">
                        Сверка цен с сайтом и ИИ-ответы клиентам ночью
                      </div>
                      <div className="flex items-center justify-between text-[13px] text-white/60 border-t border-white/15 pt-4">
                        <span>Актуальные цены без ручной сверки</span>
                        <span>→ Telegram</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.1em] text-[#0b0c10]/55">
                    {c.kind} • {c.res}
                  </div>
                  <div className="mt-1.5 font-[var(--font-display)] text-[24px] sm:text-[32px] font-medium tracking-[-0.025em] text-[#0b0c10]">
                    <span className="lusion-case-title">
                      <span className="lusion-case-arrow">→</span>
                      <span>{c.name}</span>
                    </span>
                  </div>
                  <p className="mt-1 text-[14px] text-[#0b0c10]/65 max-w-[540px]">
                    {c.task} {c.did}
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* PONDEX + Utilities editorial strip */}
          <div className="mt-16 pt-10 border-t border-black/10 grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1b3bff]">Сейчас в работе</div>
              <div className="mt-2 font-[var(--font-display)] text-[22px] font-medium">PONDEX</div>
              <p className="mt-1 text-[14px] text-[#0b0c10]/65">
                Бюро земельных решений: сайт, заявки в одном месте и утренняя сводка лотов.
              </p>
            </div>
            {TOOLS.map((t) => (
              <div key={t.name}>
                <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#0b0c10]/45">Утилита · macOS</div>
                <div className="mt-2 font-[var(--font-display)] text-[22px] font-medium">{t.name}</div>
                <p className="mt-1 text-[14px] text-[#0b0c10]/65">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 11 BOTS — SWISS ARCHITECTURAL INDEX (zero cheap SaaS cards) */}
      <section id="bots" className="px-5 sm:px-10 py-20 sm:py-28 scroll-mt-20">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#0b0c10]/55 mb-2">
                Автоматизация
              </p>
              <h2 className="font-[var(--font-display)] text-[34px] sm:text-[54px] font-medium leading-[1.02] tracking-[-0.035em]">
                11 форматов ботов
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {BOT_TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setBotCat(t.id)}
                  className={`lusion-pill rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.08em] cursor-pointer ${
                    botCat === t.id
                      ? 'bg-[#131418] text-white'
                      : 'bg-[#e3e5f2] text-[#0b0c10] hover:bg-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-black/15">
            {filteredBots.map((b, idx) => (
              <a
                key={b.title}
                href={TG}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-1 md:grid-cols-[70px_1.1fr_1.4fr_auto] gap-3 md:gap-6 items-baseline py-6 border-b border-black/12 transition-colors hover:bg-white/65 px-2 sm:px-4"
              >
                <span className="text-[12px] font-bold text-[#0b0c10]/40">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="font-[var(--font-display)] text-[20px] sm:text-[24px] font-medium tracking-[-0.02em] text-[#0b0c10] group-hover:text-[#1b3bff] transition-colors">
                  {b.title}
                </span>
                <span className="text-[15px] text-[#0b0c10]/65">{b.text}</span>
                <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#0b0c10]/55 group-hover:text-[#1b3bff]">
                  {b.tag}
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ECONOMICS + PRICES + STEPS */}
      <section id="prices" className="px-5 sm:px-10 py-16 sm:py-24 scroll-mt-20">
        <div className="mx-auto w-full max-w-[1440px]">
          {/* Monumental Economics block */}
          <div className="rounded-[24px] bg-[#131418] text-white p-8 sm:p-14 mb-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/45 mb-3">
                Бот или сотрудник
              </p>
              <h2 className="font-[var(--font-display)] text-[32px] sm:text-[48px] font-medium leading-[1.06] tracking-[-0.03em]">
                Менеджер стоит от 45 000 ₽ каждый месяц. Бот от 20 000 ₽ один раз.
              </h2>
              <p className="mt-4 text-[16px] text-white/65">
                Готов за 3–5 дней, работает ночью и в выходные. Мне автоматизация каждый день возвращает часы.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 lg:justify-end">
              <div className="rounded-2xl bg-white/6 border border-white/10 p-6 flex-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-white/45">Менеджер</div>
                <div className="mt-3 font-[var(--font-display)] text-[32px] font-medium">от 45 000 ₽</div>
                <div className="mt-1 text-[13px] text-white/55">каждый месяц, без ночных смен</div>
              </div>
              <div className="rounded-2xl bg-[#1b3bff] p-6 flex-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-white/75">ИИ-бот TMV Labs</div>
                <div className="mt-3 font-[var(--font-display)] text-[32px] font-medium">от 20 000 ₽</div>
                <div className="mt-1 text-[13px] text-white/85">один раз, 24/7 без пауз</div>
              </div>
            </div>
          </div>

          {/* Prices Index */}
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#0b0c10]/55 mb-2">
                Прозрачные условия
              </p>
              <h2 className="font-[var(--font-display)] text-[34px] sm:text-[54px] font-medium leading-[1.02] tracking-[-0.035em]">
                Цены до старта
              </h2>
            </div>
            <p className="max-w-[380px] text-[15px] text-[#0b0c10]/65">
              Точную цену называю после разбора за 15 минут. Она фиксируется до старта и не меняется.
            </p>
          </div>

          <div className="border-t border-black/15">
            {PRICES.map((p, i) => (
              <div
                key={p.title}
                className={`grid grid-cols-1 md:grid-cols-[1.2fr_1.3fr_auto_auto] gap-3 md:gap-8 items-baseline py-6 border-b border-black/12 px-2 sm:px-4 ${
                  p.featured ? 'bg-[#1b3bff]/6' : ''
                }`}
              >
                <div className="font-[var(--font-display)] text-[20px] sm:text-[24px] font-medium text-[#0b0c10]">
                  {p.title}
                </div>
                <div className="text-[15px] text-[#0b0c10]/65">{p.desc}</div>
                <div className="font-[var(--font-display)] text-[22px] sm:text-[26px] font-medium text-[#1b3bff] whitespace-nowrap">
                  {p.price}
                </div>
                <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#0b0c10]/50 whitespace-nowrap">
                  {p.term}
                </div>
              </div>
            ))}
          </div>

          {/* Steps */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pt-10 border-t border-black/10">
            {STEPS.map((s, i) => (
              <div key={s.short}>
                <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1b3bff]">
                  Шаг 0{i + 1}
                </div>
                <div className="mt-2 font-[var(--font-display)] text-[20px] font-medium text-[#0b0c10]">
                  {s.short}
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-[#0b0c10]/65">{s.full}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ABOUT & TRUST */}
      <section id="about" className="px-5 sm:px-10 py-16 sm:py-24 scroll-mt-20">
        <div className="mx-auto w-full max-w-[1440px] border-t border-black/15 pt-14 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#0b0c10]/55 mb-3">
              Реальный бизнес
            </p>
            <h2 className="font-[var(--font-display)] text-[32px] sm:text-[46px] font-medium leading-[1.06] tracking-[-0.03em]">
              Меня знают как предпринимателя
            </h2>
            <p className="mt-4 text-[17px] text-[#0b0c10]/70">
              Мой магазин и сервис ПроГаджет в Усть-Лабинске. Каждый проект веду лично, от разбора до запуска. Под объём подключаю проверенных людей, за результат отвечаю я.
            </p>
            <p className="mt-4 text-[13px] text-[#0b0c10]/50">
              Цифры справа относятся к магазину и сервису ПроГаджет. Отзывы о разработке появятся после первых клиентов.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 self-end">
            {TRUST_STATS.map((st) => (
              <div key={st.label} className="border-t border-black/20 pt-5">
                <div className="font-[var(--font-display)] text-[44px] sm:text-[52px] font-medium leading-none tracking-[-0.04em] text-[#1b3bff]">
                  {st.decimals ? st.value.toFixed(st.decimals) : st.value}
                  {st.suffix}
                </div>
                <div className="mt-3 text-[13px] font-semibold text-[#0b0c10]/65">{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. LUSION FINAL DARK CANVAS + FORM */}
      <section id="contact" className="px-5 sm:px-10 pt-8 pb-12 scroll-mt-20">
        <div className="mx-auto w-full max-w-[1440px] rounded-[24px] bg-[#131418] text-white p-8 sm:p-14 lg:p-16 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#5c7cff] mb-4">
              Быстрый старт
            </p>
            <h2 className="font-[var(--font-display)] text-[34px] sm:text-[54px] font-medium leading-[1.04] tracking-[-0.035em]">
              Разберём твой процесс за 15 минут
            </h2>
            <p className="mt-5 max-w-[460px] text-[16px] text-white/65">
              Пришли прайс, ссылку на сайт или расскажи голосом, что сейчас забирает время. Отвечу в тот же день со схемой и ценой.
            </p>
            <div className="mt-8">
              <a
                href={TG}
                target="_blank"
                rel="noopener noreferrer"
                className="lusion-pill inline-flex items-center gap-3 rounded-full bg-[#1b3bff] px-7 py-4 text-[13px] font-bold uppercase tracking-[0.08em] text-white hover:bg-[#3251ff]"
              >
                Написать в Telegram
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="grid gap-4">
            <input
              name="name"
              required
              autoComplete="name"
              placeholder="Как тебя зовут"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-[16px] text-white placeholder:text-white/40 outline-none focus:border-[#5c7cff]"
            />
            <input
              name="contact"
              required
              autoComplete="tel"
              placeholder="Telegram или телефон"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-[16px] text-white placeholder:text-white/40 outline-none focus:border-[#5c7cff]"
            />
            <textarea
              name="task"
              required
              rows={3}
              placeholder="Коротко о задаче"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-[16px] text-white placeholder:text-white/40 outline-none focus:border-[#5c7cff]"
            />
            <button
              type="submit"
              className="lusion-pill w-full rounded-full bg-white py-3.5 text-[12px] font-bold uppercase tracking-[0.08em] text-[#0b0c10] hover:bg-[#f0f1fa] cursor-pointer"
            >
              Отправить заявку
            </button>
            {formMsg && (
              <p className="text-[13px] font-semibold text-[#8ca3ff]" role="status" aria-live="polite">
                {formMsg}
              </p>
            )}
          </form>
        </div>

        <footer className="mx-auto w-full max-w-[1440px] mt-8 flex flex-wrap items-center justify-between gap-4 text-[12px] font-bold uppercase tracking-[0.08em] text-[#0b0c10]/50">
          <span>TMV LABS · МАКСИМ</span>
          <a href={TG} target="_blank" rel="noopener noreferrer" className="hover:text-[#1b3bff]">
            TELEGRAM @TMV1301
          </a>
          <span>© 2026</span>
        </footer>
      </section>
    </div>
  );
}
