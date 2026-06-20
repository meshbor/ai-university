import { COURSES } from '@/data/courses'
import { LIFE } from '@/data/life'
import { SPECIAL } from '@/data/special'
import type { LifeAxis, ProgressStore, SpecialStat, StatSource } from '@/types'
import {
  courseFraction,
  currentStreak,
  totalDoneCount,
} from './progress'

export function clamp10(v: number): number {
  return Math.max(1, Math.min(10, v))
}

export function fracToScore(frac: number): number {
  return clamp10(1 + Math.round(frac * 9))
}

export function statValue(store: ProgressStore, src: StatSource): number {
  if (src === 'streak') return clamp10(1 + currentStreak(store))
  if (src === 'pace') return clamp10(1 + totalDoneCount(store))
  if (src === 'overall') {
    const avg = COURSES.reduce((a, c) => a + courseFraction(store, c.id), 0) / COURSES.length
    return fracToScore(avg)
  }
  if (Array.isArray(src)) {
    const avg = src.reduce((a, id) => a + courseFraction(store, id), 0) / src.length
    return fracToScore(avg)
  }
  return fracToScore(courseFraction(store, src))
}

export function lifeScore(store: ProgressStore, axis: LifeAxis): number {
  return statValue(store, axis.src)
}

export function lifeScores(store: ProgressStore) {
  return LIFE.map((axis) => ({ ...axis, val: lifeScore(store, axis) }))
}

export function topStatLabel(store: ProgressStore): string {
  const vals = SPECIAL.map((s) => ({
    k: s.k,
    ru: s.ru,
    v: statValue(store, s.src),
  }))
  const best = vals.reduce((a, b) => (b.v > a.v ? b : a), vals[0])
  return `${best.k} · ${best.ru} (${best.v})`
}

export function dominantLetters(store: ProgressStore): string[] | null {
  const vals = SPECIAL.map((s) => statValue(store, s.src))
  const max = Math.max(...vals)
  const min = Math.min(...vals)
  if (max === min) return null
  return SPECIAL.filter((_, i) => vals[i] === max).map((s) => s.k)
}

export function specialWithValues(store: ProgressStore): Array<SpecialStat & { val: number }> {
  return SPECIAL.map((s) => ({ ...s, val: statValue(store, s.src) }))
}
