const path = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse"); // Import pdf-parse
const cloudinary = require("../config/cloudinary");
const Document = require("../models/Document"); // Import the Document model
const Course = require("../models/Course");
const { summarize } = require("../config/gemini"); // Import Gemini summarization function

// Helper function to get the resource type based on file extension
function getResourceType(fileName) {
  const extension = path.extname(fileName).toLowerCase();
  // Check if it's a PDF or text file
  if (extension === '.pdf' || extension === '.txt') {
    return 'raw'; // Use 'raw' for PDF or text files
  }
  // Default to 'auto' for other file types (e.g., images)
  return 'auto';
}

// Controller to handle both uploading and summarizing
const documentController = {
  // Upload document and extract text immediately
  async uploadDocument(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Get the resource type based on file extension
      const resourceType = getResourceType(req.file.originalname);

      // Upload the file to Cloudinary with 'raw' resource type for PDFs
      const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        resource_type: resourceType,
        public_id: `documents/${Date.now()}_${path.basename(req.file.originalname)}`,
      });

      // Extract text from the document if it is a PDF
      let extractedText = "";
      if (resourceType === 'raw' && path.extname(req.file.originalname).toLowerCase() === '.pdf') {
        const dataBuffer = fs.readFileSync(req.file.path);
        const parsedData = await pdfParse(dataBuffer);
        extractedText = parsedData.text;
      }

      // Create a new document in MongoDB
      const newDocument = new Document({
        courseId: req.body.courseId,
        fileName: req.file.originalname,
        fileUrl: uploadedFile.secure_url,
        extractedText: extractedText, // Store the extracted text
        summary: "", // Placeholder for summary (empty initially)
      });


      await newDocument.save();

      const updatedCourse = await Course.findByIdAndUpdate(
            req.body.courseId,
            { $push: { documents: newDocument._id } }, // Push the new video's ID into the course's videos array
            { new: true }
          );
      
          if (!updatedCourse) {
            return res.status(404).json({ message: "Course not found" });
          }

      // Clean up the file after uploading
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(200).json({
        message: 'File uploaded and text extracted successfully',
        fileUrl: uploadedFile.secure_url,
        document: newDocument,
      });
    } catch (error) {
      console.error(error);

      // Cleanup the file if an error occurs
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({ error: 'Error uploading the document and extracting text' });
    }
  },

  // Summarize the extracted text from the document
  async summarizeDocument(req, res) {
    try {
      const documentId = req.params.documentId;

      // Find the document by ID
      const document = await Document.findById(documentId);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      // Use the already extracted text to summarize
      if (!document.extractedText) {
        return res.status(400).json({ error: "No extracted text available for summarization" });
      }

      // Summarize the extracted text using Gemini
      const summary = await summarize(document.extractedText);

      // Save the summary in the document model
      document.summary = summary;
      await document.save();

      res.status(200).json({
        message: "Document summarized successfully",
        summary,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error summarizing the document" });
    }
  },

  async getDocumentsByCourse(req, res) {
    try {
      const courseId = req.params.courseId;

      // Find documents by course ID
      const documents = await Document.find({ courseId });

      res.status(200).json(documents);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching documents" });
    }
  }
};

module.exports = documentController;
