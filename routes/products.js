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

const { protect } = require('../middlewares/auth');

router
  .route('/')
  .get(advancedResults(Product), getProducts)
  .post(protect, createProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

router.route('/:id/photo').put(protect, productPhotoUpload);

module.exports = router;
