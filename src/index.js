const express = require("express");
const http = require("http");
const { ServerConfig } = require("./config");
const bodyParser = require("body-parser");
const ErrorHandler = require("./utils/errorHandler");
const setupSwagger = require("./utils/swagger");
const apiRoutes = require("./routes");
const connectMongoDB = require("./config/mongo-connection");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);
app.use("/api", apiRoutes);

setupSwagger(app);
app.use(ErrorHandler);
async function startServer() {
  try {
    await connectMongoDB();
    server.listen(ServerConfig.PORT, () => {
      console.log(
        `Successfully started the server on PORT : ${ServerConfig.PORT}`,
      );
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
}
const axios = require("axios");

// Example ECG signal (replace with real ECG samples from device)
let ecgSignal = Array.from({ length: 1000 }, () => Math.random() * 0.5);

async function getPrediction() {
  try {
    const response = await axios.post(
      "https://python-ml-production-37e3.up.railway.app/predict",
      {
        ecg_signal: ecgSignal,
      },
    );

    console.log("✅ Prediction Result:");
    console.log("Number of Beats:", response.data.num_beats);

    response.data.results.forEach((beat, i) => {
      console.log(`Beat ${i}:`);
      console.log("  Predicted Class:", beat.predicted_class);
      console.log("  Label:", beat.class_label);
      console.log("  Probabilities:", beat.probabilities);
    });
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

startServer();
getPrediction();
