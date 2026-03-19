// const PdfPrinter = require("pdfmake");
// const { ChartJSNodeCanvas } = require("chartjs-node-canvas");

// // Setup fonts (point to your downloaded Roboto fonts)
// const path = require("path");

// const fonts = {
//   Roboto: {
//     normal: path.join(__dirname, "../fonts/Roboto/static/Roboto-Regular.ttf"),
//     bold: path.join(__dirname, "../fonts/Roboto/static/Roboto-Medium.ttf"),
//     italics: path.join(__dirname, "../fonts/Roboto/static/Roboto-Italic.ttf"),
//     bolditalics: path.join(
//       __dirname,
//       "../fonts/Roboto/static/Roboto-MediumItalic.ttf"
//     ),
//   },
// };

// const printer = new PdfPrinter(fonts);

// // Function to generate chart image
// async function generateProbabilityChart(reports) {
//   const width = 800;
//   const height = 400;
//   const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

//   // Flatten probabilities across reports
//   const labels = [];
//   const datasetValues = {};

//   reports.forEach((report, rIdx) => {
//     if (report.probabilities) {
//       report.probabilities.forEach((p, i) => {
//         labels.push(`R${rIdx + 1}-B${p.beat_index}`);
//         p.probabilities.forEach((val, classIdx) => {
//           if (!datasetValues[classIdx]) datasetValues[classIdx] = [];
//           datasetValues[classIdx].push(val);
//         });
//       });
//     }
//   });

//   const datasets = Object.keys(datasetValues).map((classIdx) => ({
//     label: `Class ${classIdx}`,
//     data: datasetValues[classIdx],
//     borderColor: `hsl(${classIdx * 60}, 70%, 50%)`,
//     fill: false,
//     tension: 0.3,
//   }));

//   const config = {
//     type: "line",
//     data: { labels, datasets },
//     options: {
//       responsive: true,
//       plugins: {
//         legend: { position: "top" },
//         title: { display: true, text: "ECG Class Probabilities" },
//       },
//       scales: {
//         y: { min: 0, max: 1, ticks: { stepSize: 0.2 } },
//       },
//     },
//   };

//   const image = await chartJSNodeCanvas.renderToDataURL(config);
//   return image;
// }

// async function generateEcgReportPdf(patient, reports) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       // ✅ Summary Table
//       const tableBody = [
//         [
//           { text: "#", bold: true },
//           { text: "Date & Time", bold: true },
//           { text: "Status", bold: true },
//           { text: "Class", bold: true },
//           { text: "Comments", bold: true },
//         ],
//       ];

//       if (reports && reports.length > 0) {
//         reports.forEach((r, i) => {
//           tableBody.push([
//             { text: i + 1 },
//             { text: new Date(r.createdAt).toLocaleString() },
//             {
//               text: r.status,
//               color: r.status === "abnormal" ? "red" : "green",
//             },
//             { text: r.classLabel || "-" },
//             { text: r.comments || "-" },
//           ]);
//         });
//       } else {
//         tableBody.push([
//           {
//             text: "No ECG reports available",
//             colSpan: 5,
//             alignment: "center",
//             color: "red",
//           },
//           {},
//           {},
//           {},
//           {},
//         ]);
//       }

//       // ✅ Probability Table (show first report’s probabilities for demo)
//       const probTableBody = [["Beat", "Class", "P0", "P1", "P2", "P3", "P4"]];

//       if (reports && reports.length > 0 && reports[0].probabilities) {
//         reports[0].probabilities.forEach((p) => {
//           probTableBody.push([
//             p.beat_index,
//             p.class_label,
//             ...(p.probabilities || []).map((val) => val.toFixed(4)),
//           ]);
//         });
//       } else {
//         probTableBody.push([
//           {
//             text: "No probability data available",
//             colSpan: 7,
//             alignment: "center",
//           },
//           {},
//           {},
//           {},
//           {},
//           {},
//           {},
//         ]);
//       }

