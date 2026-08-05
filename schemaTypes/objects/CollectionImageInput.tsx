import {createFixedAspectImageInput} from './FixedAspectImageInput'
import {
  COLLECTION_IMAGE_TARGET_ASPECT,
  createCollectionImageCrop,
  isCollectionImageCropValid,
} from './collectionImageCrop'

export const CollectionImageInput = createFixedAspectImageInput({
  targetAspect: COLLECTION_IMAGE_TARGET_ASPECT,
  frameSize: {width: 705, height: 580},
  title: 'Фіксований кадр 705:580',
  description: 'Фото збору на головній сторінці показується у цій горизонтальній рамці.',
  createCrop: createCollectionImageCrop,
  isCropValid: isCollectionImageCropValid,
})
