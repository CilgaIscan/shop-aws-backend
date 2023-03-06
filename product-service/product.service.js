const { products } = require('./mockData');

class ProductService {
  constructor() {
    this.products = products;
  }

  getAll() {
    return Promise.resolve(this.products);
  }

  getById(id) {
    return Promise.resolve(this.products.find((p) => p.id === id));
  }
}

module.exports.ProductService = new ProductService();
