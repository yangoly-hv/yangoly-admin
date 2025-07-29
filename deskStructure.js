// ./deskStructure.js

export const myStructure = (S) =>
  S.list()
    .title('Категорії')
    .items([S.listItem()
      .title('Заходи')
      .child(
        S.document()
          .schemaType('events')
          .documentId('events')),
      ...S.documentTypeListItems().reverse()])
