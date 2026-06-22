import { XP_PER_LEVEL } from '@/lib/gamification/constants'
import type { PortraitPick } from '@/lib/gamification/portrait'
import { HeroAvatar } from './HeroAvatar'
import { LifeRadar } from './LifeRadar'
import type { ActiveDuel, LifeAxisScore, ProgressStore } from '@/types'
import { DuelBadge } from '@/features/duels/DuelBadge'

export interface HeroPanelStats {
  level: number
  rank: string
  xp: number
  xpInto: number
  xpPct: number
  xpToNext: number
  streak: number
  activeCourses: number
  doneLessons: number
  totalLessons: number
}

interface HeroPanelProps {
  portrait: PortraitPick
  stats: HeroPanelStats
  lifeScores: LifeAxisScore[]
  duel?: ActiveDuel | null
  store: ProgressStore
}

export function HeroPanel({ portrait, stats, lifeScores, duel, store }: HeroPanelProps) {
  return (
    <aside className="rpg-hero-panel">
      <HeroAvatar portrait={portrait} level={stats.level} />

      <div className="rpg-tt text-[22px] font-bold leading-tight">
        Уровень {stats.level} · {stats.rank}
      </div>

      <div className="rpg-xp-track">
        <div className="rpg-xp-fill" style={{ width: `${stats.xpPct}%` }} />
      </div>
      <div className="rpg-tt text-[13px] opacity-85">
        {stats.xp} XP · до ур.{stats.level + 1}: {stats.xpToNext} XP
      </div>

      <div className="rpg-tt mt-2 text-[13px] opacity-85">
        Серия:{' '}
        <span className="text-[var(--rpg-xp)]">{stats.streak}</span> дн.{' '}
        <span className="rpg-blink">▮</span>
      </div>
      <div className="rpg-tt mt-1.5 text-[13px] opacity-85">
        Образ:{' '}
        <span className="font-bold text-[var(--rpg-accent)]">{portrait.label}</span>
      </div>

      <div className="mt-3.5 grid grid-cols-3 gap-2">
        <div className="rpg-stat-mini">
          <b>{stats.activeCourses}</b>
          <span>курсов</span>
        </div>
        <div className="rpg-stat-mini">
          <b>{stats.doneLessons}</b>
          <span>пройдено</span>
        </div>
        <div className="rpg-stat-mini">
          <b>{stats.totalLessons}</b>
          <span>всего</span>
        </div>
      </div>

      {duel && <DuelBadge duel={duel} store={store} />}

      <LifeRadar scores={lifeScores} />
    </aside>
  )
}

export function buildXpBar(xp: number) {
  const into = xp % XP_PER_LEVEL
  return {
    xpInto: into,
    xpPct: Math.round((into / XP_PER_LEVEL) * 100),
    xpToNext: XP_PER_LEVEL - into,
  }
}
