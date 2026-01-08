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

exports.getOrderStats = async (_req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Get all orders
    const allOrders = await Order.find({});
    
    // Calculate stats
    const totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const todayRevenue = allOrders
      .filter(order => new Date(order.createdAt) >= startOfToday)
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const totalOrders = allOrders.length;
    const pendingOrders = allOrders.filter(o => o.status === 'pending').length;
    const completedOrders = allOrders.filter(o => o.status === 'delivered').length;
    
    // Revenue by day (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayOrders = allOrders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= date && orderDate < nextDate;
      });
      
      const dayRevenue = dayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      
      last7Days.push({
        date: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        revenue: dayRevenue,
        orders: dayOrders.length
      });
    }
    
    // Revenue by month (last 6 months)
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const monthOrders = allOrders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= date && orderDate < nextDate;
      });
      
      const monthRevenue = monthOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      
      last6Months.push({
        month: date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }),
        revenue: monthRevenue,
        orders: monthOrders.length
      });
    }
    
    // Top selling products
    const productStats = {};
    allOrders.forEach(order => {
      order.items?.forEach(item => {
        const key = item.name || item.product?.toString();
        if (!productStats[key]) {
          productStats[key] = { name: item.name || key, quantity: 0, revenue: 0 };
        }
        productStats[key].quantity += item.quantity || 0;
        productStats[key].revenue += (item.price || 0) * (item.quantity || 0);
      });
    });
    
    const topProducts = Object.values(productStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    
    res.json({
      success: true,
      data: {
        totalRevenue,
        todayRevenue,
        totalOrders,
        pendingOrders,
        completedOrders,
        last7Days,
        last6Months,
        topProducts
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};



