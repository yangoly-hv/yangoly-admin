import {defineType} from 'sanity'

export default defineType({
  name: 'perfomance',
  title: 'Цифри роботи нашого фонду',
  type: 'document',
  fields: [
    { name: 'tailsCount', type: 'number', title: 'Кількість врятованих хвостиків' },
    { name: 'feedCount', type: 'number', title: 'Кількість надісланих кілограмів корму' },
    { name: 'vaccinesCount', type: 'number', title: 'Кількість проведених вакцинацій' },
    { name: 'treatmentsCount', type: 'number', title: 'Кількість простерилізованих тварин' },
  ],
  preview: {
    prepare() {
      return {
        title: 'Цифри роботи нашого фонду'
      };
    },
  },
});

