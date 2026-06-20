import type { DuelStore, Profile, ProgressStore, ThemeId } from '@/types'

export interface ProgressRepository {
  load(): ProgressStore
  save(store: ProgressStore): void
}

export interface ProfileRepository {
  load(): Profile | null
  save(profile: Profile): void
  clear(): void
}

export interface ThemeRepository {
  load(): ThemeId | null
  save(theme: ThemeId): void
  clear(): void
}

export interface AuthRepository {
  isAuthed(): boolean
  setAuthed(): void
  clear(): void
}

export interface DuelRepository {
  load(): DuelStore
  save(store: DuelStore): void
  clear(): void
}
