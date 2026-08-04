export const MAX_JSON_BYTES = 10 * 1024 * 1024

export type JsonErrorCategory =
  | 'missing_comma'
  | 'trailing_comma'
  | 'unclosed_string'
  | 'single_quotes'
  | 'comment_detected'
  | 'unquoted_key'
  | 'invalid_control_character'
  | 'bracket_mismatch'
  | 'unknown_parse_error'

export type JsonDiagnostic =
  | {
      status: 'valid'
      value: unknown
      rootType: 'Object' | 'Array' | 'String' | 'Number' | 'Boolean' | 'Null'
      itemCount: number | null
      characterCount: number
      byteSize: number
    }
  | {
      status: 'invalid'
      category: JsonErrorCategory
      index: number
      line: number
      column: number
      title: string
      explanation: string
      suggestion: string
      context: string
      parserMessage: string
    }

type KnownError = {
  category: JsonErrorCategory
  index: number
}

type StructuralScan = {
  commentIndex?: number
  singleQuoteIndex?: number
  controlCharacterIndex?: number
  unclosedStringIndex?: number
  bracketMismatchIndex?: number
}

const errorCopy: Record<
  JsonErrorCategory,
  Pick<JsonDiagnostic & { status: 'invalid' }, 'title' | 'explanation' | 'suggestion'>
> = {
  missing_comma: {
    title: 'A comma is missing between two values.',
    explanation: 'JSON needs a comma to separate properties and array values.',
    suggestion: 'Add a comma after the previous value before the next property or item.',
  },
  trailing_comma: {
    title: 'This comma appears after the last item.',
    explanation: 'Standard JSON does not allow a trailing comma.',
    suggestion: 'Remove the comma before the closing ] or }.',
  },
  unclosed_string: {
    title: 'This string is missing its closing double quote.',
    explanation: 'Every JSON string must begin and end with a double quote.',
    suggestion: 'Add a closing double quote (") to finish the string.',
  },
  single_quotes: {
    title: 'JSON strings must use double quotes.',
    explanation: 'Single quotes are valid in some JavaScript contexts, but not in strict JSON.',
    suggestion: 'Replace single quotes with double quotes around keys and string values.',
  },
  comment_detected: {
    title: 'Comments are not valid in standard JSON.',
    explanation: 'Strict JSON does not support // or /* ... */ comments.',
    suggestion: 'Remove the comment before parsing this JSON.',
  },
  unquoted_key: {
    title: 'Object property names must be wrapped in double quotes.',
    explanation: 'Strict JSON requires every object key to be a double-quoted string.',
    suggestion: 'Change key: value to "key": value.',
  },
  invalid_control_character: {
    title: 'This string contains an unescaped control character.',
    explanation: 'Line breaks and other control characters must be escaped inside JSON strings.',
    suggestion: 'Remove the character or use a valid JSON escape sequence such as \\n.',
  },
  bracket_mismatch: {
    title: 'A bracket or brace is missing or appears in the wrong place.',
    explanation: 'JSON arrays and objects must close in the same order that they open.',
    suggestion: 'Check that every { has a matching } and every [ has a matching ].',
  },
  unknown_parse_error: {
    title: 'JSON syntax error',
    explanation: 'This content is not valid strict JSON at the highlighted location.',
    suggestion: 'Check the highlighted location and the line immediately before it for a missing quote, comma, or closing bracket.',
  },
}

export function isWithinSizeLimit(text: string): boolean {
  return new TextEncoder().encode(text).byteLength <= MAX_JSON_BYTES
}

export function diagnoseJson(text: string): JsonDiagnostic {
  const byteSize = new TextEncoder().encode(text).byteLength
  const scan = scanStructure(text)
  const knownError = findKnownError(text, scan)

  if (knownError) {
    return createInvalidDiagnostic(text, knownError, '')
  }

  try {
    const value = JSON.parse(text) as unknown
    return {
      status: 'valid',
      value,
      rootType: getRootType(value),
      itemCount: getItemCount(value),
      characterCount: text.length,
      byteSize,
    }
  } catch (error) {
    const parserMessage = error instanceof Error ? error.message : 'JSON syntax error'
    const index = getParserIndex(parserMessage, text)
    const category = getParserCategory(text, index)

    return createInvalidDiagnostic(text, { category, index }, parserMessage)
  }
}

