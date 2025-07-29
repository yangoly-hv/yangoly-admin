import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'events',
  title: 'Наші заходи',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Заголовок',
      type: 'localizedString'
    },
    defineField({
      name: 'images',
      title: 'Фото з заходів',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true
          },
        }
      ]
    }),
  ],
  preview: {
    select: {
      title: 'title.uk',
    },
  },
})
