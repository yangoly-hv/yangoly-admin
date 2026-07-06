import {defineType, defineArrayMember} from 'sanity'

export default defineType({
  title: 'Blog Block Content',
  name: 'blogBlockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H1', value: 'h1'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
        ],
        annotations: [
          {
            title: 'Link (normal)',
            name: 'link',
            type: 'object',
            fields: [
              {title: 'URL', name: 'href', type: 'url', validation: (rule) => rule.required()},
              {
                title: 'Link style',
                name: 'linkStyle',
                type: 'string',
                options: {
                  list: [
                    {title: 'Normal', value: 'normal'},
                    {title: 'Button', value: 'button'},
                  ],
                  layout: 'radio',
                },
                initialValue: 'normal',
              },
            ],
          },
        ],
      },
    }),
  ],
})
