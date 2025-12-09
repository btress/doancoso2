const { validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const Product = require('../models/Product');

exports.getByProduct = async (req, res) => {
  try {
    const comments = await Comment.find({ product: req.params.productId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.addComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { productId } = req.params;
    const { content, rating } = req.body;

    const productExists = await Product.exists({ _id: productId });
    if (!productExists) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const comment = await Comment.create({
      product: productId,
      user: req.user._id,
      content,
      rating
    });

    const populated = await comment.populate('user', 'name email');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


