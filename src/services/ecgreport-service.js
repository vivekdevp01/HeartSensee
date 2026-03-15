const NotFound = require("../errors/notfound");
const UnauthorizedRequest = require("../errors/unauthorizedError");
const { EcgReportRepository } = require("../repositories");
const { report } = require("../routes");
const { sendEmailWithAttachment } = require("../utils/emailSender");
const { generateEcgReportPdf } = require("../utils/pdfGenerator");
const ecgReportRepository = new EcgReportRepository();

async function createEcgReport(patientId, data) {
  try {
    const report = await ecgReportRepository.create({ ...data, patientId });
    return report;
  } catch (error) {
    throw error;
  }
}
async function getSingleReport(reportId, patientId) {
  try {
    const report = await ecgReportRepository.findReportById(reportId);
    if (!report) {
      throw new NotFound("ECG Report not found", reportId);
    }
    if (report.patientId.toString() !== patientId.toString()) {
      throw new UnauthorizedRequest("Unauthorized access to this ECG report");
    }
    return report;
  } catch (error) {
    throw error;
  }
}
async function getPatientReports(patientId) {
  try {
    console.log("PatientId in Service:", patientId);

    const reports = await ecgReportRepository.getReportsByPatient(patientId);
    return reports;
  } catch (error) {
    throw error;
  }
}
async function getReportsByDate(patient, fromDate, toDate) {
  try {
    const endDate = toDate ? new Date(toDate) : new Date();

    // If fromDate is provided, use it; else default to a very old date (e.g., 1970)
    const startDate = fromDate ? new Date(fromDate) : new Date("1970-01-01");
    console.log("Patient info:", patient);

    const reports = await ecgReportRepository.getReportsByPatientAndDate(
      patient.id,
      startDate,
      endDate
    );
    if (!reports || reports.length === 0) {
      throw new NotFound("No ECG reports found for the specified date range");
    }
    const pdfBuffer = await generateEcgReportPdf(patient, reports);
    await sendEmailWithAttachment(
      patient.email,
      "Your ECG Reports",
      {
        ...patient,
        reports: reports, // reports fetched from DB
      },
      fromDate,
      toDate,
      pdfBuffer
    );
    return pdfBuffer;
  } catch (error) {
    throw error;
  }
}
module.exports = {
  createEcgReport,
  getSingleReport,
  getPatientReports,
  getReportsByDate,
};
