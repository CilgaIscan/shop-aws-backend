const fs = require('fs');
const products = require("./products.json");

const requests = {
  "stocks": [],
  "products": [],
}

for (let product of products) {
  const stock = {
    'PutRequest': {
      "Item": {
        "product_id": { "S": product.id },
        "count": { "N": `${product.count}` }
      }
    }
  }
  requests.stocks.push(stock);

  const p = {
    'PutRequest': {
      "Item": {
        "id": { "S": product.id },
        "title": { "S": product.title },
        "description": { "S": product.description },
        "price": { "N": `${product.price}` }
      }
    }
  }
  requests.products.push(p);

}

fs.writeFile('./aws-request.json', JSON.stringify(requests, null, 2), err => {
  if (err) {
      console.log('Error writing file', err)
  } else {
      console.log('Successfully wrote file')
  }
})
