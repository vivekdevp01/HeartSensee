const { StatusCodes } = require("http-status-codes");
const { EcgReadingService } = require("../services");

async function createEcgReading(req, res, next) {
  try {
    const patientId = req.user.id;
    const ecgData = req.body;
    const ecgReading = await EcgReadingService.createReading(
      patientId,
      ecgData
    );
    return res.status(StatusCodes.CREATED).json({
      success: true,
      data: ecgReading,
      message: "ECG reading created successfully",
    });
  } catch (error) {
    next(error);
  }
}

async function getPatientReadings(req, res, next) {
  try {
    const patientId = req.user.id;
    const { limit } = req.query;
    const ecgReadings = await EcgReadingService.getPatientReadings(
      patientId,
      limit
    );
    return res.status(StatusCodes.OK).json({
      success: true,
      data: ecgReadings,
      message: "ECG readings fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

async function getReadingsByDateRange(req, res, next) {
  try {
    const patientId = req.user.id;
    const { startDate, endDate } = req.query;
    const ecgReadings = await EcgReadingService.getReadingsByDateRange(
      patientId,
      startDate,
      endDate
    );
    res.status(StatusCodes.OK).json({
      success: true,
      data: ecgReadings,
      message: "ECG readings fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}

async function getReadingById(req, res, next) {
  try {
    const { id } = req.params;
    const ecgReading = await EcgReadingService.getReadingById(id);
    res.status(StatusCodes.OK).json({
      success: true,
      data: ecgReading,
      message: "ECG reading fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}
async function getDoctorPatientReadings(req, res, next) {
  try {
    console.log("Inside getDoctorPatientReadings Controller");
    const doctorId = req.user.id;
    const { limit } = req.query;
    const response = await EcgReadingService.getReadingsForDoctor(
      doctorId,
      limit
    );
    console.log("Response in Controller:", response);
    res.status(StatusCodes.OK).json({
      success: true,
      data: response,
      message: "ECG readings fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}
module.exports = {
  createEcgReading,
  getPatientReadings,
  getReadingsByDateRange,
  getReadingById,
  getDoctorPatientReadings,
};
