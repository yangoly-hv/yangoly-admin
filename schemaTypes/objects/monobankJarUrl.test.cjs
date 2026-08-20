const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')
const ts = require('typescript')

function loadTsModule(relativePath) {
  const filename = path.join(__dirname, relativePath)
  const source = fs.readFileSync(filename, 'utf8')
  const {outputText} = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2017,
    },
    fileName: filename,
  })

  const module = {exports: {}}
  const run = new Function('require', 'module', 'exports', outputText)
  run(require, module, module.exports)
  return module.exports
}

const {parseMonobankJarUrl} = loadTsModule('./monobankJarUrl.ts')

test('normalizes public share links to https', () => {
  assert.equal(
    parseMonobankJarUrl('http://send.monobank.ua/jar/9sNTEdMP79'),
    'https://send.monobank.ua/jar/9sNTEdMP79',
  )
  assert.equal(
    parseMonobankJarUrl('https://www.send.monobank.ua/jar/9sNTEdMP79/'),
    'https://send.monobank.ua/jar/9sNTEdMP79',
  )
})

test('accepts a bare sendId', () => {
  assert.equal(parseMonobankJarUrl('9sNTEdMP79'), 'https://send.monobank.ua/jar/9sNTEdMP79')
})

test('rejects widget URLs and longJarId', () => {
  assert.equal(parseMonobankJarUrl(''), null)
  assert.equal(
    parseMonobankJarUrl(
      'https://send.monobank.ua/widget/builder.html?longJarId=4Spjosp6Hv79FHD52mw49Hjb4ydFJ8z6',
    ),
    null,
  )
  assert.equal(parseMonobankJarUrl('4Spjosp6Hv79FHD52mw49Hjb4ydFJ8z6'), null)
})
