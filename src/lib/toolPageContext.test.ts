import { describe, expect, it } from 'vitest'

import { getToolPageContext } from './toolPageContext'

describe('getToolPageContext', () => {
  it('returns route-specific copy for a JSON minifier page', () => {
    expect(getToolPageContext('/json-minifier/')).toMatchObject({
      heading: 'JSON minifier',
      editorLabel: 'JSON to minify',
      actionHint: 'Validate first, then minify.',
    })
  })

  it('falls back to the homepage context for unknown paths', () => {
    expect(getToolPageContext('/')).toMatchObject({
      heading: 'JSON formatter, validator, and error finder',
      editorLabel: 'JSON input',
    })
    expect(getToolPageContext('/not-a-tool/')).toEqual(getToolPageContext('/'))
  })
})
