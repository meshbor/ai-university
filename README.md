# AI University

Gamified learning dashboard + static course content. Монорепо:

| Путь | Назначение |
|------|------------|
| `apps/web` | React + TypeScript + Vite + shadcn (новый фронт) |
| `apps/api` | Go API (заготовка, senior-2026) |
| `courses/` | HTML-уроки (общие для legacy и v2) |
| `assets/` | Портреты, фоны, 3D-модели |
| `index.html` | Legacy dashboard (пока в проде на GitHub Pages) |

## Быстрый старт (web)

```bash
npm install
npm run dev
```

Откроется Vite dev server. `public/` содержит symlink на `assets/` и `courses/` в корне репо.

## Скрипты

```bash
npm run dev      # apps/web
npm run build    # tsc + vite build → apps/web/dist
npm run test     # vitest (gamification)
npm run preview  # preview production build
```

## Миграция

1. **Фаза 0 (сейчас)** — каркас, `src/data`, `lib/gamification`, `lib/storage`
2. **Фаза 1** — auth + onboarding
3. **Фаза 2** — dashboard UI (hero, courses, stats, radar)
4. **Фаза 3** — themes + 3D portraits
5. **Фаза 4** — duels + share
6. **Cutover** — GitHub Pages → `apps/web/dist`, `index.html` → archive

## Deploy (пока legacy)

Production: https://meshbor.github.io/ai-university/ — корневой `index.html`.

После cutover: build с `base: /ai-university/` и публикация `dist/`.

## API (будущее)

`apps/api` — Go-сервис для auth, sync, duels. Фронт использует интерфейсы в `lib/storage/repositories.ts`; сейчас — `Local*Repository`.
