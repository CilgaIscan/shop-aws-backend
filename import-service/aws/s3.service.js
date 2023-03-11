const AWS = require('aws-sdk');


class S3Service {
  expireAfter = 60 * 5;

  constructor() {
    this.s3 = new AWS.S3(process.env.REGION_NAME);
  }

  async getSignedURL(key, bucketName, expireAfter) {
    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: expireAfter || this.expireAfter,
    };

    return await this.s3.getSignedUrlPromise('putObject', params);
  }
}

module.exports = new S3Service();
