import { TG, bots, math, cases, tools, prices, seo, steps, trust, fin } from './content.js';

const esc = (v) =>
  String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- Crisp SVG symbols (Clerk-style hover glow) ---------- */
const SVG = {
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
  box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  cam: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  sliders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>',
  swap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
};

const botLiveIcons = [SVG.bolt, SVG.chat, SVG.box, SVG.bell, SVG.check, SVG.cam];
const botMarketIcons = [SVG.cal, SVG.sliders, SVG.tag, SVG.star, SVG.send];
const toolIcons = [SVG.mic, SVG.swap, SVG.cam];

/* ---------- Interactive Showcase Data (Clerk style) ---------- */
const liveTabs = [
  {
    num: '01',
    label: 'Боты 24/7',
    title: 'Бот отвечает клиенту за секунды, даже в 03:12 ночи',
    text: 'Принимает вопросы с Авито, Telegram и сайта, проверяет наличие и цену, а готовую заявку сразу присылает тебе в Telegram.',
    works: 'Авито и бот памяток ПроГаджет',
    screenTitle: 'Входящий диалог · 03:12',
    status: 'Онлайн 24/7',
    rows: [
      { left: 'Клиент (Авито)', sub: '«iPhone 15 128 ГБ есть в наличии? Можно в рассрочку?»', right: '03:12' },
      { left: 'ИИ-бот TMV Labs', sub: '«Да, в наличии, цена актуальна. Рассрочка оформляется за 10 минут.»', right: '03:12', accent: true },
      { left: 'Карточка в Telegram владельцу', sub: 'Контакт, модель, интерес к рассрочке', right: 'Готово' },
    ],
  },
  {
    num: '02',
    label: 'Прайсы и витрина',
    title: 'Каталог и цены всегда свежие, без ручной работы',
    text: 'Бот забирает прайс поставщика, применяет твою наценку и обновляет витрину 3 раза в день. Старая цена больше не уходит клиенту.',
    works: 'бот продаж телефонов ПроГаджет',
    screenTitle: 'Прайс поставщика → витрина',
    status: 'Обновление 09:00 · 14:00 · 19:00',
    rows: [
      { left: 'iPhone 15, 128 ГБ', sub: 'Наценка применена автоматически', right: 'Обновлено' },
      { left: 'Galaxy S24, 256 ГБ', sub: 'Сверено с сайтом и Авито', right: 'Обновлено' },
      { left: 'Статус витрины', sub: 'Продаж в минус по старому прайсу нет', right: 'Синхронно', accent: true },
    ],
  },
  {
    num: '03',
    label: 'CRM TMV Hub',
    title: 'Заказы, клиенты, склад и касса в одном окне',
    text: 'Вместо тетрадей и разрозненных чатов вся работа сервиса видна в реальном времени. Клиент сам проверяет статус заказа по номеру.',
    works: 'TMV Hub в сервисе ПроГаджет',
    screenTitle: 'TMV Hub · живой экран',
    status: 'В работе каждый день',
    shot: '../../assets/shots/tmvhub.jpg',
  },
  {
    num: '04',
    label: 'Аналитика Valyx',
    title: 'Видно чистую прибыль, а не просто выручку',
    text: 'Система собирает продажи, комиссии, эквайринг и расходы, чтобы владелец видел реальный остаток денег по каждому товару.',
    works: 'Valyx для продавцов Wildberries',
    screenTitle: 'Valyx · реальный интерфейс',
    status: 'Живые данные',
    shot: '../../assets/shots/valyx-real.jpg',
  },
  {
    num: '05',
    label: 'Контент-конвейер',
    title: 'Записал ролик один раз, система выложила везде',
    text: 'Подготовка черновиков, согласование кнопкой в Telegram и публикация по расписанию сразу в Telegram, MAX, Instagram, YouTube и ВК.',
    works: 'Content Hub',
    screenTitle: 'Контент-конвейер · выдача',
    status: '5 площадок',
    shot: '../../assets/shots/content-hub.jpg',
  },
];

