import { useMemo, useState } from 'react'
import { START_PRESETS } from '@/data/onboarding'
import { HeroPickerGrid } from '@/features/onboarding/HeroPickerGrid'
import { useAppStore } from '@/stores/use-app-store'
import type { OnboardingPreset, Profile } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function findPreset(id: string): OnboardingPreset {
  return START_PRESETS.find((p) => p.id === id) ?? START_PRESETS[0]
}

export function OnboardingPage({
  rematch = false,
  onDone,
}: {
  rematch?: boolean
  onDone?: () => void
}) {
  const completeOnboarding = useAppStore((s) => s.completeOnboarding)
  const existing = useAppStore((s) => s.profile)

  const initialId = useMemo(() => {
    if (existing) {
      const match = START_PRESETS.find(
        (p) => p.theme === existing.theme && p.hero === existing.hero,
      )
      if (match) return match.id
      if (existing.theme === 'light') return 'browse'
    }
    return START_PRESETS[0].id
  }, [existing])

  const [selectedId, setSelectedId] = useState(initialId)
  const [heroName, setHeroName] = useState(existing?.name ?? 'Baruh')
  const preset = findPreset(selectedId)

  const start = () => {
    const name = heroName.trim() || 'Baruh'
    const profile: Profile = {
      theme: preset.theme,
      hero: preset.hero,
      name,
      pickedAt: new Date().toISOString(),
    }
    completeOnboarding(profile)
    onDone?.()
  }

  return (
    <div className="game-lobby flex min-h-screen flex-col">
      <div className="game-lobby-bg" aria-hidden />
      <div className="game-lobby-scanlines" aria-hidden />

      <header className="relative z-10 flex flex-col items-center px-4 pb-2 pt-8 text-center sm:pt-10">
        <p className="game-lobby-kicker">AI University · character select</p>
        <h1 className="game-lobby-title mt-2">
          {rematch ? 'Новый герой' : 'Выбери героя и мир'}
        </h1>
        <p className="mt-2 max-w-md text-sm text-[#c8c1dc]">
          Кликни карточку. Можно сразу в светлую тему — без костюма.
        </p>

        <div className="mt-5 w-full max-w-sm">
          <Label htmlFor="hero-name" className="sr-only">
            Имя героя
          </Label>
          <Input
            id="hero-name"
            maxLength={24}
            placeholder="Имя героя"
            value={heroName}
            onChange={(e) => setHeroName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && start()}
            className="game-lobby-input h-12 border-[#6f5bdf]/50 bg-[#171522]/90 text-center text-lg text-[#efeafc] placeholder:text-[#8a82a8]"
          />
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-6">
        <HeroPickerGrid selectedId={selectedId} onSelect={(p) => setSelectedId(p.id)} />
        <p className="mt-6 max-w-lg text-center text-sm text-[#b8b0ce]">
          <strong className="text-[#efeafc]">{preset.name}</strong>
          <span className="mx-1.5 opacity-40">·</span>
          {preset.lore}
        </p>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-[#0a0810]/80 px-4 py-5 backdrop-blur-sm">
        <Button
          size="lg"
          className="game-lobby-cta mx-auto flex h-12 w-full max-w-md items-center justify-center gap-2 text-base font-semibold"
          onClick={start}
        >
          ▶ Начать путь
        </Button>
      </footer>
    </div>
  )
}
