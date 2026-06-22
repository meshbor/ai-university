import { describe, expect, it } from 'vitest'
import { answerLocal } from './answer-local'
import type { FeedbackContext } from '@/types/feedback'

const ctx: FeedbackContext = {
  route: 'dashboard',
  themeId: 'fallout',
  activeTab: 'help',
  viewport: { w: 1280, h: 720 },
  profile: { name: 'Baruh', hero: 'fast', theme: 'fallout' },
  stats: { level: 3, doneLessons: 7, xp: 700, streak: 2 },
  url: 'http://localhost/',
  userAgent: 'vitest',
  appVersion: '0.1.0',
}

describe('answerLocal', () => {
  it('answers XP questions from FAQ', () => {
    const reply = answerLocal('Как считается XP?', null)
    expect(reply).toContain('100 XP')
    expect(reply).toContain('300 XP')
  })

  it('answers with personal stats when context provided', () => {
    const reply = answerLocal('Сколько у меня XP?', ctx)
    expect(reply).toContain('700')
    expect(reply).toContain('Baruh')
  })

  it('lists courses', () => {
    const reply = answerLocal('Какие курсы есть?', null)
    expect(reply).toContain('Senior 2026')
    expect(reply).toContain('Английский')
  })
})
