// 4 варианта всего сайта после первого экрана и блока услуг. Контент общий (content.js), меняется структура и грамматика.
// 0 «Схема»: страница как схема процесса, линия связывает узлы и прорисовывается при прокрутке.
// 1 «Сутки»: страница как сутки бизнеса 00:00–24:00, часы идут при прокрутке.
// 2 «Переписка»: страница продолжает диалог в Telegram, разделы приходят сообщениями.
// 3 «Наряд-заказ»: страница как бланки сервиса: наряды, чек, штампы.
import { TG, bots, math, cases, tools, prices, seo, steps, trust, fin } from './content.js';
import { screen } from './screens.js';

const chk = (t) => t;
const cta = (t, cls = '') => `<a class="v-btn ${cls}" href="${TG}" rel="noopener">${t}</a>`;
const ext = (t, cls = '') => `<a class="v-link ${cls}" href="${TG}" rel="noopener">${t}</a>`;
const form = (btn, cls = '') => `<form class="v-form ${cls}" novalidate>
  <label><span>Имя</span><input name="name" autocomplete="name" required></label>
  <label><span>Telegram или телефон</span><input name="contact" autocomplete="tel" required></label>
  <label class="v-wide"><span>Задача</span><textarea name="task" rows="3" required placeholder="Что сейчас делаешь руками"></textarea></label>
  <button class="v-btn" type="submit">${btn}</button>
  <p class="v-form-msg" role="status" aria-live="polite"></p>
</form>`;
const price = (p) => p[3] ? `${p[2]} <small>· ${p[3]}</small>` : p[2];
const trustNums = (cls = '') => trust.nums.map(([n, l]) => `<div class="${cls}"><b>${chk(n)}</b><span>${l}</span></div>`).join('');
const devCase = () => `<p class="v-dev-p">${cases.dev.did}</p><ul class="v-dev-l">${cases.dev.pains.map((x) => `<li>${x}</li>`).join('')}</ul><p class="v-dev-p"><b>Что будет:</b> ${cases.dev.will}</p>`;
const res = (c) => c.chk ? `${c.res}: ${chk('число сверить по БД')}` : c.res;
const tick = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const send = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l16-8-6 16-2.5-6.5z" fill="currentColor"/></svg>';

