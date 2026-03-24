import {defineField, defineType} from 'sanity'

const MONTHS_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const MONTHS_UK = [
  'Січень',
  'Лютий',
  'Березень',
  'Квітень',
  'Травень',
  'Червень',
  'Липень',
  'Серпень',
  'Вересень',
  'Жовтень',
  'Листопад',
  'Грудень',
]

const yearFrom = 2020
const yearTo = 2035

const reportMonthYear = defineType({
  name: 'reportMonthYear',
  title: 'Дата звіту',
  type: 'object',
  fields: [
    defineField({
      name: 'month',
      title: 'Місяць',
      type: 'number',
      options: {
        list: MONTHS_UK.map((title, index) => ({
          title,
          value: index + 1,
        })),
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required().min(1).max(12),
    }),
    defineField({
      name: 'year',
      title: 'Рік',
      type: 'number',
      options: {
        list: Array.from({length: yearTo - yearFrom + 1}, (_, i) => {
          const year = yearFrom + i
          return {title: String(year), value: year}
        }),
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      month: 'month',
      year: 'year',
    },
    prepare({month, year}) {
      if (!month || !year) {
        return {title: '—'}
      }

      return {
        title: `${MONTHS_UK[month - 1]} ${year}`,
        subtitle: `${MONTHS_EN[month - 1]} ${year}`,
      }
    },
  },
})

export default reportMonthYear;