//       // ✅ Probability Chart
//       const chartImage = await generateProbabilityChart(reports);

//       // 📄 Document definition
//       const docDefinition = {
//         content: [
//           { text: "ECG Report Summary", style: "header" },
//           "\n",
//           { text: `Patient Name: ${patient.firstName} ${patient.lastName}` },
//           { text: `Email: ${patient.email}` },
//           { text: `Patient ID: ${patient.id}` },
//           "\n\n",

//           { text: "Summary of Reports", style: "subheader" },
//           {
//             table: {
//               headerRows: 1,
//               widths: ["auto", "auto", "auto", "auto", "*"],
//               body: tableBody,
//             },
//             layout: "lightHorizontalLines",
//           },

//           "\n\n",
//           { text: "Probability Details (First Report)", style: "subheader" },
//           {
//             table: { headerRows: 1, body: probTableBody },
//             layout: "lightHorizontalLines",
//           },

//           "\n\n",
//           { text: "Probability Chart", style: "subheader" },
//           { image: chartImage, width: 500, alignment: "center" },

//           "\n\n",
//           { text: "Doctor's Notes:", style: "subheader" },
//           { text: "...................................................." },
//           { text: "...................................................." },
//         ],
//         styles: {
//           header: {
//             fontSize: 20,
//             bold: true,
//             alignment: "center",
//             color: "#0d6efd",
//           },
//           subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
//         },
//         defaultStyle: { font: "Roboto", fontSize: 10 },
//       };

//       // Generate PDF
//       const pdfDoc = printer.createPdfKitDocument(docDefinition);
//       const chunks = [];
//       pdfDoc.on("data", (chunk) => chunks.push(chunk));
//       pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));
//       pdfDoc.end();
//     } catch (err) {
//       reject(err);
//     }
//   });
// }

// module.exports = { generateEcgReportPdf };
const PdfPrinter = require("pdfmake");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const path = require("path");
const { getLifestyleAdvice } = require("../services/aiService"); // ✅ added for AI summary

const fonts = {
  Roboto: {
    normal: path.join(__dirname, "../fonts/Roboto/static/Roboto-Regular.ttf"),
    bold: path.join(__dirname, "../fonts/Roboto/static/Roboto-Medium.ttf"),
    italics: path.join(__dirname, "../fonts/Roboto/static/Roboto-Italic.ttf"),
    bolditalics: path.join(
      __dirname,
      "../fonts/Roboto/static/Roboto-MediumItalic.ttf",
    ),
  },
};

const printer = new PdfPrinter(fonts);

// ✅ Chart generator
// async function generateProbabilityChart(reports) {
//   const width = 800;
//   const height = 400;
//   const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

//   const labels = [];
//   const datasetValues = {};

//   reports.forEach((report, rIdx) => {
//     if (report.probabilities) {
//       report.probabilities.forEach((p) => {
//         labels.push(`R${rIdx + 1}-B${p.beat_index}`);
//         p.probabilities.forEach((val, classIdx) => {
//           if (!datasetValues[classIdx]) datasetValues[classIdx] = [];
//           datasetValues[classIdx].push(val);
//         });
//       });
//     }
//   });

//   const datasets = Object.keys(datasetValues).map((classIdx) => ({
//     label: `Class ${classIdx}`,
//     data: datasetValues[classIdx],
//     borderColor: `hsl(${classIdx * 60}, 70%, 50%)`,
//     fill: false,
//     tension: 0.3,
//   }));

//   const config = {
//     type: "line",
//     data: { labels, datasets },
//     options: {
//       responsive: true,
//       plugins: {
//         legend: { position: "top" },
//         title: { display: true, text: "ECG Class Probabilities" },
//       },
//       scales: {
//         y: { min: 0, max: 1, ticks: { stepSize: 0.2 } },
//       },
//     },
//   };

//   return await chartJSNodeCanvas.renderToDataURL(config);
// }
// const axios = require("axios");
// async function generateProbabilityChart(reports) {

