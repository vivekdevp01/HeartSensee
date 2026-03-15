"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DoctorProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // models/DoctorProfile.js
      DoctorProfile.belongsTo(models.User, {
        as: "User",
        foreignKey: "userId",
      });
    }
  }
  DoctorProfile.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: { msg: "User ID is required" },
          isInt: { msg: "User ID must be an integer" },
        },
      },
      specialization: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Specialization is required" },
          len: {
            args: [2, 100],
            msg: "Specialization must be 2–100 characters",
          },
        },
      },
      experienceYears: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: { msg: "Experience must be a number" },
          min: { args: [0], msg: "Experience cannot be negative" },
          max: { args: [80], msg: "Experience must be less than 80 years" },
        },
      },
      clinicName: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [0, 100],
            msg: "Clinic name must be up to 100 characters",
          },
        },
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // admin must verify doctor
      },
    },
    {
      sequelize,
      modelName: "DoctorProfile",
      timestamps: true,
    }
  );
  return DoctorProfile;
};
