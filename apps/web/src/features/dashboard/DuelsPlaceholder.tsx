export function DuelsPlaceholder() {
  return (
    <div
      className="rounded-xl border p-6 text-center"
      style={{
        border: 'var(--rpg-frame)',
        background: 'var(--rpg-panel)',
      }}
    >
      <p className="rpg-tt text-lg font-bold">Дуэли</p>
      <p className="mt-2 text-sm opacity-80">
        Weekly XP Race и Course Sprint — в следующем MR. Логика уже есть в legacy{' '}
        <code className="text-xs">index.html</code>.
      </p>
      <p className="mt-3 text-xs opacity-60">
        После переноса дуэлей — cutover GitHub Pages на v2 и архив legacy.
      </p>
    </div>
  )
}
