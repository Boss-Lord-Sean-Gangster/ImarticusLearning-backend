const Video = require('../models/Video');
const Course = require('../models/Course'); // Import Course model

// Create Video
const createVideo = async (req, res) => {
  const { title, description, length, author, videoUrl, course } = req.body;

  try {
    // Ensure all required fields are provided
    if (!title || !videoUrl || !course || !length || !author) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Create a new video object
    const newVideo = new Video({ title, description, length, author, videoUrl, course });
    await newVideo.save();

    // Update the course with the new video reference
    const updatedCourse = await Course.findByIdAndUpdate(
      course,
      { $push: { videos: newVideo._id } }, // Push the new video's ID into the course's videos array
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(201).json({ message: "Video created successfully", video: newVideo });
  } catch (error) {
    console.error("Error creating video:", error);  // Log the error for debugging
    res.status(500).json({ message: "Error creating video", error: error.message });
  }
};

// Get all Videos
const getVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching videos", error: error.message });
  }
};

module.exports = { createVideo, getVideos };
