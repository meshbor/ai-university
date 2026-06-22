import { START_PRESETS } from '@/data/onboarding'
import type { OnboardingPreset } from '@/types'
import { HeroPreview } from '@/features/onboarding/HeroPreview'
import { cn } from '@/lib/utils'

interface HeroPickerGridProps {
  selectedId: string
  onSelect: (preset: OnboardingPreset) => void
}

export function HeroPickerGrid({ selectedId, onSelect }: HeroPickerGridProps) {
  return (
    <div className="flex w-full justify-center">
      <div
        className="grid max-w-7xl grid-cols-[repeat(auto-fill,minmax(168px,200px))] justify-center gap-4"
        role="listbox"
        aria-label="Выбор героя и мира"
      >
        {START_PRESETS.map((preset) => {
          const selected = preset.id === selectedId
          return (
            <button
              key={preset.id}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => onSelect(preset)}
              className={cn(
                'flex w-full max-w-[200px] flex-col rounded-2xl border p-3 text-left transition-all',
                preset.placeholder
                  ? 'border-[#c8c0e0]/50 bg-gradient-to-b from-[#2a2640] to-[#1e1a30] hover:border-[#d4cce8]/60'
                  : 'border-[#4f466d] bg-gradient-to-b from-[#272239] to-[#1c182b] hover:border-[#6f5bdf]/60',
                'hover:scale-[1.02] hover:shadow-lg',
                selected &&
                  (preset.placeholder
                    ? 'border-[#e8e0ff] shadow-[0_0_0_2px_#e8e0ff,inset_0_0_24px_rgba(232,224,255,.12)]'
                    : 'border-[#8f7bff] shadow-[0_0_0_2px_#8f7bff,inset_0_0_20px_rgba(143,123,255,.15)]'),
              )}
            >
              <HeroPreview preset={preset} />
              <span className="mt-3 text-[15px] font-semibold leading-tight text-[#efeafc]">
                {preset.name}
              </span>
              <span className="mt-1.5 line-clamp-2 text-xs leading-snug text-[#b8b0ce]">
                {preset.lore}
              </span>
              <span className="mt-1.5 text-[10px] uppercase tracking-wide text-[#9a92b0]">
                {preset.note}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
