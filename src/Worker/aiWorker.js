// aiWorker.js
const amqp = require("amqplib");
const { getLifestyleAdvice } = require("../services/aiService");
const { EcgReport } = require("../models"); // adjust path as needed
const ServerConfig = require("../config/server-config");
// const ecgreport = require("../models/ecgreport");

const RABBITMQ_URL = ServerConfig.RABBITMQ_URL || "amqp://localhost";
const AI_QUEUE = "ai_ecg_analysis";

async function startWorker() {
 const conn = await amqp.connect(RABBITMQ_URL + "?heartbeat=30");
  const ch = await conn.createChannel();
  await ch.assertQueue(AI_QUEUE, { durable: true });
  ch.prefetch(1);
  console.log("🤖 AI Worker running... waiting for jobs");

  ch.consume(
    AI_QUEUE,
    async (msg) => {
      const job = JSON.parse(msg.content.toString());
      console.log("🧩 Received AI job:", job);

      try {
        const advice = await getLifestyleAdvice({
          status: job.status,
          patientInfo: job.patientInfo,
          class: job.classLabel,
        });

        await EcgReport.update(
          {
            aiAdvice: advice,
            aiStatus: "done",
            aiGeneratedAt: new Date(),
          },
          { where: { id: job.reportId } }
        );

        console.log(`✅ AI advice stored for report ID ${job.reportId}`);
        ch.ack(msg);
      } catch (error) {
        console.error("❌ AI job failed:", error);
        await EcgReport.update(
          { aiStatus: "failed", aiError: error.message },
          { where: { id: job.reportId } }
        );
        ch.nack(msg, false, false);
      }
    },
    { noAck: false }
  );
}

startWorker().catch((err) => {
  console.error("Worker startup failed:", err);
  process.exit(1);
});
