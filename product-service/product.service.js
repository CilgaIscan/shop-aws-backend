const { ProductRepo } = require('./product.repo');

class ProductService {
  getAll() {
    return ProductRepo.scanAllWithStocks();
  }

  getById(id) {
    return ProductRepo.getById(id);
  }
}

module.exports.ProductService = new ProductService();
