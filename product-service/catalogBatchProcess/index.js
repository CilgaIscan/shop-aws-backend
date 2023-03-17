const { ProductService } = require('../product.service');


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

module.exports.handler = async (event) => {
  for (const record of event.Records) {
    await processProduct(record);
  }

  return {
    statusCode: 200,
  };
};