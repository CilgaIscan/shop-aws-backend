const S3 = require('../aws/s3.service');
const SQS = require('../aws/sqs.service');
const csv = require('csv-parser');

BUCKET_NAME = process.env.IMPORT_BUCKET_NAME;
QUEUE_URL = process.env.QUEUE_URL;
IMPORT_KEY_PREFIX = 'uploaded';
TARGET_KEY_PREFIX = 'parsed';

async function moveFile(filename, bucketName) {
  srcKey = `${bucketName}/${filename}`;
  destKey = filename.replace(IMPORT_KEY_PREFIX, TARGET_KEY_PREFIX);
  
  await S3.moveFile(srcKey, destKey, bucketName, filename, bucketName);
}

function processFileStream(fileStream) {
  const results = [];

  fileStream
    .pipe(csv())
    .on('data', (line) => results.push(line))
    .on('end', 
      () => results.forEach(
        async (product) => await SQS.sendMessage(product, QUEUE_URL)
      )
    );
}

module.exports.handler = async (event) => {
  for (const record of event.Records) {
    const bucketName = record.s3.bucket.name;
    const filename = record.s3.object.key;

    const stream = S3.getFileStream(filename, bucketName);
    processFileStream(stream);

    try {
      await moveFile(filename, bucketName);
    } catch (e) {
      console.error(`Error occured while moving the file: ${filename}!`, e);
    }
  }

  return {
    statusCode: 202,
  };  
};
