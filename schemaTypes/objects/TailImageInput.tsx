import {createFixedAspectImageInput} from './FixedAspectImageInput'
import {
  createFixedAspectCrop,
  isTailImageCropValid,
  TAIL_IMAGE_TARGET_ASPECT,
} from './tailImageCrop'

export const TailImageInput = createFixedAspectImageInput({
  targetAspect: TAIL_IMAGE_TARGET_ASPECT,
  frameSize: {width: 600, height: 500},
  title: 'Фіксований кадр 1.2:1',
  description: 'Фото хвостика всюди на сайті показується тільки в цій ландшафтній рамці.',
  createCrop: (value, options) => createFixedAspectCrop(value, TAIL_IMAGE_TARGET_ASPECT, options),
  isCropValid: isTailImageCropValid,
})
