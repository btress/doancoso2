const express = require('express');
const { body } = require('express-validator');
const messageController = require('../controllers/messageController');

const router = express.Router();

// Send message
router.post(
  '/',
  [
    body('senderName').notEmpty(),
    body('senderEmail').isEmail(),
    body('content').notEmpty(),
    body('senderType').isIn(['customer', 'admin'])
  ],
  messageController.sendMessage
);

// Get all messages
router.get('/', messageController.getMessages);

// Mark message as read
router.put('/:messageId/read', messageController.markAsRead);

// Delete message
router.delete('/:messageId', messageController.deleteMessage);

module.exports = router;
