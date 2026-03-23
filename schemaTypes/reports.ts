import {defineField, defineType, defineArrayMember} from 'sanity'
import { BulkImageArrayInput } from './objects/BulkImageArrayInput'

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
      type: 'localizedString',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      // validation: rule => rule.required(),
      options: {
        // @ts-expect-error
        source: doc => doc.date?.en,
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
