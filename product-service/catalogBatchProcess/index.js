const { ProductService } = require('../product.service');
const SNS = require('../aws/sns.service');

SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;

async function processProduct(record) {
  const productData = typeof record.body == 'string' ? JSON.parse(record.body) : record.body;
  const {title, description, count, price} = productData;

  try {
    const product = await ProductService.create({
      title,
      description,
      price: Number.parseFloat(price),
      count: Number.parseFloat(count),
    });
  
    console.debug(`Product (#${product.id}) Processed!`);
  } catch (e) {
    console.error('Error occurred while creating the product!', e);
  }
}

async function notifyAll() {
  try {
    await SNS.publish('Batch products creation finished!', SNS_TOPIC_ARN);

    console.debug(`Notification sent to ${SNS_TOPIC_ARN}!`);
  } catch (e) {
    console.error(`Error occurred while sending the notification to ${SNS_TOPIC_ARN}!`, e);
  }
}

module.exports.handler = async (event) => {
  for (const record of event.Records) {
    await processProduct(record);
  }

  await notifyAll();

  return {
    statusCode: 200,
  };
};