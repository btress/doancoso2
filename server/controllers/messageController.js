const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { senderName, senderEmail, content, senderType } = req.body;
    const userId = req.body.userId || req.user?._id;

    const message = await Message.create({
      userId,
      senderName,
      senderEmail,
      content,
      senderType
    });

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const filter = {};
    // allow filtering by userId query param to return only a user's conversation
    if (req.query.userId) {
      // Convert to ObjectId for matching
      filter.$or = [
        { userId: new mongoose.Types.ObjectId(req.query.userId) },
        { senderType: 'admin' }
      ];
    }

    const messages = await Message.find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .exec();

    res.json({ success: true, data: messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findByIdAndUpdate(
      messageId,
      { isRead: true },
      { new: true }
    );

    res.json({ success: true, data: message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    await Message.findByIdAndDelete(messageId);

    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
