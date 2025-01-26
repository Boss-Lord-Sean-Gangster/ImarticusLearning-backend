const express = require('express');
const multer = require('multer');
const documentController = require('../controllers/documentController');

const router = express.Router();

// Multer setup to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Store temporarily in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Keep original filename
  }
});
const upload = multer({ storage });

// Define the route to handle document uploads and parsing
router.post('/upload-and-parse', upload.single('document'), documentController.uploadDocument);

// Route to get documents by course
router.get('/:courseId', documentController.getDocumentsByCourse);

// Route to summarize a document
router.post('/summarise/:documentId', documentController.summarizeDocument);

module.exports = router;
