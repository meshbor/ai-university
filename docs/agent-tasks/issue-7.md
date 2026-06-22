# Agent task · Issue #7

> **Issue:** https://github.com/meshbor/ai-university/issues/7
> **Title:** [feedback/feature] Фича: сделай настраиваемый список колонок в курсах. две колонки не всегда крас
> **Category:** `unknown`

## Запрос пользователя

сделай настраиваемый список колонок в курсах. две колонки не всегда красиво смотрятся. сделай мультиселект с выбором 1,2,3,4

## Контекст приложения

```json
{
  "route": "dashboard",
  "themeId": "space",
  "activeTab": "help",
  "viewport": {
    "w": 2494,
    "h": 1481
  },
  "profile": {
    "name": "Baruh",
    "hero": "fast",
    "theme": "space"
  },
  "stats": {
    "level": 3,
    "doneLessons": 7,
    "xp": 700,
    "streak": 1
  },
  "url": "http://localhost:5173/ai-university/",
  "userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
  "appVersion": "0.1.0"
}
```

## Инструкции агенту

1. Реализуй запрос **минимальным diff** в `apps/web` (или `apps/api` если нужен backend).
2. Следуй существующим паттернам репозитория (repository pattern, RPG UI).
3. Не трогай `legacy/` и `courses/` HTML без явной необходимости.
4. Свяжи PR с issue #7 (`Closes #7` если задача полностью закрыта).
5. **Draft PR** — человек ревьюит перед merge.

## Чеклист

- [ ] Изменения соответствуют категории (`unknown`)
- [ ] `npm test` и `npm run build` проходят
- [ ] Нет секретов в коде
