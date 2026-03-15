const CrudRepository = require("./crud-repository");
const { PatientDoctorRequest, User } = require("../models");
class PatientRequestRepository extends CrudRepository {
  constructor() {
    super(PatientDoctorRequest);
  }
  async createRequest(patientId, doctorId, message) {
    try {
      console.log("Creating request in DB with:", {
        patientId,
        doctorId,
        message,
      });
      const response = await PatientDoctorRequest.create({
        patientId,
        doctorId,
        message,
        status: "pending",
      });
      console.log("Request created in DB:", response);
      return response;
    } catch (error) {
      throw error;
    }
  }
  async findRequestById(id) {
    try {
      const response = await PatientDoctorRequest.findByPk(id, {
        include: [
          {
            model: User,
            as: "patient",
            attributes: ["id", "firstName", "lastName", "email"],
          },
          {
            model: User,
            as: "doctor",
            attributes: ["id", "firstName", "lastName", "email"],
          },
        ],
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
  async findRequestsForDoctor(doctorId) {
    try {
      const response = await PatientDoctorRequest.findAll({
        where: { doctorId },
        include: [
          {
            model: User,
            as: "patient",
            attributes: ["id", "firstName", "lastName", "email", "age"],
          },
        ],
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
  async findRequestByIdAndDoctor(id, doctorId) {
    try {
      console.log("Finding request by ID and Doctor:", { id, doctorId });
      const response = await PatientDoctorRequest.findOne({
        where: { id, doctorId },
        include: [
          {
            model: User,
            as: "patient",
            attributes: ["id", "firstName", "lastName", "email", "age"],
          },
        ],
      });
      console.log("Request found for doctor:", response);
      return response;
    } catch (error) {
      throw error;
    }
  }
  async updateRequestStatus(id, status) {
    try {
      const [count, rows] = await PatientDoctorRequest.update(
        { status },
        {
          where: { id },
          returning: true, // important: returns updated row(s)
        }
      );

      if (count === 0) return null;
      return rows[0]; // return updated request
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PatientRequestRepository;
