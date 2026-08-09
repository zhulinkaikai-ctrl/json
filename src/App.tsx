import Editor, { type Monaco } from '@monaco-editor/react'
import {
  BookOpen,
  Braces,
  Check,
  Copy,
  FileCode2,
  FileInput,
  FileWarning,
  Info,
  Minimize2,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  Wand2,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import {
  diagnoseJson,
  formatJson,
  isWithinSizeLimit,
  MAX_JSON_BYTES,
  minifyJson,
  type JsonDiagnostic,
} from './lib/jsonDiagnostics'
import { getToolPageContext } from './lib/toolPageContext'

const INITIAL_SAMPLE = `{
  "service": "JSON Error Finder",
  "version": 1,
  "privacy": {
    "localOnly": true,
    "storesInput": false
  },
  "features": ["format", "minify", "diagnose"]
}`

type ToolState = 'empty' | 'editing' | 'valid' | 'invalid' | 'oversize' | 'file-error'
type Toast = { message: string; tone: 'success' | 'error' } | null
type ToastTone = Exclude<Toast, null>['tone']

const byteFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })

const guideLinks = [
  { href: '/guides/trailing-comma-in-json/', label: 'Trailing comma' },
  { href: '/guides/unexpected-token-in-json/', label: 'Unexpected token' },
  { href: '/guides/single-quotes-in-json/', label: 'Single quotes' },
  { href: '/guides/unquoted-property-name-in-json/', label: 'Unquoted property name' },
  { href: '/guides/unclosed-string-in-json/', label: 'Unclosed string' },
  { href: '/guides/comments-in-json/', label: 'Comments in JSON' },
]

const toolLinks = [
  { href: '/json-formatter/', label: 'Formatter', description: 'Indent valid JSON for review.', icon: Wand2 },
  { href: '/json-validator/', label: 'Validator', description: 'Check strict JSON syntax.', icon: Check },
  { href: '/json-minifier/', label: 'Minifier', description: 'Compact valid JSON safely.', icon: Minimize2 },
  { href: '/json-error-finder/', label: 'Error finder', description: 'Locate the first syntax issue.', icon: FileWarning },
  { href: '/json-beautifier/', label: 'Beautifier', description: 'Make nested JSON readable.', icon: Sparkles },
  { href: '/json-pretty-print/', label: 'Pretty print', description: 'Expand compact JSON locally.', icon: Braces },
  { href: '/fix-invalid-json/', label: 'Fix invalid JSON', description: 'Understand the parser error.', icon: Info },
  { href: '/json-viewer/', label: 'Viewer', description: 'Inspect formatted JSON structure.', icon: BookOpen },
]

