import { readFileSync, writeFileSync, globSync } from 'node:fs'
import { join } from 'node:path'

const root = 'courses'
const marker = 'lesson-nav.js'
const snippet = '  <script src="../../shared/lesson-nav.js" defer></script>\n'

for (const file of globSync(join(root, '*/lessons/*.html'))) {
  let html = readFileSync(file, 'utf8')
  if (html.includes(marker)) continue
  if (!html.includes('</body>')) {
    console.warn('skip (no </body>):', file)
    continue
  }
  html = html.replace('</body>', snippet + '</body>')
  writeFileSync(file, html)
  console.log('patched', file)
}
