const UnauthorizedRequest = require("../errors/unauthorizedError");
const Auth = require("../utils/common/Auth");

function isLoggedIn(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedRequest(
      "Invalid Credentials",
      "You must be logged in to access this resource"
    );
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = Auth.verifyToken(token);
    console.log("Logged in user:", decodedToken.id);
  } catch (error) {
    throw new UnauthorizedRequest(
      "Invalid Token",
      "The token provided is invalid or expired"
    );
  }
  req.user = {
    id: decodedToken.id,
    role: decodedToken.role,
  };
  console.log("Authenticated user:", req.user);
  next();
}
function requireSuperadmin(req, res, next) {
  if (req.user.role !== "superadmin") {
    throw new UnauthorizedRequest(
      "Access denied.",
      "You do not have permission to access this resource."
    );
  }
  next();
}
function requireAdmin(req, res, next) {
  if (req.user.role !== "admin" && req.user.role !== "superadmin") {
    throw new UnauthorizedRequest(
      "Access denied.",
      "You do not have permission to access this resource."
    );
  }
  next();
}
function requirePatient(req, res, next) {
  if (req.user.role !== "patient") {
    throw new UnauthorizedRequest(
      "Access denied.",
      "You do not have permission to access this resource."
    );
  }
  next();
}
function requireDoctor(req, res, next) {
  console.log("User role in requireDoctor middleware:", req.user.role);
  if (req.user.role.toLowerCase() !== "doctor") {
    throw new UnauthorizedRequest(
      "Access denied.",
      "You do not have permission to access this resource."
    );
  }
  next();
}
module.exports = {
  isLoggedIn,
  requireSuperadmin,
  requireAdmin,
  requirePatient,
  requireDoctor,
};
