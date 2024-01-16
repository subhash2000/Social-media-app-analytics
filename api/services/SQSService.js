const AWS = require('aws-sdk');

class SQSService {
  constructor (queueUrl) {
    this.sqs = new AWS.SQS({ region: 'us-east-1' });
    this.queueUrl = queueUrl;
  }

  async sendMessage (message) {
    const params = {
      MessageBody: JSON.stringify(message),
      QueueUrl: this.queueUrl
    };

    try {
      const result = await this.sqs.sendMessage(params).promise();

      console.log(`Message sent with ID: ${result.MessageId}`);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  async receiveMessages (maxNumberOfMessages) {
    const params = {
      QueueUrl: this.queueUrl,
      MaxNumberOfMessages: maxNumberOfMessages
    };

    try {
      const result = await this.sqs.receiveMessage(params).promise();

      return result.Messages;
    } catch (error) {
      console.error('Error receiving messages:', error);

      return [];
    }
  }

  async deleteMessage (receiptHandle) {
    const params = {
      QueueUrl: this.queueUrl,
      ReceiptHandle: receiptHandle
    };

    try {
      await this.sqs.deleteMessage(params).promise();
      console.log('Message deleted successfully');
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  }
}

module.exports = SQSService;
