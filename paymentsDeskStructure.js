export const paymentsStructure = (S) =>
  S.list()
    .title('Payments')
    .items([
      S.documentTypeListItem('donateOrder').title('Payment orders'),
      S.documentTypeListItem('paymentOccurrence').title('Payment occurrences'),
      S.documentTypeListItem('wayforpayCallback').title('WayForPay callbacks'),
      S.documentTypeListItem('paymentEffect').title('Payment effects'),
    ])
