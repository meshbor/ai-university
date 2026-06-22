import { useRef, useState } from 'react'
import { collectFeedbackContext } from '@/lib/feedback/collect-feedback-context'
import { CHAT_SUGGESTIONS } from '@/lib/chat/knowledge'
import { chatRepository } from '@/lib/storage/chat-repository'
import type { ChatMessage } from '@/types/chat'
import type { Profile, ThemeId } from '@/types'

function nextId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

interface HelpChatPanelProps {
  themeId: ThemeId
  profile: Profile | null
  stats: {
    level: number
    doneLessons: number
    xp: number
    streak: number
  }
  onOpenFeedback: () => void
}

export function HelpChatPanel({
  themeId,
  profile,
  stats,
  onOpenFeedback,
}: HelpChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Привет! Отвечаю на вопросы про курсы, XP, дуэли и интерфейс. Код не меняю — для багов и правок нажми «Сообщить разработчику».',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [via, setVia] = useState<'local' | 'api' | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
    })
  }

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMsg: ChatMessage = { id: nextId(), role: 'user', content: trimmed }
    const history = [...messages, userMsg]
    setMessages(history)
    setInput('')
    setLoading(true)

    const context = collectFeedbackContext({
      themeId,
      activeTab: 'help',
      profile,
      stats,
    })

    try {
      const result = await chatRepository.send({
        message: trimmed,
        history: messages,
        context,
      })
      setVia(result.via)
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: 'assistant', content: result.reply },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: 'assistant',
          content: 'Не удалось получить ответ. Попробуй ещё раз или нажми «Сообщить разработчику».',
        },
      ])
    } finally {
      setLoading(false)
      scrollToBottom()
    }
  }

  return (
    <div className="rpg-chat">
      <div className="rpg-chat-header">
        <div>
          <h3 className="rpg-chat-title">💬 Помощник</h3>
          <p className="rpg-chat-sub">
            Read-only: объясняет правила и прогресс
            {via === 'api' ? ' · AI' : via === 'local' ? ' · FAQ' : ''}
          </p>
        </div>
        <button type="button" className="rpg-dbtn" onClick={onOpenFeedback}>
          🛠 Сообщить
        </button>
      </div>

      <div className="rpg-chat-messages" ref={listRef}>
        {messages.map((m) => (
          <div key={m.id} className={`rpg-chat-bubble rpg-chat-bubble--${m.role}`}>
            {m.content}
          </div>
        ))}
        {loading && <div className="rpg-chat-bubble rpg-chat-bubble--assistant rpg-chat-typing">…</div>}
      </div>

      <div className="rpg-chat-suggestions">
        {CHAT_SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            className="rpg-chat-chip"
            onClick={() => sendMessage(s)}
            disabled={loading}
          >
            {s}
          </button>
        ))}
      </div>

      <form
        className="rpg-chat-form"
        onSubmit={(e) => {
          e.preventDefault()
          void sendMessage(input)
        }}
      >
        <input
          type="text"
          className="rpg-chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Спроси про XP, курсы, дуэли…"
          disabled={loading}
        />
        <button type="submit" className="rpg-dbtn primary" disabled={loading || !input.trim()}>
          Отправить
        </button>
      </form>
    </div>
  )
}
