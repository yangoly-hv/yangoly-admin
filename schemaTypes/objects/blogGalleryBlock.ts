import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'blogGalleryBlock',
  title: 'Галерея',
  type: 'object',
  fields: [
    defineField({
      name: 'images',
      title: 'Зображення',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {name: 'alt', type: 'string', title: 'Альтернативний текст'},
            {name: 'description', type: 'text', title: 'Опис'},
          ],
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    prepare(_, {parent}: {parent?: {images?: unknown[]}}) {
      const count = parent?.images?.length ?? 0
      return {
        title: 'Галерея',
        subtitle: `${count} зображень`,
      }
    },
  },
})
