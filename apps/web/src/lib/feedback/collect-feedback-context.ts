import { APP_VERSION } from '@/lib/feedback/constants'
import type { FeedbackContext } from '@/types/feedback'
import type { Profile, ThemeId } from '@/types'

export interface CollectFeedbackContextInput {
  themeId: ThemeId
  activeTab: string
  profile: Profile | null
  stats: {
    level: number
    doneLessons: number
    xp: number
    streak: number
  }
}

export function collectFeedbackContext(input: CollectFeedbackContextInput): FeedbackContext {
  return {
    route: 'dashboard',
    themeId: input.themeId,
    activeTab: input.activeTab,
    viewport: {
      w: typeof window !== 'undefined' ? window.innerWidth : 0,
      h: typeof window !== 'undefined' ? window.innerHeight : 0,
    },
    profile: input.profile
      ? {
          name: input.profile.name,
          hero: input.profile.hero,
          theme: input.profile.theme,
        }
      : null,
    stats: {
      level: input.stats.level,
      doneLessons: input.stats.doneLessons,
      xp: input.stats.xp,
      streak: input.stats.streak,
    },
    url: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    appVersion: APP_VERSION,
  }
}
