# Agent task queue

Краткие brief'ы для Cursor Agent / человека, создаются автоматически workflow `agent-task.yml`.

**Не редактируй вручную** файлы `issue-*.md` в main — они появляются в draft PR ветки `agent/issue-N`.

## Как попасть в очередь

1. **Из приложения:** «Сообщить» → ☑ «Поставить в очередь агента» (нужен Go API + `GITHUB_TOKEN`)
2. **Вручную:** добавить label `agent` на GitHub Issue с label `feedback`

## Что происходит

```
Issue (#N, labels: feedback, agent)
  → repository_dispatch или issues.labeled
  → docs/agent-tasks/issue-N.md
  → draft PR agent/issue-N
  → Cursor / review → merge
```

### Настройка GitHub (один раз)

**Settings → Actions → General → Workflow permissions:**

- ✅ Read and write permissions
- ✅ **Allow GitHub Actions to create and approve pull requests**

Без второго пункта workflow создаст ветку и brief, но PR придётся открыть вручную (ссылка compare будет в комментарии на issue).
