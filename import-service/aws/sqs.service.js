const AWS = require('aws-sdk');


class SQSService {
  constructor() {
    this.sqs = new AWS.SQS();
  }

  sendMessage(data, queueUrl) {
    const params = {
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(data),
    };

    return this.sqs.sendMessage(params).promise();
  }
}

module.exports = new SQSService();
