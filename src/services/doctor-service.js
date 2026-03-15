const ConflictError = require("../errors/conflictError");
const NotFound = require("../errors/notfound");
const UnauthorizedRequest = require("../errors/unauthorizedError");
const { DoctorProfileRepository, UserRepository } = require("../repositories");

const doctorProfileRepository = new DoctorProfileRepository();
const userRepository = new UserRepository();

async function saveDoctorProfile(
  userId,
  { specialization, experienceYears, clinicName }
) {
  try {
    let profile = await doctorProfileRepository.findByUserId(userId);
    if (profile) {
      profile = await doctorProfileRepository.updateByUserId(userId, {
        specialization,
        experienceYears,
        clinicName,
      });
    } else {
      profile = await doctorProfileRepository.create({
        userId,
        specialization,
        experienceYears,
        clinicName,
        isVerified: false,
      });
    }
    return profile;
  } catch (error) {
    // Sequelize validation or unique constraint errors
    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      const explanation = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      throw new ConflictError(
        "Validation failed for doctor profile",
        explanation
      );
    }
    throw error;
  }
}
async function getDoctorProfile(userId) {
  try {
    const profile = await doctorProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFound("Doctor profile not found for user", userId);
    }
    return profile;
  } catch (error) {
    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      const explanation = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      throw new ConflictError(
        "Validation failed for doctor profile",
        explanation
      );
    }
    throw error;
  }
}
async function verifyDoctorProfile(adminId, doctorUserId) {
  try {
    const admin = await userRepository.get(adminId);
    if (!admin || admin.role !== "admin") {
      throw new UnauthorizedRequest("Only admin can verify doctor profiles");
    }

    const profile = await doctorProfileRepository.findByUserId(doctorUserId);
    if (!profile) {
      throw new NotFound("Doctor profile not found for user", doctorUserId);
    }

    const updatedProfile = await doctorProfileRepository.updateByUserId(
      doctorUserId,
      {
        isVerified: !profile.isVerified,
      }
    );

    return updatedProfile;
  } catch (error) {
    throw error;
  }
}

async function unverifyDoctorProfile(adminId, doctorUserId) {
  try {
    const admin = await userRepository.get(adminId);
    if (!admin || admin.role !== "admin") {
      throw new UnauthorizedRequest("Only admin can unverify doctor profiles");
    }

    const profile = await doctorProfileRepository.findByUserId(doctorUserId);
    if (!profile) {
      throw new NotFound("Doctor profile not found for user", doctorUserId);
    }

    const updatedProfile = await doctorProfileRepository.updateByUserId(
      doctorUserId,
      {
        isVerified: false,
      }
    );

    return updatedProfile;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  saveDoctorProfile,
  getDoctorProfile,
  verifyDoctorProfile,
  unverifyDoctorProfile,
};