/* ---------- Interactive Ecosystem Map (Ramp + Clerk) ---------- */
const mapInputs = [
  { id: 0, label: 'Авито', icon: SVG.tag, outIdx: [0, 2], tag: 'Авито 24/7', desc: 'Клиент пишет ночью на Авито: бот сверяет цену с сайтом, отвечает за секунды и присылает заявку в Telegram.' },
  { id: 1, label: 'Telegram', icon: SVG.send, outIdx: [0, 1], tag: 'Telegram-бот', desc: 'Диалог с клиентом превращается в готовую карточку заявки и сразу фиксируется в CRM без ручного копирования.' },
  { id: 2, label: 'Instagram / Reels', icon: SVG.cam, outIdx: [0, 3], tag: 'Кодовое слово', desc: 'Человек пишет кодовое слово под роликом, получает полезный материал в личку, а база лидов копится сама.' },
  { id: 3, label: 'Сайт и Яндекс', icon: SVG.globe, outIdx: [0, 1], tag: 'Поиск + заявки', desc: 'Статьи приводят клиентов из Яндекса, форма или квиз передают заявку в Telegram и CRM с источником.' },
  { id: 4, label: 'Прайсы поставщика', icon: SVG.chart, outIdx: [2, 3], tag: 'Автопрайс', desc: 'Прайс загружается автоматически, считается наценка, витрина обновляется, а утром приходит короткая сводка.' },
];

const mapOutputs = [
  { id: 0, label: 'Заявка в Telegram', icon: SVG.bell },
  { id: 1, label: 'Заказ в CRM', icon: SVG.box },
  { id: 2, label: 'Свежая витрина', icon: SVG.bolt },
  { id: 3, label: 'Утренняя сводка', icon: SVG.check },
];

const cardList = (items, icons) =>
  items
    .map(
      ([title, text, tag], i) => `
      <article class="card" data-spotlight>
        <div class="sym" aria-hidden="true">${icons[i % icons.length]}</div>
        <h3>${esc(title)}</h3>
        <p>${esc(text)}</p>
        ${tag ? `<span class="card-tag">${esc(tag)}</span>` : ''}
      </article>`
    )
    .join('');

const caseCard = (item) => `
  <article class="card case" data-spotlight>
    <div class="case-media">
      ${
        item.shot
          ? `<img src="../../assets/shots/${esc(item.shot)}" alt="${esc(item.name)}" loading="lazy">`
          : `<div class="case-widget">
              <div class="demo-row"><span>Сверка цен с сайтом</span><b>Автоматически</b></div>
              <div class="demo-row accent"><span>ИИ-ответы клиентам</span><b>24/7 без пауз</b></div>
              <div class="demo-row"><span>Заявка владельцу</span><b>Сразу в Telegram</b></div>
            </div>`
      }
    </div>
    <div class="case-body">
      <h3>${esc(item.name)}</h3>
      <p>${esc(item.task)} ${esc(item.did)}</p>
      <div class="case-res">✦ ${esc(item.res)}</div>
    </div>
  </article>`;

