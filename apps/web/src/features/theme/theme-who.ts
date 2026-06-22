import type { ThemeId } from '@/types'

export function themeWhoLine(themeId: ThemeId, heroName: string): string {
  const map: Record<ThemeId, string> = {
    light: `Игрок: ${heroName}`,
    fallout: `VAULT 2026 · DWELLER: ${heroName.toUpperCase()}`,
    space: `Рейнджер: ${heroName} · Сектор 2026`,
    wot: `Танкист: ${heroName} · Бой 2026`,
    knight: `Рыцарь: ${heroName} · Орден 2026`,
    samurai: `Самурай: ${heroName} · Путь 2026`,
  }
  return map[themeId]
}
