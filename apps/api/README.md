# AI University API (Go)

Заготовка под бэкенд senior-2026: auth, sync прогресса, дуэли.

## План

- `cmd/server` — HTTP entrypoint
- `internal/handler` — HTTP handlers
- `internal/service` — бизнес-логика
- `internal/store` — PostgreSQL / SQLite

## Статус

Пока не реализовано. Фронт (`apps/web`) использует `localStorage` через `LocalProgressRepository`.

Когда API появится — тот же контракт, другая реализация репозитория на фронте.
