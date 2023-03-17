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

  getFileStream(key, bucketName) {
    const params = {
      Bucket: bucketName,
      Key: key,
    };

    return this.s3.getObject(params).createReadStream();
  }

  async moveFile(srcKey, destKey, bucketName, deleteKey, deleteBucketName) {
    const copyParams = {
      CopySource: srcKey,
      Bucket: bucketName,
      Key: destKey,
    };
    await this.s3.copyObject(copyParams).promise();
    
    const deleteParams = {
      Bucket: deleteBucketName,
      Key: deleteKey,
    };
    await this.s3.deleteObject(deleteParams).promise();
  }
}

module.exports = new S3Service();
