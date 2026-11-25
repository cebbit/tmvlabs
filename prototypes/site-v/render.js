// Полноширинный Bento-дизайн TMV Labs: единая ровная сетка, светлая тема, синий акцент #2357c6.
import { TG, bots, math, cases, tools, prices, seo, steps, trust, fin } from './content.js';
import { screen } from './screens.js';

const cta = (t, cls = '') =>
  `<a class="v-btn ${cls}" href="${TG}" target="_blank" rel="noopener noreferrer">${t}</a>`;

const form = (btn) => `<form class="v-form" novalidate>
  <label class="v-field"><span>Как тебя зовут</span><input name="name" required autocomplete="name" placeholder="Максим"></label>
  <label class="v-field"><span>Telegram или телефон</span><input name="contact" required autocomplete="tel" placeholder="@username или +7..."></label>
  <label class="v-field"><span>Коротко о задаче</span><textarea name="task" rows="3" required placeholder="Например: бот для заявок с Авито и сайта"></textarea></label>
  <button type="submit" class="v-btn v-btn-blue v-btn-full">${btn}</button>
  <p class="v-form-msg" role="status" aria-live="polite"></p>
</form>`;

const marqueeItems = [
  'Telegram-боты',
  'Сайты и лендинги',
  'CRM под процесс',
  'Аналитика Wildberries',
  'Авито-автоматизация',
  'SEO для Яндекса',
  'ИИ-ассистенты',
  'Контент-конвейер',
];

