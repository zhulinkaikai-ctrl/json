export type ToolPageContext = {
  eyebrow: string
  heading: string
  lead: string
  editorLabel: string
  actionHint: string
}

const homeContext: ToolPageContext = {
  eyebrow: 'Privacy-first JSON workspace',
  heading: 'JSON formatter, validator, and error finder',
  lead: 'Format, validate, minify, and repair strict JSON without sending it anywhere.',
  editorLabel: 'JSON input',
  actionHint: 'Validate as you type.',
}

const toolPageContexts: Record<string, ToolPageContext> = {
  '/json-formatter/': {
    eyebrow: 'Browser-local JSON formatter',
    heading: 'JSON formatter',
    lead: 'Format valid JSON into a readable structure without uploading it.',
    editorLabel: 'JSON to format',
    actionHint: 'Validate first, then format.',
  },
  '/json-validator/': {
    eyebrow: 'Strict JSON validator',
    heading: 'JSON validator',
    lead: 'Check strict JSON syntax and see a clear explanation when it breaks.',
    editorLabel: 'JSON to validate',
    actionHint: 'Checking syntax as you type.',
  },
  '/json-minifier/': {
    eyebrow: 'Browser-local JSON minifier',
    heading: 'JSON minifier',
    lead: 'Compact valid JSON without changing its data or uploading it.',
    editorLabel: 'JSON to minify',
    actionHint: 'Validate first, then minify.',
  },
  '/json-beautifier/': {
    eyebrow: 'Browser-local JSON beautifier',
    heading: 'JSON beautifier',
    lead: 'Turn valid JSON into a clean, readable layout for review and debugging.',
    editorLabel: 'JSON to beautify',
    actionHint: 'Validate first, then beautify.',
  },
  '/json-pretty-print/': {
    eyebrow: 'Browser-local JSON pretty printer',
    heading: 'JSON pretty print',
    lead: 'Expand compact JSON into a structured, readable document locally.',
    editorLabel: 'JSON to pretty print',
    actionHint: 'Validate first, then pretty print.',
  },
  '/json-error-finder/': {
    eyebrow: 'Strict JSON diagnostics',
    heading: 'JSON error finder',
    lead: 'Find the first syntax error, understand it, and repair the JSON yourself.',
    editorLabel: 'JSON to diagnose',
    actionHint: 'Checking for syntax errors.',
  },
  '/fix-invalid-json/': {
    eyebrow: 'Strict JSON diagnostics',
    heading: 'Fix invalid JSON',
    lead: 'Locate the first parsing problem and make the smallest correct repair.',
    editorLabel: 'Invalid JSON to fix',
    actionHint: 'Checking for syntax errors.',
  },
  '/json-viewer/': {
    eyebrow: 'Browser-local JSON viewer',
    heading: 'JSON viewer',
    lead: 'Validate and format JSON into a readable local workspace.',
    editorLabel: 'JSON to view',
    actionHint: 'Validate first, then format for review.',
  },
}

const workspaceRoutes = new Set(['/', ...Object.keys(toolPageContexts)])

export function getToolPageContext(pathname: string): ToolPageContext {
  const normalizedPath = normalizePathname(pathname)
  return toolPageContexts[normalizedPath] ?? homeContext
}

export function isWorkspaceRoute(pathname: string): boolean {
  return workspaceRoutes.has(normalizePathname(pathname))
}

function normalizePathname(pathname: string): string {
  if (pathname === '/') return pathname
  return pathname.endsWith('/') ? pathname : `${pathname}/`
}
