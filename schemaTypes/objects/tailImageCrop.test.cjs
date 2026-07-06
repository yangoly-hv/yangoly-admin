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

test('creates a 1.2:1 crop for a portrait Sanity image around the hotspot', () => {
  const {createFixedAspectCrop, getCropAspect} = loadTsModule('./tailImageCrop.ts')

  const result = createFixedAspectCrop({
    asset: {_ref: 'image-tail09151d35-1392x2560-jpg'},
    hotspot: {x: 0.520527908661697, y: 0.5616622784867373},
  })

  assert.ok(result)
  assert.equal(getCropAspect({asset: {_ref: 'image-tail09151d35-1392x2560-jpg'}, crop: result.crop}), 1.2)
  assert.equal(result.crop.left, 0)
  assert.equal(result.crop.right, 0)
  assert.ok(result.crop.top > 0)
  assert.ok(result.crop.bottom > 0)
})

test('keeps an already valid 1.2:1 crop valid', () => {
  const {getCropAspect, validateTailImageCrop} = loadTsModule('./tailImageCrop.ts')

  const value = {
    asset: {_ref: 'image-wide-1200x1000-jpg'},
    crop: {left: 0, right: 0, top: 0, bottom: 0},
  }

  assert.equal(getCropAspect(value), 1.2)
  assert.equal(validateTailImageCrop(value), true)
})

test('rejects a crop with the wrong aspect ratio', () => {
  const {validateTailImageCrop} = loadTsModule('./tailImageCrop.ts')

  const result = validateTailImageCrop({
    asset: {_ref: 'image-square-1000x1000-jpg'},
    crop: {left: 0, right: 0, top: 0, bottom: 0},
  })

  assert.equal(typeof result, 'string')
})
