import { useEffect } from 'react'
import { AuthPage } from '@/features/auth/AuthPage'
import { OnboardingPage } from '@/features/onboarding/OnboardingPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { useAppStore } from '@/stores/use-app-store'

export function AppGate() {
  const hydrated = useAppStore((s) => s.hydrated)
  const authed = useAppStore((s) => s.authed)
  const profile = useAppStore((s) => s.profile)
  const hydrate = useAppStore((s) => s.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Загрузка…
      </div>
    )
  }

  if (!authed) return <AuthPage />
  if (!profile) return <OnboardingPage />
  return <DashboardPage />
}
