import {createFixedAspectImageInput} from './FixedAspectImageInput'
import {
  createReportImageCrop,
  isReportImageCropValid,
  REPORT_IMAGE_TARGET_ASPECT,
} from './reportImageCrop'

export const ReportImageInput = createFixedAspectImageInput({
  targetAspect: REPORT_IMAGE_TARGET_ASPECT,
  frameSize: {width: 650, height: 500},
  title: 'Фіксований кадр 13:10',
  description: 'Фото звіту на сайті показується у цій горизонтальній рамці.',
  createCrop: createReportImageCrop,
  isCropValid: isReportImageCropValid,
})
