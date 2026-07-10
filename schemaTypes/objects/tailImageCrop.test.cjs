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
    asset: {_ref: 'image-landscape-1200x1000-jpg'},
    crop: {left: 0, right: 0, top: 0, bottom: 0},
    hotspot: {x: 0.5, y: 0.5, width: 1, height: 1},
  }

  assert.equal(getCropAspect(value), 1.2)
  assert.equal(validateTailImageCrop(value), true)
})

test('rejects a portrait crop with the wrong aspect ratio', () => {
  const {validateTailImageCrop} = loadTsModule('./tailImageCrop.ts')

  const result = validateTailImageCrop({
    asset: {_ref: 'image-portrait-1000x1200-jpg'},
    crop: {left: 0, right: 0, top: 0, bottom: 0},
  })

  assert.equal(typeof result, 'string')
})

test('rejects an image without crop and hotspot data', () => {
  const {validateTailImageCrop} = loadTsModule('./tailImageCrop.ts')

  const result = validateTailImageCrop({
    asset: {_ref: 'image-landscape-1200x1000-jpg'},
  })

  assert.equal(typeof result, 'string')
})

test('uses zoom and focus to create a smaller fixed-ratio frame', () => {
  const {createFixedAspectCrop, getCropAspect} = loadTsModule('./tailImageCrop.ts')

  const result = createFixedAspectCrop(
    {
      asset: {_ref: 'image-wide-2560x1392-jpg'},
    },
    undefined,
    {focusX: 0.4, focusY: 0.3, zoom: 1.5},
  )

  assert.ok(result)
  assert.equal(getCropAspect({asset: {_ref: 'image-wide-2560x1392-jpg'}, crop: result.crop}), 1.2)
  assert.ok(result.crop.left > 0)
  assert.ok(result.crop.right > 0)
  assert.ok(result.crop.top >= 0)
  assert.ok(result.crop.bottom > 0)
  assert.equal(result.hotspot.x, 0.4)
  assert.equal(result.hotspot.y, 0.3)
})

test('accepts a gallery when every uploaded image has a valid crop', () => {
  const {validateTailImagesArray} = loadTsModule('./tailImageCrop.ts')

  const result = validateTailImagesArray([
    {
      asset: {_ref: 'image-landscape-1200x1000-jpg'},
      crop: {left: 0, right: 0, top: 0, bottom: 0},
      hotspot: {x: 0.5, y: 0.5, width: 1, height: 1},
    },
  ])

  assert.equal(result, true)
})

test('reports gallery image numbers that need crop fixes', () => {
  const {validateTailImagesArray} = loadTsModule('./tailImageCrop.ts')

  const result = validateTailImagesArray([
    {
      asset: {_ref: 'image-landscape-1200x1000-jpg'},
      crop: {left: 0, right: 0, top: 0, bottom: 0},
      hotspot: {x: 0.5, y: 0.5, width: 1, height: 1},
    },
    {
      asset: {_ref: 'image-without-crop-1200x1000-jpg'},
    },
    {
      asset: {_ref: 'image-portrait-1000x1200-jpg'},
      crop: {left: 0, right: 0, top: 0, bottom: 0},
      hotspot: {x: 0.5, y: 0.5, width: 1, height: 1},
    },
  ])

  assert.match(result, /Фото №2 і 3 потребують правок/)
})
