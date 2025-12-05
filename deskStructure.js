// deskStructure.js

const singletonTypes = new Set(['events', 'perfomance', 'aboutFoundation', "aboutFounders"]);

export const myStructure = (S) =>
  S.list()
    .title('Категорії')
    .items([
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
        .title('Про співзасновників фонда')
        .child(
          S.document()
            .schemaType('aboutFounders')
            .documentId('aboutFounders')
        ),

      // Важное: исключаем singleton-документы из списка всех типов
      ...S.documentTypeListItems().filter(
        (item) => !singletonTypes.has(item.getId())
      ),
    ]);