/* ---------- 0. Схема ---------- */
function v0() {
  const node = (id, inner, cls = '') => `<section class="v-node ${cls}" id="${id}"><i class="v-pin" aria-hidden="true"></i>${inner}</section>`;
  return `<div class="v0-wire" aria-hidden="true"><svg preserveAspectRatio="none"><path class="v0-path"/><path class="v0-ink"/></svg></div>` +
  node('bots', `<h2>Какие боты ещё делаю</h2>
    <div class="v0-branches">
      <div class="v0-branch"><h3>Уже работает у меня</h3>${bots.live.map(([t, d, e]) => `<div class="v0-leaf"><b>${t}</b><p>${d}${e ? ` <em>Пример: ${e}</em>` : ''}</p></div>`).join('')}</div>
      <div class="v0-branch v0-dim"><h3>Ходовое на рынке, делаю под задачу</h3><p class="v0-hint">Живого примера пока нет, так и пишу.</p>${bots.market.map(([t, d]) => `<div class="v0-leaf"><b>${t}</b><p>${d}</p></div>`).join('')}</div>
    </div>${cta(bots.cta)}`) +
  node('math', `<h2>${math.h}</h2>
    <div class="v0-routes">
      <div class="v0-route"><div class="v0-rh"><b>${math.man[0]}</b><span>${chk(math.man[1])} ${math.man[2]}</span></div><div class="v0-track">${Array.from({ length: 12 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div><small>12 платежей за год</small></div>
      <div class="v0-route v0-bot"><div class="v0-rh"><b>${math.bot[0]}</b><span>${math.bot[1]} ${math.bot[2]}</span></div><div class="v0-track"><i style="--i:0"></i></div><small>один платёж</small></div>
    </div>
    <p class="v-lead">${math.own}</p>${cta(math.cta)}`) +
  node('cases', `<h2>${cases.h}</h2>
    <div class="v0-cases">${cases.list.map((c) => `<article class="v0-case">
      <div class="v0-io">
        <div class="v-case-meta"><span>Кейс</span><span>${c.name}</span></div>
        <h3>${c.name}</h3>
        ${c.task ? `<p><span class="v0-k">Вход</span>${c.task}</p>` : ''}
        <p><span class="v0-k">Система</span>${c.did}</p>
        ${c.res ? `<p><span class="v0-k">Выход</span>${res(c)}</p>` : ''}
      </div>${screen(c)}</article>`).join('')}
      <article class="v0-case v0-devc"><div class="v0-io"><h3>${cases.dev.name} <span class="v-tag">В разработке</span></h3>${devCase()}</div></article>
    </div>`) +
  node('tools', `<h2>${tools.h}</h2><div class="v0-tools">${tools.list.map(([t, d]) => `<div><b>${t}</b><p>${d}</p></div>`).join('')}</div><p class="v-lead">${tools.note}</p>`) +
  node('prices', `<h2>${prices.h}</h2>
    <table class="v0-legend"><tbody>${prices.list.map((p) => `<tr><th scope="row">${p[0]}${p[1] ? `<small>${p[1]}</small>` : ''}</th><td>${price(p)}</td></tr>`).join('')}</tbody></table>
    <p class="v-lead">${prices.fix}</p><p class="v-me">${prices.me}</p>${cta(prices.cta)}`) +
  node('seo', `<h2>${seo.h}</h2><p class="v-lead">${seo.p}</p><p class="v-works"><b>Работает:</b> ${seo.works}</p>${cta(seo.cta, 'v-ghost')}`) +
  node('steps', `<h2>${steps.h}</h2><ol class="v0-steps">${steps.list.map((s, i) => `<li style="--i:${i}"><b>${steps.short[i]}</b><span>${s}</span></li>`).join('')}</ol>`) +
  node('trust', `<div class="v0-trust-grid"><div><p class="v-eyebrow">Личный подход · реальные системы</p><h2>${trust.h}</h2><p class="v-lead">${trust.p}</p><div class="v0-nums">${trustNums()}</div><p class="v-me">${trust.note}</p></div><figure class="v0-portrait"><img src="../../assets/maxim-cutout.png" alt="Максим, TMV Labs" loading="lazy" width="560" height="700"><figcaption><b>Максим</b><span>делает так, чтобы бизнес работал спокойнее</span></figcaption></figure></div>`) +
  node('final', `<h2>${fin.h}</h2><div class="v0-end">${cta(fin.cta, 'v-big')}<div><p class="v-me">Или оставь заявку, напишу сам.</p>${form(fin.form)}</div></div>`, 'v0-final');
}

