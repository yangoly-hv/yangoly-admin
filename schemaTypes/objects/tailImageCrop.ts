export const TAIL_IMAGE_TARGET_ASPECT = 1.2
export const TAIL_IMAGE_MIN_ASPECT = 1.17
export const TAIL_IMAGE_MAX_ASPECT = 1.24

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
): FixedAspectCropResult | null => {
  const dimensions = parseImageAssetDimensions(value?.asset?._ref)

  if (!dimensions) return null

  const imageAspect = dimensions.width / dimensions.height
  const focus = getCurrentFocusPoint(value)
  let cropWidth = 1
  let cropHeight = 1

  if (imageAspect > targetAspect) {
    cropWidth = targetAspect / imageAspect
  } else {
    cropHeight = imageAspect / targetAspect
  }

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
  const aspect = getCropAspect(value)

  if (!aspect) return false

  return aspect >= TAIL_IMAGE_MIN_ASPECT && aspect <= TAIL_IMAGE_MAX_ASPECT
}

export const validateTailImageCrop = (value?: TailImageValue) => {
  if (!value?.asset?._ref) return true

  const aspect = getCropAspect(value)

  if (!aspect) {
    return 'Не вдалося визначити розмір фото. Завантажте зображення ще раз.'
  }

  if (!isTailImageCropValid(value)) {
    return `Кадр має бути горизонтальний приблизно 1.2:1. Зараз ${aspect}:1. Натисніть "Застосувати кадр 1.2:1" у полі фото.`
  }

  return true
}
