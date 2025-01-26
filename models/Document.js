const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // Assuming you have a 'Course' model that tracks courses
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  extractedText: {
    type: String, // To store the extracted text from the document
    default: "", // Set default to empty string
  },
  summary: {
    type: String, // To store the summarized text
    default: "", // Set default to empty string
  },
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
