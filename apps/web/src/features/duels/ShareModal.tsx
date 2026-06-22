import { useState } from 'react'
import { COURSES } from '@/data/courses'
import { DUEL_DAYS } from '@/lib/gamification/constants'
import {
  buildInvitePayload,
  inviteUrl,
  shareStats,
} from '@/lib/gamification/duels'
import type { DuelMode, Profile, ProgressStore } from '@/types'
import { ShareCard } from './ShareCard'

interface ShareModalProps {
  open: boolean
  store: ProgressStore
  profile: Profile | null
  heroName: string
  onClose: () => void
  onCopied: (msg: string) => void
}

export function ShareModal({
  open,
  store,
  profile,
  heroName,
  onClose,
  onCopied,
}: ShareModalProps) {
  const [mode, setMode] = useState<DuelMode>('weekly_xp')
  const [courseId, setCourseId] = useState(COURSES[0]?.id ?? '')

  if (!open) return null

  const stats = shareStats(store)

  const copyLink = async () => {
    const payload = buildInvitePayload(
      store,
      profile,
      mode,
      mode === 'course_sprint' ? courseId : null,
    )
    const url = inviteUrl(payload)
    try {
      await navigator.clipboard.writeText(url)
      onCopied('Ссылка вызова скопирована')
    } catch {
      window.prompt('Скопируй ссылку:', url)
    }
  }

  return (
    <div className="rpg-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="rpg-modal" role="dialog" aria-labelledby="share-title">
        <h2 id="share-title">Поделиться прогрессом</h2>
        <p>Карточка героя и ссылка на 7-дневную дуэль. Друг откроет ссылку и примет вызов.</p>

        <ShareCard heroName={heroName} stats={stats} />

        <div className="rpg-field">
          <label htmlFor="duel-mode">Формат дуэли</label>
          <select
            id="duel-mode"
            value={mode}
            onChange={(e) => setMode(e.target.value as DuelMode)}
          >
            <option value="weekly_xp">Weekly XP Race — кто больше XP за 7 дней</option>
            <option value="course_sprint">Course Sprint — кто больше уроков в курсе</option>
          </select>
        </div>

        {mode === 'course_sprint' && (
          <div className="rpg-field">
            <label htmlFor="duel-course">Курс для спринта</label>
            <select
              id="duel-course"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            >
              {COURSES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="rpg-modal-row">
          <button type="button" className="rpg-dbtn" onClick={onClose}>
            Закрыть
          </button>
          <button type="button" className="rpg-dbtn primary" onClick={copyLink}>
            📋 Копировать ссылку
          </button>
        </div>
        <p className="rpg-duel-hint">Дуэль длится {DUEL_DAYS} дней после принятия вызова.</p>
      </div>
    </div>
  )
}
