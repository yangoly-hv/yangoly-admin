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
            hotspot: true
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
      name: 'needs_family',
      title: 'Потребує сім\'ї',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'needs_keeping',
      title: 'Потребує опіки',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'keeping_price',
      title: 'Сума для місячного утримання',
      type: 'number',
      hidden: ({ parent }) => !parent?.needs_keeping,
      validation: Rule => Rule.custom((value, context) => {
        //@ts-expect-error
        const isPromo = context.parent?.needs_keeping
    
        if (isPromo && !value) {
          return 'Введіть суму місячного утримання'
        }
    
        return true 
      })
    }),
  ],
  preview: {
    select: {
      title: 'name.uk',
      media: 'mainImage',
    },
  },
})
