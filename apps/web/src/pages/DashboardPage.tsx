import { useMemo, useState } from 'react'
import { COURSES } from '@/data/courses'
import { THEMES } from '@/data/themes'
import { CourseList } from '@/features/courses/CourseList'
import { OnboardingPage } from '@/features/onboarding/OnboardingPage'
import { levelFromXp, totalDoneCount, totalXp, weeklyXp } from '@/lib/gamification/progress'
import { localRepositories } from '@/lib/storage/local-repositories'
import { useAppStore } from '@/stores/use-app-store'
import type { ProgressStore } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function DashboardPage() {
  const profile = useAppStore((s) => s.profile)
  const themeId = useAppStore((s) => s.themeId)
  const logout = useAppStore((s) => s.logout)
  const [rematch, setRematch] = useState(false)
  const [store, setStore] = useState<ProgressStore>(() => localRepositories.progress.load())

  const theme = THEMES[themeId]
  const heroName = profile?.name ?? 'Baruh'

  const stats = useMemo(() => {
    const done = totalDoneCount(store)
    const xp = totalXp(store)
    return {
      done,
      xp,
      level: levelFromXp(xp),
      weekXp: weeklyXp(store),
    }
  }, [store])

  if (rematch) {
    return <OnboardingPage rematch onDone={() => setRematch(false)} />
  }

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-4 py-8">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge variant="secondary" className="mb-2">
            v2 · auth + onboarding
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">{theme.brand}</h1>
          <p className="mt-1 text-muted-foreground">
            {theme.who.replace('Baruh', heroName)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setRematch(true)}>
            🎭 Новый герой
          </Button>
          <Button variant="outline" size="sm" onClick={logout}>
            🔒 Выйти
          </Button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Уровень"
          value={String(stats.level)}
          hint={theme.ranks[Math.min(stats.level - 1, theme.ranks.length - 1)]}
        />
        <StatCard label="XP всего" value={String(stats.xp)} hint={`${stats.done} уроков`} />
        <StatCard label="XP / 7 дн" value={String(stats.weekXp)} hint="weekly race" />
        <StatCard label="Герой" value={heroName} hint={profile?.hero ?? '—'} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Курсы ({COURSES.length})</CardTitle>
          <CardDescription>Контент в public/courses — ссылки как в legacy</CardDescription>
        </CardHeader>
        <CardContent>
          <CourseList store={store} onStoreChange={setStore} />
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  )
}
