const BaseError = require("./baseError");
const { StatusCodes } = require("http-status-codes");
class ServiceUnavailable extends BaseError {
  constructor(methodName) {
    super(
      "Not available",
      StatusCodes.SERVICE_UNAVAILABLE,
      `${methodName} not available`,
      {}
    );
  }
}

module.exports = ServiceUnavailable;
