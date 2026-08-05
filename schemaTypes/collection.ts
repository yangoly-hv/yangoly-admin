import {defineField, defineType} from 'sanity'
import {
  AutoSlugFromLocalizedStringInput,
  isUniqueDocumentSlug,
  slugifyDocumentValue,
  sourceFromLocalizedString,
} from './objects/autoSlug'
import {CollectionImageInput} from './objects/CollectionImageInput'
import {validateCollectionImageCrop} from './objects/collectionImageCrop'

type CollectionDocument = {
  title?: {
    en?: string
    uk?: string
  }
}

export default defineType({
  name: 'collection',
  title: 'Збори',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Назва збору',
      type: 'localizedString',
      validation: rule => rule.required(),
      components: {
        input: AutoSlugFromLocalizedStringInput,
      },
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: rule => rule.required(),
      options: {
        source: doc => sourceFromLocalizedString((doc as CollectionDocument).title),
        slugify: input => slugifyDocumentValue(input).slice(0, 96),
        isUnique: isUniqueDocumentSlug,
        maxLength: 96,
      },
    }),
    defineField({
      name: 'description',
      title: 'Опис збору',
      type: 'localizedBlockContent',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Фото зборів',
      type: 'image',
      options: {
        hotspot: true,
      },
      components: {
        input: CollectionImageInput,
      },
      validation: rule => rule.required().custom(validateCollectionImageCrop),
    }),
    defineField({
        name: 'amount',
        title: 'Сума зборів',
        type: 'number',
      }),
      defineField({
        name: 'amountCollected',
        title: 'Зібрано',
        type: 'number',
        description: 'Оновлюється автоматично після підтвердженого платежу WayForPay.',
        initialValue: 0,
      }),
      defineField({
        name: 'main',
        title: 'Головний збір',
        type: 'boolean',
        initialValue: false,
      }),
  ],
  preview: {
    select: {
      title: 'title.uk',
      media: 'mainImage',
    },
  },
})
