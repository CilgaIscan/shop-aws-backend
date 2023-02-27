const { ProductService } = require('../product.service');

module.exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: await ProductService.getAll(),
  };
};
