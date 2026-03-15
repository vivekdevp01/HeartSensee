const BaseError = require("./baseError");
const { StatusCodes } = require("http-status-codes");
class BadRequest extends BaseError {
  constructor(propertyName, details) {
    super("Bad Request", StatusCodes.BAD_REQUEST, propertyName, details);
  }
}
module.exports = BadRequest;

// Usage:
