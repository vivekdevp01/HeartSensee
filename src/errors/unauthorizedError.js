const BaseError = require("./baseError");
const { StatusCodes } = require("http-status-codes");
class UnauthorizedRequest extends BaseError {
  constructor(propertyName, details) {
    super(
      "UnAuthorized Request",
      StatusCodes.UNAUTHORIZED,
      propertyName,
      details
    );
  }
}
module.exports = UnauthorizedRequest;
