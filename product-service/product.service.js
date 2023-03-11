const { ProductRepo } = require('./product.repo');

class ProductService {
  getAll() {
    return ProductRepo.scanAllWithStocks();
  }

  getById(id) {
    return ProductRepo.getById(id);
  }

  create(product) {
    return ProductRepo.put(product);
  }
}

module.exports.ProductService = new ProductService();