//   try {
//     const labels = [];
//     const datasetValues = {};

//     reports.forEach((report, rIdx) => {
//       if (report.probabilities) {
//         report.probabilities.forEach((p) => {
//           labels.push(`R${rIdx + 1}-B${p.beat_index}`);
//           p.probabilities.forEach((val, classIdx) => {
//             if (!datasetValues[classIdx]) datasetValues[classIdx] = [];
//             datasetValues[classIdx].push(val);
//           });
//         });
//       }
//     });

//     const datasets = Object.keys(datasetValues).map((classIdx) => ({
//       label: `Class ${classIdx}`,
//       data: datasetValues[classIdx],
//       fill: false,
//       borderColor: `hsl(${classIdx * 60}, 70%, 50%)`,
//     }));

//     const chartConfig = {
//       type: "line",
//       data: {
//         labels,
//         datasets,
//       },
//     };

//     const response = await axios.post(
//       "https://quickchart.io/chart",
//       {
//         chart: chartConfig,
//         width: 800,
//         height: 400,
//       },
//       {
//         responseType: "arraybuffer",
//       },
//     );

//     const base64 = Buffer.from(response.data, "binary").toString("base64");
//     return `data:image/png;base64,${base64}`;
//   } catch (err) {
//     console.log("QuickChart error:", err.message);
//     return null;
//   }
// }
const axios = require("axios");

