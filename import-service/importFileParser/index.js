const S3 = require('../aws/s3.service');
const csv = require('csv-parser');

BUCKET_NAME = process.env.IMPORT_BUCKET_NAME;
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
    .on('end', () => {
      results.forEach((d) => {
        console.log(JSON.stringify(d));
      });
    });
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
