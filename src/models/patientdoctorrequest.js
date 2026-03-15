"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PatientDoctorRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PatientDoctorRequest.belongsTo(models.User, {
        foreignKey: "patientId",
        as: "patient",
      });
      PatientDoctorRequest.belongsTo(models.User, {
        foreignKey: "doctorId",
        as: "doctor",
      });
    }
  }
  PatientDoctorRequest.init(
    {
      patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { notNull: true, isInt: true },
      },
      doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { notNull: true, isInt: true },
      },
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        allowNull: false,
        defaultValue: "pending",
      },
      message: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "PatientDoctorRequest",
      timestamps: true,
    }
  );
  return PatientDoctorRequest;
};
