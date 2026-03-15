const { GoogleGenerativeAI } = require("@google/generative-ai");
// const fetch = require("node-fetch");
// Use your API key from .env or paste directly to test
const { ServerConfig } = require("../config");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const apiKey = ServerConfig.GOOGLE_API_KEY;

if (!apiKey) {
  console.error("❌ No GOOGLE_API_KEY found in .env file!");
  process.exit(1);
}

const url = "https://generativelanguage.googleapis.com/v1/models?key=" + apiKey;

(async () => {
  try {
    console.log("🔍 Fetching available Gemini models...");
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    }
    const data = await res.json();

    if (data.models) {
      console.log("✅ Models available to your API key:\n");
      data.models.forEach((m) => console.log(`• ${m.name}`));
    } else {
      console.log("⚠️ No models found or permission denied.");
      console.log(data);
    }
  } catch (error) {
    console.error("❌ Error fetching models:", error);
  }
})();