function renderStudio() {
  const mq = marqueeItems.map((x) => `<span>${x}</span><i>✦</i>`).join('');

  return `
  <div class="v-marquee" aria-hidden="true">
    <div class="v-marquee-track">${mq}${mq}</div>
  </div>

  <div class="v-wrap">
    <!-- БОТЫ -->
    <section class="v-sec" id="bots" data-reveal>
      <div class="v-bento-head">
        <div>
          <p class="v-eyebrow">Автоматизация и боты</p>
          <h2>Боты, которые уже работают в живом бизнесе</h2>
          <p class="v-lead">Каждый сценарий сначала обкатан на собственном магазине, сервисе и задачах — без лишней теории.</p>
          <div class="v-actions">${cta(bots.cta, 'v-btn-blue')}</div>
        </div>
        <div class="v-visual-card">
          <img src="../../assets/visuals/bots-3d.svg" alt="Схема работы Telegram-ботов и автоматизации" loading="lazy" width="640" height="400">
        </div>
      </div>

      <div class="v-subhead"><span>Уже в бою</span></div>
      <div class="v-grid v-grid-3">
        ${bots.live
          .map(
            ([t, d, w], i) => `<article class="v-card v-card-lift" data-reveal style="--stagger:${i}">
          <div class="v-card-top">
            <span class="v-num">0${i + 1}</span>
            ${w ? `<span class="v-pill">${w}</span>` : `<span class="v-pill v-pill-soft">Готовый сценарий</span>`}
          </div>
          <h3>${t}</h3>
          <p>${d}</p>
        </article>`
          )
          .join('')}
      </div>

      <div class="v-subhead"><span>Делаю под задачу бизнеса</span></div>
      <div class="v-grid v-grid-market">
        ${bots.market
          .map(
            ([t, d], i) => `<article class="v-card v-card-soft v-card-lift" data-reveal style="--stagger:${i}">
          <h3>${t}</h3>
          <p>${d}</p>
        </article>`
          )
          .join('')}
      </div>
    </section>

    <!-- БОТ ИЛИ СОТРУДНИК -->
    <section class="v-sec" id="math" data-reveal>
      <div class="v-sec-head">
        <p class="v-eyebrow">Экономика внедрения</p>
        <h2>${math.h}</h2>
      </div>
      <div class="v-math-grid">
        <article class="v-math-card v-math-plain" data-reveal>
          <span class="v-pill v-pill-soft">Постоянные расходы</span>
          <h3>${math.man[0]}</h3>
          <div class="v-math-price">${math.man[1]}</div>
          <p class="v-math-sub">${math.man[2]} · отпуск, больничные, не отвечает ночью</p>
        </article>
        <article class="v-math-card v-math-accent v-tilt" data-reveal>
          <span class="v-pill v-pill-light">Окупается с первого месяца</span>
          <h3>${math.bot[0]}</h3>
          <div class="v-math-price">${math.bot[1]}</div>
          <p class="v-math-sub">${math.bot[2]}</p>
          <div class="v-math-foot">
            <span>${math.own}</span>
            ${cta(math.cta, 'v-btn-white')}
          </div>
        </article>
      </div>
    </section>

    <!-- КЕЙСЫ -->
    <section class="v-sec" id="cases" data-reveal>
      <div class="v-sec-head">
        <p class="v-eyebrow">Реальные проекты и экраны</p>
        <h2>${cases.h}</h2>
        <p class="v-lead">Живые интерфейсы, сайты, CRM и боты, которыми я и клиенты пользуемся каждый день.</p>
      </div>

      <div class="v-cases-grid">
        ${cases.list
          .map(
            (c, i) => `<article class="v-case-card v-tilt" data-reveal style="--stagger:${i % 2}">
          <div class="v-case-media">${screen(c)}</div>
          <div class="v-case-body">
            <div class="v-case-meta">
              <span class="v-pill">Кейс 0${i + 1}</span>
              <span class="v-case-res">${c.res}</span>
            </div>
            <h3>${c.name}</h3>
            <dl class="v-case-dl">
              <div><dt>Задача</dt><dd>${c.task}</dd></div>
              <div><dt>Решение</dt><dd>${c.did}</dd></div>
            </dl>
          </div>
        </article>`
          )
          .join('')}
      </div>

      <article class="v-dev-banner" data-reveal>
        <div class="v-dev-top">
          <span class="v-pill v-pill-blue">Сейчас в разработке</span>
          <h3>${cases.dev.name}</h3>
          <p>${cases.dev.did}</p>
        </div>
        <div class="v-dev-cols">
          <div>
            <strong>Что болит сейчас</strong>
            <ul>${cases.dev.pains.map((p) => `<li>${p}</li>`).join('')}</ul>
          </div>
          <div>
            <strong>Что делаем</strong>
            <p>${cases.dev.will}</p>
          </div>
        </div>
      </article>
    </section>

    <!-- ЦЕНЫ -->
    <section class="v-sec" id="prices" data-reveal>
      <div class="v-sec-head">
        <p class="v-eyebrow">Прозрачный прайс</p>
        <h2>${prices.h}</h2>
        <p class="v-lead">${prices.fix}</p>
      </div>

      <div class="v-prices-grid">
        ${prices.list
          .map(([name, desc, val, term], i) => {
            const featured = i === 3 || i === 5;
            return `<article class="v-price-card ${featured ? 'is-featured' : ''} v-tilt" data-reveal style="--stagger:${i % 3}">
              <div class="v-price-top">
                <div class="v-price-head">
                  <span class="v-num">0${i + 1}</span>
                  ${featured ? '<span class="v-pill v-pill-blue">Популярно</span>' : term ? `<span class="v-pill v-pill-soft">${term}</span>` : ''}
                </div>
                <h3>${name}</h3>
                ${desc ? `<p class="v-price-desc">${desc}</p>` : '<p class="v-price-desc">Под ключ под задачу твоего бизнеса с передачей всех доступов.</p>'}
              </div>
              <div class="v-price-bottom">
                <div class="v-price-val">
                  <strong>${val}</strong>
                  ${term && featured ? `<span>${term}</span>` : ''}
                </div>
                ${cta('Обсудить задачу', featured ? 'v-btn-blue v-btn-full' : 'v-btn-ghost v-btn-full')}
              </div>
            </article>`;
          })
          .join('')}
      </div>

      <div class="v-prices-note" data-reveal>
        <p>${prices.me}</p>
        ${cta(prices.cta, 'v-btn-dark')}
      </div>
    </section>

    <!-- SEO + СВОИ ИНСТРУМЕНТЫ -->
    <section class="v-sec" id="seo" data-reveal>
      <div class="v-seo-bento">
        <article class="v-card v-seo-main" data-reveal>
          <p class="v-eyebrow">Органический трафик</p>
          <h2>${seo.h}</h2>
          <p class="v-lead">${seo.p}</p>
          <p class="v-works-pill"><b>Работает:</b> ${seo.works}</p>
          <div class="v-seo-img">
            <img src="../../assets/visuals/seo-growth-3d.svg" alt="Рост поискового трафика и статей в Яндексе" loading="lazy" width="640" height="360">
          </div>
          ${cta(seo.cta, 'v-btn-blue')}
        </article>

        <div class="v-tools-col" id="tools">
          <div class="v-tools-head">
            <p class="v-eyebrow">Собственные утилиты</p>
            <h3>${tools.h}</h3>
            <p>${tools.note}</p>
          </div>
          <div class="v-tools-list">
            ${tools.list
              .map(
                ([t, d], i) => `<article class="v-card v-tool-card v-card-lift" data-reveal style="--stagger:${i}">
              <span class="v-num">0${i + 1}</span>
              <div>
                <h4>${t}</h4>
                <p>${d}</p>
              </div>
            </article>`
              )
              .join('')}
          </div>
        </div>
      </div>
    </section>

    <!-- КАК РАБОТАЕМ -->
    <section class="v-sec" id="steps" data-reveal>
      <div class="v-sec-head">
        <p class="v-eyebrow">Процесс без воды</p>
        <h2>${steps.h}</h2>
      </div>
      <ol class="v-steps-grid">
        ${steps.list
          .map(
            (s, i) => `<li class="v-step-card" data-reveal style="--stagger:${i}">
          <span class="v-step-num">0${i + 1}</span>
          <h3>${steps.short[i]}</h3>
          <p>${s}</p>
        </li>`
          )
          .join('')}
      </ol>
    </section>

    <!-- ДОВЕРИЕ + ФОТО МАКСИМА -->
    <section class="v-sec" id="trust" data-reveal>
      <div class="v-trust-card">
        <div class="v-trust-info">
          <p class="v-eyebrow">Личный подход · реальный бизнес</p>
          <h2>${trust.h}</h2>
          <p class="v-lead">${trust.p}</p>
          <div class="v-trust-nums">
            ${trust.nums
              .map(
                ([v, l]) => `<div class="v-stat">
              <strong>${v}</strong>
              <span>${l}</span>
            </div>`
              )
              .join('')}
          </div>
          <p class="v-trust-note">${trust.note}</p>
        </div>
        <figure class="v-trust-photo">
          <img src="../../assets/maxim-cutout.png" alt="Максим, основатель TMV Labs" loading="lazy" width="560" height="700">
          <figcaption>
            <b>Максим · TMV Labs</b>
            <span>Делаю системы, которые экономят часы каждый день</span>
          </figcaption>
        </figure>
      </div>
    </section>

    <!-- ФИНАЛЬНЫЙ CTA + ФОРМА -->
    <section class="v-sec v-sec-final" id="final" data-reveal>
      <div class="v-final-card">
        <div class="v-final-copy">
          <span class="v-pill v-pill-light">Разбор за 15 минут</span>
          <h2>${fin.h}</h2>
          <p>Пришли ссылку на сайт, прайс или просто опиши голосом — предложу схему, сроки и точную цену до старта.</p>
          <div class="v-final-actions">
            ${cta(fin.cta + ' · @tmv1301', 'v-btn-blue v-btn-lg')}
          </div>
        </div>
        <div class="v-final-form">
          <h3>Или оставь заявку здесь</h3>
          ${form(fin.form)}
        </div>
      </div>
    </section>
  </div>`;
}

export const VARIANTS = [
  { name: 'TMV Labs', render: renderStudio },
];
