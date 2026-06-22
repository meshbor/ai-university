import { useMemo } from 'react'
import type { LifeAxisScore } from '@/types'

const CX = 130
const CY = 130
const R = 88

function angle(i: number, n: number) {
  return -Math.PI / 2 + i * ((2 * Math.PI) / n)
}

function point(i: number, v: number, n: number, r = R): [number, number] {
  const a = angle(i, n)
  const rr = r * ((v - 1) / 9)
  return [CX + rr * Math.cos(a), CY + rr * Math.sin(a)]
}

function labelPoint(i: number, n: number, scale: number): [number, number] {
  return point(i, 10, n, R * scale)
}

interface LifeRadarProps {
  scores: LifeAxisScore[]
}

export function LifeRadar({ scores }: LifeRadarProps) {
  const { min, weakIds, tip } = useMemo(() => {
    const vals = scores.map((s) => s.val)
    const minVal = Math.min(...vals)
    const weak = scores.filter((s) => s.val === minVal).map((s) => s.id)
    const weakLbl = scores
      .filter((s) => weak.includes(s.id))
      .map((s) => `${s.emoji} ${s.label} (${s.val})`)
      .join(', ')
    const tipText =
      minVal < 6
        ? `Просадка: ${weakLbl}`
        : `Баланс ровный · слабее всего: ${weakLbl}`
    return { min: minVal, weakIds: weak, tip: tipText }
  }, [scores])

  const n = scores.length

  return (
    <div className="mt-4 border-t border-[var(--rpg-line)] pt-3.5">
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <b className="rpg-tt text-[13px]">Баланс жизни</b>
        <span className="text-[11px] opacity-70">1–10</span>
      </div>
      <div className="my-1 flex justify-center">
        <svg
          className="rpg-radar block h-auto w-full max-w-[280px]"
          viewBox="0 0 260 260"
          aria-label="Диаграмма баланса жизни"
        >
          <polygon
            className="grid"
            points={scores.map((_, i) => point(i, 10, n).join(',')).join(' ')}
          />
          {[2, 4, 6, 8, 10].map((g) => (
            <polygon
              key={g}
              className="grid"
              points={scores.map((_, i) => point(i, g, n).join(',')).join(' ')}
            />
          ))}
          {scores.map((_, i) => {
            const [x, y] = point(i, 10, n)
            return <line key={`axis-${i}`} className="axis" x1={CX} y1={CY} x2={x} y2={y} />
          })}
          <polygon
            className="fill"
            points={scores.map((s, i) => point(i, s.val, n).join(',')).join(' ')}
          />
          {scores.map((s, i) => {
            const [x, y] = point(i, s.val, n)
            const [lx, ly] = labelPoint(i, n, 1.22)
            const [tx, ty] = labelPoint(i, n, 1.38)
            const weak = weakIds.includes(s.id)
            return (
              <g key={s.id}>
                <circle className="dot" cx={x} cy={y} r={4.5} />
                <text className={`lbl${weak ? ' weak' : ''}`} x={lx} y={ly}>
                  {s.emoji}{' '}
                  <tspan className="dim">{s.val}</tspan>
                </text>
                <text className="lbl dim" x={tx} y={ty} style={{ fontSize: 10 }}>
                  {s.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
      <p className="rpg-tt text-[11px] leading-snug opacity-80">
        {min < 6 ? (
          <>
            Просадка: <em className="font-bold not-italic text-[var(--rpg-xp)]">{tip.replace('Просадка: ', '')}</em>
          </>
        ) : (
          <>
            Баланс ровный · слабее всего:{' '}
            <em className="font-bold not-italic text-[var(--rpg-xp)]">
              {tip.replace('Баланс ровный · слабее всего: ', '')}
            </em>
          </>
        )}
      </p>
    </div>
  )
}
