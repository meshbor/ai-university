import { ARCH_LABELS, TIER_NAMES } from '@/data/portraits'
import { is3dTheme, portraitSrc } from '@/lib/portraits/preview'
import { dominantLetters } from '@/lib/gamification/stats'
import type { HeroArchetype, Profile, ProgressStore, ThemeId } from '@/types'
import { levelTier } from './progress'

export interface PortraitPick {
  src: string
  arch: HeroArchetype
  tier: 1 | 2 | 3
  theme: ThemeId
  is3d: boolean
  label: string
}

function resolveArch(theme: ThemeId, profile: Profile | null, dominant: string[] | null): HeroArchetype {
  const forced = profile?.hero
  if (forced) {
    if (theme === 'space' && ['fast', 'gun', 'cargo'].includes(forced)) return forced
    if (theme === 'wot' && forced === 'tank') return forced
    if (theme === 'knight' && forced === 'knight') return forced
    if (theme === 'samurai' && forced === 'samurai') return forced
    if (['light', 'fallout'].includes(theme) && ['smart', 'strong'].includes(forced)) return forced
  }
  if (theme === 'wot') return 'tank'
  if (theme === 'knight') return 'knight'
  if (theme === 'samurai') return 'samurai'
  if (theme === 'space') {
    if (dominant?.includes('A')) return 'fast'
    if (dominant?.includes('S')) return 'gun'
    if (dominant?.includes('E')) return 'cargo'
    return 'fast'
  }
  if (dominant?.includes('S')) return 'strong'
  return 'smart'
}

export function pickPortrait(
  theme: ThemeId,
  level: number,
  store: ProgressStore,
  profile: Profile | null,
): PortraitPick {
  const tier = levelTier(level)
  const arch = resolveArch(theme, profile, dominantLetters(store))
  const tierName = (TIER_NAMES[theme] ?? TIER_NAMES.light)[tier - 1]
  return {
    src: portraitSrc(theme, arch, tier),
    arch,
    tier,
    theme,
    is3d: is3dTheme(theme),
    label: `${tierName} · ${ARCH_LABELS[arch]}`,
  }
}