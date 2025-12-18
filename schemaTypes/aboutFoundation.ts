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
      name: 'imagesDesktop',
      title: 'Фото фонду для комп\'ютера',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
    }),
    defineField({
      name: 'imagesMobile',
      title: 'Фото для телефону',
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
