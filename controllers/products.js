const Product = require('../models/Product');

// @desc    GET all products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: 'Show all products',
  });
};

// @desc    GET one product
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Show product ${req.params.id}`,
  });
};

// @desc    CREATE new product
// @route   POST /api/v1/products
// @access  Private
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      msg: 'Create new product',
      data: product,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Update product ${req.params.id}`,
  });
};

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Delete product ${req.params.id}`,
  });
};
