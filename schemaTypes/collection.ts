import {defineField, defineType} from 'sanity'
import {
  AutoSlugFromLocalizedStringInput,
  isUniqueDocumentSlug,
  slugifyDocumentValue,
  sourceFromLocalizedString,
} from './objects/autoSlug'
import {CollectionImageInput} from './objects/CollectionImageInput'
import {validateCollectionImageCrop} from './objects/collectionImageCrop'
import {extractMonobankLongJarId, isMonobankLongJarId} from './objects/monobankLongJarId'
import {MonobankLongJarIdInput} from './objects/MonobankLongJarIdInput'

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
      name: 'monobankLongJarId',
      title: 'Monobank longJarId',
      type: 'string',
      description:
        'Ідентифікатор з віджета банки. Можна вставити сам id або натиснути «Вставити URL» і вставити посилання з longJarId=…',
      components: {
        input: MonobankLongJarIdInput,
      },
      validation: (rule) =>
        rule.custom((value) => {
          if (value == null || value === '') return true
          const extracted = extractMonobankLongJarId(value)
          if (!extracted) {
            return 'Очікується longJarId або URL віджета з параметром longJarId'
          }
          if (!isMonobankLongJarId(value.trim())) {
            return 'Натисніть «Вставити URL» або вставте посилання в поле — збережіть лише витягнутий longJarId'
          }
          return true
        }),
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
