import type { ThemeConfig, ThemeId } from '@/types'

export const THEMES: Record<ThemeId, ThemeConfig> = {
  light: {
    brand: 'AI University · лист навыков',
    who: 'Игрок: Baruh',
    tabs: { special: 'Характеристики', skills: 'Курсы', duels: 'Дуэли', help: 'Помощь' },
    ranks: ['Новичок', 'Ученик', 'Подмастерье', 'Специалист', 'Профи', 'Старший', 'Эксперт', 'Мастер', 'Гуру', 'Легенда'],
  },
  fallout: {
    brand: 'PIP-BOY 3000 · AI UNIVERSITY',
    who: 'VAULT 2026 · DWELLER: BARUH',
    tabs: { special: 'S.P.E.C.I.A.L.', skills: 'SKILLS', duels: 'VS DUELS', help: 'HELP' },
    ranks: ['Стажёр убежища', 'Падаван', 'Подмастерье', 'Странник', 'Искатель', 'Ветеран', 'Архитектор', 'Мастер', 'Оверсир', 'Легенда Пустоши'],
  },
  space: {
    brand: 'КОСМО-РЕЙНДЖЕР · БОРТОВОЙ ЖУРНАЛ',
    who: 'Рейнджер: Baruh · Сектор 2026',
    tabs: { special: 'Системы корабля', skills: 'Курсы', duels: 'Дуэли', help: 'Помощь' },
    ranks: ['Кадет', 'Пилот', 'Рейнджер', 'Лейтенант', 'Капитан', 'Командор', 'Ас сектора', 'Адмирал', 'Герой галактики', 'Легенда'],
  },
  wot: {
    brand: 'АНГАР · AI UNIVERSITY',
    who: 'Танкист: Baruh · Бой 2026',
    tabs: { special: 'Экипаж', skills: 'Курсы', duels: 'Поединки', help: 'Помощь' },
    ranks: ['Рекрут', 'Рядовой', 'Сержант', 'Мл. лейтенант', 'Лейтенант', 'Капитан', 'Майор', 'Полковник', 'Генерал', 'Маршал'],
  },
  knight: {
    brand: 'ЗАМОК · AI UNIVERSITY',
    who: 'Рыцарь: Baruh · Орден 2026',
    tabs: { special: 'Доблесть', skills: 'Курсы', duels: 'Турнир', help: 'Помощь' },
    ranks: ['Оруженосец', 'Паж', 'Рыцарь', 'Баронет', 'Барон', 'Виконт', 'Граф', 'Герцог', 'Принц', 'Король'],
  },
  samurai: {
    brand: 'ДОДЗЁ · AI UNIVERSITY',
    who: 'Самурай: Baruh · Путь 2026',
    tabs: { special: 'Бусидо', skills: 'Курсы', duels: 'Схватки', help: 'Помощь' },
    ranks: ['Ученик', 'Дзёдзё', 'Самурай', 'Кэнси', 'Даймё', 'Сёгун', 'Мастер клинка', 'Легенда', 'Ками', 'Император'],
  },
}

export const THEME_IDS = Object.keys(THEMES) as ThemeId[]
