const AWS = require('aws-sdk');
const PostsRepository = require('../repositories/PostsRepository');

const SocialMediaAnalyzerService = require('../services/SocialMediaAnalyzerService');

const sqs = new AWS.SQS({ region: 'us-east-1' });

/**
 * Function to receive messages from SQS
 *
 * @param {*} queueUrl : The SQS queue URL
 * @returns {Array}: Array of messages
 */
async function receiveMessages (queueUrl) {
  const receiveParams = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 10,
    WaitTimeSeconds: 5
  };

  const response = await sqs.receiveMessage(receiveParams).promise();

  return response.Messages || [];
}

/**
   * Calculating the word count and average word length
   *
   * @param {*} reqBody : The SQS body
   * @returns {Object }: word count and average word length
   */
function processMessage (reqBody) {
  try {
    const { uniqueIdentifier, text } = JSON.parse(reqBody),
      { wordCount, averageWordLength } = SocialMediaAnalyzerService.findWordCountAndAverageWordLength(text);

    return {
      uniqueIdentifier: uniqueIdentifier,
      wordCount: wordCount,
      averageWordLength: averageWordLength,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }
  catch (e) {
    console.error('Error processing message:', e);

    return {};
  }
}

/**
 * To save messages in SQS
 *
 * @param {*} message : Array of messages
 * @param {*} repository : The repository object
 */
async function saveMessages (message, repository) {
  try {
    const transaction = await repository.startTransaction();

    await repository.createPosts(message, transaction);

    await repository.commitTransaction(transaction);
  }
  catch (e) {
    console.error('Error saving messages:', e);
  }
}

exports.handler = async () => {
  try {
    const queueUrl = 'YOUR_SQS_QUEUE_URL';
    const postsRepository = new PostsRepository();

    const messages = await receiveMessages(queueUrl);

    if (messages.length === 0) {
      return {
        statusCode: 200,
        body: 'No messages to process'
      };
    }

    for (const message of messages) {
      const processedMessage = processMessage(message.Body);

      // eslint-disable-next-line no-await-in-loop
      await saveMessages(processedMessage, postsRepository);
    }

    return {
      statusCode: 200,
      body: 'Messages processed and saved successfully'
    };
  } catch (error) {
    console.error('Error processing messages:', error);

    return {
      statusCode: 500,
      body: 'Error processing messages'
    };
  }
};