export function formatJson(text: string): string {
  return JSON.stringify(JSON.parse(text), null, 2)
}

export function minifyJson(text: string): string {
  return JSON.stringify(JSON.parse(text))
}

function scanStructure(text: string): StructuralScan {
  const brackets: Array<{ char: '{' | '['; index: number }> = []
  let inString = false
  let escaped = false
  let stringStart = -1

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]
    const nextCharacter = text[index + 1]

    if (inString) {
      if (escaped) {
        escaped = false
        continue
      }

      if (character === '\\') {
        escaped = true
        continue
      }

      if (character === '"') {
        inString = false
        stringStart = -1
        continue
      }

      if (character.charCodeAt(0) <= 0x1f) {
        return { controlCharacterIndex: index }
      }

      continue
    }

    if (character === '"') {
      inString = true
      stringStart = index
      continue
    }

    if (character === "'") {
      return { singleQuoteIndex: index }
    }

    if (character === '/' && (nextCharacter === '/' || nextCharacter === '*')) {
      return { commentIndex: index }
    }

    if (character === '{' || character === '[') {
      brackets.push({ char: character, index })
      continue
    }

    if (character === '}' || character === ']') {
      const expectedOpening = character === '}' ? '{' : '['
      const lastOpening = brackets.at(-1)

      if (!lastOpening || lastOpening.char !== expectedOpening) {
        return { bracketMismatchIndex: index }
      }

      brackets.pop()
    }
  }

  if (inString) {
    return { unclosedStringIndex: stringStart === -1 ? text.length : stringStart }
  }

  if (brackets.length > 0) {
    return { bracketMismatchIndex: text.length }
  }

  return {}
}

function findKnownError(text: string, scan: StructuralScan): KnownError | null {
  if (scan.commentIndex !== undefined) return { category: 'comment_detected', index: scan.commentIndex }
  if (scan.singleQuoteIndex !== undefined) return { category: 'single_quotes', index: scan.singleQuoteIndex }
  if (scan.controlCharacterIndex !== undefined) return { category: 'invalid_control_character', index: scan.controlCharacterIndex }
  if (scan.unclosedStringIndex !== undefined) return { category: 'unclosed_string', index: scan.unclosedStringIndex }
  if (scan.bracketMismatchIndex !== undefined) return { category: 'bracket_mismatch', index: scan.bracketMismatchIndex }

  const trailingCommaIndex = findTrailingComma(text)
  if (trailingCommaIndex !== -1) return { category: 'trailing_comma', index: trailingCommaIndex }

  const unquotedKeyIndex = findUnquotedKey(text)
  if (unquotedKeyIndex !== -1) return { category: 'unquoted_key', index: unquotedKeyIndex }

  return null
}

function findTrailingComma(text: string): number {
  let inString = false
  let escaped = false

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]

    if (inString) {
      if (escaped) escaped = false
      else if (character === '\\') escaped = true
      else if (character === '"') inString = false
      continue
    }

    if (character === '"') {
      inString = true
      continue
    }

    if (character !== ',') continue

    let nextIndex = index + 1
    while (/\s/.test(text[nextIndex] ?? '')) nextIndex += 1
    if (text[nextIndex] === '}' || text[nextIndex] === ']') return index
  }

  return -1
}

function findUnquotedKey(text: string): number {
  let inString = false
  let escaped = false

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]

    if (inString) {
      if (escaped) escaped = false
      else if (character === '\\') escaped = true
      else if (character === '"') inString = false
      continue
    }

    if (character === '"') {
      inString = true
      continue
    }

    if (character !== '{' && character !== ',') continue

    let keyStart = index + 1
    while (/\s/.test(text[keyStart] ?? '')) keyStart += 1
    const keyMatch = /^[A-Za-z_$][\w$-]*\s*:/.exec(text.slice(keyStart))
    if (keyMatch) return keyStart
  }

  return -1
}

