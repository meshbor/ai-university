import type { HeroArchetype, ThemeId } from '@/types'

export const MODEL_THEMES = new Set<ThemeId>(['knight', 'samurai'])

export const MODELS: Partial<Record<ThemeId, Record<1 | 2 | 3, string>>> = {
  knight: {
    1: 'assets/knight-t1.glb',
    2: 'assets/knight-t2.glb',
    3: 'assets/knight-t3.glb',
  },
  samurai: {
    1: 'assets/samurai-t1.glb',
    2: 'assets/samurai-t2.glb',
    3: 'assets/samurai-t3.glb',
  },
}

export const MODEL_TIER: Partial<
  Record<ThemeId, Record<1 | 2 | 3, { scale?: string; exposure?: string; orbit?: string }>>
> = {
  knight: {
    1: { scale: '0.88 0.88 0.88', exposure: '0.85', orbit: '0deg 80deg 2.6m' },
    2: { scale: '1 1 1', exposure: '1', orbit: '0deg 78deg 2.4m' },
    3: { scale: '1.12 1.12 1.12', exposure: '1.15', orbit: '0deg 76deg 2.2m' },
  },
  samurai: {
    1: { scale: '0.92 0.92 0.92', exposure: '1', orbit: '0deg 80deg 2.5m' },
    2: { scale: '1.02 1.02 1.02', exposure: '1.08', orbit: '0deg 78deg 2.3m' },
    3: { scale: '1.14 1.14 1.14', exposure: '1.2', orbit: '0deg 75deg 2.1m' },
  },
}

export const PORTRAITS: Record<HeroArchetype, Partial<Record<1 | 2 | 3, string>>> = {
  smart: { 1: 'assets/fallout-smart.png', 2: 'assets/smart-t2.png', 3: 'assets/smart-t3.png' },
  strong: { 1: 'assets/fallout-strong.png', 2: 'assets/strong-t2.png', 3: 'assets/strong-t3.png' },
  fast: { 1: 'assets/space-fast.png', 2: 'assets/fast-t2.png', 3: 'assets/fast-t3.png' },
  gun: { 1: 'assets/space-gun.png', 2: 'assets/gun-t2.png', 3: 'assets/gun-t3.png' },
  cargo: { 1: 'assets/space-cargo.png', 2: 'assets/cargo-t2.png', 3: 'assets/cargo-t3.png' },
  tank: { 1: 'assets/tank-t1.png', 2: 'assets/tank-t2.png', 3: 'assets/tank-t3.png' },
  knight: {},
  samurai: {},
}

export const ARCH_LABELS: Record<HeroArchetype, string> = {
  smart: 'Умник в очках 🤓',
  strong: 'Силач 💪',
  fast: 'Быстрый разведчик 🚀',
  gun: 'Боевой крейсер 🔫',
  cargo: 'Грузовой транспорт 📦',
  tank: 'Т-34 🛡️',
  knight: 'Рыцарь ⚔️',
  samurai: 'Самурай 🗡️',
}
