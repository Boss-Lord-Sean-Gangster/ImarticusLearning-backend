const router = express.Router();
const Razorpay = require("razorpay");
// const express = require("express");
// const app = express();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Replace with your Razorpay Key
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Replace with your Razorpay Secret
});

router.post("/api/create-order", async (req, res) => {
  try {
    const { amount } = req.body; // You can pass the amount dynamically from the frontend
    
    const options = {
      amount: amount * 100, // Amount in paise (1 INR = 100 paise)
      currency: "INR",
      receipt: `order_${new Date().getTime()}`,
      payment_capture: 1, // Capture payment immediately
    };

    // Create order
    razorpay.orders.create(options, (err, order) => {
      if (err) {
        return res.status(500).json({ error: "Failed to create order" });
      }

      res.json({ order });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
// app.listen(5000, () => console.log("Server running on port 5000"));
