import React, { useState } from 'react';
import { Globe, Mic, Repeat, Camera, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { TG, CASES, TOOLS, PRICES, STEPS, TRUST_STATS } from '../data/content';
import { BorderBeamCard, MagneticButton, NumberTicker, SafariMockup, SpotlightCard } from './MagicEffects';

const TOOL_ICONS = { mic: Mic, swap: Repeat, camera: Camera };

export function CasesPricingRest() {
  const [formMsg, setFormMsg] = useState('');

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
    <>
      {/* RAMP ECONOMICS */}
      <section className="py-16 lg:py-22 bg-white">
        <div className="mx-auto w-[min(1240px,calc(100%-32px))]">
          <div className="max-w-[740px] mb-9">
            <p className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-[#2357c6] mb-2">
              Экономика внедрения
            </p>
            <h2 className="font-[var(--font-display)] text-[28px] sm:text-[46px] font-extrabold leading-[1.06] tracking-[-0.035em] text-slate-900">
              Бот или сотрудник
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="rounded-[26px] border border-slate-900/10 bg-[#f7f9fc] p-8 flex flex-col">
              <span className="text-[12px] font-extrabold uppercase tracking-wider text-slate-500">
                Постоянные расходы
              </span>
              <h3 className="mt-3 font-[var(--font-display)] text-[22px] font-extrabold text-slate-900">
                Менеджер на ответы клиентам
              </h3>
              <div className="mt-5 font-[var(--font-tech)] text-[32px] sm:text-[42px] font-bold tracking-tight text-slate-900">
                от 45 000 ₽
              </div>
              <p className="mt-2 text-[15px] text-slate-600">
                каждый месяц: отпуск, больничные, не отвечает ночью и в выходные.
              </p>
            </div>

            <BorderBeamCard
              innerClassName="p-8 bg-gradient-to-br from-[#2357c6] to-[#173c91] text-white flex flex-col"
            >
              <span className="text-[12px] font-extrabold uppercase tracking-wider text-blue-200">
                Окупается с первого месяца
              </span>
              <h3 className="mt-3 font-[var(--font-display)] text-[22px] font-extrabold text-white">
                ИИ-бот под твой бизнес
              </h3>
              <div className="mt-5 font-[var(--font-tech)] text-[32px] sm:text-[42px] font-bold tracking-tight text-white">
                от 20 000 ₽
              </div>
              <p className="mt-2 text-[15px] text-blue-100">
                один раз, готов за 3–5 дней, работает ночью и в выходные.
              </p>
              <div className="mt-auto pt-6 flex flex-wrap items-center justify-between gap-4">
                <span className="text-[14px] font-bold text-white">Мне автоматизация каждый день возвращает часы.</span>
                <MagneticButton href={TG} variant="light">
                  Посчитать для моего бизнеса
                </MagneticButton>
              </div>
            </BorderBeamCard>
          </div>
        </div>
      </section>

      {/* CASES WITH REAL SCREENSHOTS IN SAFARI MOCKUPS */}
      <section id="cases" className="py-16 lg:py-22 bg-[#f7f9fc] border-y border-slate-900/8 scroll-mt-20">
        <div className="mx-auto w-[min(1240px,calc(100%-32px))]">
          <div className="max-w-[780px] mb-9">
            <p className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-[#2357c6] mb-2">
              Реальные проекты и скриншоты
            </p>
            <h2 className="font-[var(--font-display)] text-[28px] sm:text-[46px] font-extrabold leading-[1.06] tracking-[-0.035em] text-slate-900">
              Сначала сделал себе. Потом клиентам
            </h2>
            <p className="mt-3 text-[17px] text-slate-600">
              Сайты ПроГаджет, ProService (TMV Repair), Аксинья Про, Гаджет Про, аналитика Valyx, CRM TMV Hub и рабочие боты.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {CASES.map((c) => (
              <SpotlightCard key={c.name} className="group p-3.5 flex flex-col">
                <SafariMockup url={c.name} badge={c.kind}>
                  {c.shot ? (
                    <div className="overflow-hidden aspect-[16/10]">
                      <img
                        src={c.shot}
                        alt={c.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] p-5 dot-grid bg-[#f6f9ff] flex flex-col justify-center gap-2.5">
                      <div className="flex items-center justify-between rounded-xl border border-slate-900/8 bg-white px-4 py-3 text-[13px] font-bold">
                        <span>Сверка цен с сайтом</span>
                        <span className="text-[#2357c6]">Автоматически</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-[#2357c6] px-4 py-3 text-[13px] font-bold text-white shadow-md">
                        <span>ИИ-ответы клиентам</span>
                        <span>24/7 без пауз</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-slate-900/8 bg-white px-4 py-3 text-[13px] font-bold">
                        <span>Заявка владельцу</span>
                        <span className="text-[#2357c6]">Сразу в Telegram</span>
                      </div>
                    </div>
                  )}
                </SafariMockup>
                <div className="p-4 pt-5">
                  <h3 className="font-[var(--font-display)] text-[20px] font-extrabold text-slate-900">{c.name}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-slate-600">
                    {c.task} {c.did}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-extrabold text-[#2357c6]">
                    <Sparkles className="h-3.5 w-3.5" /> {c.res}
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>

          {/* PONDEX in progress */}
          <SpotlightCard className="mt-5 p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#2357c6]">Сейчас в работе</span>
              <h3 className="mt-1 font-[var(--font-display)] text-[20px] font-extrabold text-slate-900">
                PONDEX, бюро земельных решений
              </h3>
              <p className="mt-1 text-[14px] text-slate-600">
                Сайт с понятными этапами, заявки в одном месте, утренняя сводка подходящих лотов.
              </p>
            </div>
            <MagneticButton href={TG} variant="light">
              Обсудить похожую задачу
            </MagneticButton>
          </SpotlightCard>

          {/* Tools */}
          <div className="mt-16 mb-6">
            <p className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-[#2357c6] mb-2">Свои утилиты</p>
            <h2 className="font-[var(--font-display)] text-[26px] sm:text-[38px] font-extrabold leading-[1.08] tracking-[-0.03em] text-slate-900">
              Делаю инструменты и для себя
            </h2>
            <p className="mt-2 text-[16px] text-slate-600">Если инструмент полезен мне каждый день, он пригодится и тебе.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TOOLS.map((t) => {
              const Icon = TOOL_ICONS[t.icon];
              return (
                <SpotlightCard key={t.name} className="group p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-900/8 bg-slate-50 text-slate-600 transition-all group-hover:bg-[#2357c6] group-hover:text-white group-hover:border-[#2357c6] group-hover:shadow-[0_0_20px_rgba(35,87,198,0.45)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full border border-slate-900/10 bg-slate-50 px-2.5 py-0.5 text-[11px] font-extrabold text-slate-500">
                      macOS
                    </span>
                  </div>
                  <h3 className="font-[var(--font-display)] text-[18px] font-extrabold text-slate-900">{t.name}</h3>
                  <p className="mt-1.5 text-[14px] text-slate-600">{t.text}</p>
                </SpotlightCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRICES */}
      <section id="prices" className="py-16 lg:py-22 bg-white scroll-mt-20">
        <div className="mx-auto w-[min(1240px,calc(100%-32px))]">
          <div className="max-w-[740px] mb-9">
            <p className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-[#2357c6] mb-2">Понятные тарифы</p>
            <h2 className="font-[var(--font-display)] text-[28px] sm:text-[46px] font-extrabold leading-[1.06] tracking-[-0.035em] text-slate-900">
              Цены до старта, без сюрпризов
            </h2>
            <p className="mt-3 text-[17px] text-slate-600">
              Точную цену называю после разбора. Она фиксируется до старта.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRICES.map((p, i) => {
              const inner = (
                <div className="flex h-full flex-col p-6">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#2357c6]">
                    {p.featured ? 'Выгодный пакет' : `0${i + 1}`}
                  </span>
                  <h3 className="mt-2 font-[var(--font-display)] text-[19px] font-extrabold text-slate-900">{p.title}</h3>
                  <p className="mt-2 text-[14px] text-slate-600">{p.desc}</p>
                  <div className="mt-auto pt-6 font-[var(--font-tech)] text-[26px] font-bold tracking-tight text-slate-900">
                    {p.price}
                  </div>
                  <div className="mt-1 text-[13px] font-bold text-[#2357c6]">{p.term}</div>
                </div>
              );

              return p.featured ? (
                <BorderBeamCard key={p.title} innerClassName="bg-gradient-to-b from-[#f4f8ff] to-white">
                  {inner}
                </BorderBeamCard>
              ) : (
                <SpotlightCard key={p.title}>{inner}</SpotlightCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* SEO + STEPS */}
      <section className="py-16 lg:py-22 bg-[#f7f9fc] border-y border-slate-900/8">
        <div className="mx-auto w-[min(1240px,calc(100%-32px))]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center mb-16">
            <div>
              <p className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-[#2357c6] mb-2">SEO для Яндекса</p>
              <h2 className="font-[var(--font-display)] text-[28px] sm:text-[42px] font-extrabold leading-[1.08] tracking-[-0.035em] text-slate-900">
                Статьи, по которым тебя находят в Яндексе
              </h2>
              <p className="mt-3 text-[17px] text-slate-600">
                Собираю реальные запросы твоих клиентов в Вордстате и запускаю регулярные статьи по твоим кейсам. Сайт получает клиентов из поиска, а не только из рекламы.
              </p>
              <div className="mt-6">
                <MagneticButton href={TG} variant="blue">
                  Запустить статьи <ArrowRight className="h-4 w-4" />
                </MagneticButton>
              </div>
            </div>

            <SpotlightCard className="group p-7">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef4ff] text-[#2357c6] group-hover:bg-[#2357c6] group-hover:text-white transition-colors">
                  <Globe className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-[11px] font-extrabold text-[#2357c6]">
                  SEO-блог
                </span>
              </div>
              <p className="text-[12px] font-extrabold uppercase tracking-wider text-[#2357c6]">
                блог сайта ремонта proserviceul.ru
              </p>
              <h3 className="mt-2 font-[var(--font-display)] text-[20px] font-extrabold text-slate-900">
                Статьи по реальным запросам клиентов
              </h3>
              <p className="mt-2 text-[14px] text-slate-600">
                Не пустые тексты ради галочки, а ответы на вопросы покупателей с переходом в заявку на сайте.
              </p>
            </SpotlightCard>
          </div>

          <div className="mb-7">
            <p className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-[#2357c6] mb-2">Процесс</p>
            <h2 className="font-[var(--font-display)] text-[28px] sm:text-[42px] font-extrabold leading-[1.08] tracking-[-0.035em] text-slate-900">
              Как работаем
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {STEPS.map((s, i) => (
              <SpotlightCard key={s.short} className="p-5">
                <span className="inline-block rounded-full bg-[#eef4ff] px-2.5 py-1 text-[12px] font-extrabold text-[#2357c6] mb-3">
                  0{i + 1}
                </span>
                <h3 className="font-[var(--font-display)] text-[17px] font-extrabold text-slate-900">{s.short}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{s.full}</p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section id="about" className="py-16 lg:py-22 bg-white scroll-mt-20">
        <div className="mx-auto w-[min(1240px,calc(100%-32px))] grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SpotlightCard className="p-7">
            <p className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-[#2357c6] mb-2">Опыт и доверие</p>
            <h2 className="font-[var(--font-display)] text-[26px] sm:text-[36px] font-extrabold leading-[1.1] tracking-[-0.03em] text-slate-900">
              Меня знают как предпринимателя
            </h2>
            <p className="mt-2 text-[16px] text-slate-600">Мой магазин и сервис ПроГаджет в Усть-Лабинске.</p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TRUST_STATS.map((st) => (
                <div key={st.label} className="rounded-2xl bg-[#eef4ff] p-4">
                  <div className="font-[var(--font-tech)] text-[26px] font-bold text-[#2357c6]">
                    <NumberTicker value={st.value} decimals={st.decimals || 0} suffix={st.suffix} />
                  </div>
                  <div className="mt-1 text-[12px] font-bold text-slate-600">{st.label}</div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[13px] text-slate-500">
              Это отзывы о магазине и сервисе. Отзывы о разработке появятся после первых клиентов.
            </p>
          </SpotlightCard>

          <SpotlightCard className="p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef4ff] text-[#2357c6]">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-[11px] font-extrabold text-[#2357c6]">
                  Личный подход
                </span>
              </div>
              <h3 className="font-[var(--font-display)] text-[22px] font-extrabold text-slate-900">
                Веду проект сам, от разбора до запуска
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
                Каждый проект веду лично, от разбора до запуска. Под объём подключаю проверенных людей, за результат отвечаю я.
              </p>
              <p className="mt-3 text-[15px] font-bold text-slate-900">
                Мне автоматизация каждый день возвращает часы.
              </p>
            </div>
            <div className="mt-6">
              <MagneticButton href={TG} variant="blue">
                Узнать цену моей задачи <ArrowRight className="h-4 w-4" />
              </MagneticButton>
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* FINAL CTA + FORM */}
      <section id="final" className="pb-20 pt-4 bg-white">
        <div className="mx-auto w-[min(1240px,calc(100%-32px))]">
          <div className="rounded-[30px] bg-gradient-to-br from-[#2357c6] to-[#173c91] p-7 sm:p-12 text-white shadow-[0_30px_64px_-24px_rgba(35,87,198,0.55)] grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-blue-200 mb-3">Быстрый старт</p>
              <h2 className="font-[var(--font-display)] text-[28px] sm:text-[42px] font-extrabold leading-[1.08] tracking-[-0.03em] text-white">
                Напиши в Telegram: разберём твой процесс за 15 минут
              </h2>
              <p className="mt-4 text-[17px] text-blue-100">
                Пришли прайс, ссылку на сайт или просто расскажи голосом, что сейчас забирает время. Отвечу в тот же день со схемой и ценой.
              </p>
              <div className="mt-7">
                <MagneticButton href={TG} variant="light">
                  Написать в Telegram <ArrowRight className="h-4 w-4" />
                </MagneticButton>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="rounded-2xl bg-white p-6 text-slate-900 grid gap-3.5">
              <label className="grid gap-1.5 text-[13px] font-extrabold">
                Как тебя зовут
                <input
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Максим"
                  className="w-full rounded-xl border border-slate-900/15 px-3.5 py-3 text-[16px] font-medium outline-none focus:border-[#2357c6] focus:ring-2 focus:ring-[#2357c6]/15"
                />
              </label>
              <label className="grid gap-1.5 text-[13px] font-extrabold">
                Telegram или телефон
                <input
                  name="contact"
                  required
                  autoComplete="tel"
                  placeholder="@username или +7..."
                  className="w-full rounded-xl border border-slate-900/15 px-3.5 py-3 text-[16px] font-medium outline-none focus:border-[#2357c6] focus:ring-2 focus:ring-[#2357c6]/15"
                />
              </label>
              <label className="grid gap-1.5 text-[13px] font-extrabold">
                Коротко о задаче
                <textarea
                  name="task"
                  required
                  rows={3}
                  placeholder="Например: бот для заявок с Авито и сайта"
                  className="w-full rounded-xl border border-slate-900/15 px-3.5 py-3 text-[16px] font-medium outline-none focus:border-[#2357c6] focus:ring-2 focus:ring-[#2357c6]/15"
                />
              </label>
              <MagneticButton type="submit" variant="blue" className="w-full">
                Отправить заявку
              </MagneticButton>
              {formMsg && (
                <p className="text-[13px] font-bold text-[#2357c6]" role="status" aria-live="polite">
                  {formMsg}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
