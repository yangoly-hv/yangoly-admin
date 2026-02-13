import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'blogSingleImageBlock',
  title: 'Одне зображення',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Зображення',
      type: 'image',
      options: {hotspot: true},
      fields: [
        {name: 'alt', type: 'string', title: 'Альтернативний текст'},
        {name: 'description', type: 'text', title: 'Опис'},
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare(_, {parent}: {parent?: {image?: {asset?: {url?: string}}}}) {
      return {
        title: 'Одне зображення',
        media: parent?.image,
      }
    },
  },
})
