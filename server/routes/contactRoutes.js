const express = require('express');
const { body } = require('express-validator');
const contactController = require('../controllers/contactController');

const router = express.Router();

router.post(
  '/',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('subject').isLength({ min: 3 }),
    body('message').isLength({ min: 5 })
  ],
  contactController.createMessage
);

module.exports = router;


