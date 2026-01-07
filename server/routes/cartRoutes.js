const express = require('express');
const { body } = require('express-validator');
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, cartController.getCart);

router.post(
  '/',
  auth,
  [
    body('productId').notEmpty().withMessage('productId is required'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('quantity must be at least 1')
  ],
  cartController.upsertItem
);

router.delete('/:itemId', auth, cartController.removeItem);

router.delete('/', auth, cartController.clearCart);

module.exports = router;


