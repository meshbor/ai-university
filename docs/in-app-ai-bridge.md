# In-App AI Bridge · бриф для нового чата

> **Цель документа:** продолжить обсуждение и проектирование в другом чате (Cursor / иначе).  
> **Запрос владельца:** общаться и корректировать продукт **из самого приложения**, не переключаясь в IDE-чат вручную.

---

## 1. Снимок проекта (на момент июнь 2026)

| | |
|---|---|
| **Репо** | `meshbor/ai-university` |
| **Prod** | https://meshbor.github.io/ai-university/ |
| **Стек** | React + TS + Vite + Tailwind + shadcn (`apps/web`) |
| **API** | `apps/api` — заготовка Go, не реализован |
| **Данные** | `localStorage`, ключи совместимы с legacy |

### Уже в main (v2 MVP)

- Auth + onboarding (game lobby, карточки героев, «просто посмотреть» → light)
- Dashboard: 6 RPG-тем, hero dock (кокпит), курсы в 2 колонки, SPECIAL, радар жизни
- Дуэли + share-card + invite URL (`?duel=`)
- GitHub Pages → `apps/web/dist`, legacy в `legacy/index.html`
- Фоны: space, wot, knight, samurai, fallout (`assets/fallout-vault.png`)

### Скрипты

```bash
npm install
npm run dev          # http://localhost:5173/ai-university/
npm run build:pages  # prod-артефакт
npm run test
```

### Ключевые файлы

| Область | Путь |
|---------|------|
| Shell / routing | `apps/web/src/app/AppGate.tsx` |
| Dashboard | `apps/web/src/pages/DashboardPage.tsx` |
| Темы / фоны | `apps/web/src/features/theme/`, `apps/web/src/styles/rpg-themes.css` |
| Storage contracts | `apps/web/src/lib/storage/repositories.ts` |
| localStorage keys | `apps/web/src/lib/storage/keys.ts` |
| Go stub | `apps/api/README.md` |
| Deploy | `.github/workflows/deploy-pages.yml` |
| Backlog | `apps/web/BACKLOG.md` |

### localStorage keys

```
aiuni_auth_v1
aiuni_profile_v1
aiuni_theme
aiuni_pipboy_v1      # прогресс уроков
aiuni_duel_v1
```

---

## 2. Проблема и желаемый UX

**Сейчас:** заметил баг / хочет правку → открывает Cursor → новый чат → объясняет контекст.

**Хочется:** из dashboard нажать «Сообщить / Поправить» → описать проблему **в контексте текущего экрана** → запрос уходит «сюда» (в агента/разработку) → правка появляется без ручного копирования скринов и состояния.

### Примерные сценарии

1. **UI-баг:** «В Pip-Boy криво ломается вёрстка курса» + автоматический контекст (тема, вкладка, viewport).
2. **Контент:** «Переименуй курс / скрой ref» — мелкая правка без долгого чата.
3. **Фича:** «Добавь кнопку X на экран Y» — попадает в backlog / issue.
4. **Вопрос:** «Почему XP не обновился?» — ответ в приложении (read-only), без коммита.

Важно разделить **(A) вопросы пользователю** и **(B) задачи на изменение кода**.

---

## 3. Жёсткое ограничение

**Публичного API «отправить сообщение в этот конкретный чат Cursor» из браузера нет** — и это правильно с точки зрения безопасности.

Значит нужен **мост (bridge)**:

```
[AI University Web]  →  [Backend / GitHub / Agent]  →  [Cursor / CI / Human]
```

Задача нового чата — выбрать мост и MVP.

---

## 4. Варианты архитектуры

### Вариант 1 · «Панель обратной связи» → GitHub Issue (рекомендуемый MVP)

```
Пользователь в app
  → форма (текст + опционально скрин)
  → POST /api/feedback или GitHub API
  → Issue с шаблоном и JSON-контекстом
  → Cursor / человек берёт issue в работу
```

**Плюсы:** просто, дёшево, аудит, не нужен LLM в prod.  
**Минусы:** не мгновенная правка; всё равно нужен dev/agent на стороне репо.

**Контекст в issue (автоматически):**

```json
{
  "url": "https://meshbor.github.io/ai-university/?...",
  "theme": "fallout",
  "tab": "skills",
  "viewport": "1920x1080",
  "profile": { "name": "...", "hero": "...", "theme": "..." },
  "progressSummary": { "doneLessons": 7, "level": 3 },
  "userAgent": "...",
  "appVersion": "git-sha-or-tag"
}
```

