function processProduct(record) {
  const productData = typeof record.body == 'string' ? JSON.parse(record.body) : record.body;
  console.log(JSON.stringify(productData));
}

module.exports.handler = async (event) => {
  const {Records: records} = event;

  records.forEach(processProduct);

  return {
    statusCode: 200,
  };
};