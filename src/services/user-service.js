const { HostNotFoundError } = require("sequelize");
const BadRequest = require("../errors/badRequestError");
const UnauthorizedRequest = require("../errors/unauthorizedError");
const { UserRepository } = require("../repositories");

const Auth = require("../utils/common/Auth");
const NotFound = require("../errors/notfound");
const { StatusCodes } = require("http-status-codes");
const ConflictError = require("../errors/conflictError");
const userRepository = new UserRepository();

async function createUser(data) {
  try {
    // console.log("Creating user with data:", data);
    const existingUser = await userRepository.getByEmail(data.email);
    if (existingUser) {
      throw new BadRequest("User with this email already exists");
    }
    const user = await userRepository.create(data);

    // console.log("User created:", user);
    return user;
  } catch (error) {
    if (
      error.name == "SequelizeValidationError" ||
      error.name == "SequelizeUniqueConstraintError"
    ) {
      const explanation = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));

      throw new ConflictError(
        "Validation failed for the provided data. Please correct the errors and try again.",
        explanation
      );
    }
    console.log(error);
    throw error;
  }
}
async function signIn(data) {
  const user = await userRepository.getByEmail(data.email);
  if (!user) {
    throw new BadRequest("User with this email does not exist");
  }
  const passwordMatch = Auth.checkPassword(data.password, user.password);
  if (!passwordMatch) {
    throw new UnauthorizedRequest(
      "Invalid Credentials",
      `The password you entered for ${data.email} is incorrect`
    );
  }
  const token = Auth.generateJWT({ id: user.id, role: user.role });
  return { user, token };
}
async function destroyUser(userId) {
  try {
    const user = await userRepository.destroy(userId);
    return user;
  } catch (error) {
    if (error.statusCode == StatusCodes.NOT_FOUND) {
      throw new NotFound("Cannot delete user", userId);
    }
    throw error;
  }
}
async function updateUser(userId, data) {
  try {
    const user = await userRepository.get(userId);
    if (!user) {
      throw new NotFound(`User with id ${userId} not found`);
    }

    // Only allow personal fields to be updated
    const allowedFields = [
      "firstName",
      "middleName",
      "lastName",
      "age",
      "phoneNumber",
    ];
    const filteredData = {};
    allowedFields.forEach((field) => {
      if (data[field] !== undefined) filteredData[field] = data[field];
    });

    const updatedUser = await userRepository.update(userId, filteredData);
    const freshuser = await userRepository.get(userId);

    return freshuser;
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
        "Validation failed for the provided data. Please correct the errors and try again.",
        explanation
      );
    }
    throw error;
  }
}

// async function getUserById(userId) {
//   try {
//     const user = await userRepository.get(userId);
//     let doctorProfile = null;
//     if (user.role === "doctor" && user.DoctorProfile) {
//       doctorProfile = user.DoctorProfile;
//     }
//     return { ...user.toJSON(), doctorProfile };
//   } catch (error) {
//     if (error.statusCode == StatusCodes.NOT_FOUND) {
//       throw new NotFound("User not found", userId);
//     }
//     throw error;
//   }
// }
async function getUserByIdWithProfile(userId) {
  try {
    // Fetch user with associated DoctorProfile
    const user = await userRepository.get(userId, {
      attributes: { exclude: ["password"] }, // hide password
      include: [
        {
          association: "DoctorProfile", // must match 'as' in User model
          required: false, // user may not have doctor profile
        },
        {
          association: "Doctor", // the patient's doctor
          attributes: ["id", "firstName", "lastName", "email"],
          include: [
            {
              association: "DoctorProfile", // doctor's profile
              required: false,
            },
          ],
        },
      ],
    });

    if (!user) {
      throw new NotFound("User not found", userId);
    }
    let responseData = user.toJSON();

    if (user.role === "doctor") {
      // Remove doctorId from doctor
      delete responseData.doctorId;
      delete responseData.Doctor;
    } else if (user.role === "patient") {
      // Remove doctorProfile from patient
      delete responseData.DoctorProfile;
    }

    return responseData;
  } catch (error) {
    if (error.statusCode === StatusCodes.NOT_FOUND) {
      throw new NotFound("User not found", userId);
    }
    throw error;
  }
}
module.exports = {
  createUser,
  signIn,
  destroyUser,
  updateUser,
  getUserByIdWithProfile,
  //   getUserById,
};
