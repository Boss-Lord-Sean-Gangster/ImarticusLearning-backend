const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Google Generative AI client with the API key
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Function to summarize text using Gemini
async function summarize(text) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = "Summarize this text:\n" + text;
      // Generate content using Gemini API
      const result = await model.generateContent(prompt);
      const response = result.response;
      const summary = response.text();
      return summary;
    } catch (error) {
      console.error("Error with Gemini summarization:", error.message);
      throw new Error("Failed to summarize the text using Gemini.");
    }
  }
  

module.exports = {
  summarize,
};
