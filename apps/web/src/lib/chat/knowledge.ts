import { COURSES } from '@/data/courses'
import { DUEL_DAYS, XP_PER_LESSON, XP_PER_LEVEL } from '@/lib/gamification/constants'

export const GAMIFICATION_RULES = `Правила геймификации AI University:
- 1 завершённый урок = ${XP_PER_LESSON} XP
- Новый уровень каждые ${XP_PER_LEVEL} XP (уровень 1 при 0 XP, уровень 2 при 300 XP и т.д.)
- Прогресс хранится в localStorage браузера (ключ aiuni_pipboy_v1)
- Streak — серия дней с активностью
- SPECIAL — характеристики, считаются из прогресса по курсам`

export const DUEL_RULES = `Дуэли:
- Weekly XP Race — кто больше XP за ${DUEL_DAYS} дней
- Course Sprint — кто больше уроков пройдёт в выбранном курсе за ${DUEL_DAYS} дней
- Вызов через ссылку ?duel= в URL
- Счёт соперника — снимок на момент вызова (без сервера синхронизации)`

export function coursesSummary(): string {
  return COURSES.map(
    (c) => `• ${c.emoji} ${c.title} (${c.id}) — ${c.lessons.length} уроков: ${c.sub}`,
  ).join('\n')
}

export const FAQ_ENTRIES: { keywords: string[]; answer: string }[] = [
  {
    keywords: ['xp', 'опыт', 'уровень', 'level'],
    answer: GAMIFICATION_RULES,
  },
  {
    keywords: ['дуэль', 'duel', 'вызов', 'соревн'],
    answer: DUEL_RULES,
  },
  {
    keywords: ['курс', 'courses', 'урок', 'lesson'],
    answer: `Доступные курсы:\n${coursesSummary()}\n\nОткрой вкладку «Курсы» на dashboard, чтобы отмечать уроки и копить XP.`,
  },
  {
    keywords: ['прогресс', 'сброс', 'localstorage', 'хран'],
    answer:
      'Прогресс уроков хранится в localStorage браузера. Кнопка «Сбросить прогресс» внизу dashboard очищает уроки, но профиль героя остаётся. Если XP «не обновился» — проверь, что урок отмечен галочкой на вкладке Курсы.',
  },
  {
    keywords: ['тема', 'theme', 'pip-boy', 'fallout', 'оформл'],
    answer:
      'Темы оформления переключаются в верхней панели: Светлая, Pip-Boy, Космос, Танки, Рыцарь, Самурай. Тема сохраняется в localStorage (aiuni_theme).',
  },
  {
    keywords: ['special', 'характер', 'радар', 'стат'],
    answer:
      'Вкладка SPECIAL (или аналог в теме) показывает характеристики героя и радар жизни — они считаются из прогресса по курсам. Чем больше уроков пройдено, тем выше показатели.',
  },
  {
    keywords: ['баг', 'правк', 'сообщ', 'feedback', 'issue'],
    answer:
      'Чтобы сообщить о баге или попросить правку в коде — нажми «🛠 Сообщить» в верхней панели. Помощник отвечает только на вопросы, код не меняет.',
  },
  {
    keywords: ['не обнов', 'не работ', 'галоч', 'отмет'],
    answer:
      'XP начисляется при отметке урока на вкладке «Курсы». Если галочка стоит, а XP не изменился — обнови страницу. Прогресс локальный: на другом устройстве или браузере он не синхронизируется.',
  },
]

export const CHAT_SUGGESTIONS = [
  'Как считается XP?',
  'Что такое дуэль?',
  'Какие курсы есть?',
  'Почему XP не обновился?',
]
