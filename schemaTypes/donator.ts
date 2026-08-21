import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'donator',
  title: 'Топ донаторів',
  type: 'document',
  fields: [
    defineField({
      name: 'donorKind',
      title: 'Тип донатора',
      type: 'string',
      options: {
        list: [
          {title: 'Приватна особа', value: 'person'},
          {title: 'Компанія', value: 'company'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'person',
    }),
    defineField({
      name: 'name',
      title: 'ПІБ донатора / назва компанії',
      type: 'localizedString',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Фото особи або логотип компанії',
      type: 'image',
      options: {hotspot: true},
      description: 'Якщо не завантажити, на сайті буде кружечок з ініціалами.',
    }),
    defineField({
        name: 'amount',
        title: 'Сума донату',
        type: 'number',
        validation: rule => rule.required(),
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
      name: 'websiteUrl',
      title: 'Сайт (опційно)',
      type: 'url',
      validation: rule => rule.uri({scheme: ['http', 'https'], allowRelative: false}),
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
    }),
  ],
  orderings: [
    {
      title: 'Сума донату (спадання)',
      name: 'amountDesc',
      by: [{field: 'amount', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'name.uk',
      amount: 'amount',
      donorKind: 'donorKind',
      media: 'image',
    },
    prepare: ({title, amount, donorKind, media}) => ({
      title,
      media,
      subtitle: `${donorKind === 'company' ? 'Компанія' : 'Приватна особа'}${
        typeof amount === 'number' ? ` · ${amount.toLocaleString('uk-UA')} грн` : ''
      }`,
    }),
  },
})
