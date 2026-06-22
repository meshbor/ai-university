import type { ReactNode } from 'react'
import type { ShareStats } from '@/lib/gamification/duels'

interface ShareCardProps {
  heroName: string
  stats: Pick<ShareStats, 'level' | 'weeklyXp' | 'streak' | 'topStat'>
  extra?: ReactNode
}

export function ShareCard({ heroName, stats, extra }: ShareCardProps) {
  return (
    <div className="rpg-share-card">
      <div className="rpg-share-tag">AI University · Share Card</div>
      <div className="rpg-share-hero">{heroName}</div>
      <div className="rpg-share-stats">
        <div className="rpg-share-stat">
          <b>Lv {stats.level}</b>
          <span>уровень</span>
        </div>
        <div className="rpg-share-stat">
          <b>{stats.weeklyXp}</b>
          <span>XP / 7 дн</span>
        </div>
        <div className="rpg-share-stat">
          <b>{stats.streak}</b>
          <span>серия</span>
        </div>
      </div>
      <div className="rpg-share-top">
        Топ-стат: <b>{stats.topStat}</b>
      </div>
      {extra}
    </div>
  )
}
