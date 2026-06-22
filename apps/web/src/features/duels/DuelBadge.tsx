import type { ActiveDuel, ProgressStore } from '@/types'
import {
  duelBadgeStatus,
  duelDaysLeft,
  duelMetricLabel,
  duelScoreHint,
  myDuelScore,
  opponentDuelScore,
} from '@/lib/gamification/duels'

interface DuelBadgeProps {
  duel: ActiveDuel
  store: ProgressStore
}

export function DuelBadge({ duel, store }: DuelBadgeProps) {
  const mine = myDuelScore(duel, store)
  const theirs = opponentDuelScore(duel)
  const metric = duelMetricLabel(duel)
  const { leadMine, tie } = duelScoreHint(mine, theirs, metric)
  const daysLeft = duelDaysLeft(duel)
  const status = duelBadgeStatus(leadMine, tie)

  return (
    <div className="rpg-duel-badge mt-3">
      <b>⚔️ Дуэль:</b> {duel.opponent.name} · {mine} vs {theirs} {metric} · {daysLeft} дн. ·{' '}
      <b>{status}</b>
    </div>
  )
}
