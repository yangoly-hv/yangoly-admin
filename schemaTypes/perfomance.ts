import {defineType} from 'sanity'

export default defineType({
  name: 'perfomance',
  title: 'Цифри роботи нашого фонду',
  type: 'document',
  fields: [
    { name: 'tailsCount', type: 'number', title: 'Кількість врятованих хвостиків' },
    { name: 'feedCount', type: 'number', title: 'Кількість надісленого корму в кілограмах' },
    { name: 'vaccinesCount', type: 'number', title: 'Кількість вакцин' },
    { name: 'treatmentsCount', type: 'number', title: 'Кількість обробок' },
  ],
  preview: {
    prepare() {
      return {
        title: 'Цифри роботи нашого фонду'
      };
    },
  },
});

