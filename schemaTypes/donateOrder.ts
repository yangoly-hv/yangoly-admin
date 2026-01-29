export default {
    name: "donateOrder",
    title: "Donate Order",
    type: "document",
    __experimental_actions: ['delete'],
    fields: [
      {
        name: "orderReference",
        title: "Order Reference",
        type: "string",
      },
      {
        name: "returnPath",
        title: "Return Path",
        type: "string",
      },
      {
        name: "createdAt",
        title: "Created At",
        type: "datetime",
      },
    ],
  };