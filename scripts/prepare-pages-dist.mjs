import { cpSync, existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const dist = 'apps/web/dist'

if (!existsSync(dist)) {
  console.error('apps/web/dist not found — run npm run build first')
  process.exit(1)
}

if (!existsSync('legacy/index.html')) {
  console.error('legacy/index.html not found')
  process.exit(1)
}

cpSync('legacy', join(dist, 'legacy'), { recursive: true })
writeFileSync(join(dist, '.nojekyll'), '')
console.log('GitHub Pages artifact ready at', dist)
