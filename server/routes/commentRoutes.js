const express = require('express');
const { body } = require('express-validator');
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.get('/:productId', commentController.getByProduct);

router.post(
  '/:productId',
  auth,
  [
    body('content').isLength({ min: 2 }).withMessage('Content is required'),
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
  ],
  commentController.addComment
);

module.exports = router;