function App() {
  const pageContext = getToolPageContext(window.location.pathname)
  const [value, setValue] = useState('')
  const [toolState, setToolState] = useState<ToolState>('empty')
  const [diagnostic, setDiagnostic] = useState<JsonDiagnostic | null>(null)
  const [toast, setToast] = useState<Toast>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const [editorReady, setEditorReady] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const monacoRef = useRef<Monaco | null>(null)
  const actionTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (!value) {
      setDiagnostic(null)
      setToolState('empty')
      return undefined
    }

    if (!isWithinSizeLimit(value)) {
      setDiagnostic(null)
      setToolState('oversize')
      return undefined
    }

    setToolState('editing')
    const timeoutId = window.setTimeout(() => {
      const result = diagnoseJson(value)
      setDiagnostic(result)
      setToolState(result.status)
    }, 260)

    return () => window.clearTimeout(timeoutId)
  }, [value])

  useEffect(() => {
    if (!editorReady || !monacoRef.current) return
    const monaco = monacoRef.current

    if (diagnostic?.status === 'invalid') {
      monaco.editor.setModelMarkers(monaco.editor.getModels()[0], 'json-error-finder', [
        {
          severity: monaco.MarkerSeverity.Error,
          message: diagnostic.title,
          startLineNumber: diagnostic.line,
          startColumn: diagnostic.column,
          endLineNumber: diagnostic.line,
          endColumn: diagnostic.column + 1,
        },
      ])
      return
    }

    const model = monaco.editor.getModels()[0]
    if (model) monaco.editor.setModelMarkers(model, 'json-error-finder', [])
  }, [diagnostic, editorReady])

  useEffect(() => () => {
    if (actionTimeoutRef.current) window.clearTimeout(actionTimeoutRef.current)
  }, [])

  const isValid = toolState === 'valid'
  const hasValue = value.length > 0
  const characterCount = value.length.toLocaleString('en-US')
  const byteSize = new TextEncoder().encode(value).byteLength

  const showToast = useCallback((message: string, tone: ToastTone) => {
    setToast({ message, tone })
    if (actionTimeoutRef.current) window.clearTimeout(actionTimeoutRef.current)
    actionTimeoutRef.current = window.setTimeout(() => setToast(null), 2200)
  }, [])

  const handleFormat = useCallback(() => {
    if (!isValid) return
    setValue(formatJson(value))
    showToast('JSON formatted.', 'success')
  }, [isValid, showToast, value])

  const handleMinify = useCallback(() => {
    if (!isValid) return
    setValue(minifyJson(value))
    showToast('JSON minified.', 'success')
  }, [isValid, showToast, value])

  const handleCopy = useCallback(async () => {
    if (!hasValue) return
    try {
      await navigator.clipboard.writeText(value)
      showToast('Copied to clipboard.', 'success')
    } catch {
      showToast('Couldn\'t copy automatically. Select the content and try again.', 'error')
    }
  }, [hasValue, showToast, value])

  const loadValue = useCallback((nextValue: string, message?: string) => {
    setFileError(null)
    setValue(nextValue)
    if (message) showToast(message, 'success')
  }, [showToast])

  const handleFile = useCallback(async (file?: File) => {
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.json')) {
      setFileError('Choose a text-based .json file under 10 MB.')
      setToolState('file-error')
      return
    }

    if (file.size > MAX_JSON_BYTES) {
      setFileError(null)
      setToolState('oversize')
      return
    }

    try {
      const content = await file.text()
      if (!content) {
        setFileError('Choose a JSON file that contains text.')
        setToolState('file-error')
        return
      }

      loadValue(content)
    } catch {
      setFileError('Choose a text-based .json file under 10 MB.')
      setToolState('file-error')
    }
  }, [loadValue])

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    void handleFile(event.dataTransfer.files.item(0) ?? undefined)
  }, [handleFile])

  const handleEditorMount = useCallback((_: unknown, monaco: Monaco) => {
    monacoRef.current = monaco
    setEditorReady(true)
  }, [])

  return (
    <main className="app-shell">
      <section className="workspace" aria-label={pageContext.heading}>
        <header className="topbar">
          <a className="brand" href="/" aria-label="JSONFmt home">
            <span className="brand-mark"><Braces size={21} strokeWidth={2.25} /></span>
            <span>JSONFmt</span>
          </a>

          <nav className="site-nav" aria-label="Primary navigation">
            <a href="/json-formatter/">Formatter</a>
            <a href="/json-validator/">Validator</a>
            <a href="/json-minifier/">Minifier</a>
            <a href="/json-error-finder/">Error Finder</a>
            <a href="/tools/">Tools</a>
            <a href="/guides/">Guides</a>
          </nav>

          <div className="privacy-note">
            <ShieldCheck size={16} />
            <span>Runs locally in your browser</span>
          </div>
        </header>

        <div className="intro" id="top">
          <div>
            <p className="eyebrow">{pageContext.eyebrow}</p>
            <h1>{pageContext.heading}</h1>
            <p className="lead">{pageContext.lead}</p>
            <p className="tool-context">{pageContext.actionHint}</p>
          </div>
          <div className="input-stats" aria-label="Input statistics">
            <span>{hasValue ? characterCount : '0'} chars</span>
            <span>{formatBytes(byteSize)} / 10 MB</span>
          </div>
        </div>

        <div className="tool-layout">
          <section className="editor-panel" aria-label="JSON editor">
            <div className="panel-toolbar">
              <div className="editor-label">
                <span className={`state-dot ${toolState}`} aria-hidden="true" />
                <span>{pageContext.editorLabel}</span>
                {toolState === 'editing' && <span className="checking">Checking...</span>}
              </div>
              <div className="toolbar-actions">
                <IconButton label="Format JSON" disabled={!isValid} onClick={handleFormat}>
                  <Wand2 size={16} />
                </IconButton>
                <IconButton label="Minify JSON" disabled={!isValid} onClick={handleMinify}>
                  <Minimize2 size={16} />
                </IconButton>
                <IconButton label="Copy JSON" disabled={!hasValue} onClick={() => void handleCopy()}>
                  <Copy size={16} />
                </IconButton>
                <span className="toolbar-divider" />
                <IconButton label="Load valid sample" onClick={() => loadValue(INITIAL_SAMPLE, 'Sample JSON loaded.')}>
                  <Sparkles size={16} />
                </IconButton>
                <IconButton label="Import a local JSON file" onClick={() => fileInputRef.current?.click()}>
                  <Upload size={16} />
                </IconButton>
                <IconButton label="Clear editor" disabled={!hasValue} onClick={() => loadValue('', 'JSON cleared.')}>
                  <Trash2 size={16} />
                </IconButton>
                <input
                  ref={fileInputRef}
                  className="visually-hidden"
                  type="file"
                  accept="application/json,.json"
                  onChange={(event) => {
                    void handleFile(event.target.files?.[0])
                    event.currentTarget.value = ''
                  }}
                />
              </div>
            </div>

            <div
              className={`editor-dropzone ${isDragging ? 'is-dragging' : ''}`}
              onDragEnter={(event) => { event.preventDefault(); setIsDragging(true) }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              {isDragging && (
                <div className="drop-overlay">
                  <FileInput size={30} />
                  <span>Drop your JSON file to open it</span>
                </div>
              )}
              <Editor
                height="100%"
                defaultLanguage="json"
                value={value}
                theme="json-finder-dark"
                onMount={handleEditorMount}
                onChange={(nextValue) => {
                  setFileError(null)
                  setValue(nextValue ?? '')
                }}
                beforeMount={(monaco) => {
                  monaco.editor.defineTheme('json-finder-dark', {
                    base: 'vs-dark',
                    inherit: true,
                    rules: [
                      { token: 'string.key.json', foreground: '80d7c2' },
                      { token: 'string.value.json', foreground: 'd5ca8a' },
                      { token: 'number', foreground: 'e7a879' },
                      { token: 'delimiter.bracket.json', foreground: 'cbd3c5' },
                    ],
                    colors: {
                      'editor.background': '#101713',
                      'editorGutter.background': '#101713',
                      'editorLineNumber.foreground': '#57665d',
                      'editorLineNumber.activeForeground': '#c5d0c8',
                      'editorCursor.foreground': '#ffb55f',
                      'editor.selectionBackground': '#284238',
                      'editor.lineHighlightBackground': '#17211c',
                      'editorError.foreground': '#ff7777',
                      'editorError.border': '#00000000',
                    },
                  })
                }}
                options={{
                  automaticLayout: true,
                  fontFamily: "'IBM Plex Mono', 'Cascadia Code', monospace",
                  fontSize: 14,
                  lineHeight: 22,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  padding: { top: 18, bottom: 18 },
                  glyphMargin: true,
                  lineNumbersMinChars: 3,
                  renderLineHighlight: 'line',
                  placeholder: 'Paste or type JSON here...',
                }}
              />
            </div>
            <div className="editor-footer">
              <span>Paste JSON, import a file, or drag a .json file into the editor.</span>
              <span>Strict JSON only</span>
            </div>
          </section>

          <aside className="diagnostic-panel" aria-live="polite">
            <DiagnosticContent
              state={toolState}
              diagnostic={diagnostic}
              fileError={fileError}
              onLoadSample={() => loadValue(INITIAL_SAMPLE, 'Sample JSON loaded.')}
            />
          </aside>
        </div>

        <section className="privacy-band" aria-label="Privacy notice">
          <ShieldCheck size={18} />
          <div>
            <strong>Your JSON stays in your browser.</strong>
            <span>It is parsed locally and is never uploaded, saved, or shared.</span>
          </div>
        </section>

        <section className="tool-entry-band" aria-labelledby="tools-title">
          <div>
            <p className="eyebrow">JSON tools</p>
            <h2 id="tools-title">Choose the exact task.</h2>
          </div>
          <div className="tool-entry-grid">
            {toolLinks.map((tool) => {
              const Icon = tool.icon

              return (
                <a className="tool-entry-link" href={tool.href} key={tool.href}>
                  <Icon size={16} />
                  <span>
                    <strong>{tool.label}</strong>
                    <small>{tool.description}</small>
                  </span>
                </a>
              )
            })}
          </div>
        </section>

        <section className="guides-band" aria-labelledby="guides-title">
          <div>
            <p className="eyebrow">JSON error guides</p>
            <h2 id="guides-title">Fix the syntax issue, then validate here.</h2>
          </div>
          <div className="guide-links">
            {guideLinks.map((guide) => (
              <a href={guide.href} key={guide.href}>
                <BookOpen size={15} />
                <span>{guide.label}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="faq" aria-labelledby="faq-title">
          <div>
            <p className="eyebrow">Quick answers</p>
            <h2 id="faq-title">Built for the moment JSON breaks.</h2>
          </div>
          <div className="faq-grid">
            <article>
              <h3>Is my JSON uploaded?</h3>
              <p>No. This tool processes JSON locally in your browser.</p>
            </article>
            <article>
              <h3>Why is JSON invalid?</h3>
              <p>Missing commas, single quotes, unclosed strings, and unmatched brackets are common causes.</p>
            </article>
            <article>
              <h3>Does it support JSON5?</h3>
              <p>No. JSON Error Finder validates strict standard JSON only.</p>
            </article>
          </div>
        </section>

        <footer className="site-footer">
          <span>JSONFmt is maintained by the JSON Formatter team.</span>
          <nav aria-label="Footer navigation">
            <a href="/tools/">All tools</a>
            <a href="/json-formatter/">Formatter</a>
            <a href="/json-validator/">Validator</a>
            <a href="/json-minifier/">Minifier</a>
            <a href="/guides/">Guides</a>
            <a href="/privacy/">Privacy Policy</a>
            <a href="/terms/">Terms of Use</a>
            <a href="/contact/">Contact</a>
          </nav>
        </footer>
      </section>

      {toast && (
        <div className={`toast ${toast.tone}`} role="status">
          {toast.tone === 'success' ? <Check size={17} /> : <X size={17} />}
          {toast.message}
        </div>
      )}
    </main>
  )
}

function IconButton({
  label,
  children,
  disabled = false,
  onClick,
}: {
  label: string
  children: React.ReactNode
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button className="icon-button" type="button" aria-label={label} title={label} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}

function DiagnosticContent({
  state,
  diagnostic,
  fileError,
  onLoadSample,
}: {
  state: ToolState
  diagnostic: JsonDiagnostic | null
  fileError: string | null
  onLoadSample: () => void
}) {
  if (state === 'empty') {
    return (
      <div className="diagnostic-empty">
        <div className="diagnostic-icon quiet"><Braces size={26} /></div>
        <p className="panel-kicker">Ready to validate</p>
        <h2>Paste JSON to begin.</h2>
        <p>We will point out syntax errors as you type.</p>
        <button className="sample-button" type="button" onClick={onLoadSample}>
          <Sparkles size={16} /> Load a sample
        </button>
      </div>
    )
  }

  if (state === 'editing') {
    return (
      <div className="diagnostic-empty checking-state">
        <div className="diagnostic-icon working"><RotateCcw size={25} /></div>
        <p className="panel-kicker">Checking JSON</p>
        <h2>Looking for syntax errors...</h2>
        <p>Validation happens locally after you pause typing.</p>
      </div>
    )
  }

  if (state === 'oversize') {
    return (
      <div className="diagnostic-result oversize-result">
        <div className="diagnostic-icon warning"><FileWarning size={25} /></div>
        <p className="panel-kicker">File limit</p>
        <h2>This JSON is larger than 10 MB.</h2>
        <p>To keep the editor responsive, this tool only processes JSON up to 10 MB.</p>
      </div>
    )
  }

  if (state === 'file-error') {
    return (
      <div className="diagnostic-result oversize-result">
        <div className="diagnostic-icon warning"><FileCode2 size={25} /></div>
        <p className="panel-kicker">Import issue</p>
        <h2>Couldn't read this file.</h2>
        <p>{fileError ?? 'Choose a text-based .json file under 10 MB.'}</p>
      </div>
    )
  }

  if (diagnostic?.status === 'valid') {
    const summary = diagnostic.itemCount === null
      ? diagnostic.rootType
      : diagnostic.rootType === 'Array'
        ? `${diagnostic.rootType} - ${diagnostic.itemCount.toLocaleString('en-US')} ${diagnostic.itemCount === 1 ? 'item' : 'items'}`
        : `${diagnostic.rootType} - ${diagnostic.itemCount.toLocaleString('en-US')} ${diagnostic.itemCount === 1 ? 'key' : 'keys'}`

    return (
      <div className="diagnostic-result valid-result">
        <div className="result-heading">
          <div className="diagnostic-icon valid"><Check size={25} /></div>
          <div>
            <p className="panel-kicker">Validation complete</p>
            <h2>Valid JSON</h2>
          </div>
        </div>
        <p>This JSON is valid and ready to format or minify.</p>
        <div className="valid-summary">
          <span>{summary}</span>
          <span>{diagnostic.characterCount.toLocaleString('en-US')} characters</span>
        </div>
      </div>
    )
  }

  if (diagnostic?.status === 'invalid') {
    return (
      <div className="diagnostic-result invalid-result">
        <div className="result-heading">
          <div className="diagnostic-icon invalid"><X size={25} /></div>
          <div>
            <p className="panel-kicker">Syntax error</p>
            <h2>Invalid JSON</h2>
          </div>
        </div>
        <div className="location-pill"><Info size={15} /> Line {diagnostic.line}, Column {diagnostic.column}</div>
        <div className="diagnostic-block">
          <span>What happened</span>
          <strong>{diagnostic.title}</strong>
          <p>{diagnostic.explanation}</p>
        </div>
        <div className="diagnostic-block suggestion-block">
          <span>How to fix it</span>
          <p>{diagnostic.suggestion}</p>
        </div>
        <div className="context-block">
          <span>Near this location</span>
          <code>{diagnostic.context || 'End of input'}</code>
        </div>
      </div>
    )
  }

  return null
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${byteFormatter.format(bytes / 1024)} KB`
  return `${byteFormatter.format(bytes / (1024 * 1024))} MB`
}

export default App
