import { COURSES } from '@/data/courses'
import { DUEL_DAYS } from '@/lib/gamification/constants'
import {
  courseDoneCount,
  currentStreak,
  dateStr,
  levelFromXp,
  totalDoneCount,
  totalXp,
  weeklyXp,
} from '@/lib/gamification/progress'
import { topStatLabel } from '@/lib/gamification/stats'
import type {
  ActiveDuel,
  DuelInvitePayload,
  DuelMode,
  DuelStore,
  Profile,
  ProgressStore,
} from '@/types'

const INVITE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function randCode(len = 6): string {
  let s = ''
  for (let i = 0; i < len; i++) {
    s += INVITE_ALPHABET[Math.floor(Math.random() * INVITE_ALPHABET.length)]
  }
  return s
}

export function encodeInvite(payload: DuelInvitePayload): string {
  const json = JSON.stringify(payload)
  return btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export function decodeInvite(token: string): DuelInvitePayload | null {
  try {
    const json = decodeURIComponent(
      escape(atob(token.replace(/-/g, '+').replace(/_/g, '/'))),
    )
    const payload = JSON.parse(json) as DuelInvitePayload
    if (!payload?.from) return null
    return payload
  } catch {
    return null
  }
}

export function addDaysStr(base: string, days: number): string {
  const d = new Date(`${base}T12:00:00`)
  d.setDate(d.getDate() + days)
  return dateStr(d)
}

export interface ShareStats {
  level: number
  weeklyXp: number
  streak: number
  topStat: string
  totalDone: number
}

export function shareStats(store: ProgressStore): ShareStats {
  const totalDone = totalDoneCount(store)
  const xp = totalXp(store)
  return {
    level: levelFromXp(xp),
    weeklyXp: weeklyXp(store),
    streak: currentStreak(store),
    topStat: topStatLabel(store),
    totalDone,
  }
}

export function buildInvitePayload(
  store: ProgressStore,
  profile: Profile | null,
  mode: DuelMode,
  courseId: string | null,
): DuelInvitePayload {
  const st = shareStats(store)
  return {
    v: 1,
    code: randCode(),
    from: profile?.name ?? 'Герой',
    level: st.level,
    weeklyXp: st.weeklyXp,
    streak: st.streak,
    topStat: st.topStat,
    mode,
    courseId: courseId || null,
    courseDone: courseId ? courseDoneCount(store, courseId) : 0,
    at: dateStr(new Date()),
  }
}

export function inviteBaseUrl(): string {
  const url = new URL(import.meta.env.BASE_URL, window.location.origin)
  return url.href.replace(/\/$/, '') || url.href
}

export function inviteUrl(payload: DuelInvitePayload): string {
  return `${inviteBaseUrl()}?duel=${encodeInvite(payload)}`
}

export function duelModeLabel(mode: DuelMode, courseId: string | null): string {
  if (mode === 'course_sprint') {
    const course = COURSES.find((c) => c.id === courseId)
    return `Course Sprint · ${course?.title ?? courseId}`
  }
  return 'Weekly XP Race'
}

export function myDuelScore(duel: ActiveDuel, store: ProgressStore): number {
  if (duel.mode === 'course_sprint' && duel.courseId) {
    return courseDoneCount(store, duel.courseId)
  }
  return weeklyXp(store)
}

export function duelMetricLabel(duel: ActiveDuel): string {
  return duel.mode === 'course_sprint' ? 'уроков' : 'XP'
}

export function opponentDuelScore(duel: ActiveDuel): number {
  return duel.mode === 'course_sprint'
    ? duel.opponent.courseDone || 0
    : duel.opponent.weeklyXp || 0
}

export function isDuelExpired(duel: ActiveDuel, now = new Date()): boolean {
  return dateStr(now) > duel.endsAt
}

export function normalizeDuelStore(store: DuelStore): DuelStore {
  if (store.active && isDuelExpired(store.active)) {
    return { active: null }
  }
  return store
}

export function acceptInvite(payload: DuelInvitePayload): ActiveDuel {
  const startedAt = dateStr(new Date())
  return {
    id: payload.code || randCode(),
    mode: payload.mode || 'weekly_xp',
    courseId: payload.courseId || null,
    startedAt,
    endsAt: addDaysStr(startedAt, DUEL_DAYS),
    opponent: {
      name: payload.from || 'Друг',
      level: payload.level || 1,
      weeklyXp: payload.weeklyXp || 0,
      streak: payload.streak || 0,
      courseDone: payload.courseDone || 0,
      topStat: payload.topStat || '—',
    },
  }
}

export function duelDaysLeft(duel: ActiveDuel, now = new Date()): number {
  const end = new Date(`${duel.endsAt}T23:59:59`)
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 86_400_000))
}

export function duelScoreHint(
  mine: number,
  theirs: number,
  metric: string,
): { leadMine: boolean; tie: boolean; hint: string } {
  const leadMine = mine > theirs
  const tie = mine === theirs
  const hint = tie
    ? 'Ничья по снимку — жми уроки!'
    : leadMine
      ? `Ты впереди на ${mine - theirs} ${metric}`
      : `Отстаёшь на ${theirs - mine} ${metric} от снимка соперника`
  return { leadMine, tie, hint }
}

export function duelBadgeStatus(leadMine: boolean, tie: boolean): string {
  if (tie) return 'ничья'
  return leadMine ? 'лидируешь' : 'догоняй'
}

export function parseInviteFromUrl(href = window.location.href): DuelInvitePayload | null {
  try {
    const url = new URL(href)
    const token = url.searchParams.get('duel')
    if (!token) return null
    url.searchParams.delete('duel')
    const next = `${url.pathname}${url.search}${url.hash}`
    window.history.replaceState({}, '', next)
    return decodeInvite(token)
  } catch {
    return null
  }
}

export function parseInviteFromPaste(raw: string): DuelInvitePayload | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  try {
    const url = new URL(trimmed, window.location.href)
    const token = url.searchParams.get('duel')
    if (!token) return null
    return decodeInvite(token)
  } catch {
    return null
  }
}
