# Agent task · Issue #6

> **Issue:** https://github.com/meshbor/ai-university/issues/6
> **Title:** [feedback/feature] Фича: добавь еще курс по сборке сборке кубика рубика
> **Category:** `unknown`

## Запрос пользователя

добавь еще курс по сборке сборке кубика рубика

## Контекст приложения

```json
{
  "route": "dashboard",
  "themeId": "space",
  "activeTab": "skills",
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
4. Свяжи PR с issue #6 (`Closes #6` если задача полностью закрыта).
5. **Draft PR** — человек ревьюит перед merge.

## Чеклист

- [ ] Изменения соответствуют категории (`unknown`)
- [ ] `npm test` и `npm run build` проходят
- [ ] Нет секретов в коде
