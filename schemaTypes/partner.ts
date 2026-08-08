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
    defineField({
      name: 'sortOrder',
      title: 'Порядок відображення',
      type: 'number',
      description: 'Менше число — вище в списку на сторінці партнерства',
      validation: rule => rule.required().integer().min(0),
    }),
  ],
  orderings: [
    {
      title: 'Порядок відображення',
      name: 'sortOrderAsc',
      by: [{field: 'sortOrder', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
      sortOrder: 'sortOrder',
    },
    prepare: ({title, media, sortOrder}) => ({
      title,
      media,
      subtitle:
        typeof sortOrder === 'number' ? `Порядок: ${sortOrder}` : 'Без порядку',
    }),
  },
})
