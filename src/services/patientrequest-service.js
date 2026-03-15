const BadRequest = require("../errors/badRequestError");
const NotFound = require("../errors/notfound");
const { PatientRequestRepository, UserRepository } = require("../repositories");
const patientrequestrepository = new PatientRequestRepository();
const userRepository = new UserRepository();
async function createPatientRequest(patientId, doctorId, message) {
  try {
    const doctor = await userRepository.get(doctorId);
    console.log("Doctor found:", doctor);
    if (!doctor || doctor.role !== "doctor") {
      throw new BadRequest(
        "Invalid doctor ID",
        `No doctor found with ID ${doctorId}`
      );
    }
    const request = await patientrequestrepository.createRequest(
      patientId,
      doctorId,
      message
    );
    console.log("Patient request created:", request);
    return request;
  } catch (error) {
    throw error;
  }
}
async function getRequestsForDoctor(doctorId) {
  try {
    const requests = await patientrequestrepository.findRequestsForDoctor(
      doctorId
    );
    return requests;
  } catch (error) {
    throw error;
  }
}
async function getRequestByIdForDoctor(id, doctorId) {
  try {
    const request = await patientrequestrepository.findRequestByIdAndDoctor(
      id,
      doctorId
    );
    if (!request) {
      throw new NotFound(
        "Request not found or unauthorized",
        `Request ${id} not assigned to doctor ${doctorId}`
      );
    }
    return request;
  } catch (error) {
    throw error;
  }
}
async function updateRequestStatus(requestId, doctorId, status) {
  try {
    // fetch request and ensure it's for this doctor
    const request = await patientrequestrepository.findRequestByIdAndDoctor(
      requestId,
      doctorId
    );

    if (!request) {
      throw new NotFound(
        "Request not found",
        `No request found with ID ${requestId} for doctor ${doctorId}`
      );
    }

    if (request.status !== "pending") {
      throw new BadRequest("Invalid action", "Request already processed");
    }

    // update request status
    const updatedRequest = await patientrequestrepository.updateRequestStatus(
      requestId,
      status
    );

    // if approved → set doctorId for patient
    if (status === "approved") {
      await userRepository.update(request.patientId, { doctorId });
    }

    return updatedRequest;
  } catch (error) {
    throw error;
  }
}
async function getAllDoctors() {
  try {
    console.log("Fetching all doctors from DB");
    const doctors = await userRepository.findAll({
      where: { role: "doctor" },
      attributes: { exclude: ["password"] },
      include: [{ association: "DoctorProfile", required: false }],
    });
    console.log("Doctors fetched:", doctors);
    return doctors;
  } catch (error) {
    throw error;
  }
}
module.exports = {
  createPatientRequest,
  getRequestsForDoctor,
  getRequestByIdForDoctor,
  updateRequestStatus,
  getAllDoctors,
};
