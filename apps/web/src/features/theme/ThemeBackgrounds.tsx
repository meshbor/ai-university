import type { ThemeId } from '@/types'
import { cn } from '@/lib/utils'

const base = import.meta.env.BASE_URL

export function ThemeBackgrounds({ themeId }: { themeId: ThemeId }) {
  return (
    <>
      <div
        className={cn('pointer-events-none fixed inset-0 -z-10', themeId !== 'fallout' && 'hidden')}
        style={{
          backgroundImage: `linear-gradient(rgba(2,12,6,.55),rgba(2,8,5,.78)),url(${base}assets/fallout-vault.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div
        className={cn('pointer-events-none fixed inset-0 -z-10', themeId !== 'space' && 'hidden')}
        style={{
          backgroundImage: `linear-gradient(rgba(3,5,15,.30),rgba(3,5,15,.55)),url(${base}assets/space-cockpit.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div
        className={cn('pointer-events-none fixed inset-0 -z-10', themeId !== 'wot' && 'hidden')}
        style={{
          backgroundImage: `linear-gradient(rgba(20,18,12,.32),rgba(10,9,6,.58)),url(${base}assets/wot-hangar.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div
        className={cn('pointer-events-none fixed inset-0 -z-10', themeId !== 'knight' && 'hidden')}
        style={{
          backgroundImage: `linear-gradient(rgba(20,16,12,.35),rgba(10,8,6,.6)),url(${base}assets/knight-hall.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div
        className={cn('pointer-events-none fixed inset-0 -z-10', themeId !== 'samurai' && 'hidden')}
        style={{
          backgroundImage: `linear-gradient(rgba(40,18,18,.35),rgba(18,8,8,.58)),url(${base}assets/samurai-dojo.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </>
  )
}
