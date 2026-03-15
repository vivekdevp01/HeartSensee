const { StatusCodes } = require("http-status-codes");
const { DoctorService } = require("../services");

async function createDoctorProfile(req, res, next) {
  try {
    const userId = req.user.id; // get from JWT
    const { specialization, experienceYears, clinicName } = req.body;
    const profile = await DoctorService.saveDoctorProfile(userId, {
      specialization,
      experienceYears,
      clinicName,
    });
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Doctor profile created/updated successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}
async function getDoctorProfile(req, res, next) {
  try {
    const userId = req.user.id; // get from JWT
    const profile = await DoctorService.getDoctorProfile(userId);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Doctor profile fetched successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}
async function verifyDoctor(req, res, next) {
  try {
    const doctorId = req.params.id;
    const updatedProfile = await DoctorService.verifyDoctorProfile(req.user.id, doctorId);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Doctor profile verified successfully",
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
}
async function unverifyDoctor(req, res, next) {
  try {
    const doctorId = req.params.id;
    const updatedProfile = await DoctorService.unverifyDoctorProfile(req.user.id, doctorId);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Doctor profile unverfied successfully",
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
}
module.exports = {
  createDoctorProfile,
  getDoctorProfile,
  verifyDoctor,
  unverifyDoctor,
};
