import { describe, expect, it } from 'vitest'

import { getToolPageContext, isWorkspaceRoute } from './toolPageContext'

describe('getToolPageContext', () => {
  it('returns route-specific copy for a JSON minifier page', () => {
    expect(getToolPageContext('/json-minifier/')).toMatchObject({
      heading: 'JSON minifier',
      editorLabel: 'JSON to minify',
      actionHint: 'Validate first, then minify.',
    })

    expect(getToolPageContext('/json-minifier')).toMatchObject({
      heading: 'JSON minifier',
      editorLabel: 'JSON to minify',
    })
  })

  it('falls back to the homepage context for unknown paths', () => {
    expect(getToolPageContext('/')).toMatchObject({
      heading: 'JSON formatter, validator, and error finder',
      editorLabel: 'JSON input',
    })
    expect(getToolPageContext('/not-a-tool/')).toEqual(getToolPageContext('/'))
  })

  it('uses the two-panel workspace on home and JSON tool pages only', () => {
    expect(isWorkspaceRoute('/')).toBe(true)
    expect(isWorkspaceRoute('/json-formatter')).toBe(true)
    expect(isWorkspaceRoute('/json-formatter/')).toBe(true)
    expect(isWorkspaceRoute('/json-validator/')).toBe(true)
    expect(isWorkspaceRoute('/json-minifier/')).toBe(true)
    expect(isWorkspaceRoute('/json-error-finder/')).toBe(true)
    expect(isWorkspaceRoute('/guides/')).toBe(false)
  })
})
