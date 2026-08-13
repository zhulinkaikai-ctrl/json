import { readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const docsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../docs')

function collectMarkdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      return collectMarkdownFiles(filePath)
    }

    return entry.isFile() && entry.name.endsWith('.md') ? [filePath] : []
  })
}

function toRelativePath(filePath) {
  return path.relative(docsRoot, filePath).split(path.sep).join('/')
}

const markdownFiles = collectMarkdownFiles(docsRoot).map(toRelativePath)
const englishFiles = markdownFiles.filter((filePath) => !filePath.endsWith('.zh-CN.md'))
const chineseFiles = new Set(markdownFiles.filter((filePath) => filePath.endsWith('.zh-CN.md')))

describe('documentation language parity', () => {
  it('keeps a Chinese companion for every English Markdown document', () => {
    for (const englishFile of englishFiles) {
      expect(chineseFiles.has(`${englishFile.slice(0, -3)}.zh-CN.md`), englishFile).toBe(true)
    }
  })

  it('does not leave Chinese documents without an English source', () => {
    for (const chineseFile of chineseFiles) {
      const englishFile = chineseFile.replace(/\.zh-CN\.md$/, '.md')
      expect(englishFiles, chineseFile).toContain(englishFile)
    }
  })

  it('keeps all documentation files inside the docs directory', () => {
    expect(englishFiles.length).toBeGreaterThanOrEqual(10)
    expect(chineseFiles.size).toBe(englishFiles.length)
    expect(markdownFiles.every((filePath) => statSync(path.join(docsRoot, filePath)).isFile())).toBe(true)
  })
})
