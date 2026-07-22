import {defineField, defineType, defineArrayMember} from 'sanity'
import { BulkImageArrayInput } from './objects/BulkImageArrayInput'
import {ReportImageInput} from './objects/ReportImageInput'
import {validateReportImageCrop, validateReportImagesArray} from './objects/reportImageCrop'
import {
  AutoSlugFromReportDateInput,
  isUniqueDocumentSlug,
  slugifyDocumentValue,
  sourceFromReportDate,
} from './objects/autoSlug'

type ReportDocument = {
  date?: {
    month?: number
    year?: number
  }
}

export default defineType({
  name: 'reports',
  title: 'Звіти',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Назва звіту',
      type: 'localizedString',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Дата звіту',
      type: 'reportMonthYear',
      components: {
        input: AutoSlugFromReportDateInput,
      },
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: rule => rule.required(),
      options: {
        source: (doc) => sourceFromReportDate((doc as ReportDocument).date),
        slugify: input => slugifyDocumentValue(input).slice(0, 96),
        isUnique: isUniqueDocumentSlug,
        maxLength: 96,
      },
    }),
    defineField({
      name: 'images',
      title: 'Фото для звіту',
      type: 'array',
      validation: rule => rule.custom(validateReportImagesArray),
      of: [
        defineArrayMember({
          type: 'image',
          description: 'Для кожного фото налаштуйте фіксовану рамку 13:10.',
          options: {
            hotspot: true,
          },
          components: {
            input: ReportImageInput,
          },
          validation: rule => rule.custom(validateReportImageCrop),
        }),
      ],
      options: {
        layout: 'grid',
        disableActions: ['add'],
      },
      components: {
        input: BulkImageArrayInput,
      },
    }),
    defineField({
      name: 'reportFile',
      title: 'Файл для звіту',
      description: 'Завантажте один файл звіту.',
      type: 'file',
    }),
    defineField({
      name: 'shortFoodDescription',
      title: 'Короткий опис допомоги кормом',
      type: 'localizedBlockContent',
    }),
    defineField({
      name: 'foodDescription',
      title: 'Опис допомоги кормом',
      type: 'localizedBlockContent',
    }),
    defineField({
      name: 'shortHouseDescription',
      title: 'Короткий опис житла для хвостиків',
      type: 'localizedBlockContent',
    }),
    defineField({
      name: 'houseDescription',
      title: 'Опис житла для хвостиків',
      type: 'localizedBlockContent',
    }),
    defineField({
      name: 'shortTherapyDescription',
      title: 'Короткий опис лікування хвостиків',
      type: 'localizedBlockContent',
    }),
    defineField({
      name: 'therapyDescription',
      title: 'Опис лікування хвостиків',
      type: 'localizedBlockContent',
    }),
    defineField({
      name: 'shortOtherDescription',
      title: 'Короткий опис іншої допомоги',
      type: 'localizedBlockContent',
    }),
    defineField({
      name: 'otherDescription',
      title: 'Опис іншої допомоги',
      type: 'localizedBlockContent',
    }),
  ],
  preview: {
    select: {
      title: 'title.uk',
      media: 'mainImage',
    },
  },
})
