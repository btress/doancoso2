const { validationResult } = require('express-validator');
const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  // Dấu hiệu đặc biệt để xác nhận code được chạy
  console.log('╔════════════════════════════════════╗');
  console.log('║  ORDER CONTROLLER HIT - NEW CODE   ║');
  console.log('╚════════════════════════════════════╝');
  
  console.log('=== ORDER DEBUG ===');
  console.log('Method: POST /api/orders');
  console.log('Body:', JSON.stringify(req.body, null, 2));
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation FAILED:', errors.array());
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const order = await Order.create(req.body);
    console.log('Order created successfully:', order._id);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error('Order creation FAILED:', error.name, error.message);
    console.error('Full error:', error);
    res.status(500).json({ success: false, error: error.message, details: error.name });
  }
};

exports.getOrders = async (_req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



