const CrudRepository = require("./crud-repository");
const { EcgReport, User } = require("../models");
const { Op } = require("sequelize");
class EcgReportRepository extends CrudRepository {
  constructor() {
    super(EcgReport);
  }
  async findReportById(id) {
    return await EcgReport.findByPk(id, {
      include: [
        {
          model: User,
          as: "Patient",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: User,
          as: "Doctor",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
    });
  }

  async getReportsByPatient(patientId) {
    console.log("Fetching reports for patient:", patientId);
    try {
      return await EcgReport.findAll({
        where: { patientId },
        include: [
          {
            model: User,
            as: "Doctor",
            attributes: ["id", "firstName", "lastName"],
            required: false, // Include reports even if no doctor is assigned
          },
        ],
        order: [["createdAt", "DESC"]],
      });
    } catch (error) {
      console.error("Error fetching reports for patient:", patientId, error);
      throw error;
    }
  }

  async getReportsByDoctor(doctorId) {
    return await EcgReport.findAll({
      where: { doctorId },
      include: [
        {
          model: User,
          as: "Patient",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }
  async getReportsByPatientAndDate(patientId, fromDate, toDate) {
    return await EcgReport.findAll({
      where: {
        patientId,
        createdAt: {
          [Op.gte]: new Date(fromDate),
          [Op.lte]: new Date(toDate),
        },
      },
      order: [["createdAt", "ASC"]],
    });
  }
}
module.exports = EcgReportRepository;