function getParserIndex(message: string, text: string): number {
  const positionMatch = /position\s+(\d+)/i.exec(message)
  if (positionMatch) return clampIndex(Number(positionMatch[1]), text)

  const lineColumnMatch = /line\s+(\d+)\s+column\s+(\d+)/i.exec(message)
  if (lineColumnMatch) {
    const targetLine = Number(lineColumnMatch[1])
    const targetColumn = Number(lineColumnMatch[2])
    return getIndexForLineColumn(text, targetLine, targetColumn)
  }

  return text.length
}

function getParserCategory(text: string, index: number): JsonErrorCategory {
  const errorCharacter = text[index]
  const previousIndex = findPreviousNonWhitespaceIndex(text, index - 1)
  const previousCharacter = previousIndex === -1 ? '' : text[previousIndex]

  if (errorCharacter === '"' && ['"', '}', ']', 'e', 'l', 'r', 'e', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(previousCharacter)) {
    return 'missing_comma'
  }

  if (errorCharacter === '}' || errorCharacter === ']' || index === text.length) {
    return 'bracket_mismatch'
  }

  return 'unknown_parse_error'
}

function createInvalidDiagnostic(
  text: string,
  error: KnownError,
  parserMessage: string,
): Extract<JsonDiagnostic, { status: 'invalid' }> {
  const index = clampIndex(error.index, text)
  const copy = errorCopy[error.category]
  const { line, column } = getLineColumn(text, index)

  return {
    status: 'invalid',
    category: error.category,
    index,
    line,
    column,
    title: copy.title,
    explanation: copy.explanation,
    suggestion: copy.suggestion,
    context: getContextLine(text, index),
    parserMessage,
  }
}

function getRootType(value: unknown): Extract<JsonDiagnostic, { status: 'valid' }>['rootType'] {
  if (value === null) return 'Null'
  if (Array.isArray(value)) return 'Array'

  switch (typeof value) {
    case 'object':
      return 'Object'
    case 'string':
      return 'String'
    case 'number':
      return 'Number'
    case 'boolean':
      return 'Boolean'
    default:
      return 'String'
  }
}

function getItemCount(value: unknown): number | null {
  if (Array.isArray(value)) return value.length
  if (value !== null && typeof value === 'object') return Object.keys(value).length
  return null
}

function getLineColumn(text: string, index: number): { line: number; column: number } {
  const start = clampIndex(index, text)
  let line = 1
  let column = 1

  for (let position = 0; position < start; position += 1) {
    if (text[position] === '\n') {
      line += 1
      column = 1
    } else {
      column += 1
    }
  }

  return { line, column }
}

function getIndexForLineColumn(text: string, line: number, column: number): number {
  let currentLine = 1
  let currentColumn = 1

  for (let index = 0; index < text.length; index += 1) {
    if (currentLine === line && currentColumn === column) return index
    if (text[index] === '\n') {
      currentLine += 1
      currentColumn = 1
    } else {
      currentColumn += 1
    }
  }

  return text.length
}

function getContextLine(text: string, index: number): string {
  const safeIndex = clampIndex(index, text)
  const lineStart = text.lastIndexOf('\n', Math.max(0, safeIndex - 1)) + 1
  const lineEnd = text.indexOf('\n', safeIndex)
  const rawLine = text.slice(lineStart, lineEnd === -1 ? text.length : lineEnd)

  return rawLine.length > 140 ? `${rawLine.slice(0, 137)}...` : rawLine
}

function findPreviousNonWhitespaceIndex(text: string, startingIndex: number): number {
  for (let index = startingIndex; index >= 0; index -= 1) {
    if (!/\s/.test(text[index])) return index
  }

  return -1
}

function clampIndex(index: number, text: string): number {
  return Math.max(0, Math.min(Number.isFinite(index) ? index : text.length, text.length))
}
