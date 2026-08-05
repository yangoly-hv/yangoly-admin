import {
  createFixedAspectCrop,
  formatImageNumbers,
  getCropAspect,
  getInvalidImageNumbers,
  hasTailImageCropData,
  isCropAspectWithinRange,
} from './tailImageCrop'
import type {TailImageValue} from './tailImageCrop'

export const REPORT_IMAGE_TARGET_ASPECT = 13 / 10
export const REPORT_IMAGE_MIN_ASPECT = 1.27
export const REPORT_IMAGE_MAX_ASPECT = 1.33

export type ReportImageValue = TailImageValue

import type {FixedAspectCropOptions} from './tailImageCrop'

export const createReportImageCrop = (
  value?: ReportImageValue,
  options: FixedAspectCropOptions = {},
) => createFixedAspectCrop(value, REPORT_IMAGE_TARGET_ASPECT, options)

export const isReportImageCropValid = (value?: ReportImageValue) => {
  return isCropAspectWithinRange(value, REPORT_IMAGE_MIN_ASPECT, REPORT_IMAGE_MAX_ASPECT)
}

export const validateReportImageCrop = (value?: ReportImageValue) => {
  if (!value?.asset?._ref) return true

  if (!hasTailImageCropData(value)) {
    return 'Налаштуйте фото у фіксованій рамці 13:10, щоб зберегти crop і hotspot.'
  }

  const aspect = getCropAspect(value)

  if (!aspect) {
    return 'Не вдалося визначити розмір фото. Завантажте зображення ще раз.'
  }

  if (!isReportImageCropValid(value)) {
    return `Кадр має бути 13:10. Зараз ${aspect}:1. Налаштуйте фото у фіксованій рамці.`
  }

  return true
}

export const validateReportImagesArray = (value?: ReportImageValue[]) => {
  const invalidImageNumbers = getInvalidImageNumbers(value, validateReportImageCrop)

  if (!invalidImageNumbers.length) return true

  const numbers = formatImageNumbers(invalidImageNumbers)

  return invalidImageNumbers.length === 1
    ? `Фото №${numbers} потребує правки. Налаштуйте кадр 13:10 і натисніть «Зберегти кадр».`
    : `Фото №${numbers} потребують правок. Налаштуйте для кожного кадр 13:10 і натисніть «Зберегти кадр».`
}