/* ---------- 1. Сутки ---------- */
function v1() {
  const hour = (id, time, line, inner, cls = '') => `<section class="v1-hour ${cls}" id="${id}" data-time="${time}">
    <div class="v1-stamp"><time>${time}</time><p>${line}</p></div><div class="v1-body">${inner}</div></section>`;
  return `<div class="v1-clock" aria-hidden="true"><svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="21"/><line class="v1-hh" x1="24" y1="24" x2="24" y2="13"/><line class="v1-mm" x1="24" y1="24" x2="24" y2="7"/></svg><b>00:00</b></div>` +
  hour('bots', '02:14', 'Клиент написал ночью. Бот ответил за секунды.', `<h2>Какие боты ещё делаю</h2>
    <div class="v1-cols"><div><h3>Уже работает у меня</h3><dl class="v1-dl">${bots.live.map(([t, d, e]) => `<dt>${t}</dt><dd>${d}${e ? ` Пример: ${e}.` : ''}</dd>`).join('')}</dl></div>
    <div><h3>Ходовое на рынке, делаю под задачу</h3><p class="v1-hint">Живого примера пока нет, так и пишу.</p><dl class="v1-dl">${bots.market.map(([t, d]) => `<dt>${t}</dt><dd>${d}</dd>`).join('')}</dl></div></div>${cta(bots.cta)}`) +
  hour('cases', '09:00', 'Прайс обновился сам. Первое из трёх обновлений за день.', `<h2>${cases.h}</h2>
    <div class="v1-cases">${cases.list.map((c, i) => `<article class="v1-case ${i % 3 === 0 ? 'v1-wide' : ''}">${screen(c)}<div><h3>${c.name}</h3>${c.task ? `<p>${c.task}</p>` : ''}<p><b>Сделал:</b> ${c.did}</p>${c.res ? `<p class="v1-res">${res(c)}</p>` : ''}</div></article>`).join('')}
      <article class="v1-case v1-dev"><div><h3>${cases.dev.name}</h3><span class="v-tag">В разработке</span>${devCase()}</div></article></div>`) +
  hour('tools', '11:30', 'Инструкцию для мастера надиктовал голосом.', `<h2>${tools.h}</h2><ul class="v1-tools">${tools.list.map(([t, d]) => `<li><b>${t}</b> ${d}</li>`).join('')}</ul><p class="v-lead">${tools.note}</p>`) +
  hour('math', '13:00', 'Менеджер ушёл на обед. Бот на месте.', `<h2>${math.h}</h2>
    <div class="v1-vs"><div><span>${math.man[0]}</span><b>${chk(math.man[1])}</b><small>${math.man[2]}</small></div><div class="v1-or">или</div><div class="v1-botc"><span>${math.bot[0]}</span><b>${math.bot[1]}</b><small>${math.bot[2]}</small></div></div>
    <p class="v-lead">${math.own}</p>${cta(math.cta)}`) +
  hour('prices', '18:00', 'Рабочий день кончился. Цены остаются прежними.', `<h2>${prices.h}</h2>
    <ul class="v1-prices">${prices.list.map((p) => `<li><span>${p[0]}${p[1] ? `<small>${p[1]}</small>` : ''}</span><b>${price(p)}</b></li>`).join('')}</ul>
    <p class="v-lead">${prices.fix}</p><p class="v-me">${prices.me}</p>${cta(prices.cta)}`) +
  hour('seo', '20:00', 'Ты дома. Статьи приводят клиентов из Яндекса.', `<h2>${seo.h}</h2><p class="v-lead">${seo.p}</p><p class="v-works"><b>Работает:</b> ${seo.works}</p>${cta(seo.cta, 'v-ghost')}`) +
  hour('steps', '21:00', 'Прислал прайс вечером. Утром разбор.', `<h2>${steps.h}</h2><ol class="v1-steps">${steps.list.map((s) => `<li>${s}</li>`).join('')}</ol>`) +
  hour('trust', '22:30', 'Магазин закрыт. Отзывы читают и ночью.', `<h2>${trust.h}</h2><p class="v-lead">${trust.p}</p><div class="v1-nums">${trustNums()}</div><p class="v-me">${trust.note}</p>`) +
  hour('final', 'сейчас', 'Напиши, пока помнишь, что делаешь руками.', `<h2>${fin.h}</h2>${cta(fin.cta, 'v-big')}<details class="v1-alt"><summary>Не пользуюсь Telegram</summary>${form(fin.form)}</details>`, 'v1-final');
}

