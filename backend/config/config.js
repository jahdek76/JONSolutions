require('dotenv').config();

module.exports = {
    openaiApiKey: process.env.OPENAI_API_KEY,
    elevenLabsApiKey: process.env.ELEVEN_LABS_API_KEY,
    mongoDbUri: process.env.MONGODB_URI,
    port: process.env.PORT || 3000
}; 