import { THEME_IDS } from '@/data/themes'
import { useAppStore } from '@/stores/use-app-store'
import type { ThemeId } from '@/types'
import { cn } from '@/lib/utils'

const LABELS: Record<ThemeId, string> = {
  light: '☀️ Светлая',
  fallout: '📟 Pip-Boy',
  space: '🚀 Космос',
  wot: '🛡️ Танки',
  knight: '⚔️ Рыцарь',
  samurai: '🗡️ Самурай',
}

interface ThemeToolbarProps {
  onNewHero: () => void
  onLogout: () => void
}

export function ThemeToolbar({ onNewHero, onLogout }: ThemeToolbarProps) {
  const themeId = useAppStore((s) => s.themeId)
  const setTheme = useAppStore((s) => s.setTheme)

  return (
    <div className="sticky top-0 z-50 mb-4 flex flex-wrap items-center justify-between gap-3 rounded-b-xl bg-[#13151f] px-4 py-2.5 text-[#e8e8f0] shadow-lg">
      <div className="font-semibold tracking-wide">🎓 AI University</div>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-xs opacity-70">Тема:</span>
        {THEME_IDS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTheme(id)}
            className={cn(
              'rounded-lg border px-2.5 py-1.5 text-xs transition-colors',
              themeId === id
                ? 'border-[#6c8cff] bg-[#6c8cff] text-white'
                : 'border-[#343852] bg-[#23263a] text-[#cfd2e6] hover:bg-[#2c3050]',
            )}
          >
            {LABELS[id]}
          </button>
        ))}
        <button
          type="button"
          onClick={onNewHero}
          className="ml-1 rounded-lg border border-[#343852] bg-[#23263a] px-2.5 py-1.5 text-xs hover:bg-[#2c3050]"
        >
          🎭 Новый герой
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-lg border border-[#343852] bg-[#23263a] px-2.5 py-1.5 text-xs hover:bg-[#2c3050]"
        >
          🔒 Выйти
        </button>
      </div>
    </div>
  )
}
