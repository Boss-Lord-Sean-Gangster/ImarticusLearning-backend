const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    author: { type: String, required: true },
    duration: { type: String, required: true },  
    price: { type: String, required: true },
    ratings: { type: Number },  
    enrollments: { type: Number },  
    image: { type: String },  
    curriculum: { type: [String] },  
    instructor: {
      name: { type: String },
      bio: { type: String },
      image: { type: String },
    },
    faqs: [{ question: String, answer: String }],
    createdAt: { type: Date, default: Date.now },

    sections: [
      {
        title: { type: String, required: true }, // e.g., "Introduction", "Advanced Topics"
        videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
        documents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
      },
    ],

  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
