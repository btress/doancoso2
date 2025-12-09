const express = require('express');
const { body } = require('express-validator');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.get('/', orderController.getOrders);

router.post(
  '/',
  [
    body('customer.name').notEmpty(),
    body('customer.email').isEmail(),
    body('items').isArray({ min: 1 }),
    body('totalAmount').isNumeric()
  ],
  orderController.createOrder
);

module.exports = router;


