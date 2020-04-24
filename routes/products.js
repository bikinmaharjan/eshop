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

const { protect, authorize } = require('../middlewares/auth');

router
  .route('/')
  .get(advancedResults(Product), getProducts)
  .post(protect, authorize('owner', 'admin'), createProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorize('owner', 'admin'), updateProduct)
  .delete(protect, authorize('owner', 'admin'), deleteProduct);

router
  .route('/:id/photo')
  .put(protect, authorize('owner', 'admin'), productPhotoUpload);

module.exports = router;
