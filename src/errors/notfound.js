const BaseError = require("./baseError");
const { StatusCodes } = require("http-status-codes");
class NotFound extends BaseError {
  constructor(resourceName, resourceValue) {
    super(
      "Not Found",
      StatusCodes.NOT_FOUND,
      `the requested  ${resourceName} with ID ${resourceValue} is not found`,
      "not found"
    );
  }
}

module.exports = NotFound;
