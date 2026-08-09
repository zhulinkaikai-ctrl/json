import { describe, expect, it } from 'vitest'

import {
  getHomepageActionFeedback,
  getHomepageOutputText,
  isHomepageOutputStale,
  runHomepageAction,
} from './homepageWorkspace'

describe('homepage workspace actions', () => {
  it('formats valid JSON into a read-only output value without changing the source text', () => {
    const source = '{"name":"Ada"}'
    const output = runHomepageAction(source, 'format')

    expect(source).toBe('{"name":"Ada"}')
    expect(output).toMatchObject({
      kind: 'text',
      action: 'format',
      value: '{\n  "name": "Ada"\n}',
      sourceInput: source,
    })
    expect(getHomepageOutputText(output)).toBe('{\n  "name": "Ada"\n}')
  })

  it('replaces a previous result with the current diagnostic when formatting invalid JSON', () => {
    const output = runHomepageAction('{"name":"Ada",}', 'format')

    expect(output).toMatchObject({
      kind: 'diagnostic',
      action: 'format',
      diagnostic: {
        status: 'invalid',
        category: 'trailing_comma',
      },
    })
    expect(getHomepageOutputText(output)).toBeNull()
    expect(getHomepageActionFeedback(output)).toEqual({
      message: 'JSON has a syntax error.',
      tone: 'error',
    })
  })

  it('returns validation status without creating a transformed output value', () => {
    const output = runHomepageAction('["a","b"]', 'validate')

    expect(output).toMatchObject({
      kind: 'validation',
      diagnostic: {
        status: 'valid',
        rootType: 'Array',
        itemCount: 2,
      },
    })
    expect(getHomepageOutputText(output)).toBeNull()
    expect(getHomepageActionFeedback(output)).toEqual({
      message: 'Validation result updated.',
      tone: 'success',
    })
  })

  it('returns success feedback for transformed output actions', () => {
    expect(getHomepageActionFeedback(runHomepageAction('{"name":"Ada"}', 'format'))).toEqual({
      message: 'Format applied to output.',
      tone: 'success',
    })
    expect(getHomepageActionFeedback(runHomepageAction('{"name":"Ada"}', 'minify'))).toEqual({
      message: 'Minified output updated.',
      tone: 'success',
    })
  })

  it('marks an existing result stale after the input changes but not after using the result as input', () => {
    const source = '{"name":"Ada"}'
    const output = runHomepageAction(source, 'format')
    const formatted = getHomepageOutputText(output)

    expect(isHomepageOutputStale(source, output)).toBe(false)
    expect(isHomepageOutputStale('{"name":"Grace"}', output)).toBe(true)
    expect(isHomepageOutputStale(formatted!, output)).toBe(false)
  })
})
