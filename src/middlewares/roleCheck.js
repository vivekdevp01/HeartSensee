const UnauthorizedRequest = require("../errors/unauthorizedError");

function allowRoles(...roles) {
  return (req, res, next) => {
    const user = req.user;
    if (!user) {
      return next(
        new UnauthorizedRequest(
          "You are not authorized to access this resource"
        )
      );
    }
    if (!roles.includes(user.role)) {
      return next(
        new UnauthorizedRequest(
          "You are not authorized to access this resource"
        )
      );
    }
    next();
  };
}
module.exports = { allowRoles };
