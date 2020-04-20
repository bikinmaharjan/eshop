const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

// @desc    GET all products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  let query;

  //Copy req.query
  const reqQuery = { ...req.query };

  //Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  //Loop over removeFields and delete them from the reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);

  //Create Operators ($gt, $gte, $lt, $lte)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //Finding resources
  query = Product.find(JSON.parse(queryStr));

  //Select Field
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Product.countDocuments();

  query = query.skip(startIndex).limit(limit);

  const products = await query;

  //Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: products.length,
    pagination,
    data: products,
  });
});

// @desc    GET one product
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    msg: `Show product ${req.params.id}`,
    data: product,
  });
});

// @desc    CREATE new product
// @route   POST /api/v1/products
// @access  Private
exports.createProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    msg: 'Create new product',
    data: product,
  });
});

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    msg: `Update product ${req.params.id}`,
    data: product,
  });
});

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    msg: `Delete product ${req.params.id}`,
  });
});
