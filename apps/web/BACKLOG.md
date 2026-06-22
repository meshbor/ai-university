# Web v2 · Backlog

## Сделано

### PR auth + onboarding
- [x] Обязательный вход (localStorage, как legacy)
- [x] Выбор героя: grid карточек вместо карусели
- [x] Превью 2D / 3D (model-viewer) для knight/samurai
- [x] «Новый герой» без сброса прогресса

### PR dashboard UI
- [x] Боковая рубка: портрет, уровень, XP, серия, мини-статы
- [x] Эволюция портрета по tier (pickPortrait из legacy)
- [x] Радар баланса жизни (4 оси)
- [x] SPECIAL grid с пипами
- [x] 6 RPG-тем (CSS variables + фоны cockpit/hangar/knight/dojo)
- [x] Табы: Special / Курсы / Дуэли
- [x] Сброс прогресса

### PR duels (текущий)
- [x] Weekly XP Race + Course Sprint
- [x] Share-card + копирование invite URL (`?duel=`)
- [x] Принятие вызова по ссылке / paste
- [x] Бейдж дуэли в рубке героя
- [x] Совместимость `aiuni_duel_v1` с legacy

## Следующий PR

- [ ] **MR4 · Cutover legacy** — GH Actions → `apps/web/dist`, `index.html` → `legacy/index.html`

## Когда убираем `index.html`?

**В MR4 cutover**, после мерджа дуэлей — v2 догнал legacy по функциям MVP.

| Шаг | Действие |
|-----|----------|
| GH Actions | build `apps/web`, deploy `dist/` на GitHub Pages |
| Архив | `index.html` → `legacy/index.html` |
| Корень | редирект или SPA `index.html` из dist |

## Мелочи

- [ ] Auth через Go API (`apps/api`)
- [ ] Синхронизация прогресса с сервером
