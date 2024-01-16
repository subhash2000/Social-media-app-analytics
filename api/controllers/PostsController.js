const PostsRepository = require('../repository/PostsRepository'),
  TransactionService = require('../services/TransactionService'),
  SocialMediaAnalyzerService = require('../services/SocialMediaAnalyzerService');

module.exports = {
  createPosts: async function (req, res) {
    let transaction;

    try {
      const { uniqueIdentifier, text } = req.body,
        // eslint-disable-next-line max-len
        // Important:- We will push this event to SQS and process it asynchronously through lambda and that will save the record in DB
        // rather than having this logic in controller
        { wordCount, averageWordLength } = SocialMediaAnalyzerService.findWordCountAndAverageWordLength(text);

      transaction = await TransactionService.start();

      const record = await PostsRepository.createPosts({
        uniqueIdentifier: uniqueIdentifier,
        wordCount: wordCount,
        averageWordLength: averageWordLength,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }, transaction);

      await TransactionService.commit(transaction);

      return res.send({ success: true, record: record });
    }

    catch (e) {
      TransactionService.rollback(transaction);

      return res.status(500).send({
        statusCode: 500,
        message: 'PostsController~createPosts: failed'
      });
    }
  },

  findByUniqueIdentifier: async function (req, res) {
    try {
      const record = await PostsRepository.findByUniqueIdentifier(req.params.uniqueIdentifier);

      return res.send({ success: true, record: record });
    }

    catch (e) {
      return res.status(500).send({
        statusCode: 500,
        message: 'PostsController~findByUniqueIdentifier: failed'
      });
    }
  }
};
