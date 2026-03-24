import {defineField, defineType, defineArrayMember} from 'sanity'
import { BulkImageArrayInput } from './objects/BulkImageArrayInput'

const MONTHS_EN = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];

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
    // defineField({
    //   name: 'date',
    //   title: 'Дата звіту',
    //   type: 'localizedString',
    //   validation: rule => rule.required(),
    // }),
    defineField({
      name: 'date',
      title: 'Дата звіту',
      type: 'reportMonthYear',
      // validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: rule => rule.required(),
      options: {
        source: (doc) => {
          //@ts-expect-error
          const year = doc.date?.year
          //@ts-expect-error
          const month = doc.date?.month
    
          if (!year || !month) return ''
    
          return `${MONTHS_EN[month - 1]}-${year}`
        },
        maxLength: 96,
      },
    }),
    defineField({
      name: 'images',
      title: 'Фото для звіту',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {
            hotspot: true,
          },
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
      name: 'shortFoodDescription',
      title: 'Короткий опис допомоги кормом',
      type: 'localizedBlockContent',
      // validation: rule => rule.required(),
    }),
    defineField({
      name: 'foodDescription',
      title: 'Опис допомоги кормом',
      type: 'localizedBlockContent',
      // validation: rule => rule.required(),
    }),
    defineField({
      name: 'shortHouseDescription',
      title: 'Короткий опис житла для хвостиків',
      type: 'localizedBlockContent',
      // validation: rule => rule.required(),
    }),
    defineField({
      name: 'houseDescription',
      title: 'Опис житла для хвостиків',
      type: 'localizedBlockContent',
      // validation: rule => rule.required(),
    }),
    defineField({
      name: 'shortTherapyDescription',
      title: 'Короткий опис лікування хвостиків',
      type: 'localizedBlockContent',
      // validation: rule => rule.required(),
    }),
    defineField({
      name: 'therapyDescription',
      title: 'Опис лікування хвостиків',
      type: 'localizedBlockContent',
      // validation: rule => rule.required(),
    }),
    defineField({
      name: 'shortOtherDescription',
      title: 'Короткий опис іншої допомоги',
      type: 'localizedBlockContent',
      // validation: rule => rule.required(),
    }),
    defineField({
      name: 'otherDescription',
      title: 'Опис іншої допомоги',
      type: 'localizedBlockContent',
      // validation: rule => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title.uk',
      media: 'mainImage',
    },
    // prepare(selection) {
    //   const {author} = selection
    //   return {...selection, subtitle: author && `by ${author}`}
    // },
  },
})
