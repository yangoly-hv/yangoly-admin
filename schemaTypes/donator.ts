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
    defineField({
      name: 'orderReference',
      title: 'WayForPay order reference',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'occurrenceId',
      title: 'Payment occurrence',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'paymentStatus',
      title: 'Payment status',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'isActive',
      title: 'Visible in top donors',
      type: 'boolean',
      initialValue: true,
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'name.uk',
    },
  },
})
