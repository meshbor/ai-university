import { COURSES } from '@/data/courses'
import type { Course, ProgressStore } from '@/types'
import { XP_PER_LESSON, XP_PER_LEVEL } from './constants'

export function lessonKey(courseId: string, lessonN: string): string {
  return `${courseId}/${lessonN}`
}

export function totalDoneCount(store: ProgressStore, courses: Course[] = COURSES): number {
  let n = 0
  for (const course of courses) {
    for (const lesson of course.lessons) {
      if (store.lessons[lessonKey(course.id, lesson.n)]) n++
    }
  }
  return n
}

export function courseDoneCount(
  store: ProgressStore,
  courseId: string,
  courses: Course[] = COURSES,
): number {
  const course = courses.find((c) => c.id === courseId)
  if (!course) return 0
  return course.lessons.filter((l) => store.lessons[lessonKey(courseId, l.n)]).length
}

export function courseFraction(
  store: ProgressStore,
  courseId: string,
  courses: Course[] = COURSES,
): number {
  const course = courses.find((c) => c.id === courseId)
  if (!course || !course.lessons.length) return 0
  return courseDoneCount(store, courseId, courses) / course.lessons.length
}

export function totalXp(store: ProgressStore, courses: Course[] = COURSES): number {
  return totalDoneCount(store, courses) * XP_PER_LESSON
}

export function levelFromXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

export function xpIntoLevel(xp: number): number {
  return xp % XP_PER_LEVEL
}

export function levelTier(level: number): 1 | 2 | 3 {
  if (level >= 7) return 3
  if (level >= 4) return 2
  return 1
}

export function dateStr(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function lessonCompletedAt(store: ProgressStore, key: string): Date | null {
  const raw = store.meta.completedAt?.[key]
  return raw ? new Date(raw) : null
}

export function weeklyXp(store: ProgressStore, days = 7): number {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  let xp = 0
  for (const [key, done] of Object.entries(store.lessons)) {
    if (!done) continue
    const at = lessonCompletedAt(store, key)
    if (at && at >= cutoff) xp += XP_PER_LESSON
  }
  return xp
}

export function touchStreak(store: ProgressStore, now = new Date()): ProgressStore {
  const today = dateStr(now)
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const yest = dateStr(yesterday)

  if (store.meta.lastActive === today) return store

  const streak =
    store.meta.lastActive === yest ? (store.meta.streak ?? 0) + 1 : 1

  return {
    ...store,
    meta: { ...store.meta, streak, lastActive: today },
  }
}

export function currentStreak(store: ProgressStore, now = new Date()): number {
  if (!store.meta.lastActive) return 0
  const today = dateStr(now)
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const yest = dateStr(yesterday)
  if (store.meta.lastActive === today || store.meta.lastActive === yest) {
    return store.meta.streak ?? 0
  }
  return 0
}

export function setLessonDone(
  store: ProgressStore,
  key: string,
  done: boolean,
  now = new Date(),
): ProgressStore {
  const lessons = { ...store.lessons }
  const completedAt = { ...(store.meta.completedAt ?? {}) }

  if (done) {
    lessons[key] = true
    completedAt[key] = now.toISOString()
    return touchStreak({ ...store, lessons, meta: { ...store.meta, completedAt } }, now)
  }

  delete lessons[key]
  delete completedAt[key]
  return { ...store, lessons, meta: { ...store.meta, completedAt } }
}
