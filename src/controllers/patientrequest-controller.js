const { StatusCodes } = require("http-status-codes");
const { PatientRequestService } = require("../services");

async function createRequest(req, res, next) {
  try {
    const patientId = req.user.id;
    const { doctorId, message } = req.body;
    console.log("Creating request:", { patientId, doctorId, message });
    const request = await PatientRequestService.createPatientRequest(
      patientId,
      doctorId,
      message
    );
    console.log("Request created:", request);
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Patient request created successfully",
      data: request,
    });
  } catch (error) {
    next(error);
  }
}

async function getRequestsForDoctor(req, res, next) {
  try {
    const doctorId = req.user.id;
    const request = await PatientRequestService.getRequestsForDoctor(doctorId);
    console.log("Requests fetched:", request);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Requests fetched successfully",
      data: request,
    });
  } catch (error) {
    next(error);
  }
}
async function getRequestById(req, res, next) {
  try {
    const { id } = req.params;

    // If doctor is logged in → restrict to only their requests
    if (req.user.role === "doctor") {
      const request = await PatientRequestService.getRequestByIdForDoctor(
        id,
        req.user.id
      );
      console.log("Doctor's request fetched:", request);
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Doctor's request fetched successfully",
        data: request,
      });
    }
  } catch (error) {
    next(error);
  }
}
async function updateRequestStatus(req, res, next) {
  try {
    const doctorId = req.user.id; // logged in doctor
    const { id } = req.params; // requestId
    const { status } = req.body; // "approved" | "rejected"

    if (!["approved", "rejected"].includes(status)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid status. Must be 'approved' or 'rejected'.",
      });
    }

    const updatedRequest = await PatientRequestService.updateRequestStatus(
      id,
      doctorId,
      status
    );
    console.log("Request status updated:", updatedRequest);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: `Request ${status} successfully`,
      data: updatedRequest,
    });
  } catch (error) {
    next(error);
  }
}
async function getAllDoctors(req, res, next) {
  try {
    console.log("Fetching all doctors");
    const doctors = await PatientRequestService.getAllDoctors();
    console.log("Doctors fetched:", doctors);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Doctors fetched successfully",
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
}
module.exports = {
  createRequest,
  getRequestsForDoctor,
  getRequestById,
  updateRequestStatus,
  getAllDoctors,
};
