import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'report',
  title: 'Звіт',
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
      name: 'link',
      title: 'Посилання на звіт',
      type: 'url',
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
      name: 'description',
      title: 'Опис',
      type: 'localizedBlockContent',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'additionalInfo',
      title: 'Додаткова інформація',
      type: 'localizedBlockContent',
    }),
    defineField({
      name: 'mainImage',
      title: 'Головне фото',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'secondaryImage',
      title: 'Друге фото',
      type: 'image',
      options: {
        hotspot: true,
      },
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
