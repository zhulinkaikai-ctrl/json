import { describe, expect, it } from 'vitest'

import { diagnoseJson, formatJson, isWithinSizeLimit, minifyJson } from './jsonDiagnostics'

describe('diagnoseJson', () => {
  it('reports a valid object with its top-level item count', () => {
    const result = diagnoseJson('{"service":"api","enabled":true}')

    expect(result).toMatchObject({
      status: 'valid',
      rootType: 'Object',
      itemCount: 2,
    })
  })

  it('classifies a missing comma and points to the next property', () => {
    const result = diagnoseJson('{\n  "name": "Ada"\n  "role": "Engineer"\n}')

    expect(result).toMatchObject({
      status: 'invalid',
      category: 'missing_comma',
      line: 3,
      column: 3,
    })
  })

  it('classifies a trailing comma', () => {
    const result = diagnoseJson('{"name":"Ada",}')

    expect(result).toMatchObject({
      status: 'invalid',
      category: 'trailing_comma',
    })
  })

  it('classifies single-quoted JSON', () => {
    const result = diagnoseJson("{'name':'Ada'}")

    expect(result).toMatchObject({
      status: 'invalid',
      category: 'single_quotes',
    })
  })

  it('classifies an unclosed string', () => {
    const result = diagnoseJson('{"name":"Ada}')

    expect(result).toMatchObject({
      status: 'invalid',
      category: 'unclosed_string',
    })
  })

  it('classifies an unquoted object key', () => {
    const result = diagnoseJson('{name:"Ada"}')

    expect(result).toMatchObject({
      status: 'invalid',
      category: 'unquoted_key',
    })
  })

  it('classifies comments as invalid standard JSON', () => {
    const result = diagnoseJson('{\n  // API response\n  "name": "Ada"\n}')

    expect(result).toMatchObject({
      status: 'invalid',
      category: 'comment_detected',
    })
  })

  it('classifies an unmatched closing bracket', () => {
    const result = diagnoseJson('{"items": []}}')

    expect(result).toMatchObject({
      status: 'invalid',
      category: 'bracket_mismatch',
    })
  })

  it('classifies a literal line break inside a string', () => {
    const result = diagnoseJson('{"message":"line one\nline two"}')

    expect(result).toMatchObject({
      status: 'invalid',
      category: 'invalid_control_character',
    })
  })
})

describe('isWithinSizeLimit', () => {
  it('accepts text at the 10 MB byte limit and rejects larger text', () => {
    const tenMegabytes = 'x'.repeat(10 * 1024 * 1024)

    expect(isWithinSizeLimit(tenMegabytes)).toBe(true)
    expect(isWithinSizeLimit(`${tenMegabytes}x`)).toBe(false)
  })
})

describe('JSON transformations', () => {
  it('formats valid JSON with two-space indentation', () => {
    expect(formatJson('{"name":"Ada","enabled":true}')).toBe(
      '{\n  "name": "Ada",\n  "enabled": true\n}',
    )
  })

  it('minifies valid JSON without changing its data', () => {
    expect(minifyJson('{\n  "name": "Ada",\n  "enabled": true\n}')).toBe(
      '{"name":"Ada","enabled":true}',
    )
  })
})
