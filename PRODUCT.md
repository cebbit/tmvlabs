# Product

<!-- impeccable:product-schema 1 -->

Source: written 19.11.2026 by Claude from the agreed intent `docs/intent/2026-11-18-redesign.md` (Maxim's interview, status "agreed" 18.11.2026) and the closed texts v3 `docs/copy/2026-11-18-texts.md`. Init did not run a new interview: the intent already is Maxim's answers. Facts marked "сверить" are not verified and must not reach the site until checked at the primary source. When this file and the intent disagree, the intent wins; update this file.

## Platform

web

## Stack

Static HTML/CSS/JS on GitHub Pages (repo `cebbit/tmvlabs`, domain tmvlabs.ru). No server and no build step. Three.js is vendored in `assets/vendor/three/`; fonts are self-hosted in `assets/fonts/` (Dela Gothic One, Manrope, OFL). Push to `main` changes the live site at once; redesign work lives in branch `redesign`.

## Users

Owner of a small business who has money and is ready to pay for automation. Niche does not matter (Maxim, 18.11). Typical situation: clients write or call after hours and nobody answers; the owner does not see where leads come from; prices, cards, site and Avito are updated by hand; money comes in but profit is not visible. Hint from NotebookLM, not confirmed: service workshops, retail, dentists, realtors, lawyers, production, WB and Ozon sellers, turnover 2-5 mln rub per month, region Krasnodar, Ust-Labinsk and remote.

Not the audience: coffee shops and similar businesses without budget for automation, grey topics, clients who want endless calls, capricious clients.

## Product Purpose

The site sells Maxim personally as a developer who automates small business: sites, bots, CRM, analytics, Avito and price automation. Success is that an owner understands in 20 seconds who Maxim is, that he already did this for himself and for clients, and that he can write to him in Telegram now. Business target after launch: 10 leads per month or 1 expensive lead.

## Positioning

Maxim is not a theorist: 21 years in phones and electronics (сверить годы), started at intake, bought the business from his boss and owns the ProGadget shop and repair service. Everything he sells first works in his own business. Every offer is built on a bot or system that already runs: client pain, what he will do, where it already works.

## Operating Context

- Main action: "Обсудить проект в Telegram", opens a chat with Maxim; on mobile the button sticks to the screen.
- Backup action: short form (name, contact, task). Leads go as a card to Pulse through a receiver on server de next to pulse-bot. The bot token never reaches the browser. The receiver is built only on Maxim's command.
- Process: 15-minute task review from a price list, site or description; scope, term and price fixed before start; prototype and development from 3 days; domain and server registered to the client, access stays with the client; support after launch.
- TMV Labs Avito listings must say the same as the site (`~/Documents/Авито`).

## Capabilities and Constraints

Services, simple to serious, with "from" prices (texts v3, Maxim's rule "slightly below market, bot is more expensive"):
- business-card site with call button and Telegram notification: from 15 000 rub, 3-5 days;
- landing with leads (form or quiz, leads to Telegram and CRM, Yandex Metrika): from 30 000 rub, 5-10 days;
- bot that answers clients: from 20 000 rub, 3-5 days;
- bot with AI, price lists and CRM: from 45 000 rub plus support from 5 000 rub per month;
- SEO and articles for Yandex: from 10 000 rub per month;
- package "site + Avito + bot": from 45 000 rub.
Also: lead analytics by channel, Avito listing builder and automator, supplier price parsing with markup and auto-update, mini-CRM, content pipeline. 11 bot formats are listed in the texts.

Constraints: light theme only, no dark theme. No long dashes in copy. ProGadget is written in Russian ("ПроГаджет"). No project limit statement; "each project I lead personally, for volume I bring in proven people, I answer for the result". Lighthouse mobile performance at least 80; no horizontal scroll on phones; on a 375 px phone the first screen shows headline, one benefit line and the Telegram button without scrolling.

## Brand Commitments

- Maxim personally, address on "ты", lively, direct, short, no pathos.
- TMV Labs is the studio name, people come to the person.
- Forbidden words: "гуру", "бизнес-наставник", "эксперт №1", "успешный успех", "нейросети под ключ", "революционная экосистема".
- Never show: personal income, address, family, VPN, grey topics. Client names, phones and sums are hidden in screenshots.
- No info-business style, no acid gradients, no generated images (Higgsfield rejected): real screenshots and screen recordings.
- Accepted prototype decisions (19.11.2026): first screen `prototypes/hero-b/` (cards built from headline letters, Three.js), headline font Dela Gothic One; mark from shards `prototypes/logo-b/` waits for Maxim's yes.

## Evidence on Hand

- Photos: `assets/maxim-cutout.png`; portrait with MacBook `maxim-hero-4x5.jpg`, `maxim-square.jpg`, `maxim-portrait-enhanced.jpg` (outside repo).
- Screenshots: `assets/shots/`.
- Cases allowed by Maxim, named by brand only: TMV Hub (CRM of the repair service; repairs, clients and turnover through the system are taken by a DB query on build day), ProGadget sales bot, Avito automator (сверить numbers), Valyx (required case), "Гаджет Про", "Аксинья Про", sites ProGadget and TMV Repair, content pipeline, package "site + Avito + bot", PONDEX as in development. Utilities block: TMV Voice, TMV Switcher, TMV Shot. "Золотая Нива" is not shown.
- Reviews about development: none. Fabricated reviews are never allowed. ProGadget shop and service reviews (Yandex Maps, Avito) may be shown only with the caption "отзывы о магазине и сервисе ПроГаджет"; rating and count are checked on publication day.

## Product Principles

1. Proof before promise: every offer points to a system that already runs.
2. One clear action: Telegram first, form second.
3. Only verified numbers reach the site.
4. The price filters the audience: "from" prices on every service.
5. Real material over decoration: screenshots and recordings, not generated art.

## Accessibility & Inclusion

No product-specific standard was set. Default: readable contrast on the light theme, working tap targets on phones, motion that does not block reading (hero-b and services-b are heavy WebGL and need a reduced-motion and low-power path, not yet confirmed).
