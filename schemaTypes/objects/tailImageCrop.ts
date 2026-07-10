export const TAIL_IMAGE_TARGET_ASPECT = 6 / 5
export const TAIL_IMAGE_MIN_ASPECT = 1.17
export const TAIL_IMAGE_MAX_ASPECT = 1.23

export type TailImageCrop = {
  top?: number
  bottom?: number
  left?: number
  right?: number
}

export type TailImageHotspot = {
  x?: number
  y?: number
  width?: number
  height?: number
}

export type TailImageValue = {
  asset?: {
    _ref?: string
  }
  crop?: TailImageCrop
  hotspot?: TailImageHotspot
}

type ImageDimensions = {
  width: number
  height: number
}

type FixedAspectCropResult = {
  crop: Required<TailImageCrop>
  hotspot: Required<TailImageHotspot>
}

type FixedAspectCropOptions = {
  focusX?: number
  focusY?: number
  zoom?: number
}

const roundCropNumber = (value: number) => Math.round(value * 1000000) / 1000000

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export const parseImageAssetDimensions = (assetRef?: string): ImageDimensions | null => {
  const match = assetRef?.match(/^image-[^-]+-(\d+)x(\d+)-/)

  if (!match) return null

  const width = Number(match[1])
  const height = Number(match[2])

  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return null
  }

  return {width, height}
}

export const getCropAspect = (value?: TailImageValue): number | null => {
  const dimensions = parseImageAssetDimensions(value?.asset?._ref)

  if (!dimensions) return null

  const crop = value?.crop || {}
  const visibleWidth = dimensions.width * (1 - (crop.left || 0) - (crop.right || 0))
  const visibleHeight = dimensions.height * (1 - (crop.top || 0) - (crop.bottom || 0))

  if (visibleWidth <= 0 || visibleHeight <= 0) return null

  return Math.round((visibleWidth / visibleHeight) * 1000) / 1000
}

export const hasTailImageCropData = (value?: TailImageValue) => {
  const crop = value?.crop
  const hotspot = value?.hotspot

  return (
    typeof crop?.left === 'number' &&
    typeof crop.right === 'number' &&
    typeof crop.top === 'number' &&
    typeof crop.bottom === 'number' &&
    typeof hotspot?.x === 'number' &&
    typeof hotspot.y === 'number' &&
    typeof hotspot.width === 'number' &&
    typeof hotspot.height === 'number'
  )
}

const getCurrentFocusPoint = (value?: TailImageValue) => {
  if (typeof value?.hotspot?.x === 'number' && typeof value.hotspot.y === 'number') {
    return {
      x: clamp(value.hotspot.x, 0, 1),
      y: clamp(value.hotspot.y, 0, 1),
    }
  }

  const crop = value?.crop

  if (crop) {
    const left = crop.left || 0
    const right = crop.right || 0
    const top = crop.top || 0
    const bottom = crop.bottom || 0

    return {
      x: clamp(left + (1 - left - right) / 2, 0, 1),
      y: clamp(top + (1 - top - bottom) / 2, 0, 1),
    }
  }

  return {x: 0.5, y: 0.5}
}

export const createFixedAspectCrop = (
  value?: TailImageValue,
  targetAspect = TAIL_IMAGE_TARGET_ASPECT,
  options: FixedAspectCropOptions = {},
): FixedAspectCropResult | null => {
  const dimensions = parseImageAssetDimensions(value?.asset?._ref)

  if (!dimensions) return null

  const imageAspect = dimensions.width / dimensions.height
  const currentFocus = getCurrentFocusPoint(value)
  const focus = {
    x: clamp(options.focusX ?? currentFocus.x, 0, 1),
    y: clamp(options.focusY ?? currentFocus.y, 0, 1),
  }
  const zoom = clamp(options.zoom || 1, 1, 4)
  let cropWidth = 1
  let cropHeight = 1

  if (imageAspect > targetAspect) {
    cropWidth = targetAspect / imageAspect
  } else {
    cropHeight = imageAspect / targetAspect
  }

  cropWidth = cropWidth / zoom
  cropHeight = cropHeight / zoom

  const left = clamp(focus.x - cropWidth / 2, 0, 1 - cropWidth)
  const top = clamp(focus.y - cropHeight / 2, 0, 1 - cropHeight)
  const right = 1 - left - cropWidth
  const bottom = 1 - top - cropHeight
  const hotspotX = clamp(focus.x, left, left + cropWidth)
  const hotspotY = clamp(focus.y, top, top + cropHeight)

  return {
    crop: {
      left: roundCropNumber(left),
      right: roundCropNumber(right),
      top: roundCropNumber(top),
      bottom: roundCropNumber(bottom),
    },
    hotspot: {
      x: roundCropNumber(hotspotX),
      y: roundCropNumber(hotspotY),
      width: roundCropNumber(cropWidth),
      height: roundCropNumber(cropHeight),
    },
  }
}

export const isTailImageCropValid = (value?: TailImageValue) => {
  if (!hasTailImageCropData(value)) return false

  const aspect = getCropAspect(value)

  if (!aspect) return false

  return aspect >= TAIL_IMAGE_MIN_ASPECT && aspect <= TAIL_IMAGE_MAX_ASPECT
}

export const validateTailImageCrop = (value?: TailImageValue) => {
  if (!value?.asset?._ref) return true

  if (!hasTailImageCropData(value)) {
    return 'Налаштуйте фото у фіксованій рамці 1.2:1, щоб зберегти crop і hotspot.'
  }

  const aspect = getCropAspect(value)

  if (!aspect) {
    return 'Не вдалося визначити розмір фото. Завантажте зображення ще раз.'
  }

  if (!isTailImageCropValid(value)) {
    return `Кадр має бути ландшафтний 1.2:1. Зараз ${aspect}:1. Налаштуйте фото у фіксованій рамці.`
  }

  return true
}

const formatImageNumbers = (numbers: number[]) => {
  if (numbers.length <= 1) return numbers.join('')
  if (numbers.length === 2) return `${numbers[0]} і ${numbers[1]}`

  return `${numbers.slice(0, -1).join(', ')} і ${numbers[numbers.length - 1]}`
}

export const validateTailImagesArray = (value?: TailImageValue[]) => {
  if (!Array.isArray(value)) return true

  const invalidImageNumbers = value
    .map((image, index) => (image?.asset?._ref && validateTailImageCrop(image) !== true ? index + 1 : null))
    .filter((index): index is number => typeof index === 'number')

  if (!invalidImageNumbers.length) return true

  const numbers = formatImageNumbers(invalidImageNumbers)

  return invalidImageNumbers.length === 1
    ? `Фото №${numbers} потребує правки. Налаштуйте кадр 1.2:1 і натисніть «Зберегти кадр».`
    : `Фото №${numbers} потребують правок. Налаштуйте для кожного кадр 1.2:1 і натисніть «Зберегти кадр».`
}
