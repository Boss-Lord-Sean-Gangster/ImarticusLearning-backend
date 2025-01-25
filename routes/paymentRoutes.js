const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Route to create a Razorpay order
router.post('/create-course-order', paymentController.createPayment);

// Route to verify the Razorpay payment after success
router.post('/verify-payment', paymentController.verifyPayment);

module.exports = router;
