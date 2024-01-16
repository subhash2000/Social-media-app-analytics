module.exports = {
  body: {
    type: 'object',
    properties: {
      uniqueIdentifier: {
        type: 'string'
      },
      text: {
        type: 'string'
      }
    },
    required: ['uniqueIdentifier', 'text']
  }
};
