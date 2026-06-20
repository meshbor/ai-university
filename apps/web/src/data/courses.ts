import type { Course } from '@/types'

export const COURSES: Course[] = [
  {
    id: 'senior-2026',
    emoji: '🏛️',
    title: 'Senior 2026',
    sub: 'Системный дизайн и архитектура',
    primary: {
      label: 'Открыть последний урок',
      href: 'courses/senior-2026/lessons/0005-chekpoin-faza-0.html',
    },
    lessons: [
      { n: '0001', t: 'Путь запроса: от логина до списка', href: 'courses/senior-2026/lessons/0001-put-zaprosa.html' },
      { n: '0002', t: 'Кто ты: сессии, токены и почему 401', href: 'courses/senior-2026/lessons/0002-sessii-i-tokeny.html' },
      { n: '0003', t: 'Контракт API: data, status, message', href: 'courses/senior-2026/lessons/0003-kontrakt-api.html' },
      { n: '0004', t: 'CORS и credentials', href: 'courses/senior-2026/lessons/0004-cors.html' },
      { n: '0005', t: 'Чекпоинт Фазы 0: полный путь запроса', href: 'courses/senior-2026/lessons/0005-chekpoin-faza-0.html' },
    ],
    refs: [
      { t: 'Дорожная карта', href: 'courses/senior-2026/reference/dorozhnaya-karta-2026.html' },
      { t: 'Расписание дня', href: 'courses/senior-2026/reference/raspisanie-dnya.html' },
      { t: 'Трекер фаз', href: 'courses/senior-2026/reference/progress-tracker.html' },
      { t: 'Глоссарий', href: 'courses/senior-2026/reference/glossary.html' },
    ],
  },
  {
    id: 'english',
    emoji: '🗣️',
    title: 'Английский',
    sub: 'Читать доки и писать свободно',
    primary: {
      label: 'Открыть последний урок',
      href: 'courses/english/lessons/0003-present-perfect-vs-past-simple.html',
    },
    lessons: [
      { n: '0001', t: 'Диагностика: точка старта', href: 'courses/english/lessons/0001-diagnostika-tochka-starta.html' },
      { n: '0002', t: 'Артикли a / an / the', href: 'courses/english/lessons/0002-artikli-a-an-the.html' },
      { n: '0003', t: 'Present Perfect vs Past Simple', href: 'courses/english/lessons/0003-present-perfect-vs-past-simple.html' },
    ],
    refs: [
      { t: 'Артикли', href: 'courses/english/reference/artikli.html' },
      { t: 'Уровни CEFR', href: 'courses/english/reference/cefr-urovni.html' },
      { t: 'Present Perfect vs Past Simple', href: 'courses/english/reference/vremena-present-perfect-past-simple.html' },
    ],
  },
  {
    id: 'css-grid',
    emoji: '🎨',
    title: 'CSS Grid',
    sub: 'Двумерные раскладки без хаков',
    primary: {
      label: 'Открыть последний урок',
      href: 'courses/css-grid/lessons/0003-adaptivnye-setki.html',
    },
    lessons: [
      { n: '0001', t: 'Основы CSS Grid', href: 'courses/css-grid/lessons/0001-osnovy-css-grid.html' },
      { n: '0002', t: 'Размещение элементов', href: 'courses/css-grid/lessons/0002-razmeshchenie-elementov.html' },
      { n: '0003', t: 'Адаптивные сетки', href: 'courses/css-grid/lessons/0003-adaptivnye-setki.html' },
    ],
    refs: [{ t: 'Справочник Grid', href: 'courses/css-grid/reference/grid-spravochnik.html' }],
  },
  {
    id: 'chtenie',
    emoji: '📖',
    title: 'Чтение (сын)',
    sub: 'Учим сына читать · ведёт родитель',
    primary: {
      label: 'Открыть последний урок',
      href: 'courses/chtenie/lessons/0005-bukvy-bez-tyani-i-prevrashcheniya.html',
    },
    lessons: [
      { n: '0001', t: 'Звук, а не имя', href: 'courses/chtenie/lessons/0001-zvuk-ne-imya.html' },
      { n: '0002', t: 'Бегущий пальчик', href: 'courses/chtenie/lessons/0002-begushchiy-palchik.html' },
      { n: '0003', t: 'Из слогов — слово', href: 'courses/chtenie/lessons/0003-iz-slogov-slovo.html' },
      { n: '0004', t: 'Слог с хвостиком', href: 'courses/chtenie/lessons/0004-zakrytye-slogi.html' },
      { n: '0005', t: 'Буквы без тяни и превращения', href: 'courses/chtenie/lessons/0005-bukvy-bez-tyani-i-prevrashcheniya.html' },
    ],
    refs: [
      { t: 'Памятка родителю', href: 'courses/chtenie/reference/pamyatka-roditelyu.html' },
      { t: 'Слоговая таблица', href: 'courses/chtenie/reference/slogovaya-tablica.html' },
      { t: 'Карточки уроки 3–5', href: 'courses/chtenie/reference/kartochki-uroki-3-5.html' },
    ],
  },
]
