import { useMemo, useState } from 'react'
import { START_PRESETS } from '@/data/onboarding'
import { HeroPickerGrid } from '@/features/onboarding/HeroPickerGrid'
import { HeroPreview } from '@/features/onboarding/HeroPreview'
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
    <div className="flex min-h-screen items-center justify-center bg-[#0a0810] p-4">
      <div className="w-full max-w-5xl rounded-2xl border border-white/15 bg-[#121018]/90 p-5 text-[#efeafc] shadow-2xl sm:p-6">
        <h1 className="text-2xl font-bold">
          {rematch ? 'Новый герой' : 'Выбери героя и мир'}
        </h1>
        <p className="mt-1 text-sm text-[#c8c1dc]">
          Все варианты на экране — без карусели. Кликни карточку, задай имя и стартуй.
        </p>

        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(260px,320px)_1fr] lg:items-start">
          <div className="space-y-4">
            <HeroPreview preset={preset} large />
            <div className="space-y-2">
              <Label htmlFor="hero-name" className="text-[#b8b0ce]">
                Имя героя
              </Label>
              <Input
                id="hero-name"
                maxLength={24}
                placeholder="Например: Baruh the Brave"
                value={heroName}
                onChange={(e) => setHeroName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && start()}
                className="border-[#4f466d] bg-[#171522] text-[#efeafc]"
              />
            </div>
            <p className="text-xs text-[#b8b0ce]">
              Выбор: <strong className="text-[#efeafc]">{preset.name}</strong> · {preset.lore}
            </p>
            <Button className="w-full" onClick={start}>
              Начать путь
            </Button>
          </div>

          <HeroPickerGrid
            selectedId={selectedId}
            onSelect={(p) => setSelectedId(p.id)}
          />
        </div>
      </div>
    </div>
  )
}
