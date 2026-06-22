import { MODEL_TIER } from '@/data/portraits'
import { is3dTheme, portraitSrc } from '@/lib/portraits/preview'
import type { OnboardingPreset } from '@/types'
import { cn } from '@/lib/utils'

interface HeroPreviewProps {
  preset: OnboardingPreset
  large?: boolean
}

export function HeroPreview({ preset, large = false }: HeroPreviewProps) {
  const frame = cn(
    'relative overflow-hidden rounded-xl border w-full',
    preset.placeholder
      ? 'border-[#c8c0e0]/40 bg-gradient-to-b from-[#f4f0fa] to-[#e8e2f4]'
      : 'border-[#4f466d] bg-gradient-to-b from-[#222031] to-[#171522]',
    large ? 'aspect-[4/3] min-h-[200px]' : 'aspect-[4/3]',
  )

  if (preset.placeholder) {
    return (
      <div className={frame}>
        <div className="flex size-full flex-col items-center justify-center gap-2 p-3 text-center text-[#4a4460]">
          <span className="text-4xl" aria-hidden>
            👀
          </span>
          <span className="text-xs font-medium leading-snug">просто посмотреть</span>
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
        <img src={src} alt={preset.name} className="size-full object-cover" />
      )}
    </div>
  )
}
