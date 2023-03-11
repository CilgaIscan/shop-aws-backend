const { ProductService } = require('../product.service');

module.exports.handler = async (event) => {
  const data = JSON.parse(event.body);
  const product = await ProductService.create(data);
  console.log(product)
  return {
    statusCode: 200,
    body: JSON.stringify(product),
  };
};