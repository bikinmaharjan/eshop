const express = require('express');

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  productPhotoUpload,
} = require('../controllers/products');

const Product = require('../models/Product');
const advancedResults = require('../middlewares/advancedResults');

const router = express.Router();

router
  .route('/')
  .get(advancedResults(Product), getProducts)
  .post(createProduct);

router.route('/:id').get(getProduct).put(updateProduct).delete(deleteProduct);

router.route('/:id/photo').put(productPhotoUpload);

module.exports = router;
