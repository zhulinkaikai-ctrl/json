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
    expect(cssBlock('.workspace-actions')).toContain('position: sticky')
    expect(cssBlock('.workspace-actions')).toContain('top: 0')
    expect(cssBlock('.workspace-actions')).toContain('justify-content: flex-start')
    expect(cssBlock('.output-panel')).toContain('overflow: hidden')
    expect(cssBlock('.output-code')).toContain('height: 100%')
  })

  it('turns the action rail into a compact mobile toolbar', () => {
    expect(styles).toContain('@media (max-width: 940px)')
    expect(styles).toContain('.workspace-actions .command-button.primary')
    expect(styles).toContain('grid-column: 1 / -1')
    expect(styles).toContain('@media (max-width: 640px)')
    expect(styles).toContain('grid-template-columns: repeat(2, minmax(0, 1fr))')
  })
})
