const { StatusCodes } = require("http-status-codes");
const { UserService } = require("../services");

async function createUser(req, res, next) {
  try {
    // console.log("Request Body:", req.body);
    if (req.body.role && req.body.role === "admin") {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "Cannot signup as admin directly",
      });
    }
    const user = await UserService.createUser({
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      age: req.body.age,
      password: req.body.password,
      role: req.body.role,
      gender: req.body.gender,
    });
    // console.log("User created:", user);
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Successfully created the user",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
async function signIn(req, res, next) {
  try {
    const { user, token } = await UserService.signIn({
      email: req.body.email,
      password: req.body.password,
    });
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "User signed in successfully",
      token: token,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        Status: StatusCodes.OK,
      },
    });
  } catch (error) {
    next(error);
  }
}
async function deleteAccount(req, res, next) {
  try {
    const userId = req.user.id;
    const response = await UserService.destroyUser(userId);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "User deleted successfully",
      data: response,
    });
  } catch (error) {
    next(error);
  }
}
async function updateUser(req, res, next) {
  try {
    const userId = req.user.id;
    const data = req.body;
    const response = await UserService.updateUser(userId, data);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "User updated successfully",
      data: response,
    });
  } catch (error) {
    next(error);
  }
}
async function getUser(req, res, next) {
  try {
    const userId = req.user.id;
    const response = await UserService.getUserByIdWithProfile(userId);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "User retrieved successfully",
      data: response,
    });
  } catch (error) {
    next(error);
  }
}
module.exports = { createUser, signIn, deleteAccount, updateUser, getUser };
