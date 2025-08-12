import {defineField, defineType} from 'sanity'

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
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      // validation: rule => rule.required(),
      options: {
        // @ts-expect-error
        source: doc => doc.title?.en,
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
      validation: rule => rule.required(),
    }),
    defineField({
        name: 'amount',
        title: 'Сума зборів',
        type: 'number',
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
