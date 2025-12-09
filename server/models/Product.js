const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    required: [true, 'Product image is required'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Please provide a valid image URL'
    }
  },
  storage: {
    type: String,
    required: [true, 'Storage capacity is required'],
    enum: ['64GB', '128GB', '256GB', '512GB', '1TB']
  },
  color: {
    type: String,
    required: [true, 'Color is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  features: [{
    type: String,
    maxlength: [200, 'Feature cannot exceed 200 characters']
  }],
  category: {
    type: String,
    required: true,
    enum: ['iphone-15-series', 'iphone-14-series', 'iphone-13-series', 'refurbished'],
    default: 'iphone-15-series'
  },
  modelType: {
    type: String,
    required: true,
    enum: ['standard', 'pro', 'pro-max'],
    default: 'standard'
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  discountPrice: {
    type: Number,
    min: 0
  },
  specifications: {
    display: String,
    processor: String,
    camera: String,
    battery: String,
    weight: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Calculate discount price before saving
// pre-save hook: calculate discountPrice if discount is set
productSchema.pre('save', function() {
  if (this.discount > 0) {
    this.discountPrice = this.price * (1 - this.discount / 100);
  }
});

// Virtual for final price
productSchema.virtual('finalPrice').get(function() {
  return this.discountPrice || this.price;
});

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, modelType: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isFeatured: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;