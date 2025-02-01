// routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const { createVideo, getVideos,getVideoById } = require('../controllers/videoController');

// POST request to add a video
router.post('/', createVideo);

// GET request to fetch all videos
router.get('/', getVideos);

// Define route to get video by ID
router.get("/:videoId", getVideoById);

module.exports = router;
