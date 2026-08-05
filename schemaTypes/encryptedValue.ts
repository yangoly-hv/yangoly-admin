export default {
  name: 'encryptedValue',
  title: 'Encrypted value',
  type: 'object',
  fields: [
    {name: 'algorithm', title: 'Algorithm', type: 'string', readOnly: true},
    {name: 'keyVersion', title: 'Key version', type: 'number', readOnly: true},
    {name: 'iv', title: 'IV', type: 'string', readOnly: true},
    {name: 'authTag', title: 'Auth tag', type: 'string', readOnly: true},
    {name: 'ciphertext', title: 'Ciphertext', type: 'text', readOnly: true},
  ],
}
