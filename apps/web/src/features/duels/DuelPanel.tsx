import type { ActiveDuel } from '@/types'
import {
  duelDaysLeft,
  duelMetricLabel,
  duelModeLabel,
  duelScoreHint,
  myDuelScore,
  opponentDuelScore,
} from '@/lib/gamification/duels'
import type { ProgressStore } from '@/types'
import { COURSES } from '@/data/courses'
import { cn } from '@/lib/utils'

interface DuelPanelProps {
  duel: ActiveDuel | null
  store: ProgressStore
  onShare: () => void
  onEnd: () => void
  onPaste: (raw: string) => void
  onToast: (msg: string) => void
}

export function DuelPanel({ duel, store, onShare, onEnd, onPaste, onToast }: DuelPanelProps) {
  if (!duel) {
    return (
      <div className="rpg-duel-box">
        <h3>Дуэли с друзьями</h3>
        <p>
          Соревнуйтесь по учебным метрикам: кто больше XP за неделю или кто быстрее пройдёт уроки в
          выбранном курсе.
        </p>
        <div className="rpg-duel-actions">
          <button type="button" className="rpg-dbtn primary" onClick={onShare}>
            📤 Бросить вызов
          </button>
        </div>
        <label className="rpg-duel-hint" htmlFor="duel-paste">
          Получил ссылку от друга? Вставь её сюда:
        </label>
        <PasteForm
          onPaste={(raw) => {
            if (!raw.trim()) {
              onToast('Вставь ссылку с ?duel=')
              return
            }
            onPaste(raw)
          }}
        />
        <p className="rpg-duel-hint">
          Без сервера счёт соперника — снимок на момент вызова. Чтобы соревноваться вдвоём,
          обменяйтесь ссылками.
        </p>
      </div>
    )
  }

  const mine = myDuelScore(duel, store)
  const theirs = opponentDuelScore(duel)
  const metric = duelMetricLabel(duel)
  const { leadMine, tie, hint } = duelScoreHint(mine, theirs, metric)
  const daysLeft = duelDaysLeft(duel)
  const course =
    duel.mode === 'course_sprint' && duel.courseId
      ? COURSES.find((c) => c.id === duel.courseId)
      : null

  return (
    <div className="rpg-duel-box">
      <h3>{duelModeLabel(duel.mode, duel.courseId)}</h3>
      <p>
        Дуэль с <b>{duel.opponent.name}</b> · осталось <b>{daysLeft}</b> дн.
      </p>
      {course && (
        <p>
          Курс: <b>{course.title}</b>
        </p>
      )}

      <div className="rpg-duel-score">
        <div className={cn('rpg-duel-side', leadMine && !tie && 'lead')}>
          <b>{mine}</b>
          <span>ты · {metric}</span>
        </div>
        <div className="rpg-duel-vs">VS</div>
        <div className={cn('rpg-duel-side', !leadMine && !tie && 'lead')}>
          <b>{theirs}</b>
          <span>{duel.opponent.name} · снимок</span>
        </div>
      </div>

      <div className="rpg-duel-meta">
        Соперник на вызове: ур. {duel.opponent.level}, серия {duel.opponent.streak},{' '}
        {duel.opponent.topStat}
      </div>

      <div className="rpg-duel-actions">
        <button type="button" className="rpg-dbtn primary" onClick={onShare}>
          📤 Ответный вызов
        </button>
        <button
          type="button"
          className="rpg-dbtn"
          onClick={() => {
            if (window.confirm('Завершить текущую дуэль?')) onEnd()
          }}
        >
          Завершить дуэль
        </button>
      </div>
      <p className="rpg-duel-hint">{hint}</p>
    </div>
  )
}

function PasteForm({ onPaste }: { onPaste: (raw: string) => void }) {
  return (
    <form
      className="mt-2"
      onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        onPaste(String(fd.get('paste') ?? ''))
      }}
    >
      <input
        id="duel-paste"
        name="paste"
        className="rpg-duel-paste"
        type="text"
        placeholder="https://...?duel=..."
      />
      <div className="rpg-duel-actions">
        <button type="submit" className="rpg-dbtn">
          Принять по ссылке
        </button>
      </div>
    </form>
  )
}
