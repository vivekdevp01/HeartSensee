// const { generateEcgReportPdf } = require("./pdfGenerator");

// // Mock patient
// const patient = {
//   firstName: "Vivek",
//   lastName: "Pundir",
//   email: "rishikeshtv2002@gmail.com",
//   id: 19,
// };

// // Mock reports (can be replaced with DB data)
// const reports = [
//   { createdAt: new Date("2025-09-20"), heartRate: 78, comments: "Normal" },
//   { createdAt: new Date("2025-09-21"), heartRate: 95, comments: "Normal" },
//   { createdAt: new Date("2025-09-22"), heartRate: 102, comments: "High" },
// ];

// (async () => {
//   const pdfBuffer = await generateEcgReportPdf(patient, reports);
//   require("fs").writeFileSync("ECG_Report.pdf", pdfBuffer);
//   console.log("PDF generated successfully!");
// })();
