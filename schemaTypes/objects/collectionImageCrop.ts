import {
  createFixedAspectCrop,
  getCropAspect,
  hasTailImageCropData,
} from './tailImageCrop'
import type {TailImageValue} from './tailImageCrop'

export const COLLECTION_IMAGE_TARGET_ASPECT = 705 / 580
export const COLLECTION_IMAGE_MIN_ASPECT = 1.2
export const COLLECTION_IMAGE_MAX_ASPECT = 1.23

export type CollectionImageValue = TailImageValue

type FixedAspectCropOptions = {
  focusX?: number
  focusY?: number
  zoom?: number
}

export const createCollectionImageCrop = (
  value?: CollectionImageValue,
  options: FixedAspectCropOptions = {},
) => createFixedAspectCrop(value, COLLECTION_IMAGE_TARGET_ASPECT, options)

export const isCollectionImageCropValid = (value?: CollectionImageValue) => {
  if (!hasTailImageCropData(value)) return false

  const aspect = getCropAspect(value)

  if (!aspect) return false

  return aspect >= COLLECTION_IMAGE_MIN_ASPECT && aspect <= COLLECTION_IMAGE_MAX_ASPECT
}

export const validateCollectionImageCrop = (value?: CollectionImageValue) => {
  if (!value?.asset?._ref) return true

  if (!hasTailImageCropData(value)) {
    return 'Налаштуйте фото збору у фіксованій рамці 705:580, щоб зберегти crop і hotspot.'
  }

  const aspect = getCropAspect(value)

  if (!aspect) {
    return 'Не вдалося визначити розмір фото. Завантажте зображення ще раз.'
  }

  if (!isCollectionImageCropValid(value)) {
    return `Кадр має бути 705:580. Зараз ${aspect}:1. Налаштуйте фото у фіксованій рамці.`
  }

  return true
}
