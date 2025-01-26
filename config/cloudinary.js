// config/cloudinary.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,  // Replace with your Cloud name
  api_key: process.env.CLOUDINARY_API_KEY,        // Replace with your API key
  api_secret: process.env.CLOUDINARY_API_SECRET   // Replace with your API secret
});

module.exports = cloudinary;
