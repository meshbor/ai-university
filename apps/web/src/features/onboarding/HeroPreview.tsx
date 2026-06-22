import { MODEL_TIER } from '@/data/portraits'
import { is3dTheme, portraitSrc } from '@/lib/portraits/preview'
import type { OnboardingPreset } from '@/types'
import { cn } from '@/lib/utils'

interface HeroPreviewProps {
  preset: OnboardingPreset
  large?: boolean
  /** Крупные карточки на экране выбора героя */
  picker?: boolean
}

export function HeroPreview({ preset, large = false, picker = false }: HeroPreviewProps) {
  const frame = cn(
    'relative overflow-hidden rounded-xl border w-full',
    preset.placeholder
      ? 'border-[#c8c0e0]/40 bg-gradient-to-b from-[#f4f0fa] to-[#e8e2f4]'
      : 'border-[#4f466d]/80 bg-gradient-to-b from-[#222031] to-[#171522]',
    picker && 'min-h-[260px] rounded-2xl border-0 sm:min-h-[300px] lg:min-h-[340px]',
    picker ? 'aspect-[3/4]' : large ? 'aspect-[4/3] min-h-[200px]' : 'aspect-[4/3]',
  )

  if (preset.placeholder) {
    return (
      <div className={frame}>
        <div
          className={cn(
            'flex size-full flex-col items-center justify-center gap-3 p-4 text-center text-[#4a4460]',
            picker && 'gap-4',
          )}
        >
          <span className={cn('text-4xl', picker && 'text-6xl')} aria-hidden>
            👀
          </span>
          <span className={cn('text-xs font-medium leading-snug', picker && 'text-sm')}>
            просто посмотреть
          </span>
        </div>
      </div>
    )
  }

  const src = portraitSrc(preset.theme, preset.hero, 1)
  const is3d = is3dTheme(preset.theme)
  const cfg = MODEL_TIER[preset.theme]?.[1] ?? {}

  return (
    <div className={frame}>
      {is3d ? (
        <model-viewer
          src={src}
          alt={preset.name}
          camera-controls
          auto-rotate
          rotation-per-second="14deg"
          interaction-prompt="none"
          shadow-intensity="1"
          touch-action="pan-y"
          scale={cfg.scale}
          exposure={cfg.exposure}
          camera-orbit={cfg.orbit}
          className="size-full"
        />
      ) : (
        <img
          src={src}
          alt={preset.name}
          className={cn('size-full object-cover object-top', picker && 'scale-105')}
        />
      )}
      {picker && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0a0810]/90 to-transparent"
          aria-hidden
        />
      )}
    </div>
  )
}
