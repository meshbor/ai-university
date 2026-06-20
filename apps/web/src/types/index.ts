export type ThemeId = 'light' | 'fallout' | 'space' | 'wot' | 'knight' | 'samurai'

export type HeroArchetype =
  | 'smart'
  | 'strong'
  | 'fast'
  | 'gun'
  | 'cargo'
  | 'tank'
  | 'knight'
  | 'samurai'

export interface LessonLink {
  n: string
  t: string
  href: string
}

export interface RefLink {
  t: string
  href: string
}

export interface Course {
  id: string
  emoji: string
  title: string
  sub: string
  primary: { label: string; href: string }
  lessons: LessonLink[]
  refs?: RefLink[]
}

export type StatSource =
  | string
  | 'streak'
  | 'pace'
  | 'overall'
  | string[]

export interface SpecialStat {
  k: string
  name: string
  ru: string
  src: StatSource
  note: string
}

export interface LifeAxis {
  id: string
  label: string
  emoji: string
  src: StatSource
}

export interface ThemeConfig {
  brand: string
  who: string
  tabs: { special: string; skills: string; duels: string }
  ranks: string[]
}

export interface Profile {
  theme: ThemeId
  hero: HeroArchetype
  name: string
  pickedAt: string
}

export interface ProgressMeta {
  streak?: number
  lastActive?: string
  progressVer?: number
  completedAt?: Record<string, string>
}

export interface ProgressStore {
  lessons: Record<string, boolean>
  meta: ProgressMeta
}

export interface OnboardingPreset {
  id: string
  name: string
  theme: ThemeId
  hero: HeroArchetype
  note: string
  lore: string
}

export type DuelMode = 'weekly_xp' | 'course_sprint'

export interface DuelOpponent {
  name: string
  level: number
  weeklyXp: number
  streak: number
  courseDone: number
  topStat: string
}

export interface ActiveDuel {
  id: string
  mode: DuelMode
  courseId: string | null
  startedAt: string
  endsAt: string
  opponent: DuelOpponent
}

export interface DuelStore {
  active: ActiveDuel | null
}
