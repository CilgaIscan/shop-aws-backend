const AWS = require('aws-sdk');

class ProductRepo {
  constructor() {
    this.awsClient = new AWS.DynamoDB.DocumentClient();
  }

  async _scanTable(tableName) {
    return await this.awsClient.scan({
      TableName: tableName,
    }).promise().then((data) => data.Items);
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
}

module.exports.ProductRepo = new ProductRepo();
