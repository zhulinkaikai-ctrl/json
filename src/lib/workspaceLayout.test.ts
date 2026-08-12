import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const styles = readFileSync(new URL('../styles.css', import.meta.url), 'utf8')

function cssBlock(selector: string) {
  const match = styles.match(new RegExp(`${selector.replaceAll('.', '\\.')}\\s*\\{([^}]*)\\}`))
  return match?.[1] ?? ''
}

describe('two-panel workspace layout', () => {
  it('keeps the center action rail near the top while long output scrolls inside the panel', () => {
    expect(cssBlock('.home-tool-layout')).toContain('height: clamp(')
    expect(cssBlock('.workspace-actions')).toContain('justify-content: flex-start')
    expect(cssBlock('.output-panel')).toContain('overflow: hidden')
    expect(cssBlock('.output-code')).toContain('height: 100%')
  })
})
