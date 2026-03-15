const { StatusCodes } = require("http-status-codes");
const { EcgReportService } = require("../services");
const { User } = require("../models");
async function createEcgReport(req, res, next) {
  try {
    const patientId = req.user.id;
    const data = req.body;
    const report = await EcgReportService.createEcgReport(patientId, data);
    return res.status(201).json({
      success: true,
      message: "ECG Report created successfully",
      data: report,
    });
  } catch (error) {
    next(error);
  }
}
async function getSingleReport(req, res, next) {
  try {
    const reportId = req.params.reportId;
    const report = await EcgReportService.getSingleReport(
      reportId,
      req.user.id
    );
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "ECG Report fetched successfully",
      data: report,
    });
  } catch (error) {
    next(error);
  }
}
async function getPatientReports(req, res, next) {
  try {
    const patientId = req.user.id;
    const reports = await EcgReportService.getPatientReports(patientId);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "ECG Reports fetched successfully",
      data: reports,
    });
  } catch (error) {
    next(error);
  }
}
async function downloadReports(req, res, next) {
  try {
    // fetch full patient info from DB
    const patientFromDb = await User.findByPk(req.user.id);

    if (!patientFromDb) {
      return res
        .status(StatusCodes.BAD_GATEWAY)
        .json({ success: false, message: "Patient not found" });
    }
    const patient = {
      id: req.user.id,
      firstName: patientFromDb.firstName,
      lastName: patientFromDb.lastName,
      email: patientFromDb.email,
    };
    console.log("Patient in Controller:", patient);

    const { fromDate, toDate } = req.body;

    await EcgReportService.getReportsByDate(patient, fromDate, toDate);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Reports sent to your email successfully",
    });
  } catch (error) {
    next(error);
  }
}
module.exports = {
  createEcgReport,
  getSingleReport,
  getPatientReports,
  downloadReports,
};
