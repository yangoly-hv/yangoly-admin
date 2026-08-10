import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'tailContribution',
  title: 'Tail payment credits',
  type: 'document',
  fields: [
    defineField({
      name: 'orderReference',
      title: 'Order reference',
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
      name: 'tailId',
      title: 'Tail ID',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'amount',
      title: 'Amount (UAH)',
      type: 'number',
      readOnly: true,
    }),
    defineField({
      name: 'amountMinor',
      title: 'Amount (kopiykas)',
      type: 'number',
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
      title: 'Included in tail total',
      type: 'boolean',
      readOnly: true,
    }),
    defineField({
      name: 'createdAt',
      title: 'Created at',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated at',
      type: 'datetime',
      readOnly: true,
    }),
  ],
})
