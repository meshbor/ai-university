import { specialWithValues } from '@/lib/gamification/stats'
import type { ProgressStore } from '@/types'

interface SpecialGridProps {
  store: ProgressStore
}

export function SpecialGrid({ store }: SpecialGridProps) {
  const stats = specialWithValues(store)

  return (
    <div className="rpg-special">
      {stats.map((s) => (
        <div key={s.k} className="rpg-sp">
          <div className="letter">{s.k}</div>
          <div className="min-w-0 flex-1">
            <div className="name">
              <span>{s.name}</span>
              <span className="val">{s.val}</span>
            </div>
            <div className="ru">{s.ru}</div>
            <div className="rpg-pips">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className={`rpg-pip${i < s.val ? ' on' : ''}`} />
              ))}
            </div>
            <div className="rpg-tt mt-1 text-[10px] uppercase opacity-55">{s.note}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
