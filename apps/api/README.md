# AI University API (Go)

HTTP API для senior-2026: auth, sync прогресса, дуэли, **in-app feedback**.

## Структура

```
cmd/server/          — HTTP entrypoint
internal/handler/    — HTTP handlers (feedback, chat)
internal/chat/       — local FAQ knowledge
internal/middleware/ — CORS
```

## Запуск

```bash
cd apps/api
go run ./cmd/server
# → http://localhost:8080
```

### Переменные окружения

| Переменная | По умолчанию | Назначение |
|------------|--------------|------------|
| `ADDR` | `:8080` | Адрес сервера |
| `GITHUB_REPO` | `meshbor/ai-university` | Репозиторий для Issues |
| `GITHUB_TOKEN` | — | PAT с `repo` scope; без токена API возвращает prefilled draft URL |
| `AGENT_DISPATCH_ENABLED` | `true` | `false` отключает очередь агента |
| `OPENAI_API_KEY` | — | Для AI-ответов в `/v1/chat`; без ключа — local FAQ |
| `OPENAI_MODEL` | `gpt-4o-mini` | Модель OpenAI |

## Endpoints

### `GET /health`

```json
{ "ok": true }
```

### `POST /v1/feedback`

Создаёт GitHub Issue (или возвращает prefilled URL без `GITHUB_TOKEN`).

**Request:**

```http
POST /v1/feedback
Content-Type: application/json

{
  "message": "string",
  "category": "bug" | "ui" | "content" | "feature",
  "context": {
    "route": "dashboard",
    "themeId": "fallout",
    "activeTab": "skills",
    "viewport": { "w": 1920, "h": 1080 },
    "profile": { "name": "Baruh", "hero": "fast", "theme": "fallout" },
    "stats": { "level": 3, "doneLessons": 7, "xp": 700, "streak": 2 },
    "url": "https://meshbor.github.io/ai-university/",
    "userAgent": "...",
    "appVersion": "0.1.0"
  },
  "requestAgent": false
}
```

`requestAgent: true` → labels `feedback` + `agent`, `repository_dispatch` → workflow создаёт draft PR.

**Response `201`:**

```json
{
  "id": "42",
  "issueUrl": "https://github.com/meshbor/ai-university/issues/42",
  "agentQueued": true
}
```

CORS: `localhost:5173`, `meshbor.github.io`.

### `POST /v1/chat`

Read-only помощник: local FAQ или OpenAI proxy.

**Request:**

```http
POST /v1/chat
Content-Type: application/json

{
  "message": "Как считается XP?",
  "history": [{ "role": "user", "content": "..." }, { "role": "assistant", "content": "..." }],
  "context": { ... }
}
```

**Response `200`:**

```json
{
  "reply": "1 урок = 100 XP...",
  "via": "local"
}
```

`via`: `local` (FAQ) или `openai` (с `OPENAI_API_KEY`).

## Фронт

- Без `VITE_API_BASE_URL` — feedback: prefilled GitHub Issue; chat: local FAQ в браузере.
- С `VITE_API_BASE_URL=http://localhost:8080` — POST на API (feedback + chat).

```bash
# apps/web/.env.local
VITE_API_BASE_URL=http://localhost:8080
```

## Статус

| Endpoint | Статус |
|----------|--------|
| `POST /v1/feedback` | MVP реализован |
| `POST /v1/chat` | MVP: local FAQ + OpenAI proxy |
| Agent queue (Phase 4) | `.github/workflows/agent-task.yml` |
| Auth / progress sync | Заготовка |
