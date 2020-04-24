const mongoose = require('mongoose');
const slugify = require('slugify');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Name cannot be more than 50 characters'],
  },
  images: {
    type: String,
    default: 'no-photo.jpg',
  },
  category: {
    type: [String],
    required: [true, 'Please choose a category'],
    enum: ['Statue', 'Clothes', 'Shoes', 'Handicraft', 'Others'],
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating can not be more than 5'],
  },
  cost: {
    type: Number,
  },
  available: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

//Create product slug from the name
ProductSchema.pre('save', function () {
  this.slug = slugify(this.name, { lower: true });
});

module.exports = mongoose.model('Products', ProductSchema);
