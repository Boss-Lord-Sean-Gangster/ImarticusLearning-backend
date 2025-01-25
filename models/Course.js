const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    duration: {
      type: String,  // e.g., "2 Years"
      required: true,
    },
    price: {
      type: String,  // e.g., "Free"
      required: true,
    },
    ratings: {
      type: Number,  // e.g., 4.5 (stars)
    },
    enrollments: {
      type: Number,  // e.g., 4786
    },
    image: {
      type: String,  // URL of the course image
    },
    curriculum: {
      type: [String],  // List of curriculum items
    },
    instructor: {
      name: { type: String },
      bio: { type: String },
      image: { type: String },  // URL of the instructor's image
    },
    faqs: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    documents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Document",
        }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
