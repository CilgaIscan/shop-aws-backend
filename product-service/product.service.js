const { products } = require('./mockData');
const { ProductRepo } = require('./product.repo');

class ProductService {
  constructor() {
    this.products = products;
  }

  getAll() {
    return ProductRepo.scanAllWithStocks();
  }

  getById(id) {
    return Promise.resolve(this.products.find((p) => p.id === id));
  }
}

module.exports.ProductService = new ProductService();
