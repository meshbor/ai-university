import { MODELS, MODEL_THEMES, PORTRAITS } from '@/data/portraits'
import type { HeroArchetype, ThemeId } from '@/types'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

export function portraitSrc(theme: ThemeId, arch: HeroArchetype, tier: 1 | 2 | 3 = 1): string {
  if (MODEL_THEMES.has(theme)) {
    const map: Partial<Record<1 | 2 | 3, string>> = MODELS[theme] ?? {}
    for (let t = tier; t >= 1; t--) {
      const src = map[t as 1 | 2 | 3]
      if (src) return asset(src)
    }
    return asset(map[1] ?? '')
  }
  const map: Partial<Record<1 | 2 | 3, string>> = PORTRAITS[arch] ?? {}
  for (let t = tier; t >= 1; t--) {
    const src = map[t as 1 | 2 | 3]
    if (src) return asset(src)
  }
  return asset(map[1] ?? '')
}

export function is3dTheme(theme: ThemeId): boolean {
  return MODEL_THEMES.has(theme)
}
