const { StatusCodes } = require("http-status-codes");
const BadRequest = require("../errors/badRequestError");
const UnauthorizedRequest = require("../errors/unauthorizedError");
const { UserRepository } = require("../repositories");
const NotFound = require("../errors/notfound");
const userRepository = new UserRepository();

async function createAdmin(data) {
  const existingAdmin = await userRepository.getByEmail(data.email);
  if (existingAdmin) {
    throw new BadRequest("Admin with this email already exists");
  }
  try {
    const admin = await userRepository.create({ ...data, role: "admin" });
    return admin;
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
        "Validation failed for the provided data",
        explanation
      );
    }
    throw error;
  }
}
async function getAdminById(id) {
  try {
    const admin = await userRepository.get(id);
    if (admin.role !== "admin" && admin.role !== "superadmin") {
      throw new BadRequest("User is not an admin");
    }
    return admin;
  } catch (error) {
    throw error;
  }
}
async function getAllAdmins() {
  try {
    const admins = await userRepository.listAll();
    return admins;
  } catch (error) {
    throw error;
  }
}
async function deleteAdmin(id) {
    try {
    const user = await userRepository.destroy(id);
    return user;
  } catch (error) {
    if (error.statusCode == StatusCodes.NOT_FOUND) {
      throw new NotFound("Cannot delete admin", id);
    }
    throw error;
  }
}

module.exports = { createAdmin, getAdminById, getAllAdmins, deleteAdmin };
