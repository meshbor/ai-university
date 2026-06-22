import { GITHUB_REPO } from '@/lib/feedback/constants'
import type { FeedbackCategory, FeedbackPayload } from '@/types/feedback'

const CATEGORY_LABELS: Record<FeedbackCategory, string> = {
  bug: 'Баг',
  ui: 'UI / вёрстка',
  content: 'Контент',
  feature: 'Фича',
}

export function feedbackIssueTitle(category: FeedbackCategory, message: string): string {
  const label = CATEGORY_LABELS[category]
  const preview = message.trim().replace(/\s+/g, ' ').slice(0, 72)
  return `[feedback/${category}] ${label}: ${preview}`
}

export function feedbackIssueBody(payload: FeedbackPayload): string {
  const lines = [
    '## Сообщение',
    '',
    payload.message.trim(),
    '',
    '## Контекст',
    '',
    `- **Категория:** ${CATEGORY_LABELS[payload.category]} (\`${payload.category}\`)`,
  ]

  if (payload.context) {
    const ctx = payload.context
    lines.push(
      `- **URL:** ${ctx.url}`,
      `- **Тема:** ${ctx.themeId}`,
      `- **Вкладка:** ${ctx.activeTab}`,
      `- **Viewport:** ${ctx.viewport.w}×${ctx.viewport.h}`,
      `- **Версия:** ${ctx.appVersion}`,
      '',
      '<details>',
      '<summary>JSON контекст</summary>',
      '',
      '```json',
      JSON.stringify(ctx, null, 2),
      '```',
      '',
      '</details>',
    )
  } else {
    lines.push('- Контекст экрана не приложен.')
  }

  lines.push('', '---', '_Отправлено из AI University (in-app feedback)_')
  return lines.join('\n')
}

export function githubNewIssueUrl(title: string, body: string, labels: string[] = ['feedback']): string {
  const params = new URLSearchParams({
    title,
    body,
    labels: labels.join(','),
  })
  return `https://github.com/${GITHUB_REPO}/issues/new?${params}`
}
