const mongoose = require("mongoose");
const ServerConfig = require("./server-config");
async function connectMongoDB() {
  try {
    await mongoose.connect(ServerConfig.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
}

module.exports = connectMongoDB;
