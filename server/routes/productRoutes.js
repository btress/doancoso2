const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const adminAuth = require('../middleware/adminAuth');

// Get featured products
router.get('/featured', productController.getFeaturedProducts);

// Search products
router.get('/search/:query', productController.searchProducts);

// Get products by category
router.get('/category/:category', productController.getProductsByCategory);

// Get related products
router.get('/:id/related', productController.getRelatedProducts);

// Update product stock
router.patch('/:id/stock', productController.updateStock);

// Get all products with filters
router.get('/', productController.getAllProducts);

// Get product by ID
router.get('/:id', productController.getProductById);

// Create new product (admin only)
router.post('/', adminAuth, productController.createProduct);

// Update product (admin only)
router.put('/:id', adminAuth, productController.updateProduct);

// Delete product (admin only)
router.delete('/:id', adminAuth, productController.deleteProduct);

module.exports = router;