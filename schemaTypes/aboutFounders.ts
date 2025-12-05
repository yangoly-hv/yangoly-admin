import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'aboutFounders',
  title: 'Про співзасновників фонда',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Заголовок',
      type: 'localizedString',
    },
    defineField({
      name: 'description',
      title: 'Про співзнасновників',
      type: 'localizedBlockContent',
    }),
    defineField({
      name: 'image',
      title: 'Фото',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: rule => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Про співзасновників фонда',
      }
    },
  },
})