⚠️ Не слать полный `localStorage` в публичный issue — только агрегаты.

---

### Вариант 2 · Встроенный чат в приложении (LLM read-only)

Отдельная вкладка **«Помощник»**: отвечает на вопросы по курсам, XP, дуэлям.  
Код не меняет — только объясняет.

```
Web → Vercel AI Gateway / OpenAI API
System prompt + RAG (README, BACKLOG, структура курсов)
```

**Плюсы:** не уходишь из app для вопросов.  
**Минусы:** не чинит код; нужен API key на backend (не в браузере).

---

### Вариант 3 · Cursor Background Agent / Cloud Agent по webhook

```
App → Go API сохраняет задачу
    → webhook (GitHub dispatch / Cursor Agents)
    → агент клонирует репо, делает PR
```

**Плюсы:** ближе к «правка без чата».  
**Минусы:** сложность, стоимость, нужны секреты, политика доступа к репо, review обязателен.

---

### Вариант 4 · Локальный мост (только dev)

Для разработки на своей машине:

```
App (localhost) → POST localhost:PORT/cursor-bridge
               → скрипт дописывает в файл / создаёт .cursor/task.md
               → Cursor подхватывает контекст
```

**Плюсы:** быстрый эксперимент.  
**Минусы:** не работает на GitHub Pages prod без туннеля.

---

### Вариант 5 · Гибрид (целевой)

| Слой | Что делает |
|------|------------|
| **UI в app** | Кнопка «💬 Помощь» + «🛠 Сообщить о проблеме» |
| **Read path** | Встроенный чат (вариант 2) — FAQ, XP, курсы |
| **Write path** | Issue / task queue (вариант 1) → опционально agent (вариант 3) |
| **Go API** | `POST /v1/feedback`, `POST /v1/chat` (proxy), auth позже |

---

## 5. UI-эскиз (куда встроить)

Логичные места:

1. **ThemeToolbar** — иконка «💬» рядом с «Поделиться»
2. **Footer dashboard** — «Сообщить о проблеме»
3. **Отдельная вкладка** — «Помощь» (если чат read-only)

Модалка:

```
┌─────────────────────────────────────┐
│  Сообщить разработчику              │
├─────────────────────────────────────┤
│  [текстовое поле]                   │
│  ☑ приложить контекст экрана        │
│  ☐ приложить скрин (опционально)    │
├─────────────────────────────────────┤
│  [Отмена]  [Отправить]              │
└─────────────────────────────────────┘
```

После отправки: toast «Задача #123 создана» + ссылка на GitHub Issue.

---

## 6. Backend контракт (черновик для `apps/api`)

```http
POST /v1/feedback
Content-Type: application/json

{
  "message": "string",
  "category": "bug" | "ui" | "content" | "feature",
  "context": {
    "route": "dashboard",
    "themeId": "space",
    "activeTab": "skills",
    "viewport": { "w": 1920, "h": 1080 },
    "profile": { "name": "Baruh", "hero": "fast", "theme": "space" },
    "stats": { "level": 3, "doneLessons": 7 }
  },
  "screenshotBase64": "optional"
}

→ 201 { "id": "...", "issueUrl": "https://github.com/..." }
```

```http
POST /v1/chat
{ "message": "...", "context": { ... } }
→ 200 { "reply": "..." }
```

Фронт: новые репозитории `FeedbackRepository`, `ChatRepository` — по аналогии с `lib/storage/repositories.ts`.

---

## 7. Безопасность и приватность

- [ ] API keys только на сервере (Go / serverless), никогда в `apps/web` bundle
- [ ] Rate limit на `/feedback` и `/chat`
- [ ] Не отправлять пароли, полный localStorage, PII сверх имени героя
- [ ] Скриншоты — opt-in; можно `html2canvas` только области dashboard
- [ ] CORS: prod origin `meshbor.github.io`, dev `localhost:5173`
- [ ] Auth: на MVP можно shared secret / GitHub token только на backend

---

## 8. Предлагаемые фазы

| Фаза | Содержание | Сложность |
|------|------------|-----------|
| **0** | Документ + решение по варианту | — |
| **1** | UI-модалка + `mailto:` или GitHub Issue URL с prefilled body | низкая |
| **2** | `POST /v1/feedback` в Go + GitHub Issues API | средняя |
| **3** | Read-only чат «Помощник» через backend proxy | средняя |
| **4** | Agent → PR по очереди задач | высокая |

