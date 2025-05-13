import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'tail',
  title: 'Хвостики',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Ім\'я',
      type: 'localizedString',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      // validation: rule => rule.required(),
      options: {
        // @ts-expect-error
        source: doc => doc.name?.en,
        maxLength: 96,
      },
    }),
    defineField({
      name: 'description',
      title: 'Опис',
      type: 'localizedBlockContent',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Головне фото',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Фото',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true // позволяет настраивать фокус изображения
          },
        }
      ]
    }),
    defineField({
      name: 'sex',
      title: 'Стать',
      type: 'string',
      options: {
        list: [
          { title: 'Хлопчик', value: 'boy' },
          { title: 'Дівчина', value: 'girl' },
        ],
        layout: 'dropdown'
      }
    }),
    defineField({
      name: 'needs_sterilization',
      title: 'Потребує стерилізації',
      type: 'boolean'
    }),
    defineField({
      name: 'needs_family',
      title: 'Потребує сім\'ї',
      type: 'boolean'
    }),
  ],
  preview: {
    select: {
      title: 'name.uk',
      media: 'mainImage',
    },
    // prepare(selection) {
    //   const {author} = selection
    //   return {...selection, subtitle: author && `by ${author}`}
    // },
  },
})
