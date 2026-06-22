import { create } from 'zustand'
import { checkCredentials } from '@/lib/auth/credentials'
import { localRepositories } from '@/lib/storage/local-repositories'
import type { Profile, ThemeId } from '@/types'

interface AppState {
  hydrated: boolean
  authed: boolean
  profile: Profile | null
  themeId: ThemeId
  hydrate: () => void
  login: (user: string, pass: string) => boolean
  logout: () => void
  completeOnboarding: (profile: Profile) => void
  setTheme: (theme: ThemeId) => void
}

function syncAuthedClass(authed: boolean) {
  document.documentElement.classList.toggle('authed', authed)
}

export const useAppStore = create<AppState>((set) => ({
  hydrated: false,
  authed: false,
  profile: null,
  themeId: 'light',

  hydrate: () => {
    const authed = localRepositories.auth.isAuthed()
    const profile = authed ? localRepositories.profile.load() : null
    const themeId =
      (authed && localRepositories.theme.load()) ||
      profile?.theme ||
      'light'
    syncAuthedClass(authed)
    set({ hydrated: true, authed, profile, themeId })
  },

  login: (user, pass) => {
    if (!checkCredentials(user, pass)) return false
    localRepositories.auth.setAuthed()
    syncAuthedClass(true)
    const profile = localRepositories.profile.load()
    const themeId = localRepositories.theme.load() ?? profile?.theme ?? 'light'
    set({ authed: true, profile, themeId })
    return true
  },

  logout: () => {
    localRepositories.auth.clear()
    syncAuthedClass(false)
    set({ authed: false })
  },

  completeOnboarding: (profile) => {
    localRepositories.profile.save(profile)
    localRepositories.theme.save(profile.theme)
    set({ profile, themeId: profile.theme })
  },

  setTheme: (themeId) => {
    localRepositories.theme.save(themeId)
    set({ themeId })
  },
}))
