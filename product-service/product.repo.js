const AWS = require('aws-sdk');

class ProductRepo {
  constructor() {
    this.awsClient = new AWS.DynamoDB.DocumentClient();
  }

  async _scanTable(tableName) {
    return await this.awsClient
    .scan({
      TableName: tableName,
    })
    .promise()
    .then((data) => data.Items);
  }

  async _getItem(tableName, filter) {
    return await this.awsClient
    .get({
      TableName: tableName,
      Key: filter
    })
    .promise()
    .then((data) => data.Item);
  }

  async _putItem(tableName, item) {
    await this.awsClient.put({
      TableName: tableName,
      Item: item,
    }).promise();
  }

  async scanAllWithStocks() {
    const products = await this._scanTable(process.env.PRODUCTS_TABLE_NAME);
    const stocks = await this._scanTable(process.env.STOCKS_TABLE_NAME);

    return products.map((p) => {
      const stock = stocks.find((s) => s.product_id === p.id);
      return {
        ...p,
        count: stock.count,
      };
    })
  }

  async getById(id) {
    const product = await this._getItem(process.env.PRODUCTS_TABLE_NAME, {
      id: id,
    });
    if (!product) {
      throw new Exception(`Product not found! Product Id: ${id}`);
    }

    const stock = await this._getItem(process.env.STOCKS_TABLE_NAME, {
      product_id: id,
    });
    if (!stock) {
      throw new Exception(`Stock not found for the product! Product Id: ${id}`);
    }

    return {
      ...product,
      count: stock.count,
    }
  }

  async put(product) {
    const productId = `${AWS.util.uuid.v4()}`;
    
    const newProduct = {
      id: product.id || productId,
      title: product.title,
      description: product.description,
      price: product.price,
    }
    await this._putItem(process.env.PRODUCTS_TABLE_NAME, newProduct);

    const newStock = {
      product_id: newProduct.id,
      count: product.count || 1,
    }
    await this._putItem(process.env.STOCKS_TABLE_NAME, newStock);

    return {
      ...newProduct,
      count: newStock.count,
    };
  }
}

module.exports.ProductRepo = new ProductRepo();
