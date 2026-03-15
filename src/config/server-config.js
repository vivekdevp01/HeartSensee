// const dotenv = require("dotenv");

// dotenv.config();
const path = require("path");
const dotenv = require("dotenv");

// Force dotenv to load from the Heart-Sense root folder
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

module.exports = {
  PORT: process.env.PORT,
  SALT_ROUND: parseInt(process.env.SALT_ROUND) || 10,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY,
  GMAIL_USER: process.env.GMAIL_USER,
  GMAIL_PASS: process.env.GMAIL_PASS,
  MONGODB_URL: process.env.MONGODB_URL,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  RABBITMQ_URL: process.env.RABBITMQ_URL,
};