**Рекомендация для старта:** фаза 1–2 (issue с контекстом). Это уже снимает 80% боли «объяснять где я был».

---

## 9. Открытые вопросы (решить в новом чате)

1. **Куда летят задачи?** GitHub Issues / GitLab / Telegram / email / только локально?
2. **Нужен ли мгновенный ответ в app** или достаточно «заявка принята»?
3. **Допустим ли внешний LLM** (OpenAI, Cursor gateway) или только self-hosted?
4. **Кто может отправлять feedback** — только authed user (`user/useradmin`) или любой?
5. **Нужен ли скрин** в MVP или только structured context?
6. **Связь с Cursor Agents** — ручной triage или автозапуск агента на issue с label `agent`?

---

## 10. Промпт для старта нового чата

Скопируй в новый чат:

```
Проект: ai-university (React v2 на GitHub Pages, Go API stub).
Читаю docs/in-app-ai-bridge.md в корне репо.

Задача: спроектировать и реализовать MVP «обратная связь / правки из приложения»
без ручного перехода в Cursor-чат.

Ограничения:
- GitHub Pages static frontend, секреты только на backend
- Уже есть repository pattern в apps/web/src/lib/storage/repositories.ts
- Пользователь (Baruh) пишет Go backend сам, нужен чёткий контракт API + React UI

Начни с: выбор варианта (issue vs chat vs hybrid), схема, список файлов,
оценка фаз. Потом — реализация фазы 1–2.
```

---

## 11. Связанные PR (история миграции)

| PR | Тема |
|----|------|
| #1 | auth + onboarding |
| #2 | dashboard UI + themes |
| #3 | duels + share |
| #4 | cutover GitHub Pages + legacy |
| #5 | cockpit layout + 2-col courses |

---

## 12. Не трогать без явного запроса

- `COMMERCIAL-REVIEW-BRIEF.md`, `COMPETITOR-BATTLECARD.md` — внутренние, не в git
- `legacy/index.html` — архив, только критичные фиксы
- `courses/` HTML — контент уроков отдельным потоком

---

*Файл создан для handoff между чатами. Обновляй по мере решений в `docs/in-app-ai-bridge.md`.*

---

## 13. Решения MVP (июнь 2026)

| Вопрос | Решение |
|--------|---------|
| Куда летят задачи? | **GitHub Issues** (`meshbor/ai-university`, label `feedback`) |
| Мгновенный ответ? | Нет — toast «черновик открыт» / «задача принята» |
| LLM в MVP? | Нет (фаза 3) |
| Кто отправляет? | Любой authed user на dashboard |
| Скрин в MVP? | Нет — только structured context |
| Agent на issue? | Ручной triage |

### Реализовано

- **Phase 1:** `FeedbackModal` + `GitHubIssueFeedbackRepository` (prefilled issue URL)
- **Phase 2:** `HttpFeedbackRepository` + Go `POST /v1/feedback`
- UI: кнопка «🛠 Сообщить» в `ThemeToolbar` + footer dashboard
- Файлы: `apps/web/src/features/feedback/`, `apps/web/src/lib/feedback/`, `apps/api/cmd/server/`

### Запуск Phase 2 локально

```bash
# terminal 1
cd apps/api && go run ./cmd/server

# terminal 2 — apps/web/.env.local
VITE_API_BASE_URL=http://localhost:8080
npm run dev
```

### Фаза 3 — Помощник (read-only чат)

- Вкладка «Помощь» на dashboard + кнопка «💬 Помощь» в toolbar
- Без API: local FAQ в браузере (`lib/chat/answer-local.ts`)
- С API: `POST /v1/chat` — local FAQ или OpenAI (`OPENAI_API_KEY`)
- Write path (баги/правки) — по-прежнему «🛠 Сообщить» → GitHub Issue

### Фаза 4 — Agent queue → draft PR

- Checkbox «Поставить в очередь агента» в FeedbackModal
- API: `requestAgent` → labels `feedback` + `agent` + `repository_dispatch`
- Workflow `.github/workflows/agent-task.yml` → `docs/agent-tasks/issue-N.md` + draft PR
- Ручной triage: добавить label `agent` на существующий issue
- Labels: см. `.github/labels.yml` (создать в GitHub вручную)
