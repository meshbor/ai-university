import { useEffect, useMemo, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CourseList } from '@/features/courses/CourseList'
import { HeroPanel } from '@/features/dashboard/HeroPanel'
import { SpecialGrid } from '@/features/dashboard/SpecialGrid'
import { useDashboardStats } from '@/features/dashboard/use-dashboard-stats'
import { DuelPanel } from '@/features/duels/DuelPanel'
import { InviteModal } from '@/features/duels/InviteModal'
import { ShareModal } from '@/features/duels/ShareModal'
import { Toast } from '@/features/duels/Toast'
import { OnboardingPage } from '@/features/onboarding/OnboardingPage'
import { ThemeBackgrounds } from '@/features/theme/ThemeBackgrounds'
import { ThemeToolbar } from '@/features/theme/ThemeToolbar'
import { themeWhoLine } from '@/features/theme/theme-who'
import { THEMES } from '@/data/themes'
import {
  acceptInvite,
  normalizeDuelStore,
  parseInviteFromPaste,
  parseInviteFromUrl,
} from '@/lib/gamification/duels'
import { localRepositories } from '@/lib/storage/local-repositories'
import { useAppStore } from '@/stores/use-app-store'
import type { DuelInvitePayload, DuelStore, ProgressStore } from '@/types'
import '@/styles/rpg-themes.css'

export function DashboardPage() {
  const profile = useAppStore((s) => s.profile)
  const themeId = useAppStore((s) => s.themeId)
  const logout = useAppStore((s) => s.logout)
  const [rematch, setRematch] = useState(false)
  const [store, setStore] = useState<ProgressStore>(() => localRepositories.progress.load())
  const [duelStore, setDuelStore] = useState<DuelStore>(() =>
    normalizeDuelStore(localRepositories.duel.load()),
  )
  const [shareOpen, setShareOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [pendingInvite, setPendingInvite] = useState<DuelInvitePayload | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const theme = THEMES[themeId]
  const heroName = profile?.name ?? 'Baruh'
  const dash = useDashboardStats(store, profile, themeId)
  const activeDuel = useMemo(() => normalizeDuelStore(duelStore).active, [duelStore])

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2400)
  }

  const saveDuel = (next: DuelStore) => {
    localRepositories.duel.save(next)
    setDuelStore(next)
  }

  const openInvite = (payload: DuelInvitePayload) => {
    const normalized = normalizeDuelStore(duelStore)
    if (normalized.active) {
      showToast(`${payload.from} вызывает, но у тебя уже есть дуэль`)
      return
    }
    setPendingInvite(payload)
    setInviteOpen(true)
  }

  useEffect(() => {
    setDuelStore((current) => {
      const normalized = normalizeDuelStore(current)
      if (normalized.active !== current.active) {
        localRepositories.duel.save(normalized)
        return normalized
      }
      return current
    })
  }, [store])

  useEffect(() => {
    const payload = parseInviteFromUrl()
    if (!payload) return
    const normalized = normalizeDuelStore(localRepositories.duel.load())
    if (normalized.active) {
      showToast(`${payload.from} вызывает, но у тебя уже есть дуэль`)
      return
    }
    setPendingInvite(payload)
    setInviteOpen(true)
  }, [])

  const sysDate = new Date().toLocaleDateString('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  if (rematch) {
    return <OnboardingPage rematch onDone={() => setRematch(false)} />
  }

  const resetProgress = () => {
    if (!window.confirm('Сбросить весь прогресс уроков? Профиль героя останется.')) return
    const empty = { lessons: {}, meta: {} }
    localRepositories.progress.save(empty)
    setStore(empty)
  }

  const acceptPendingInvite = () => {
    if (!pendingInvite) return
    saveDuel({ active: acceptInvite(pendingInvite) })
    setInviteOpen(false)
    setPendingInvite(null)
    showToast('Дуэль началась! Удачи.')
  }

  return (
    <div className="rpg-shell" data-theme={themeId}>
      <ThemeBackgrounds themeId={themeId} />
      <ThemeToolbar
        onShare={() => setShareOpen(true)}
        onNewHero={() => setRematch(true)}
        onLogout={logout}
      />

      <div className="rpg-screen">
        <div className="rpg-scanlines" aria-hidden />
        <div className="rpg-starfield" aria-hidden />

        <header className="rpg-tt mb-3.5 flex items-end justify-between border-b border-[var(--rpg-line)] pb-2 text-[13px]">
          <div className="text-lg font-bold">{theme.brand}</div>
          <div className="text-right leading-snug opacity-85">
            <div>{sysDate}</div>
            <div>{themeWhoLine(themeId, heroName)}</div>
          </div>
        </header>

        <div className="rpg-dashboard">
          <HeroPanel
            portrait={dash.portrait}
            stats={dash.heroPanel}
            lifeScores={dash.life}
            duel={activeDuel}
            store={store}
          />

          <div className="min-w-0">
            <Tabs defaultValue="skills" className="gap-0">
              <TabsList variant="line" className="rpg-tabs-list w-full justify-start rounded-none">
                <TabsTrigger value="special" className="rpg-tabs-trigger">
                  {theme.tabs.special}
                </TabsTrigger>
                <TabsTrigger value="skills" className="rpg-tabs-trigger">
                  {theme.tabs.skills}
                </TabsTrigger>
                <TabsTrigger value="duels" className="rpg-tabs-trigger">
                  {theme.tabs.duels}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="special" className="mt-0">
                <SpecialGrid store={store} />
              </TabsContent>

              <TabsContent value="skills" className="rpg-course mt-0">
                <CourseList store={store} onStoreChange={setStore} />
              </TabsContent>

              <TabsContent value="duels" className="mt-0">
                <DuelPanel
                  duel={activeDuel}
                  store={store}
                  onShare={() => setShareOpen(true)}
                  onEnd={() => saveDuel({ active: null })}
                  onPaste={(raw) => {
                    const payload = parseInviteFromPaste(raw)
                    if (!payload) {
                      showToast('Не удалось разобрать ссылку')
                      return
                    }
                    openInvite(payload)
                  }}
                  onToast={showToast}
                />
              </TabsContent>
            </Tabs>

            <footer className="rpg-tt mt-4 flex flex-wrap items-center justify-between gap-2 text-xs opacity-70">
              <span>1 урок = 100 XP · уровень каждые 300 XP · прогресс в браузере</span>
              <button type="button" className="rpg-reset-btn" onClick={resetProgress}>
                Сбросить прогресс
              </button>
            </footer>
          </div>
        </div>
      </div>

      <ShareModal
        open={shareOpen}
        store={store}
        profile={profile}
        heroName={heroName}
        onClose={() => setShareOpen(false)}
        onCopied={showToast}
      />

      <InviteModal
        open={inviteOpen}
        payload={pendingInvite}
        onAccept={acceptPendingInvite}
        onDecline={() => {
          setInviteOpen(false)
          setPendingInvite(null)
        }}
      />

      <Toast message={toast} />
    </div>
  )
}
