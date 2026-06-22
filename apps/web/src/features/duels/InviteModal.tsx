import { DUEL_DAYS } from '@/lib/gamification/constants'
import { duelModeLabel } from '@/lib/gamification/duels'
import type { DuelInvitePayload } from '@/types'
import { ShareCard } from './ShareCard'

interface InviteModalProps {
  open: boolean
  payload: DuelInvitePayload | null
  onAccept: () => void
  onDecline: () => void
}

export function InviteModal({ open, payload, onAccept, onDecline }: InviteModalProps) {
  if (!open || !payload) return null

  const mode = duelModeLabel(payload.mode, payload.courseId)

  return (
    <div className="rpg-overlay" onClick={(e) => e.target === e.currentTarget && onDecline()}>
      <div className="rpg-modal" role="dialog" aria-labelledby="invite-title">
        <h2 id="invite-title">{payload.from} вызывает на дуэль!</h2>
        <p>
          Формат: {mode}. Дуэль на {DUEL_DAYS} дней.
        </p>

        <ShareCard
          heroName={payload.from}
          stats={{
            level: payload.level,
            weeklyXp: payload.weeklyXp,
            streak: payload.streak,
            topStat: payload.topStat,
          }}
          extra={
            <div className="rpg-share-top">
              Код вызова: <b>{payload.code || '—'}</b>
            </div>
          }
        />

        <div className="rpg-modal-row">
          <button type="button" className="rpg-dbtn" onClick={onDecline}>
            Отклонить
          </button>
          <button type="button" className="rpg-dbtn primary" onClick={onAccept}>
            Принять вызов
          </button>
        </div>
      </div>
    </div>
  )
}
