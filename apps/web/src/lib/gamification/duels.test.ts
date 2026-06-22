import { describe, expect, it } from 'vitest'
import {
  acceptInvite,
  addDaysStr,
  buildInvitePayload,
  decodeInvite,
  duelDaysLeft,
  duelScoreHint,
  encodeInvite,
  isDuelExpired,
  myDuelScore,
  normalizeDuelStore,
  opponentDuelScore,
} from './duels'
import type { DuelInvitePayload, ProgressStore } from '@/types'

const emptyStore: ProgressStore = { lessons: {}, meta: {} }

describe('duels', () => {
  const payload: DuelInvitePayload = {
    v: 1,
    code: 'ABC123',
    from: 'Вася',
    level: 3,
    weeklyXp: 200,
    streak: 2,
    topStat: 'S · Бэкенд (5)',
    mode: 'weekly_xp',
    courseId: null,
    courseDone: 0,
    at: '2026-06-18',
  }

  it('roundtrips invite encode/decode', () => {
    const token = encodeInvite(payload)
    expect(decodeInvite(token)).toEqual(payload)
  })

  it('acceptInvite builds active duel', () => {
    const duel = acceptInvite(payload)
    expect(duel.opponent.name).toBe('Вася')
    expect(duel.mode).toBe('weekly_xp')
    expect(duel.endsAt).toBe(addDaysStr(duel.startedAt, 7))
  })

  it('scores weekly xp duel from progress', () => {
    const store: ProgressStore = {
      lessons: { 'english/0001': true },
      meta: { completedAt: { 'english/0001': new Date().toISOString() } },
    }
    const duel = acceptInvite({ ...payload, mode: 'weekly_xp' })
    expect(myDuelScore(duel, store)).toBe(100)
    expect(opponentDuelScore(duel)).toBe(200)
  })

  it('expires old duels on normalize', () => {
    const duel = acceptInvite(payload)
    duel.endsAt = '2020-01-01'
    expect(isDuelExpired(duel)).toBe(true)
    expect(normalizeDuelStore({ active: duel })).toEqual({ active: null })
  })

  it('buildInvitePayload uses profile name', () => {
    const built = buildInvitePayload(
      emptyStore,
      { name: 'Борух', theme: 'light', hero: 'smart', pickedAt: '2026-01-01' },
      'weekly_xp',
      null,
    )
    expect(built.from).toBe('Борух')
    expect(built.code).toHaveLength(6)
  })

  it('duelScoreHint describes lead and tie', () => {
    expect(duelScoreHint(300, 200, 'XP').hint).toContain('впереди')
    expect(duelScoreHint(100, 100, 'XP').tie).toBe(true)
  })

  it('duelDaysLeft is non-negative', () => {
    const duel = acceptInvite(payload)
    expect(duelDaysLeft(duel)).toBeGreaterThanOrEqual(0)
  })
})
