const Review = require('../models/Review');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const path = require('path');

// @desc    GET all reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/products/:productId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.productId) {
    const reviews = await Review.find({
      product: req.params.productId,
    });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    GET single review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'product',
    select: 'name description',
  });
  if (!review) {
    return next(
      new ErrorResponse(`No review found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc    Add review
// @route   POST /api/v1/products/:productId/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.product = req.params.productId;
  req.body.user = req.user.id;

  const product = await Product.findById(req.params.productId);

  if (!product) {
    return next(
      new ErrorResponse(`No product with ${req.params.productId} found`, 404)
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review,
  });
});
