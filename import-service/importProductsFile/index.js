const S3 = require('../aws/s3.service');

BUCKET_NAME = process.env.IMPORT_BUCKET_NAME;
KEY_PREFIX = 'uploaded'

module.exports.handler = async (event) => {
  const { name: filename } = event.queryStringParameters;
  
  const url = await S3.getSignedURL(`${KEY_PREFIX}/${filename}`, BUCKET_NAME);
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      url,
    }),
  };
};
