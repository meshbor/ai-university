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
    <div className="flex w-full justify-center px-2 sm:px-4">
      <div
        className="grid w-full max-w-[1800px] grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6 lg:gap-4 xl:gap-5"
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
                'group flex w-full flex-col overflow-hidden rounded-2xl border text-left transition-all duration-200',
                preset.placeholder
                  ? 'border-[#c8c0e0]/40 bg-gradient-to-b from-[#2a2640] to-[#141020]'
                  : 'border-[#4f466d]/60 bg-gradient-to-b from-[#1e1a2e] to-[#100d18]',
                'hover:border-[#8f7bff]/70 hover:shadow-[0_12px_40px_rgba(0,0,0,.45)]',
                selected
                  ? 'z-10 scale-[1.03] border-[#a898ff] shadow-[0_0_0_2px_#8f7bff,0_16px_48px_rgba(111,91,223,.35)]'
                  : 'hover:scale-[1.02]',
              )}
            >
              <HeroPreview preset={preset} picker />
              <div className="flex flex-1 flex-col px-3.5 pb-4 pt-3 sm:px-4 sm:pb-5 sm:pt-3.5">
                <span className="text-base font-bold leading-tight text-[#efeafc] sm:text-[17px]">
                  {preset.name}
                </span>
                <span className="mt-1.5 line-clamp-2 text-xs leading-snug text-[#b8b0ce] sm:text-[13px]">
                  {preset.lore}
                </span>
                <span className="mt-2 text-[10px] font-medium uppercase tracking-wider text-[#8f7bff]/80 sm:text-[11px]">
                  {preset.note}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
