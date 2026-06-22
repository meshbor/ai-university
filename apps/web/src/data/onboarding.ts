import type { OnboardingPreset } from '@/types'

export const START_PRESETS: OnboardingPreset[] = [
  {
    id: 'browse',
    name: 'Я просто посмотреть',
    theme: 'light',
    hero: 'smart',
    note: 'светлая тема по умолчанию',
    lore: 'Без ролевой шелухи — сразу к курсам',
    placeholder: true,
  },
  {
    id: 'fallout',
    name: 'Умник убежища',
    theme: 'fallout',
    hero: 'smart',
    note: 'Pip-Boy + ретро',
    lore: 'Технарь и планировщик',
  },
  {
    id: 'space',
    name: 'Косморейнджер',
    theme: 'space',
    hero: 'fast',
    note: 'корабль и рубка',
    lore: 'Скорость и маневр',
  },
  {
    id: 'wot',
    name: 'Танкист Т-34',
    theme: 'wot',
    hero: 'tank',
    note: 'ангар и броня',
    lore: 'Сталь и напор',
  },
  {
    id: 'knight',
    name: 'Рыцарь ордена',
    theme: 'knight',
    hero: 'knight',
    note: 'замок + 3D',
    lore: 'Честь и дисциплина',
  },
  {
    id: 'samurai',
    name: 'Путь самурая',
    theme: 'samurai',
    hero: 'samurai',
    note: 'додзё + 3D',
    lore: 'Бусидо и клинок',
  },
]
