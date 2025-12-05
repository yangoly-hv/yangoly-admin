import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'aboutFoundation',
  title: 'Про благодійний фонд',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Заголовок',
      type: 'localizedString',
    },
    defineField({
      name: 'description',
      title: 'Про фонд',
      type: 'localizedBlockContent',
    }),
    defineField({
      name: 'images',
      title: 'Фото фонду',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Про благодійний фонд',
      }
    },
  },
})
