const { validationResult } = require('express-validator');
const User = require('../models/User');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'cart.product',
      select: 'name price image storage color discount discountPrice'
    });

    res.json({ success: true, data: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.upsertItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { productId, quantity = 1, color, storage } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const user = await User.findById(req.user._id);
    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId && item.color === color && item.storage === storage
    );

    if (existingItem) {
      existingItem.quantity = quantity;
    } else {
      user.cart.push({
        product: productId,
        quantity,
        color,
        storage,
        priceAtAdd: product.discountPrice || product.price
      });
    }

    await user.save();
    const populated = await user.populate({
      path: 'cart.product',
      select: 'name price image storage color discount discountPrice'
    });

    res.status(200).json({ success: true, data: populated.cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter((item) => item._id?.toString() !== itemId);
    await user.save();

    const populated = await user.populate({
      path: 'cart.product',
      select: 'name price image storage color discount discountPrice'
    });

    res.json({ success: true, data: populated.cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();
    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
