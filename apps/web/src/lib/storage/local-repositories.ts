import { LEGACY_BACKFILL_DATE } from '@/lib/gamification/constants'
import type { DuelStore, Profile, ProgressStore, ThemeId } from '@/types'
import { STORAGE_KEYS } from './keys'
import type {
  AuthRepository,
  DuelRepository,
  ProfileRepository,
  ProgressRepository,
  ThemeRepository,
} from './repositories'

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value))
}

function emptyProgress(): ProgressStore {
  return { lessons: {}, meta: {} }
}

function normalizeProgress(store: ProgressStore): ProgressStore {
  const lessons = store.lessons ?? {}
  const meta = store.meta ?? {}
  const completedAt = { ...(meta.completedAt ?? {}) }

  for (const key of Object.keys(lessons)) {
    if (lessons[key] && !completedAt[key]) {
      completedAt[key] = LEGACY_BACKFILL_DATE
    }
  }

  return { lessons, meta: { ...meta, completedAt } }
}

function runProgressMigration(store: ProgressStore): ProgressStore {
  let next = normalizeProgress(store)
  if ((next.meta.progressVer ?? 0) < 1) {
    for (const key of ['chtenie/0001', 'chtenie/0002', 'chtenie/0003']) {
      next.lessons[key] = true
      if (!next.meta.completedAt?.[key]) {
        next.meta.completedAt = { ...next.meta.completedAt, [key]: LEGACY_BACKFILL_DATE }
      }
    }
    next.meta.progressVer = 1
  }
  return next
}

export class LocalProgressRepository implements ProgressRepository {
  load(): ProgressStore {
    const raw = readJson<ProgressStore>(STORAGE_KEYS.progress, emptyProgress())
    return runProgressMigration(raw)
  }

  save(store: ProgressStore): void {
    writeJson(STORAGE_KEYS.progress, store)
  }
}

export class LocalProfileRepository implements ProfileRepository {
  load(): Profile | null {
    return readJson<Profile | null>(STORAGE_KEYS.profile, null)
  }

  save(profile: Profile): void {
    writeJson(STORAGE_KEYS.profile, profile)
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEYS.profile)
  }
}

export class LocalThemeRepository implements ThemeRepository {
  load(): ThemeId | null {
    const raw = localStorage.getItem(STORAGE_KEYS.theme)
    return raw as ThemeId | null
  }

  save(theme: ThemeId): void {
    localStorage.setItem(STORAGE_KEYS.theme, theme)
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEYS.theme)
  }
}

export class LocalAuthRepository implements AuthRepository {
  isAuthed(): boolean {
    return localStorage.getItem(STORAGE_KEYS.auth) === '1'
  }

  setAuthed(): void {
    localStorage.setItem(STORAGE_KEYS.auth, '1')
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEYS.auth)
  }
}

export class LocalDuelRepository implements DuelRepository {
  load(): DuelStore {
    const raw = readJson<Partial<DuelStore>>(STORAGE_KEYS.duel, {})
    return { active: raw.active ?? null }
  }

  save(store: DuelStore): void {
    writeJson(STORAGE_KEYS.duel, store)
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEYS.duel)
  }
}

export const localRepositories = {
  progress: new LocalProgressRepository(),
  profile: new LocalProfileRepository(),
  theme: new LocalThemeRepository(),
  auth: new LocalAuthRepository(),
  duel: new LocalDuelRepository(),
}
