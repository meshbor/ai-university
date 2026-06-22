import { useMemo } from 'react'
import { COURSES } from '@/data/courses'
import { THEMES } from '@/data/themes'
import {
  courseDoneCount,
  currentStreak,
  levelFromXp,
  totalDoneCount,
  totalXp,
} from '@/lib/gamification/progress'
import { pickPortrait } from '@/lib/gamification/portrait'
import { lifeScores } from '@/lib/gamification/stats'
import { buildXpBar } from '@/features/dashboard/HeroPanel'
import type { Profile, ProgressStore, ThemeId } from '@/types'

export function useDashboardStats(
  store: ProgressStore,
  profile: Profile | null,
  themeId: ThemeId,
) {
  return useMemo(() => {
    const done = totalDoneCount(store)
    const xp = totalXp(store)
    const level = levelFromXp(xp)
    const theme = THEMES[themeId]
    const rank = theme.ranks[Math.min(level - 1, theme.ranks.length - 1)]
    const xpBar = buildXpBar(xp)

    let totalLessons = 0
    let activeCourses = 0
    for (const course of COURSES) {
      totalLessons += course.lessons.length
      if (courseDoneCount(store, course.id) > 0) activeCourses++
    }

    return {
      done,
      xp,
      level,
      rank,
      streak: currentStreak(store),
      activeCourses,
      totalLessons,
      portrait: pickPortrait(themeId, level, store, profile),
      life: lifeScores(store),
      heroPanel: {
        level,
        rank,
        xp,
        ...xpBar,
        streak: currentStreak(store),
        activeCourses,
        doneLessons: done,
        totalLessons,
      },
    }
  }, [store, profile, themeId])
}
