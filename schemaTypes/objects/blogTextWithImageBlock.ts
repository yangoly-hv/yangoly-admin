import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'blogTextWithImageBlock',
  title: 'Текст із зображенням',
  type: 'object',
  fields: [
    defineField({
      name: 'content',
      title: 'Текст',
      type: 'localizedBlogBlockContent',
      validation: (rule) => rule.required(),
    }),
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
    defineField({
      name: 'imageSide',
      title: 'Розташування зображення на комп\'ютері',
      type: 'string',
      options: {
        list: [
          {title: 'Зліва', value: 'left'},
          {title: 'Справа', value: 'right'},
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Текст із зображенням'}
    },
  },
})
