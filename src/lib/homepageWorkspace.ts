import {
  diagnoseJson,
  formatJson,
  minifyJson,
  type JsonDiagnostic,
} from './jsonDiagnostics'

export type HomepageAction = 'format' | 'validate' | 'minify'

export type HomepageActionFeedback = {
  message: string
  tone: 'success' | 'error'
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

export function runHomepageAction(input: string, action: HomepageAction): HomepageOutput {
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
    value: action === 'format' ? formatJson(input) : minifyJson(input),
    sourceInput: input,
  }
}

export function getHomepageOutputText(output: HomepageOutput): string | null {
  return output.kind === 'text' ? output.value : null
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
