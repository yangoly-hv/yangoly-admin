import {
  createFixedAspectCrop,
  getCropAspect,
  hasTailImageCropData,
  isCropAspectWithinRange,
} from './tailImageCrop'
import type {TailImageValue} from './tailImageCrop'

export const COLLECTION_IMAGE_TARGET_ASPECT = 705 / 580
export const COLLECTION_IMAGE_MIN_ASPECT = 1.2
export const COLLECTION_IMAGE_MAX_ASPECT = 1.23

export type CollectionImageValue = TailImageValue

import type {FixedAspectCropOptions} from './tailImageCrop'

export const createCollectionImageCrop = (
  value?: CollectionImageValue,
  options: FixedAspectCropOptions = {},
) => createFixedAspectCrop(value, COLLECTION_IMAGE_TARGET_ASPECT, options)

export const isCollectionImageCropValid = (value?: CollectionImageValue) => {
  return isCropAspectWithinRange(value, COLLECTION_IMAGE_MIN_ASPECT, COLLECTION_IMAGE_MAX_ASPECT)
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
