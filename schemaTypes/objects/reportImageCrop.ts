import {
  createFixedAspectCrop,
  getCropAspect,
  hasTailImageCropData,
} from './tailImageCrop'
import type {TailImageValue} from './tailImageCrop'

export const REPORT_IMAGE_TARGET_ASPECT = 13 / 10
export const REPORT_IMAGE_MIN_ASPECT = 1.27
export const REPORT_IMAGE_MAX_ASPECT = 1.33

export type ReportImageValue = TailImageValue

type FixedAspectCropOptions = {
  focusX?: number
  focusY?: number
  zoom?: number
}

export const createReportImageCrop = (
  value?: ReportImageValue,
  options: FixedAspectCropOptions = {},
) => createFixedAspectCrop(value, REPORT_IMAGE_TARGET_ASPECT, options)

export const isReportImageCropValid = (value?: ReportImageValue) => {
  if (!hasTailImageCropData(value)) return false

  const aspect = getCropAspect(value)

  if (!aspect) return false

  return aspect >= REPORT_IMAGE_MIN_ASPECT && aspect <= REPORT_IMAGE_MAX_ASPECT
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

const formatImageNumbers = (numbers: number[]) => {
  if (numbers.length <= 1) return numbers.join('')
  if (numbers.length === 2) return `${numbers[0]} і ${numbers[1]}`

  return `${numbers.slice(0, -1).join(', ')} і ${numbers[numbers.length - 1]}`
}

export const validateReportImagesArray = (value?: ReportImageValue[]) => {
  if (!Array.isArray(value)) return true

  const invalidImageNumbers = value
    .map((image, index) => (image?.asset?._ref && validateReportImageCrop(image) !== true ? index + 1 : null))
    .filter((index): index is number => typeof index === 'number')

  if (!invalidImageNumbers.length) return true

  const numbers = formatImageNumbers(invalidImageNumbers)

  return invalidImageNumbers.length === 1
    ? `Фото №${numbers} потребує правки. Налаштуйте кадр 13:10 і натисніть «Зберегти кадр».`
    : `Фото №${numbers} потребують правок. Налаштуйте для кожного кадр 13:10 і натисніть «Зберегти кадр».`
}
