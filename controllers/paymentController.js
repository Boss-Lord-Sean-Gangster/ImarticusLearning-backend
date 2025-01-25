const Razorpay = require('razorpay');
const Payment = require('../models/Payment');
const Course = require('../models/Course');  // Import Course model
const razorpayConfig = require('../config/payment');  // Import Razorpay config

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: razorpayConfig.key_id,
  key_secret: razorpayConfig.key_secret,
});

// Create Payment Record and Razorpay Order
const createPayment = async (req, res) => {
  const { user, course } = req.body;  // Only user and course are needed, amount will be fetched automatically

  try {
    // Fetch the course price
    const courseDetails = await Course.findById(course);
    if (!courseDetails) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Convert course price to a number, handle "free" case by setting it to 0
    let amount = parseFloat(courseDetails.price);

    // If the price is "free" or non-numeric, set the amount to 0
    if (isNaN(amount) || courseDetails.price.toLowerCase().includes("free")) {
      amount = 0;
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert amount to paise (1 INR = 100 paise)
      currency: 'INR',
      receipt: `receipt_${course}`, // Unique receipt ID for the course purchase
      payment_capture: 1, // Automatically capture the payment
    };

    razorpay.orders.create(options, async (err, order) => {
      if (err) {
        return res.status(500).json({
          message: 'Error creating Razorpay order',
          error: err,
        });
      }

      // Save payment record with Razorpay order details
      const newPayment = new Payment({
        user,
        course,
        amount,
        razorpayOrderId: order.id,
        paymentStatus: 'pending',  // Set payment status to pending initially
      });

      await newPayment.save();
      
      res.status(201).json({
        message: "Payment created successfully",
        payment: newPayment,
        order: order,  // Send Razorpay order details to frontend
      });
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating payment',
      error: error.message,
    });
  }
};

// Verify Razorpay Payment and Update Status
const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    // Find the payment record
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });

    if (!payment) {
      return res.status(400).json({ message: 'Payment record not found' });
    }

    // Verify payment signature using Razorpay key secret
    const crypto = require('crypto');
    const generated_signature = crypto
      .createHmac('sha256', razorpayConfig.key_secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Payment is successful, update payment status
      payment.razorpayPaymentId = razorpay_payment_id;
      payment.razorpaySignature = razorpay_signature;
      payment.razorpayPaymentStatus = 'paid';
      payment.paymentStatus = 'completed';
      await payment.save();

      return res.status(200).json({
        message: 'Payment verified and updated successfully',
        payment: payment,
      });
    } else {
      // Invalid signature
      return res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error verifying payment',
      error: error.message,
    });
  }
};

module.exports = { createPayment, verifyPayment };