/* ---------- 2. Переписка ---------- */
function v2() {
  const av = '<img class="v2-av" src="../../assets/maxim-cutout.png" alt="" width="40" height="40">';
  const me = (html, cls = '') => `<div class="v2-msg v2-in ${cls}">${html}</div>`;
  const group = (id, msgs, replies = [], cls = '') => `<section class="v2-group ${cls}" id="${id}">${av}<div class="v2-stack"><div class="v2-typing" aria-hidden="true"><i></i><i></i><i></i></div>${msgs.join('')}${replies.length ? `<div class="v2-replies">${replies.map((r) => ext(r, 'v2-reply')).join('')}</div>` : ''}</div></section>`;
  const day = (t) => `<div class="v2-day"><span>${t}</span></div>`;
  return `<div class="v2-chat"><header class="v2-head"><img src="../../assets/maxim-cutout.png" alt="" width="40" height="40"><div><b>Максим · TMV Labs</b><span>был недавно</span></div></header>` +
  day('Сегодня') +
  group('bots', [me('<h2>Какие боты ещё делаю</h2><p>Сначала то, что уже работает у меня. Нажми на формат, расскажу коротко.</p>'),
    me(`<div class="v2-kb">${bots.live.map(([t, d, e]) => `<details><summary>${t}</summary><p>${d}${e ? ` Пример: ${e}.` : ''}</p></details>`).join('')}</div>`, 'v2-kbm'),
    me(`<p>Ходовое на рынке, делаю под задачу. Живого примера пока нет, так и пишу.</p><div class="v2-kb v2-kb-m">${bots.market.map(([t, d]) => `<details><summary>${t}</summary><p>${d}</p></details>`).join('')}</div>`, 'v2-kbm')], [bots.cta]) +
  group('math', [me(`<h2>${math.h}</h2><p>${math.man[0]}: ${chk(math.man[1])} ${math.man[2]}.</p>`), me(`<p class="v2-big">${math.bot[0]}: <b>${math.bot[1]}</b> ${math.bot[2]}.</p>`), me(`<p>${math.own}</p>`)], [math.cta]) +
  day('Пересланные сообщения') +
  group('cases', [me(`<h2>${cases.h}</h2>`), ...cases.list.map((c) => me(`<div class="v2-fwd"><span>Переслано из «${c.name}»</span>${screen(c)}${c.task ? `<p>${c.task}</p>` : ''}<p><b>Сделал:</b> ${c.did}</p>${c.res ? `<p class="v2-res">${res(c)}</p>` : ''}</div>`, 'v2-media')),
    me(`<div class="v2-fwd"><span>Сейчас делаю</span><h3>${cases.dev.name} <span class="v-tag">В разработке</span></h3>${devCase()}</div>`)], ['Хочу так же']) +
  group('tools', [me(`<h2>${tools.h}</h2>`), ...tools.list.map(([t, d]) => me(`<p><b>${t}.</b> ${d}</p>`)), me(`<p>${tools.note}</p>`)]) +
  group('prices', [me(`<h2>${prices.h}</h2><div class="v2-inv">${prices.list.map((p) => `<div><span>${p[0]}${p[1] ? `<small>${p[1]}</small>` : ''}</span><b>${price(p)}</b></div>`).join('')}</div><p>${prices.fix}</p>`, 'v2-wide'), me(`<p>${prices.me}</p>`)], [prices.cta]) +
  group('seo', [me(`<h2>${seo.h}</h2><p>${seo.p}</p><p class="v2-res"><b>Работает:</b> ${seo.works}</p>`)], [seo.cta]) +
  group('steps', [me(`<h2>${steps.h}</h2>`), ...steps.list.map((s, i) => me(`<p>${i + 1}. ${s}</p><span class="v2-read">${tick}${tick}</span>`))]) +
  group('trust', [me(`<h2>${trust.h}</h2><p>${trust.p}</p><div class="v2-nums">${trustNums()}</div><p class="v2-small">${trust.note}</p>`)]) +
  group('final', [me(`<h2>${fin.h}</h2>`)], [], 'v2-final') +
  `<div class="v2-compose">${cta(fin.cta + ' ' + send, 'v-big')}<details><summary>Или оставь заявку здесь</summary>${form(fin.form)}</details></div></div>`;
}

