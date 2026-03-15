const CrudRepository = require("./crud-repository");
const { DoctorProfile } = require("../models");
const NotFound = require("../errors/notfound");
class DoctorProfileRepository extends CrudRepository {
  constructor() {
    super(DoctorProfile);
  }
  async findByUserId(userId) {
    try {
      const doctor = await DoctorProfile.findOne({
        where: {
          userId: userId,
        },
      });
      return doctor;
    } catch (error) {
      throw error;
    }
  }
  async getAllVerifiedDoctors() {
    try {
      const doctors = await DoctorProfile.findAll({
        where: { isVerified: true },
        include: ["User"],
        order: [["experienceYears", "DESC"]],
      });
      return doctors;
    } catch (error) {
      throw error;
    }
  }
  async updateByUserId(userId, data) {
    try {
      const profile = await this.findByUserId(userId);
      if (!profile) {
        throw new NotFound("Couldn't find profile for user", userId);
      }
      return await profile.update(data);
    } catch (error) {
      throw error;
    }
  }
}
module.exports = DoctorProfileRepository;
