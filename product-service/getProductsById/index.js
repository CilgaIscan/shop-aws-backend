const { ProductService } = require('../product.service');

module.exports.handler = async (event) => {
  const { productId } = event.pathParameters;

  try {
    const product = await ProductService.getById(productId);
    return {
      statusCode: 200,
      body: JSON.stringify(product),
    }
  } catch (err) {
    console.error(err);
    if (err.message.toLowerCase().includes('not found')) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "NOT FOUND!",
        }),
      }
    } else {
      return {
        statusCode: 418,
        body: JSON.stringify({
          message: "Unknown Error!",
        }),
      }
    }
  }
};
