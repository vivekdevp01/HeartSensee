// testQueue.js
const { publishAiJob } = require("../Jobs/aiJob");

(async () => {
  const testJob = {
    reportId: 123,
    patientId: 1,
    doctorId: 2,
    status: "normal",
    patientInfo: { age: 45, gender: "male" },
  };

  await publishAiJob(testJob);
})();
