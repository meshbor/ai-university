import { describe, expect, it } from 'vitest'
import type { ProgressStore } from '@/types'
import { XP_PER_LESSON, XP_PER_LEVEL } from './constants'
import {
  courseDoneCount,
  courseFraction,
  currentStreak,
  levelFromXp,
  lessonKey,
  setLessonDone,
  totalDoneCount,
  totalXp,
  touchStreak,
  weeklyXp,
} from './progress'

function emptyStore(): ProgressStore {
  return { lessons: {}, meta: {} }
}

describe('progress', () => {
  it('counts completed lessons', () => {
    const store: ProgressStore = {
      lessons: { [lessonKey('english', '0001')]: true },
      meta: {},
    }
    expect(totalDoneCount(store)).toBe(1)
    expect(courseDoneCount(store, 'english')).toBe(1)
    expect(courseFraction(store, 'english')).toBeCloseTo(1 / 3)
  })

  it('computes xp and level', () => {
    const xp = 3 * XP_PER_LESSON
    expect(levelFromXp(xp)).toBe(2)
    const store: ProgressStore = {
      lessons: {
        'english/0001': true,
        'english/0002': true,
        'english/0003': true,
      },
      meta: {},
    }
    expect(totalXp(store)).toBe(xp)
  })

  it('tracks streak on lesson completion', () => {
    const base = emptyStore()
    const after = setLessonDone(base, 'english/0001', true, new Date('2026-06-18T12:00:00Z'))
    expect(after.meta.streak).toBe(1)
    expect(after.meta.lastActive).toBe('2026-06-18')

    const nextDay = touchStreak(after, new Date('2026-06-19T12:00:00Z'))
    expect(nextDay.meta.streak).toBe(2)
    expect(currentStreak(nextDay, new Date('2026-06-19T12:00:00Z'))).toBe(2)
  })

  it('weekly xp only counts recent completions', () => {
    const store: ProgressStore = {
      lessons: { old: true, fresh: true },
      meta: {
        completedAt: {
          old: '2020-01-01T00:00:00.000Z',
          fresh: '2026-06-17T00:00:00.000Z',
        },
      },
    }
    expect(weeklyXp(store, 7)).toBe(XP_PER_LESSON)
  })

  it('level thresholds match legacy dashboard', () => {
    expect(levelFromXp(0)).toBe(1)
    expect(levelFromXp(XP_PER_LEVEL - 1)).toBe(1)
    expect(levelFromXp(XP_PER_LEVEL)).toBe(2)
  })
})
