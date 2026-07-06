import {defineField, defineType} from 'sanity'
import {
  AutoSlugFromLocalizedStringInput,
  isUniqueDocumentSlug,
  slugifyDocumentValue,
  sourceFromLocalizedString,
} from './objects/autoSlug'
import {TailImageInput} from './objects/TailImageInput'
import {validateTailImageCrop} from './objects/tailImageCrop'

type TailDocument = {
  name?: {
    en?: string
    uk?: string
  }
}

type KeepingParent = {
  needs_keeping?: boolean
}

export default defineType({
  name: 'tail',
  title: 'Хвостики',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Ім\'я',
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
        source: doc => sourceFromLocalizedString((doc as TailDocument).name),
        slugify: input => slugifyDocumentValue(input).slice(0, 96),
        isUnique: isUniqueDocumentSlug,
        maxLength: 96,
      },
    }),
    defineField({
      name: 'description',
      title: 'Опис',
      type: 'localizedBlockContent',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Головне фото',
      type: 'image',
      description: 'Завантажте фото і натисніть "Застосувати кадр 1.2:1".',
      options: {
        hotspot: true,
      },
      components: {
        input: TailImageInput,
      },
      validation: rule => rule.required().custom(validateTailImageCrop),
    }),
    defineField({
      name: 'images',
      title: 'Фото',
      type: 'array',
      of: [
        {
          type: 'image',
          description: 'Для кожного фото натисніть "Застосувати кадр 1.2:1".',
          options: {
            hotspot: true
          },
          components: {
            input: TailImageInput,
          },
          validation: rule => rule.custom(validateTailImageCrop),
        }
      ]
    }),
    defineField({
      name: 'sex',
      title: 'Стать',
      type: 'string',
      options: {
        list: [
          { title: 'Хлопчик', value: 'boy' },
          { title: 'Дівчина', value: 'girl' },
        ],
        layout: 'dropdown'
      }
    }),
    defineField({
      name: 'needs_family',
      title: 'Потребує сім\'ї',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'needs_keeping',
      title: 'Потребує опіки',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'needs_sterilization',
      title: 'Потребує стерилізації',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'keeping_price',
      title: 'Сума для місячного утримання',
      type: 'number',
      hidden: ({ parent }) => !parent?.needs_keeping,
      validation: Rule => Rule.custom((value, context) => {
        const isPromo = (context.parent as KeepingParent | undefined)?.needs_keeping
    
        if (isPromo && !value) {
          return 'Введіть суму місячного утримання'
        }
    
        return true 
      })
    }),
  ],
  preview: {
    select: {
      title: 'name.uk',
      media: 'mainImage',
    },
  },
})
