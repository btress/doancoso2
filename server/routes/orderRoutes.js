const express = require('express');
const { body } = require('express-validator');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.get('/', orderController.getOrders);

// Get order statistics
router.get('/stats', orderController.getOrderStats);

router.post(
  '/',
  [
    body('customer.name').notEmpty(),
    body('customer.email').isEmail(),
    body('customer.phone').notEmpty(),
    body('items').isArray({ min: 1 }),
    body('totalAmount').isNumeric()
  ],
  orderController.createOrder
);

module.exports = router;



