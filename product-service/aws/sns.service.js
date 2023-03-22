const AWS = require('aws-sdk');


class SNSService {
  constructor() {
    this.sns = new AWS.SNS();
  }

  publish(message, topic) {
    const params = {
      Message: message,
      TopicArn: topic
    };
    
    return this.sns.publish(params).promise();
  }
}

module.exports = new SNSService();