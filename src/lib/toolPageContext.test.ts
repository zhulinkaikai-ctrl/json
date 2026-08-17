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

  it('keeps the homepage and error-finding entry copy focused on search intent', () => {
    expect(getToolPageContext('/')).toMatchObject({
      heading: 'JSON formatter, validator, and error finder',
      lead: 'Format, validate, minify, and repair strict JSON locally in your browser for API payloads, configs, and logs.',
      editorLabel: 'JSON input',
      actionHint: 'Validate as you type.',
    })

    expect(getToolPageContext('/json-error-finder/')).toMatchObject({
      heading: 'JSON error finder',
      lead: 'Find the first strict JSON syntax error, see line and column details, and repair it locally.',
      actionHint: 'Checking line and column as you type.',
    })

    expect(getToolPageContext('/fix-invalid-json/')).toMatchObject({
      heading: 'Fix invalid JSON',
      lead: 'See the parser line and column, diagnose the blocking JSON error, and make the smallest correct repair.',
      actionHint: 'Checking the parser location as you type.',
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
