import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'donator',
  title: 'Топ донаторів',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'ПІБ донатора',
      type: 'localizedString',
      validation: rule => rule.required(),
    }),
    defineField({
        name: 'amount',
        title: 'Сума донату',
        type: 'number',
        validation: rule => rule.required(),
      }),
  ],
  preview: {
    select: {
      title: 'name',
    },
  },
})
