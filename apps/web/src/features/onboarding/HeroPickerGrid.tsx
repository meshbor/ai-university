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
    <div
      className="grid grid-cols-[repeat(auto-fill,minmax(132px,1fr))] gap-3"
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
              'flex flex-col rounded-xl border p-2 text-left transition-all',
              'border-[#4f466d] bg-gradient-to-b from-[#272239] to-[#1c182b]',
              'hover:border-[#6f5bdf]/60 hover:shadow-md',
              selected && 'border-[#8f7bff] shadow-[inset_0_0_0_1px_#8f7bff]',
            )}
          >
            <HeroPreview preset={preset} />
            <span className="mt-2 text-sm font-semibold leading-tight text-[#efeafc]">
              {preset.name}
            </span>
            <span className="mt-1 line-clamp-2 text-xs text-[#b8b0ce]">{preset.lore}</span>
            <span className="mt-1 text-[10px] text-[#9a92b0]">{preset.note}</span>
          </button>
        )
      })}
    </div>
  )
}
