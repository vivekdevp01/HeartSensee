const BadRequest = require("../errors/badRequestError");

function validateUser(requiredFields) {
  return (req, res, next) => {
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      // Construct detailed error for missing fields
      const details = missingFields.map((field) => ({
        field,
        message: `${field} field is required.`,
      }));

      throw new BadRequest(
        "Validation failed. Please provide all required fields.",
        details
      );
    }

    next();
  };
}
module.exports = { validateUser };
