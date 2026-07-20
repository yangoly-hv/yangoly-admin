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

test('creates a 705:580 crop for a collection image', () => {
  const {createCollectionImageCrop, validateCollectionImageCrop} = loadTsModule('./collectionImageCrop.ts')
  const {getCropAspect} = loadTsModule('./tailImageCrop.ts')

  const result = createCollectionImageCrop({
    asset: {_ref: 'image-wide-2400x1200-jpg'},
    hotspot: {x: 0.35, y: 0.5},
  })

  assert.ok(result)
  assert.equal(getCropAspect({asset: {_ref: 'image-wide-2400x1200-jpg'}, crop: result.crop}), 1.216)
  assert.equal(
    validateCollectionImageCrop({
      asset: {_ref: 'image-wide-2400x1200-jpg'},
      crop: result.crop,
      hotspot: result.hotspot,
    }),
    true,
  )
})

test('accepts an already valid 705:580 collection image crop', () => {
  const {validateCollectionImageCrop} = loadTsModule('./collectionImageCrop.ts')

  const result = validateCollectionImageCrop({
    asset: {_ref: 'image-collection-1410x1160-jpg'},
    crop: {left: 0, right: 0, top: 0, bottom: 0},
    hotspot: {x: 0.5, y: 0.5, width: 1, height: 1},
  })

  assert.equal(result, true)
})

test('rejects a collection image without crop and hotspot data', () => {
  const {validateCollectionImageCrop} = loadTsModule('./collectionImageCrop.ts')

  const result = validateCollectionImageCrop({
    asset: {_ref: 'image-without-crop-1410x1160-jpg'},
  })

  assert.equal(typeof result, 'string')
})
