const Video = require("../models/Video");
const Course = require("../models/Course"); // Import Course model

// Create Video
const createVideo = async (req, res) => {
  const { title, description, length, author, videoUrl, courseId, sectionTitle } = req.body;

  try {
    // Ensure all required fields are provided
    if (!title || !videoUrl || !courseId || !length || !author || !sectionTitle) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Find the course and check if it exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the section exists within the course
    let section = course.sections.find(sec => sec.title === sectionTitle);

    if (!section) {
      // If the section doesn't exist, create a new section
      section = {
        title: sectionTitle,  // Title from the request body
        videos: []  // Initialize empty video array
      };

      // Push the new section into the course's sections array
      course.sections.push(section);
    }

    // Create the new video object
    const newVideo = new Video({
      title,
      description,
      length,
      author,
      videoUrl,
      course: courseId
    });

    // Save the new video
    await newVideo.save();

    // Add the new video ID to the section's videos array
    section.videos.push(newVideo._id);

    // Ensure the modified section is updated inside the course
    course.sections = course.sections.map(sec =>
      sec.title === sectionTitle ? section : sec
    );

    // Save the updated course with the new section and video
    await course.save();

    res.status(201).json({ message: "Video added successfully to the section", video: newVideo });
  } catch (error) {
    console.error("Error creating video:", error); // Log the error for debugging
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

// Get Video by ID
const getVideoById = async (req, res) => {
  const { videoId } = req.params;

  try {
    // Fetch the video by its ID
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.status(200).json(video);
  } catch (error) {
    console.error("Error fetching video by ID:", error); // Log the error for debugging
    res.status(500).json({ message: "Error fetching video", error: error.message });
  }
};

module.exports = { createVideo, getVideos, getVideoById };
