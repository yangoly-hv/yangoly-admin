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
  const localRequire = (specifier) => {
    if (specifier === './tailImageCrop') return loadTsModule('./tailImageCrop.ts')
    return require(specifier)
  }

  run(localRequire, module, module.exports)

  return module.exports
}

test('creates a 13:10 crop for a report image', () => {
  const {createReportImageCrop, validateReportImageCrop} = loadTsModule('./reportImageCrop.ts')
  const {getCropAspect} = loadTsModule('./tailImageCrop.ts')

  const result = createReportImageCrop({
    asset: {_ref: 'image-wide-2400x1200-jpg'},
    hotspot: {x: 0.35, y: 0.5},
  })

  assert.ok(result)
  assert.equal(getCropAspect({asset: {_ref: 'image-wide-2400x1200-jpg'}, crop: result.crop}), 1.3)
  assert.equal(validateReportImageCrop({
    asset: {_ref: 'image-wide-2400x1200-jpg'},
    crop: result.crop,
    hotspot: result.hotspot,
  }), true)
})

test('rejects a report image without crop and hotspot data', () => {
  const {validateReportImageCrop} = loadTsModule('./reportImageCrop.ts')

  const result = validateReportImageCrop({
    asset: {_ref: 'image-without-crop-1300x1000-jpg'},
  })

  assert.equal(typeof result, 'string')
})
