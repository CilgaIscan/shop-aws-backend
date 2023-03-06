const { ProductService } = require('../product.service');

module.exports.handler = async (event) => {
  const data = await ProductService.getAll();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
