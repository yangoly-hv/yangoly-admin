import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'partner',
  title: 'Партнери',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Назва партнера (українською)',
      type: 'string',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Логотип партнера',
      type: 'image',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'websiteUrl',
      title: 'Посилання на сайт партнера',
      type: 'url',
      validation: rule => rule.required().uri({scheme: ['http', 'https'], allowRelative: false}),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
    },
  },
})
