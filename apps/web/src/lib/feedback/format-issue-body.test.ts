import { describe, expect, it } from 'vitest'
import { feedbackIssueBody, feedbackIssueTitle, githubNewIssueUrl } from './format-issue-body'
import type { FeedbackPayload } from '@/types/feedback'

const basePayload: FeedbackPayload = {
  message: 'Кривая вёрстка курса',
  category: 'ui',
  context: {
    route: 'dashboard',
    themeId: 'fallout',
    activeTab: 'skills',
    viewport: { w: 1280, h: 720 },
    profile: { name: 'Baruh', hero: 'fast', theme: 'fallout' },
    stats: { level: 2, doneLessons: 5, xp: 500, streak: 1 },
    url: 'http://localhost:5173/ai-university/',
    userAgent: 'vitest',
    appVersion: '0.1.0',
  },
}

describe('format-issue-body', () => {
  it('formats title with category prefix', () => {
    expect(feedbackIssueTitle('bug', 'не работает кнопка')).toMatch(/\[feedback\/bug\]/)
  })

  it('includes message and json context in body', () => {
    const body = feedbackIssueBody(basePayload)
    expect(body).toContain('Кривая вёрстка курса')
    expect(body).toContain('"themeId": "fallout"')
    expect(body).toContain('JSON контекст')
  })

  it('builds github new issue url', () => {
    const url = githubNewIssueUrl('title', 'body')
    expect(url).toContain('github.com/meshbor/ai-university/issues/new')
    expect(url).toContain('labels=feedback')
  })
})
