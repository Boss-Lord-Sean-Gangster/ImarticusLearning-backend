// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Optional: To enable CORS for cross-origin requests

// Load environment variables
dotenv.config();

// Create the app
const app = express();

// Middleware
app.use(express.json());  // For parsing JSON bodies
app.use(cors({
  origin: 'http://localhost:5173'
}));  // Enable CORS (if needed for frontend requests)

// Import routes
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const videoRoutes = require('./routes/videoRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const documentRoutes = require('./routes/documentRoutes');

// Use the routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/documents', documentRoutes);

// Connect to the MongoDB database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch(err => {
    console.log('Database connection error:', err);
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
