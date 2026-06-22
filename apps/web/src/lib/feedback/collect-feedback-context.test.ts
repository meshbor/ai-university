import { describe, expect, it } from 'vitest'
import { collectFeedbackContext } from './collect-feedback-context'

describe('collectFeedbackContext', () => {
  it('builds safe aggregates without full localStorage', () => {
    const ctx = collectFeedbackContext({
      themeId: 'fallout',
      activeTab: 'skills',
      profile: {
        name: 'Baruh',
        hero: 'fast',
        theme: 'fallout',
        pickedAt: '2026-06-01',
      },
      stats: { level: 3, doneLessons: 7, xp: 700, streak: 2 },
    })

    expect(ctx.route).toBe('dashboard')
    expect(ctx.themeId).toBe('fallout')
    expect(ctx.activeTab).toBe('skills')
    expect(ctx.profile).toEqual({ name: 'Baruh', hero: 'fast', theme: 'fallout' })
    expect(ctx.stats).toEqual({ level: 3, doneLessons: 7, xp: 700, streak: 2 })
    expect(ctx.appVersion).toBeTruthy()
  })
})
