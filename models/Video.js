const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    videoUrl: {
      type: String,
      required: true, // This will store the YouTube video URL
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", // Reference to the Course model
      required: true, // Link this video to a course
    },
    length: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