const app = document.querySelector('#app');
app.innerHTML = `
<header class="topbar">
  <a class="brand" href="#top"><img src="../../assets/logo/mark.svg" alt="">TMV Labs</a>
  <nav class="nav" aria-label="Навигация">
    <a href="#showcase">Витрина</a>
    <a href="#system">Система</a>
    <a href="#cases">Кейсы</a>
    <a href="#prices">Цены</a>
    <a href="#about">Обо мне</a>
  </nav>
  <a class="btn btn-blue" href="${TG}" target="_blank" rel="noopener noreferrer">Telegram</a>
</header>

<main id="top">
  <!-- HERO -->
  <section class="hero" id="hero">
    <div class="wrap hero-grid">
      <div>
        <span class="badge"><span class="badge-dot"></span>Разработка и автоматизация для бизнеса</span>
        <h1>Твой бизнес отвечает клиентам, даже когда ты спишь</h1>
        <p class="hero-lead">21 год в технике и собственный магазин с сервисом ПроГаджет. Сначала проверяю ботов, сайты и CRM на своём бизнесе, потом внедряю тебе.</p>
        <div class="actions">
          <a class="btn btn-blue" href="${TG}" target="_blank" rel="noopener noreferrer">Обсудить проект в Telegram</a>
          <a class="btn btn-light" href="#system">Смотреть схему системы</a>
        </div>
        <div class="hero-meta">
          <span><i></i>Цена фиксируется до старта</span>
          <span><i></i>Запуск от 3 дней</span>
          <span><i></i>Все доступы на тебя</span>
        </div>
      </div>

      <div class="canvas-card">
        <div class="canvas-head">
          <div class="canvas-dots"><span></span><span></span><span></span></div>
          <span>Наведи курсор на блоки TMV LABS</span>
        </div>
        <div class="canvas-stage">
          <canvas id="logo-canvas" width="760" height="520" aria-label="Интерактивная сборка знака TMV LABS из модульных блоков"></canvas>
        </div>
        <div class="canvas-pills">
          <div class="canvas-pill"><strong>Боты 24/7</strong><span>Ответ за секунды</span></div>
          <div class="canvas-pill"><strong>Свои системы</strong><span>CRM и аналитика</span></div>
          <div class="canvas-pill"><strong>Сайты + SEO</strong><span>Заявки из поиска</span></div>
        </div>
      </div>
    </div>
  </section>

  <!-- CLERK INTERACTIVE SHOWCASE -->
  <section class="showcase" id="showcase">
    <div class="wrap">
      <div class="showcase-top">
        <div>
          <p class="eyebrow">Живая витрина</p>
          <h2 style="font:400 clamp(26px,3.2vw,40px)/1.08 var(--display);margin:0;letter-spacing:-.025em">Что сделаю для твоего бизнеса</h2>
        </div>
        <div class="showcase-tabs" role="tablist" aria-label="Направления TMV Labs">
          ${liveTabs
            .map(
              (tab, i) =>
                `<button class="tab ${i === 0 ? 'active' : ''}" role="tab" aria-selected="${i === 0}" data-tab="${i}"><span class="tab-num">${tab.num}</span>${tab.label}</button>`
            )
            .join('')}
        </div>
      </div>
      <div class="demo" id="demo-box"></div>
    </div>
  </section>

  <!-- RAMP + CLERK INTERACTIVE MAP -->
  <section class="section" id="system">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow">Карта системы</p>
        <h2>Из разрозненных каналов в понятный результат</h2>
        <p class="lead">Наведи на любой канал слева: увидишь, как заявки, цены и сообщения проходят через ядро автоматизации.</p>
      </div>

      <div class="map-shell">
        <div class="map-stage" id="map-stage">
          <svg class="map-svg" id="map-svg" viewBox="0 0 1000 380" preserveAspectRatio="none" aria-hidden="true"></svg>

          <div class="nodes" id="map-in">
            ${mapInputs
              .map(
                (n, i) => `
              <button type="button" class="node ${i === 0 ? 'active' : ''}" data-route="${i}">
                <span class="node-sym">${n.icon}</span>
                <span>${esc(n.label)}</span>
              </button>`
              )
              .join('')}
          </div>

          <div class="map-center">
            <div class="core">
              <div class="core-logo"><img src="../../assets/logo/mark.svg" alt=""></div>
              <strong>TMV Labs</strong>
              <small>ИИ-бот · сверка цен · правила</small>
            </div>
          </div>

          <div class="nodes" id="map-out">
            ${mapOutputs
              .map(
                (o, i) => `
              <div class="node" data-out="${i}">
                <span class="node-sym">${o.icon}</span>
                <span>${esc(o.label)}</span>
              </div>`
              )
              .join('')}
          </div>
        </div>

        <div class="map-info">
          <span class="map-info-tag" id="map-tag"></span>
          <div class="map-info-text" id="map-info"></div>
          <a class="btn btn-blue" href="${TG}" target="_blank" rel="noopener noreferrer">Собрать под свой бизнес</a>
        </div>
      </div>
    </div>
  </section>

  <!-- BOTS BENTO -->
  <section class="section" style="background:var(--surface);border-top:1px solid var(--line);border-bottom:1px solid var(--line)">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow">Боты и автоматизация</p>
        <h2>Сценарии, которые уже работают в живом бизнесе</h2>
        <p class="lead">Каждый бот решает конкретную задачу без лишних звонков и ручного контроля.</p>
      </div>
      <div class="grid grid-3">${cardList(bots.live, botLiveIcons)}</div>

      <div class="sub-label">Делаю под задачу бизнеса</div>
      <div class="grid grid-3">${cardList(bots.market, botMarketIcons)}</div>
    </div>
  </section>

  <!-- ECONOMICS (RAMP STYLE) -->
  <section class="section">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow">Экономика внедрения</p>
        <h2>${esc(math.h)}</h2>
      </div>
      <div class="compare">
        <article class="compare-card">
          <span class="compare-label">Постоянные расходы</span>
          <h3 style="margin:12px 0 0;font-size:22px">${esc(math.man[0])}</h3>
          <div class="price-num">${esc(math.man[1])}</div>
          <p>${esc(math.man[2])}: отпуск, больничные, не отвечает ночью и в выходные.</p>
        </article>
        <article class="compare-card blue">
          <span class="compare-label">Окупается с первого месяца</span>
          <h3 style="margin:12px 0 0;font-size:22px;color:#fff">${esc(math.bot[0])}</h3>
          <div class="price-num">${esc(math.bot[1])}</div>
          <p>${esc(math.bot[2])}.</p>
          <div class="compare-foot">
            <span>${esc(math.own)}</span>
            <a class="btn btn-light" href="${TG}" target="_blank" rel="noopener noreferrer">${esc(math.cta)}</a>
          </div>
        </article>
      </div>
    </div>
  </section>

  <!-- CASES -->
  <section class="section" id="cases" style="background:var(--surface);border-top:1px solid var(--line);border-bottom:1px solid var(--line)">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow">Реальные проекты и скриншоты</p>
        <h2>${esc(cases.h)}</h2>
        <p class="lead">Живые интерфейсы, сайты, CRM и боты, которыми я и клиенты пользуемся каждый день.</p>
      </div>

      <div class="grid cases">${cases.list.map(caseCard).join('')}</div>

      <div class="card dev-card" data-spotlight>
        <div>
          <p class="eyebrow" style="margin-bottom:6px">Сейчас в работе</p>
          <h3>${esc(cases.dev.name)}</h3>
          <p>${esc(cases.dev.will)}</p>
        </div>
        <a class="btn btn-light" href="${TG}" target="_blank" rel="noopener noreferrer">Обсудить похожую задачу</a>
      </div>

      <div class="section-head" style="margin-top:64px;margin-bottom:24px">
        <p class="eyebrow">Свои утилиты</p>
        <h2>${esc(tools.h)}</h2>
        <p class="lead">${esc(tools.note)}</p>
      </div>
      <div class="grid grid-3">
        ${tools.list
          .map(
            ([t, p], i) => `
          <article class="card" data-spotlight>
            <div class="sym" aria-hidden="true">${toolIcons[i % toolIcons.length]}</div>
            <h3>${esc(t)}</h3>
            <p>${esc(p)}</p>
          </article>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <!-- PRICES -->
  <section class="section" id="prices">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow">Понятные тарифы</p>
        <h2>${esc(prices.h)}</h2>
        <p class="lead">${esc(prices.fix)}</p>
      </div>
      <div class="grid prices">
        ${prices.list
          .map(
            (p, i) => `
          <article class="card price-card ${i === 5 ? 'featured' : ''}" data-spotlight>
            <p class="eyebrow">${i === 5 ? 'Выгодный пакет' : `0${i + 1}`}</p>
            <h3>${esc(p[0])}</h3>
            <p>${esc(p[1] || 'Запуск под ключ под твой процесс')}</p>
            <div class="price-num">${esc(p[2])}</div>
            ${p[3] ? `<div class="price-term">${esc(p[3])}</div>` : '<div class="price-term">Срок фиксируем на разборе</div>'}
          </article>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <!-- SEO + STEPS -->
  <section class="section" style="background:var(--surface);border-top:1px solid var(--line);border-bottom:1px solid var(--line)">
    <div class="wrap">
      <div class="split" style="margin-bottom:72px">
        <div>
          <p class="eyebrow">SEO для Яндекса</p>
          <h2>${esc(seo.h)}</h2>
          <p class="lead">${esc(seo.p)}</p>
          <a class="btn btn-blue" style="margin-top:24px" href="${TG}" target="_blank" rel="noopener noreferrer">${esc(seo.cta)}</a>
        </div>
        <article class="card" data-spotlight style="display:flex;flex-direction:column;justify-content:center">
          <div class="sym" aria-hidden="true">${SVG.globe}</div>
          <p class="eyebrow">${esc(seo.works)}</p>
          <h3>Статьи по реальным запросам клиентов</h3>
          <p>Не пустые тексты ради галочки, а ответы на вопросы покупателей с переходом в заявку на сайте.</p>
        </article>
      </div>

      <div class="section-head">
        <p class="eyebrow">Процесс</p>
        <h2>${esc(steps.h)}</h2>
      </div>
      <div class="grid steps">
        ${steps.short
          .map(
            (s, i) => `
          <article class="card" data-spotlight>
            <span class="step-num">0${i + 1}</span>
            <h3>${esc(s)}</h3>
            <p>${esc(steps.list[i])}</p>
          </article>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <!-- TRUST -->
  <section class="section" id="about">
    <div class="wrap">
      <div class="split">
        <article class="card" data-spotlight>
          <p class="eyebrow">Опыт и доверие</p>
          <h2 style="font-size:clamp(26px,3vw,38px)">${esc(trust.h)}</h2>
          <p class="lead">${esc(trust.p)}</p>
          <div class="stats">
            ${trust.nums.map(([n, l]) => `<div class="stat"><b>${esc(n)}</b><span>${esc(l)}</span></div>`).join('')}
          </div>
          <p style="font-size:13px">${esc(trust.note)}</p>
        </article>

        <article class="card" data-spotlight style="display:flex;flex-direction:column;justify-content:space-between">
          <div>
            <div class="sym" aria-hidden="true">${SVG.check}</div>
            <p class="eyebrow">Личная ответственность</p>
            <h3>Веду проект сам, от разбора до запуска</h3>
            <p style="font-size:15px;margin-top:10px">${esc(prices.me)}</p>
            <p style="font-size:15px;margin-top:14px;color:var(--ink);font-weight:700">${esc(math.own)}</p>
          </div>
          <div style="margin-top:24px">
            <a class="btn btn-blue" href="${TG}" target="_blank" rel="noopener noreferrer">${esc(prices.cta)}</a>
          </div>
        </article>
      </div>
    </div>
  </section>

  <!-- FINAL CTA -->
  <section class="section" id="final" style="padding-top:24px">
    <div class="wrap">
      <div class="final">
        <div>
          <p class="eyebrow" style="color:#c8dbff">Быстрый старт</p>
          <h2>${esc(fin.h)}</h2>
          <p>Пришли прайс, ссылку на сайт или просто расскажи голосом, что сейчас забирает время. Отвечу в тот же день со схемой и ценой.</p>
          <div class="actions">
            <a class="btn btn-light" href="${TG}" target="_blank" rel="noopener noreferrer">${esc(fin.cta)}</a>
          </div>
        </div>

        <form class="form" id="lead-form" novalidate>
          <label>Как тебя зовут<input name="name" required autocomplete="name" placeholder="Максим"></label>
          <label>Telegram или телефон<input name="contact" required autocomplete="tel" placeholder="@username или +7..."></label>
          <label>Коротко о задаче<textarea name="task" required placeholder="Например: бот для заявок с Авито и сайта"></textarea></label>
          <button class="btn btn-blue" type="submit">${esc(fin.form)}</button>
          <p class="form-msg" id="form-msg" role="status" aria-live="polite"></p>
        </form>
      </div>
    </div>
  </section>
</main>

<footer>
  <div class="wrap">
    <span>TMV Labs · Максим, разработка и автоматизация для малого бизнеса</span>
    <a href="${TG}" target="_blank" rel="noopener noreferrer">Telegram @tmv1301</a>
    <span>© 2026</span>
  </div>
</footer>

<a class="sticky" id="sticky-cta" href="${TG}" target="_blank" rel="noopener noreferrer">${esc(fin.sticky)}</a>
`;

/* ---------- 1. Showcase Tabs ---------- */
const demoBox = document.querySelector('#demo-box');
function renderTab(index) {
  const t = liveTabs[index];
  const rightSide = t.shot
    ? `<img class="demo-shot" src="${t.shot}" alt="${esc(t.label)}">`
    : `<div class="demo-feed">
        ${t.rows
          .map(
            (r) => `
          <div class="demo-row ${r.accent ? 'accent' : ''}">
            <div><div>${esc(r.left)}</div><small>${esc(r.sub)}</small></div>
            <b>${esc(r.right)}</b>
          </div>`
          )
          .join('')}
      </div>`;

  demoBox.innerHTML = `
    <div>
      <p class="eyebrow">Сценарий ${t.num}</p>
      <h3>${esc(t.title)}</h3>
      <p class="demo-text">${esc(t.text)}</p>
      <div class="demo-works"><b>Работает:</b> ${esc(t.works)}</div><br>
      <a class="btn btn-blue" href="${TG}" target="_blank" rel="noopener noreferrer">Запустить у себя</a>
    </div>
    <div class="demo-screen">
      <div class="demo-bar">
        <span>${esc(t.screenTitle)}</span>
        <span class="demo-status">${esc(t.status)}</span>
      </div>
      ${rightSide}
    </div>
  `;
}
renderTab(0);

document.querySelectorAll('[data-tab]').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-tab]').forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    renderTab(Number(btn.dataset.tab));
  });
});

/* ---------- 2. Big Interactive SVG Map ---------- */
const mapSvg = document.querySelector('#map-svg');
const mapTag = document.querySelector('#map-tag');
const mapInfo = document.querySelector('#map-info');

const inY = [46, 118, 190, 262, 334];
const outY = [72, 150, 228, 306];

function buildMapPaths() {
  const paths = [];
  inY.forEach((y, i) => {
    const d = `M 260 ${y} C 365 ${y}, 385 190, 495 190`;
    paths.push(`<path class="map-path" data-in-path="${i}" d="${d}"/>`);
    paths.push(`<circle class="map-pulse" data-in-pulse="${i}" r="4.5"><animateMotion dur="1.7s" repeatCount="indefinite" path="${d}"/></circle>`);
  });
  outY.forEach((y, i) => {
    const d = `M 505 190 C 615 190, 635 ${y}, 740 ${y}`;
    paths.push(`<path class="map-path" data-out-path="${i}" d="${d}"/>`);
    paths.push(`<circle class="map-pulse" data-out-pulse="${i}" r="4.5"><animateMotion dur="1.7s" begin="0.4s" repeatCount="indefinite" path="${d}"/></circle>`);
  });
  mapSvg.innerHTML = paths.join('');
}
buildMapPaths();

function setRoute(idx) {
  const item = mapInputs[idx];
  document.querySelectorAll('[data-route]').forEach((n) => n.classList.toggle('active', Number(n.dataset.route) === idx));
  document.querySelectorAll('[data-out]').forEach((o) => o.classList.toggle('active', item.outIdx.includes(Number(o.dataset.out))));
  document.querySelectorAll('[data-in-path]').forEach((p) => p.classList.toggle('active', Number(p.dataset.inPath) === idx));
  document.querySelectorAll('[data-in-pulse]').forEach((p) => p.classList.toggle('active', Number(p.dataset.inPulse) === idx));
  document.querySelectorAll('[data-out-path]').forEach((p) => p.classList.toggle('active', item.outIdx.includes(Number(p.dataset.outPath))));
  document.querySelectorAll('[data-out-pulse]').forEach((p) => p.classList.toggle('active', item.outIdx.includes(Number(p.dataset.outPulse))));
  mapTag.textContent = item.tag;
  mapInfo.textContent = item.desc;
}
setRoute(0);

document.querySelectorAll('[data-route]').forEach((node) => {
  const activate = () => setRoute(Number(node.dataset.route));
  node.addEventListener('mouseenter', activate);
  node.addEventListener('click', activate);
  node.addEventListener('focus', activate);
});

/* ---------- 3. Clerk Spotlight Hover ---------- */
document.querySelectorAll('[data-spotlight]').forEach((el) => {
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

/* ---------- 4. Lead Form ---------- */
document.querySelector('#lead-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const msg = document.querySelector('#form-msg');
  if (!form.checkValidity()) {
    msg.textContent = 'Заполни имя, контакт и задачу.';
    form.reportValidity();
    return;
  }
  msg.textContent = 'Форма готова к подключению к Пульсу. Пока можно написать напрямую в @tmv1301.';
  form.reset();
});

/* ---------- 5. Mobile Sticky CTA (only after Hero) ---------- */
const stickyCta = document.querySelector('#sticky-cta');
const heroEl = document.querySelector('#hero');
const finalEl = document.querySelector('#final');
function updateSticky() {
  if (!stickyCta || !heroEl) return;
  const pastHero = heroEl.getBoundingClientRect().bottom < window.innerHeight * 0.35;
  const nearFinal = finalEl && finalEl.getBoundingClientRect().top < window.innerHeight * 0.85;
  stickyCta.classList.toggle('is-visible', pastHero && !nearFinal);
}
window.addEventListener('scroll', updateSticky, { passive: true });
updateSticky();

/* ---------- 6. Crisp Interactive 2D Pixel Assembly: TMV LABS ---------- */
const canvas = document.querySelector('#logo-canvas');
const ctx = canvas.getContext('2d');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function initLogoCanvas() {
  const W = canvas.width;
  const H = canvas.height;
  const mask = document.createElement('canvas');
  mask.width = W;
  mask.height = H;
  const mctx = mask.getContext('2d');
  mctx.fillStyle = '#000';
  mctx.textAlign = 'center';
  mctx.textBaseline = 'middle';
  mctx.font = '900 176px "Dela Gothic One", Manrope, sans-serif';
  mctx.fillText('TMV', W / 2, H * 0.34);
  mctx.font = '800 116px "Dela Gothic One", Manrope, sans-serif';
  mctx.fillText('LABS', W / 2, H * 0.72);

  const imgData = mctx.getImageData(0, 0, W, H).data;
  const step = 11;
  const size = 8;
  const particles = [];

  for (let y = 10; y < H - 10; y += step) {
    for (let x = 10; x < W - 10; x += step) {
      if (imgData[(y * W + x) * 4 + 3] > 90) {
        const isTop = y < H * 0.54;
        const startSpread = reduceMotion ? 0 : 140;
        particles.push({
          ox: x,
          oy: y,
          x: x + (Math.random() - 0.5) * startSpread,
          y: y + (Math.random() - 0.5) * startSpread,
          vx: 0,
          vy: 0,
          phase: (x + y) * 0.015,
          isBlue: isTop ? Math.random() > 0.25 : Math.random() > 0.65,
        });
      }
    }
  }

  let mx = -9999;
  let my = -9999;
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    mx = ((e.clientX - r.left) * W) / r.width;
    my = ((e.clientY - r.top) * H) / r.height;
  });
  canvas.addEventListener('pointerleave', () => {
    mx = -9999;
    my = -9999;
  });

  function draw(now = 0) {
    ctx.clearRect(0, 0, W, H);
    const t = now * 0.0018;

    for (const p of particles) {
      const dx = p.x - mx;
      const dy = p.y - my;
      const dist = Math.hypot(dx, dy);
      const radius = 125;
      let tx = p.ox;
      let ty = p.oy;

      if (!reduceMotion) {
        tx += Math.sin(t + p.phase) * 1.4;
        ty += Math.cos(t * 0.9 + p.phase) * 1.4;
      }

      if (dist < radius && dist > 0.1) {
        const force = (1 - dist / radius) * 58;
        tx += (dx / dist) * force;
        ty += (dy / dist) * force;
      }

      p.x += (tx - p.x) * (reduceMotion ? 1 : 0.14);
      p.y += (ty - p.y) * (reduceMotion ? 1 : 0.14);

      const glow = dist < radius ? 1 - dist / radius : 0;
      ctx.fillStyle = glow > 0.2 ? '#2357c6' : p.isBlue ? '#2357c6' : '#1e293b';
      ctx.globalAlpha = glow > 0.2 ? 1 : p.isBlue ? 0.92 : 0.86;
      const r = 2.2;
      ctx.beginPath();
      ctx.roundRect(p.x - size / 2, p.y - size / 2, size, size, r);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (!reduceMotion) requestAnimationFrame(draw);
  }

  draw();
}

document.fonts.ready.then(initLogoCanvas);