/* ---------- 3. Наряд-заказ ---------- */
function v3() {
  let n = 2480;
  const sheet = (id, title, fields, inner, cls = '') => `<section class="v3-sheet ${cls}" id="${id}"><div class="v3-fields">${fields.map(([k, v]) => `<div><small>${k}</small><span>${v}</span></div>`).join('')}</div><h2>${title}</h2>${inner}</section>`;
  const stamp = (t, cls = '') => `<span class="v3-stamp ${cls}" aria-hidden="true">${t}</span>`;
  const box = (on) => `<i class="v3-box ${on ? 'on' : ''}" aria-hidden="true">${on ? tick : ''}</i>`;
  return sheet('bots', 'Какие боты ещё делаю', [['Наряд', '№' + n++], ['Мастер', 'Максим'], ['Отметка', 'работает у меня']],
    `<table class="v3-check"><tbody>${bots.live.map(([t, d, e]) => `<tr><td>${box(1)}</td><th scope="row">${t}</th><td>${d}${e ? ` <em>Пример: ${e}</em>` : ''}</td></tr>`).join('')}
      <tr class="v3-sub"><td colspan="3">Ходовое на рынке, делаю под задачу. Живого примера пока нет, так и пишу.</td></tr>
      ${bots.market.map(([t, d]) => `<tr><td>${box(0)}</td><th scope="row">${t}</th><td>${d}</td></tr>`).join('')}</tbody></table>${cta(bots.cta)}`) +
  sheet('math', math.h, [['Наряд', '№' + n++], ['Расчёт', 'на 12 месяцев']],
    `<div class="v3-receipts"><div class="v3-rc"><b>${math.man[0]}</b>${Array.from({ length: 12 }, (_, i) => `<div><span>Месяц ${i + 1}</span><span>${chk('45 000 ₽')}</span></div>`).join('')}<div class="v3-tot"><span>Каждый месяц</span><span>${math.man[1]}</span></div></div>
      <div class="v3-rc v3-rc-bot"><b>${math.bot[0]}</b><div><span>Разработка</span><span>${math.bot[1]}</span></div><div><span>Срок</span><span>3–5 дней</span></div><div><span>Ночью и в выходные</span><span>работает</span></div><div class="v3-tot"><span>Один раз</span><span>${math.bot[1]}</span></div>${stamp('один раз', 'v3-st-g')}</div></div>
    <p class="v-lead">${math.own}</p>${cta(math.cta)}`) +
  `<section class="v3-cases" id="cases"><h2>${cases.h}</h2><div class="v3-grid">${cases.list.map((c) => `<article class="v3-order"><div class="v3-fields"><div><small>Наряд</small><span>№${n++}</span></div><div><small>Заказчик</small><span>${c.name}</span></div></div>${screen(c)}
      ${c.task ? `<p><small>Было</small>${c.task}</p>` : ''}<p><small>Сделано</small>${c.did}</p>${c.res ? `<p><small>Итог</small>${res(c)}</p>` : ''}${stamp('Готов')}</article>`).join('')}
    <article class="v3-order v3-open"><div class="v3-fields"><div><small>Наряд</small><span>№${n++}</span></div><div><small>Заказчик</small><span>${cases.dev.name}</span></div></div>${devCase()}${stamp('В работе', 'v3-st-w')}</article></div></section>` +
  sheet('tools', tools.h, [['Для себя', '3 утилиты для Mac']], `<div class="v3-tools">${tools.list.map(([t, d]) => `<div><b>${t}</b><p>${d}</p></div>`).join('')}</div><p class="v-lead">${tools.note}</p>`) +
  `<section class="v3-pricewrap" id="prices"><div class="v3-receipt"><h2>${prices.h}</h2><p class="v3-shop">TMV Labs · прайс</p>${prices.list.map((p) => `<div class="v3-li"><span>${p[0]}${p[1] ? `<small>${p[1]}</small>` : ''}</span><i></i><b>${price(p)}</b></div>`).join('')}<p class="v3-fix">${prices.fix}</p>${stamp('Цена до старта', 'v3-st-g')}</div>
    <div class="v3-pside"><p class="v-lead">${prices.me}</p>${cta(prices.cta)}<div class="v3-seo"><h3>${seo.h}</h3><p>${seo.p}</p><p class="v-works"><b>Работает:</b> ${seo.works}</p>${cta(seo.cta, 'v-ghost')}</div></div></section>` +
  sheet('steps', steps.h, [['Статусы заказа', '5']], `<ol class="v3-status">${steps.list.map((s, i) => `<li><b>${['Принят', 'Согласован', 'В работе', 'Сдан', 'На поддержке'][i]}</b><span>${s}</span></li>`).join('')}</ol>`) +
  sheet('trust', trust.h, [['Магазин и сервис', 'ПроГаджет, Усть-Лабинск']], `<p class="v-lead">${trust.p}</p><div class="v3-nums">${trustNums()}</div><p class="v-me">${trust.note}</p>`) +
  sheet('final', fin.h, [['Новый наряд', '№' + n], ['Мастер', 'Максим'], ['Ответ', 'в тот же день']], `<div class="v3-end">${cta(fin.cta, 'v-big')}${form(fin.form)}</div>`, 'v3-final');
}

export const VARIANTS = [
  { name: 'Схема', render: v0 },
  { name: 'Сутки', render: v1 },
  { name: 'Переписка', render: v2 },
  { name: 'Наряд-заказ', render: v3 },
];
