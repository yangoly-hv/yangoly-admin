import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'volunteer',
  title: 'Волонтери',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: "Ім'я волонтера",
      type: 'localizedString',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Фото',
      type: 'image',
      options: {hotspot: true},
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Опис / роль у фонді',
      type: 'localizedString',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'contribution',
      title: 'Внесок (опційно)',
      type: 'localizedString',
      description: 'Наприклад: «Понад 200 прилаштованих хвостиків».',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram (опційно)',
      type: 'url',
      validation: rule => rule.uri({scheme: ['https'], allowRelative: false}),
    }),
    defineField({
      name: 'telegramUrl',
      title: 'Telegram (опційно)',
      type: 'url',
      validation: rule => rule.uri({scheme: ['https'], allowRelative: false}),
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook (опційно)',
      type: 'url',
      validation: rule => rule.uri({scheme: ['https'], allowRelative: false}),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Порядок відображення',
      type: 'number',
      description:
        'Менше число — вище в списку. За однакового порядку новіші зміни показуються вище.',
      validation: rule => rule.required().integer().min(0),
    }),
  ],
  orderings: [
    {
      title: 'Порядок відображення',
      name: 'sortOrderAsc',
      by: [
        {field: 'sortOrder', direction: 'asc'},
        {field: '_updatedAt', direction: 'desc'},
      ],
    },
  ],
  preview: {
    select: {
      title: 'name.uk',
      subtitle: 'description.uk',
      media: 'photo',
    },
  },
})
