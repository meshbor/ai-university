import { useEffect, useRef, useState } from 'react'
import { MODEL_TIER } from '@/data/portraits'
import type { PortraitPick } from '@/lib/gamification/portrait'
import { cn } from '@/lib/utils'

interface HeroAvatarProps {
  portrait: PortraitPick
  level: number
}

export function HeroAvatar({ portrait, level }: HeroAvatarProps) {
  const prevKey = useRef(`${portrait.src}-${portrait.tier}`)
  const [flash, setFlash] = useState(false)
  const cfg = MODEL_TIER[portrait.theme]?.[portrait.tier] ?? {}

  useEffect(() => {
    const key = `${portrait.src}-${portrait.tier}-${level}`
    if (prevKey.current !== key) {
      prevKey.current = key
      setFlash(true)
      const t = window.setTimeout(() => setFlash(false), 450)
      return () => window.clearTimeout(t)
    }
  }, [portrait.src, portrait.tier, level])

  return (
    <div
      className={cn('rpg-avatar', portrait.is3d && 'rpg-avatar-3d', flash && 'rpg-avatar-flash')}
    >
      {portrait.is3d ? (
        <model-viewer
          src={portrait.src}
          alt={portrait.label}
          camera-controls
          disable-zoom
          auto-rotate
          rotation-per-second="14deg"
          interaction-prompt="none"
          shadow-intensity="1"
          touch-action="pan-y"
          scale={cfg.scale}
          exposure={cfg.exposure}
          camera-orbit={cfg.orbit}
          min-camera-orbit="auto auto 1.8m"
          max-camera-orbit="auto auto 3.2m"
        />
      ) : (
        <img
          src={portrait.src}
          alt={portrait.label}
          className="block size-full object-cover"
        />
      )}
      <div
        className="rpg-tt absolute right-2.5 top-2.5 rounded-md px-2.5 py-0.5 text-xs tracking-wide text-[var(--rpg-xp)]"
        style={{ background: 'rgba(0,0,0,.6)', textShadow: 'none' }}
      >
        T{portrait.tier}
      </div>
      <div
        className="rpg-tt absolute bottom-2.5 left-2.5 rounded-md px-2.5 py-1 text-[13px] tracking-wider text-white"
        style={{ background: 'rgba(0,0,0,.65)', textShadow: 'none' }}
      >
        LVL {level}
      </div>
    </div>
  )
}
