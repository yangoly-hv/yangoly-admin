import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Блог',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Назва запису',
      type: 'localizedString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Автоматично з англійської назви, можна змінити вручну',
      validation: (rule) => rule.required(),
      options: {
        source: (doc: {title?: {en?: string}}) => doc?.title?.en ?? '',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'description',
      title: 'Опис',
      type: 'localizedBlockContent',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Головне фото',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Дата та час публікації',
      type: 'datetime',
      description: 'Встановлюється при створенні, можна змінити',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'readingTime',
      title: 'Час читання (хв)',
      type: 'number',
      description: 'Опційно. Орієнтовна кількість хвилин на прочитання',
      validation: (rule) => rule.min(0).max(999),
    }),
    defineField({
      name: 'content',
      title: 'Контент',
      type: 'array',
      of: [
        {type: 'blogPlainTextBlock'},
        {type: 'blogTextWithImageBlock'},
        {type: 'blogSingleImageBlock'},
        {type: 'blogGalleryBlock'},
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title.uk',
      media: 'mainImage',
      publishedAt: 'publishedAt',
    },
    prepare({title, media, publishedAt}) {
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString('uk-UA') : ''
      return {
        title: title || 'Без назви',
        subtitle: date,
        media,
      }
    },
  },
})
