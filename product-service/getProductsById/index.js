const { ProductService } = require('../product.service');

module.exports.handler = async (event) => {
  const { productId } = event.pathParameters;

  const product = await ProductService.getById(productId);

  if (product) {
    return {
      statusCode: 200,
      body: product,
    };
  } else {
    return {
      statusCode: 404,
      body: "NOT FOUND!",
    }
  }
};
