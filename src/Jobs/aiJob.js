const amqp = require("amqplib");
const ServerConfig = require("../config/server-config");
const RABBITMQ_URL = ServerConfig.RABBITMQ_URL;
const QUEUE_NAME = "ai_ecg_analysis";

async function publishAiJob(job) {
  try {
    const conn = await amqp.connect(RABBITMQ_URL + "?heartbeat=30");
    const channel = await conn.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(job)), {
      persistent: true,
    });
    console.log("Published AI job to queue:", job);
    await channel.close();
    await conn.close();
  } catch (error) {
    console.error("Error publishing AI job:", error);
  }
}
module.exports = {
  publishAiJob,
};
