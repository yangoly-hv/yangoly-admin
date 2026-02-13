import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'blogPlainTextBlock',
  title: 'Звичайний текст',
  type: 'object',
  fields: [
    defineField({
      name: 'content',
      title: 'Текст',
      type: 'localizedBlogBlockContent',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Звичайний текст'}
    },
  },
})