async function generateProbabilityChart(reports) {
  try {
    const labels = [];
    const datasetValues = {};

    reports.forEach((report, rIdx) => {
      if (report.probabilities) {
        report.probabilities.forEach((p) => {
          labels.push(`R${rIdx + 1}-B${p.beat_index}`);
          p.probabilities.forEach((val, classIdx) => {
            if (!datasetValues[classIdx]) datasetValues[classIdx] = [];
            datasetValues[classIdx].push(val);
          });
        });
      }
    });

    let datasets = Object.keys(datasetValues).map((classIdx) => ({
      label: `Class ${classIdx}`,
      data: datasetValues[classIdx],
      fill: false,
      borderColor: `hsl(${classIdx * 60}, 70%, 50%)`,
    }));

    const chartConfig = {
      type: "line",
      data: {
        labels,
        datasets,
      },
    };

    const response = await axios.post(
      "https://quickchart.io/chart",
      {
        chart: chartConfig,
        width: 800,
        height: 400,
      },
      { responseType: "arraybuffer" },
    );

    const base64 = Buffer.from(response.data).toString("base64");
    return `data:image/png;base64,${base64}`;
  } catch (err) {
    console.log("Chart failed:", err.message);
    return null;
  }
}
// ✅ Enhanced PDF generator
async function generateEcgReportPdf(patient, reports) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!Array.isArray(reports)) reports = [reports];

      const latestReport = reports?.[0] || {};
      let aiAdvice = latestReport.aiAdvice || "No AI advice available.";

      // 🧠 If multiple reports (whole-day summary), re-run AI for daily summary
      if (reports.length > 1) {
        console.log("🧠 Generating AI daily summary...");
        try {
          aiAdvice = await getLifestyleAdvice(reports);
        } catch (err) {
          console.error("❌ AI daily summary failed:", err.message);
        }
      }

      // ✅ Summary Table
      const tableBody = [
        [
          { text: "#", bold: true },
          { text: "Date & Time", bold: true },
          { text: "Status", bold: true },
          { text: "Class", bold: true },
          { text: "Comments", bold: true },
        ],
      ];

      if (reports.length > 0) {
        reports.forEach((r, i) => {
          tableBody.push([
            { text: i + 1 },
            { text: new Date(r.createdAt).toLocaleString() },
            {
              text: r.status,
              color: r.status === "abnormal" ? "red" : "green",
            },
            { text: r.classLabel || "-" },
            { text: r.comments || "-" },
          ]);
        });
      } else {
        tableBody.push([
          {
            text: "No ECG reports available",
            colSpan: 5,
            alignment: "center",
            color: "red",
          },
          {},
          {},
          {},
          {},
        ]);
      }

      // ✅ Probability Table (first report)
      // ✅ Probability Table (include ALL reports)
      const probTableBody = [
        ["Report #", "Beat", "Class", "P0", "P1", "P2", "P3", "P4"],
      ];

      let foundData = false;

      reports.forEach((report, rIdx) => {
        if (report.probabilities && report.probabilities.length > 0) {
          foundData = true;
          report.probabilities.forEach((p) => {
            probTableBody.push([
              `R${rIdx + 1}`, // report index
              p.beat_index,
              p.class_label,
              ...(p.probabilities || []).map((val) => val.toFixed(4)),
            ]);
          });
        }
      });

      if (!foundData) {
        probTableBody.push([
          {
            text: "No probability data available",
            colSpan: 8,
            alignment: "center",
          },
          {},
          {},
          {},
          {},
          {},
          {},
          {},
        ]);
      }

      // ✅ Chart
      // let chartImage = await generateProbabilityChart(reports);
      let chartImage = null;

      try {
        chartImage = await generateProbabilityChart(reports);
      } catch (err) {
        console.log("Chart failed:", err.message);
      }

      // ✅ AI Advice Formatting
      const formattedAiAdvice = aiAdvice
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map((line) => {
          // Remove Markdown markers like **bold** or *italic*
          const cleanLine = line
            .replace(/\*\*(.*?)\*\*/g, "$1") // remove **bold**
            .replace(/\*(.*?)\*/g, "$1"); // remove *italic*

          // Detect headings (usually start with 'ECG' or end with ':')
          const isHeading = line.startsWith("**") || line.trim().endsWith(":");

          // Detect numbered or bulleted points
          const isListItem =
            /^\d+\./.test(line.trim()) || /^[-•]/.test(line.trim());

          return {
            text: cleanLine.trim(),
            bold: isHeading, // bold for headings
            margin: isListItem ? [15, 2, 0, 2] : [0, 3, 0, 2], // indent list items
          };
        });

      // 📄 PDF Content
      const docDefinition = {
        content: [
          { text: "ECG Report Summary", style: "header" },
          "\n",
          { text: `Patient Name: ${patient.firstName} ${patient.lastName}` },
          { text: `Email: ${patient.email}` },
          { text: `Patient ID: ${patient.id}` },
          "\n\n",

          {
            text:
              reports.length > 1
                ? "Whole-Day ECG Summary"
                : "Single ECG Report Summary",
            style: "subheader",
            color: "#0d6efd",
          },
          {
            table: {
              headerRows: 1,
              widths: ["auto", "auto", "auto", "auto", "*"],
              body: tableBody,
            },
            layout: "lightHorizontalLines",
          },

          "\n\n",
          { text: "Probability Details (First Report)", style: "subheader" },
          {
            table: { headerRows: 1, body: probTableBody },
            layout: "lightHorizontalLines",
          },

          "\n\n",
          { text: "Probability Chart", style: "subheader" },
          // { image: chartImage, width: 500, alignment: "center" },
          ...(chartImage
            ? [{ image: chartImage, width: 500, alignment: "center" }]
            : []),

          "\n\n",
          {
            text:
              reports.length > 1
                ? "AI Daily Wellness Summary"
                : "AI Wellness Advice",
            style: "subheader",
            color: "#0d6efd",
          },
          ...formattedAiAdvice,

          "\n\n",
          { text: "Doctor's Notes:", style: "subheader" },
          { text: "...................................................." },
          { text: "...................................................." },
        ],
        styles: {
          header: {
            fontSize: 20,
            bold: true,
            alignment: "center",
            color: "#0d6efd",
          },
          subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
        },
        defaultStyle: { font: "Roboto", fontSize: 10 },
      };

      // ✅ Generate PDF
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      const chunks = [];
      pdfDoc.on("data", (chunk) => chunks.push(chunk));
      pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));
      pdfDoc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generateEcgReportPdf };
