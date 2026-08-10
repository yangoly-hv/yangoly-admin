// deskStructure.js

const singletonTypes = new Set([
  'events',
  'perfomance',
  'aboutFoundation',
  'siteSettings',
]);

const hiddenDocumentTypes = new Set([
  ...singletonTypes,
  'donateOrder',
  'tail',
  'tailContribution',
  'collectionContribution',
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

      S.listItem()
        .title('Хвостики')
        .schemaType('tail')
        .child(
          S.list()
            .title('Хвостики')
            .items([
              S.listItem()
                .title('Усі хвостики')
                .schemaType('tail')
                .child(
                  S.documentTypeList('tail')
                    .title('Усі хвостики')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
                ),
              S.listItem()
                .title('З цільовими донатами')
                .schemaType('tail')
                .child(
                  S.documentTypeList('tail')
                    .title('З цільовими донатами')
                    .filter('_type == "tail" && amountCollected > 0')
                    .defaultOrdering([{field: 'amountCollected', direction: 'desc'}])
                ),
            ])
        ),

      // Важное: исключаем singleton-документы и служебные типы из списка всех типов
      ...S.documentTypeListItems().filter(
        (item) => !hiddenDocumentTypes.has(item.getId())
      ),
    ]);
