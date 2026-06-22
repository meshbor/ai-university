#!/usr/bin/env node
/**
 * Генерирует brief для агента из GitHub Issue.
 * Используется в .github/workflows/agent-task.yml
 *
 * Usage: node scripts/agent-task-from-issue.mjs <issue_number>
 */

import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const issueNumber = process.argv[2]
if (!issueNumber) {
  console.error('Usage: node scripts/agent-task-from-issue.mjs <issue_number>')
  process.exit(1)
}

const repo = process.env.GITHUB_REPOSITORY
const token = process.env.GITHUB_TOKEN
if (!repo || !token) {
  console.error('GITHUB_REPOSITORY and GITHUB_TOKEN required')
  process.exit(1)
}

const res = await fetch(`https://api.github.com/repos/${repo}/issues/${issueNumber}`, {
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  },
})

if (!res.ok) {
  console.error(`GitHub API ${res.status}: ${await res.text()}`)
  process.exit(1)
}

const issue = await res.json()
const message = extractSection(issue.body ?? '', 'Сообщение')
const contextJson = extractJsonBlock(issue.body ?? '')
const category = extractCategory(issue.body ?? '')

const outDir = path.join('docs', 'agent-tasks')
await mkdir(outDir, { recursive: true })

const fileName = `issue-${issueNumber}.md`
const outPath = path.join(outDir, fileName)

const content = `# Agent task · Issue #${issueNumber}

> **Issue:** ${issue.html_url}
> **Title:** ${issue.title}
> **Category:** \`${category}\`

## Запрос пользователя

${message || '_См. issue body_'}

## Контекст приложения

${contextJson ? '```json\n' + JSON.stringify(contextJson, null, 2) + '\n```' : '_Контекст не приложен_'}

## Инструкции агенту

1. Реализуй запрос **минимальным diff** в \`apps/web\` (или \`apps/api\` если нужен backend).
2. Следуй существующим паттернам репозитория (repository pattern, RPG UI).
3. Не трогай \`legacy/\` и \`courses/\` HTML без явной необходимости.
4. Свяжи PR с issue #${issueNumber} (\`Closes #${issueNumber}\` если задача полностью закрыта).
5. **Draft PR** — человек ревьюит перед merge.

## Чеклист

- [ ] Изменения соответствуют категории (\`${category}\`)
- [ ] \`npm test\` и \`npm run build\` проходят
- [ ] Нет секретов в коде
`

await writeFile(outPath, content, 'utf8')

const branch = `agent/issue-${issueNumber}`
const githubOutput = process.env.GITHUB_OUTPUT
if (githubOutput) {
  const { appendFile } = await import('node:fs/promises')
  await appendFile(githubOutput, `branch=${branch}\n`)
  await appendFile(githubOutput, `task_file=${outPath}\n`)
}

console.log(`Wrote ${outPath}`)
console.log(`Branch: ${branch}`)

function extractSection(body, heading) {
  const re = new RegExp(`## ${heading}\\s*\\n+([\\s\\S]*?)(?=\\n## |$)`)
  const m = body.match(re)
  return m ? m[1].trim() : ''
}

function extractJsonBlock(body) {
  const m = body.match(/```json\s*([\s\S]*?)```/)
  if (!m) return null
  try {
    return JSON.parse(m[1].trim())
  } catch {
    return null
  }
}

function extractCategory(body) {
  const m = body.match(/Категория:\*\* `([^`]+)`/)
  return m ? m[1] : 'unknown'
}
