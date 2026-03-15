const { StatusCodes } = require("http-status-codes");
const { AdminService } = require("../services");

async function createAdmin(req, res, next) {
  try {
    const data = req.body;
    
    const admin = await AdminService.createAdmin(data);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Admin created successfully",
      data: admin,
    });
  } catch (error) {
    next(error);
  }
}
async function listAllAdmins(req, res, next) {
  try {
    const admins = await AdminService.getAllAdmins();
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Admins fetched successfully",
      data: admins,
    });
  } catch (error) {
    next(error);
  }
}
async function getAdminById(req, res, next) {
  try {
    const id = req.params.id;
    const admin = await AdminService.getAdminById(id);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Admin fetched successfully",
      data: admin,
    });
  } catch (error) {
    next(error);
  }
}
async function deleteAdmin(req, res, next) {
  try {
    const id = req.params.id;
    const admin = await AdminService.deleteAdmin(id);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Admin deleted successfully",
      data: admin,
    });
  } catch (error) {
    next(error);
  }
}
module.exports = {
  createAdmin,
  listAllAdmins,
  getAdminById,
  // updateAdmin,
  deleteAdmin,
};
