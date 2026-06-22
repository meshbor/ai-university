import type { FeedbackContext } from '@/types/feedback'
import { DUEL_RULES, FAQ_ENTRIES, GAMIFICATION_RULES, coursesSummary } from './knowledge'

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, ' ').trim()
}

function matchesKeywords(message: string, keywords: string[]): boolean {
  const norm = normalize(message)
  return keywords.some((kw) => norm.includes(kw))
}

function personalStatsAnswer(ctx: FeedbackContext): string {
  const { stats, profile } = ctx
  const name = profile?.name ?? 'герой'
  return `Твой прогресс, ${name}:
- Уровень: ${stats.level}
- XP: ${stats.xp}
- Уроков пройдено: ${stats.doneLessons}
- Streak: ${stats.streak} дн.

${GAMIFICATION_RULES}`
}

export function answerLocal(message: string, context: FeedbackContext | null): string {
  const norm = normalize(message)

  if (
    context &&
    (norm.includes('мой') || norm.includes('сколько') || norm.includes('текущ')) &&
    (norm.includes('xp') || norm.includes('уров') || norm.includes('прогресс') || norm.includes('streak'))
  ) {
    return personalStatsAnswer(context)
  }

  if (norm.includes('курс') && (norm.includes('какие') || norm.includes('список') || norm.includes('есть'))) {
    return `Доступные курсы:\n${coursesSummary()}`
  }

  for (const entry of FAQ_ENTRIES) {
    if (matchesKeywords(message, entry.keywords)) {
      return entry.answer
    }
  }

  if (norm.includes('привет') || norm.includes('здравств')) {
    return 'Привет! Я помощник AI University — отвечаю на вопросы про курсы, XP, дуэли и интерфейс. Код не меняю; для правок нажми «🛠 Сообщить».'
  }

  return `Я могу помочь с вопросами про XP, курсы, дуэли, темы и прогресс.

${GAMIFICATION_RULES}

${DUEL_RULES}

Для багов и правок в коде — «🛠 Сообщить» в верхней панели.`
}
