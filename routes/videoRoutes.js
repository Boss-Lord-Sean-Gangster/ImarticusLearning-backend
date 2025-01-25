// routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const { createVideo, getVideos } = require('../controllers/videoController');

// POST request to add a video
router.post('/', createVideo);

// GET request to fetch all videos
router.get('/', getVideos);

module.exports = router;
