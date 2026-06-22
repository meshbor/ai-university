# AI University

Gamified learning dashboard + static course content. Монорепо:

| Путь | Назначение |
|------|------------|
| `apps/web` | React + TypeScript + Vite + shadcn (прод-фронт) |
| `apps/api` | Go API (заготовка, senior-2026) |
| `courses/` | HTML-уроки |
| `assets/` | Портреты, фоны, 3D-модели |
| `legacy/` | Архив старого `index.html` dashboard |

## Быстрый старт (web)

```bash
npm install
npm run dev
```

Откроется Vite dev server: http://localhost:5173/ai-university/

`apps/web/public/` содержит symlink на `assets/` и `courses/` в корне репо.

## Скрипты

```bash
npm run dev          # apps/web dev server
npm run build        # tsc + vite build → apps/web/dist
npm run build:pages  # build + legacy/.nojekyll для GH Pages
npm run test         # vitest (gamification)
npm run preview      # preview production build
```

## Deploy (GitHub Pages)

**Production:** https://meshbor.github.io/ai-university/

При пуше в `main` workflow [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) собирает `apps/web` и публикует `dist/`.

### Первичная настройка (один раз)

1. Repo → **Settings** → **Pages**
2. **Build and deployment** → Source: **GitHub Actions**
3. После мерджа cutover — дождаться зелёного workflow run

Локальная проверка prod-сборки:

```bash
npm run build:pages
npm run preview
```

Legacy dashboard: `/ai-university/legacy/index.html`

## API (будущее)

`apps/api` — Go-сервис для auth, sync, duels. Фронт использует интерфейсы в `lib/storage/repositories.ts`; сейчас — `Local*Repository`.
