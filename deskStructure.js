// deskStructure.js

const singletonTypes = new Set([
  'events',
  'perfomance',
  'aboutFoundation',
  'siteSettings',
]);

export const myStructure = (S) =>
  S.list()
    .title('Категорії')
    .items([
      S.listItem()
        .title('Налаштування сайту')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),

      S.listItem()
        .title('Заходи')
        .child(S.document().schemaType('events').documentId('events')),

      S.listItem()
        .title('Цифри роботи нашого фонду')
        .child(
          S.document()
            .schemaType('perfomance')
            .documentId('perfomance')
        ),

      S.listItem()
        .title('Про благодійний фонд')
        .child(
          S.document()
            .schemaType('aboutFoundation')
            .documentId('aboutFoundation')
        ),

      // Важное: исключаем singleton-документы из списка всех типов
      ...S.documentTypeListItems().filter(
        (item) => !singletonTypes.has(item.getId()) &&
        item.getId() !== 'donateOrder'
      ),
    ]);
