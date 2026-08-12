import { describe, expect, it } from 'vitest'

import { formatJson } from './jsonDiagnostics'
import { DEFAULT_JSON_SAMPLE } from './homepageSample'

describe('default homepage sample', () => {
  it('starts with valid compact JSON that visibly changes when formatted', () => {
    expect(() => JSON.parse(DEFAULT_JSON_SAMPLE)).not.toThrow()
    expect(DEFAULT_JSON_SAMPLE).not.toContain('\n')
    expect(formatJson(DEFAULT_JSON_SAMPLE)).not.toBe(DEFAULT_JSON_SAMPLE)
  })
})
