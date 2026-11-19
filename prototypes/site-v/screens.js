// Живые экраны кейсов. Пока это показательные макеты на HTML с петлёй 5 с (подпись «макет»),
// числа и имена в них выдуманы для макета. Заменить на записи экрана 5 с (список в README).
const ROWS = (a) => a.map(([l, r, c = '']) => `<div class="s-row ${c}"><span>${l}</span><b>${r}</b></div>`).join('');

const S = {
  hub: () => `<div class="s-top"><i></i>TMV Hub · заказы</div>
    <div class="s-kpis"><div><small>В работе</small><b>14</b></div><div><small>Готово</small><b class="s-tick">6</b></div><div><small>Ждут</small><b>3</b></div></div>
    ${ROWS([['№2481 · iPhone 12, экран', 'Готов', 's-go'], ['№2482 · MacBook Air, АКБ', 'Деталь'], ['№2483 · Galaxy A54', 'В работе'], ['№2484 · iPad 9, стекло', 'Принят', 's-new']])}`,
  price: () => `<div class="s-top"><i></i>Прайс → витрина</div>
    ${ROWS([['iPhone 15, 128 ГБ', '<s>63 100</s> 64 900 ₽', 's-upd'], ['iPhone 14, 128 ГБ', '52 400 ₽'], ['Galaxy S24, 256 ГБ', '<s>57 200</s> 58 900 ₽', 's-upd'], ['AirPods Pro 2', '17 300 ₽']])}
    <div class="s-foot"><span>Наценка +6%</span><span class="s-pill">обновлено 14:00</span></div>`,
  avito: () => `<div class="s-top"><i></i>Авито · сообщения</div>
    <div class="s-msg in">Добрый вечер, ещё продаёте?</div>
    <div class="s-msg out s-late">Да, в наличии. Цена 52 400 ₽, можно забрать сегодня до 20:00.</div>
    <div class="s-foot"><span>Объявление = сайт</span><span class="s-pill">цены сверены</span></div>`,
  chat: () => `<div class="s-top"><i></i>Telegram · магазин</div>
    <div class="s-msg in">Есть оптом чехлы на 15 серию?</div>
    <div class="s-msg out s-late">Да. Опт-прайс обновлён сегодня, отправил файл.</div>
    <div class="s-file s-late2">opt-price.xlsx</div>`,
  site: () => `<div class="s-top"><i></i>aksinyapro.ru</div>
    <div class="s-hero"><b>Онлайн-уроки</b><span>Запишись на пробный</span></div>
    <div class="s-grid"><i></i><i></i><i></i></div>`,
  content: () => `<div class="s-top"><i></i>Конвейер · сегодня</div>
    ${ROWS([['Ролик «Замена экрана»', '15 мин записи'], ['Нарезка и субтитры', 'готово', 's-go']])}
    <div class="s-chips">${['Telegram 10:00', 'MAX 10:00', 'Instagram 12:00', 'YouTube 18:00', 'ВК 19:00'].map((t, i) => `<span style="--i:${i}">${t}</span>`).join('')}</div>`,
};

export function screen(c) {
  if (c.shot) return `<figure class="s-shot"><img src="../../assets/shots/${c.shot}" alt="Скриншот: ${c.name}" loading="lazy" width="1200" height="760"></figure>`;
  return `<figure class="s-screen" aria-hidden="true"><div class="s-in">${S[c.screen]()}</div><figcaption>макет экрана</figcaption></figure>`;
}
