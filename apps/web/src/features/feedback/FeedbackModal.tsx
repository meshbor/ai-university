import { useState } from 'react'
import { collectFeedbackContext } from '@/lib/feedback/collect-feedback-context'
import { feedbackRepository, isApiFeedbackAvailable } from '@/lib/storage/feedback-repository'
import type { FeedbackCategory, FeedbackContext } from '@/types/feedback'
import type { Profile, ThemeId } from '@/types'

const CATEGORIES: { id: FeedbackCategory; label: string }[] = [
  { id: 'bug', label: '🐛 Баг' },
  { id: 'ui', label: '🎨 UI / вёрстка' },
  { id: 'content', label: '📝 Контент' },
  { id: 'feature', label: '✨ Фича' },
]

interface FeedbackModalProps {
  open: boolean
  themeId: ThemeId
  activeTab: string
  profile: Profile | null
  stats: {
    level: number
    doneLessons: number
    xp: number
    streak: number
  }
  onClose: () => void
  onSubmitted: (msg: string, issueUrl?: string) => void
}

export function FeedbackModal({
  open,
  themeId,
  activeTab,
  profile,
  stats,
  onClose,
  onSubmitted,
}: FeedbackModalProps) {
  const [category, setCategory] = useState<FeedbackCategory>('bug')
  const [message, setMessage] = useState('')
  const [attachContext, setAttachContext] = useState(true)
  const [requestAgent, setRequestAgent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const apiMode = isApiFeedbackAvailable()
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const reset = () => {
    setMessage('')
    setCategory('bug')
    setAttachContext(true)
    setRequestAgent(false)
    setError(null)
    setSubmitting(false)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = async () => {
    const trimmed = message.trim()
    if (!trimmed) {
      setError('Опиши проблему или пожелание.')
      return
    }

    setSubmitting(true)
    setError(null)

    let context: FeedbackContext | null = null
    if (attachContext) {
      context = collectFeedbackContext({ themeId, activeTab, profile, stats })
    }

    try {
      const result = await feedbackRepository.submit({
        message: trimmed,
        category,
        context,
        requestAgent: apiMode && requestAgent,
      })

      if (result.via === 'github-draft') {
        const agentHint = requestAgent
          ? ' Label `agent` в черновике — после Submit запустится workflow (если label есть в репо).'
          : ''
        onSubmitted(
          `Открылся черновик GitHub Issue — нажми «Submit» там, чтобы отправить.${agentHint}`,
          result.issueUrl,
        )
      } else if (result.agentQueued) {
        onSubmitted('Задача принята! Агент поставлен в очередь — скоро появится draft PR.', result.issueUrl)
      } else {
        onSubmitted('Задача принята!', result.issueUrl)
      }
      reset()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось отправить')
      setSubmitting(false)
    }
  }

  return (
    <div className="rpg-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="rpg-modal" role="dialog" aria-labelledby="feedback-title">
        <h2 id="feedback-title">Сообщить разработчику</h2>
        <p>
          Опиши баг, правку контента или идею. Контекст экрана (тема, вкладка, прогресс)
          приложится автоматически — не нужно копировать скрины вручную.
        </p>

        <div className="rpg-field">
          <label htmlFor="feedback-category">Категория</label>
          <select
            id="feedback-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
            disabled={submitting}
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="rpg-field">
          <label htmlFor="feedback-message">Сообщение</label>
          <textarea
            id="feedback-message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Например: в Pip-Boy криво ломается вёрстка курса на узком экране"
            disabled={submitting}
          />
        </div>

        <label className="rpg-check-row">
          <input
            type="checkbox"
            checked={attachContext}
            onChange={(e) => setAttachContext(e.target.checked)}
            disabled={submitting}
          />
          Приложить контекст экрана (тема, вкладка, viewport, прогресс)
        </label>

        <label className="rpg-check-row">
          <input
            type="checkbox"
            checked={requestAgent}
            onChange={(e) => setRequestAgent(e.target.checked)}
            disabled={submitting}
          />
          ⚡ Поставить в очередь агента (draft PR по задаче)
          {!apiMode && (
            <span className="rpg-check-hint">
              {' '}
              — нужен API (<code>VITE_API_BASE_URL</code>); иначе добавь label <code>agent</code> на
              issue вручную
            </span>
          )}
        </label>

        {error && <p className="rpg-field-error">{error}</p>}

        <div className="rpg-modal-row">
          <button type="button" className="rpg-dbtn" onClick={handleClose} disabled={submitting}>
            Отмена
          </button>
          <button
            type="button"
            className="rpg-dbtn primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Отправка…' : 'Отправить'}
          </button>
        </div>
      </div>
    </div>
  )
}
