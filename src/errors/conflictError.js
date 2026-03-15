const { StatusCodes } = require("http-status-codes");
const BaseError = require("./baseError");
class ConflictError extends BaseError {
  constructor(propertyName, details) {
    super("Conflict Error", StatusCodes.CONFLICT, propertyName, details);
  }
}
module.exports = ConflictError;
