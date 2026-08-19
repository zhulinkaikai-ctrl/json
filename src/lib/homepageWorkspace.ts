import {
  diagnoseJson,
  minifyJson,
  type JsonDiagnostic,
} from './jsonDiagnostics'

export type HomepageAction = 'format' | 'validate' | 'minify'
export type HomepageIndentSize = 2 | 4 | 'tab'

export type HomepageActionOptions = {
  indentSize?: HomepageIndentSize
}

export type HomepageActionFeedback = {
  message: string
  tone: 'success' | 'error'
}

export type HomepageTreeNode = {
  key: string
  typeLabel: string
  value?: string
  children?: HomepageTreeNode[]
}

export type HomepageOutput =
  | {
      kind: 'empty'
    }
  | {
      kind: 'text'
      action: Exclude<HomepageAction, 'validate'>
      value: string
      sourceInput: string
    }
  | {
      kind: 'validation'
      diagnostic: Extract<JsonDiagnostic, { status: 'valid' }>
      sourceInput: string
    }
  | {
      kind: 'diagnostic'
      action: HomepageAction
      diagnostic: Extract<JsonDiagnostic, { status: 'invalid' }>
      sourceInput: string
    }

export const EMPTY_HOMEPAGE_OUTPUT: HomepageOutput = { kind: 'empty' }

export function runHomepageAction(
  input: string,
  action: HomepageAction,
  options: HomepageActionOptions = {},
): HomepageOutput {
  const diagnostic = diagnoseJson(input)

  if (diagnostic.status === 'invalid') {
    return {
      kind: 'diagnostic',
      action,
      diagnostic,
      sourceInput: input,
    }
  }

  if (action === 'validate') {
    return {
      kind: 'validation',
      diagnostic,
      sourceInput: input,
    }
  }

  return {
    kind: 'text',
    action,
    value: action === 'format' ? formatJsonWithIndent(input, options.indentSize ?? 2) : minifyJson(input),
    sourceInput: input,
  }
}

export function getHomepageOutputText(output: HomepageOutput): string | null {
  return output.kind === 'text' ? output.value : null
}

export function getHomepageTreeData(output: HomepageOutput): HomepageTreeNode | null {
  if (output.kind !== 'text' && output.kind !== 'validation') return null

  const sourceText = output.kind === 'text' ? output.value : output.sourceInput
  const parsedValue = JSON.parse(sourceText) as unknown

  return createTreeNode('root', parsedValue)
}

export function getHomepageActionFeedback(output: HomepageOutput): HomepageActionFeedback {
  if (output.kind === 'diagnostic') {
    return {
      message: 'JSON has a syntax error.',
      tone: 'error',
    }
  }

  if (output.kind === 'validation') {
    return {
      message: 'Validation result updated.',
      tone: 'success',
    }
  }

  if (output.kind === 'text') {
    return {
      message: output.action === 'format' ? 'Format applied to output.' : 'Minified output updated.',
      tone: 'success',
    }
  }

  return {
    message: 'Paste JSON to begin.',
    tone: 'error',
  }
}

export function isHomepageOutputStale(input: string, output: HomepageOutput): boolean {
  if (output.kind === 'empty') return false
  if (output.kind === 'text' && input === output.value) return false

  return input !== output.sourceInput
}

export function getHomepageActionLabel(action: HomepageAction): string {
  if (action === 'format') return 'Format'
  if (action === 'minify') return 'Minify'
  return 'Validate'
}

function formatJsonWithIndent(input: string, indentSize: HomepageIndentSize): string {
  const space = indentSize === 'tab' ? '\t' : indentSize

  return JSON.stringify(JSON.parse(input), null, space)
}

function createTreeNode(key: string, value: unknown): HomepageTreeNode {
  if (Array.isArray(value)) {
    return {
      key,
      typeLabel: `Array (${value.length})`,
      children: value.map((item, index) => createTreeNode(`[${index}]`, item)),
    }
  }

  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value)

    return {
      key,
      typeLabel: 'Object',
      children: entries.map(([childKey, childValue]) => createTreeNode(childKey, childValue)),
    }
  }

  return {
    key,
    typeLabel: getTreeValueType(value),
    value: formatTreeLeafValue(value),
  }
}

function getTreeValueType(value: unknown): string {
  if (value === null) return 'Null'
  if (typeof value === 'string') return 'String'
  if (typeof value === 'number') return 'Number'
  if (typeof value === 'boolean') return 'Boolean'

  return 'Value'
}

function formatTreeLeafValue(value: unknown): string {
  if (typeof value === 'string') return JSON.stringify(value)
  if (value === null) return 'null'

  return String(value)
}
