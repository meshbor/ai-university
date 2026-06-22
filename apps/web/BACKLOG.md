# Web v2 · Backlog

## Сделано

### PR auth + onboarding
- [x] Обязательный вход (localStorage, как legacy)
- [x] Выбор героя: grid карточек вместо карусели
- [x] Превью 2D / 3D (model-viewer) для knight/samurai
- [x] «Новый герой» без сброса прогресса

### PR dashboard UI (текущий)
- [x] Боковая рубка: портрет, уровень, XP, серия, мини-статы
- [x] Эволюция портрета по tier (pickPortrait из legacy)
- [x] Радар баланса жизни (4 оси)
- [x] SPECIAL grid с пипами
- [x] 6 RPG-тем (CSS variables + фоны cockpit/hangar/knight/dojo)
- [x] Табы: Special / Курсы / Дуэли (заглушка)
- [x] Сброс прогресса

## Следующие PR

- [ ] **MR3 · Дуэли + share-card** — порт логики из `index.html` (~769–1070)
- [ ] **MR4 · Cutover legacy** — см. ниже

## Когда убираем `index.html`?

**Не в этом MR.** Legacy остаётся prod на GitHub Pages, пока v2 не догонит дуэли.

| MR | Содержание | Legacy |
|----|------------|--------|
| MR2 (этот) | Dashboard UI + темы | `index.html` в корне, prod как сейчас |
| MR3 | Дуэли + share + invite URL | то же |
| **MR4 cutover** | GH Actions → `apps/web/dist`, `index.html` → `legacy/index.html`, README | **v2 = prod** |

После MR4 корневой `index.html` — либо редирект на SPA, либо только `legacy/` для архива.

## Мелочи

- [ ] Auth через Go API (`apps/api`)
- [ ] Синхронизация прогресса с сервером
