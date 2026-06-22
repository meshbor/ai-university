import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CourseList } from '@/features/courses/CourseList'
import { DuelsPlaceholder } from '@/features/dashboard/DuelsPlaceholder'
import { HeroPanel } from '@/features/dashboard/HeroPanel'
import { SpecialGrid } from '@/features/dashboard/SpecialGrid'
import { useDashboardStats } from '@/features/dashboard/use-dashboard-stats'
import { OnboardingPage } from '@/features/onboarding/OnboardingPage'
import { ThemeBackgrounds } from '@/features/theme/ThemeBackgrounds'
import { ThemeToolbar } from '@/features/theme/ThemeToolbar'
import { themeWhoLine } from '@/features/theme/theme-who'
import { THEMES } from '@/data/themes'
import { localRepositories } from '@/lib/storage/local-repositories'
import { useAppStore } from '@/stores/use-app-store'
import type { ProgressStore } from '@/types'
import '@/styles/rpg-themes.css'

export function DashboardPage() {
  const profile = useAppStore((s) => s.profile)
  const themeId = useAppStore((s) => s.themeId)
  const logout = useAppStore((s) => s.logout)
  const [rematch, setRematch] = useState(false)
  const [store, setStore] = useState<ProgressStore>(() => localRepositories.progress.load())

  const theme = THEMES[themeId]
  const heroName = profile?.name ?? 'Baruh'
  const dash = useDashboardStats(store, profile, themeId)

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

  return (
    <div className="rpg-shell" data-theme={themeId}>
      <ThemeBackgrounds themeId={themeId} />
      <ThemeToolbar onNewHero={() => setRematch(true)} onLogout={logout} />

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
          <HeroPanel portrait={dash.portrait} stats={dash.heroPanel} lifeScores={dash.life} />

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
                <DuelsPlaceholder />
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
    </div>
  )
}
