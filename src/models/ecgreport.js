"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EcgReport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EcgReport.belongsTo(models.User, {
        as: "Patient",
        foreignKey: "patientId",
      });
      EcgReport.belongsTo(models.User, {
        as: "Doctor",
        foreignKey: "doctorId",
      });
    }
  }
  EcgReport.init(
    {
      patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Patient ID is required" },
          isInt: { msg: "Patient ID must be an integer" },
        },
      },
      doctorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: { msg: "Doctor ID must be an integer" },
        },
      },

      status: {
        type: DataTypes.ENUM("normal", "abnormal", "pending"),
        allowNull: false,
        defaultValue: "pending",
        validate: {
          isIn: {
            args: [["normal", "abnormal", "pending"]],
            msg: "Status must be normal, abnormal, or pending",
          },
        },
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: {
            args: [0, 500],
            msg: "Comments must be under 500 characters",
          },
        },
      },
      // 🆕 Add ML model details
      predictedClass: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      classLabel: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      probabilities: {
        type: DataTypes.JSON, // store full ML probability output
        allowNull: true,
      },
      mongoReadingId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // --- AI Status Tracking ---
      aiStatus: {
        type: DataTypes.ENUM("pending", "done", "failed"),
        allowNull: false,
        defaultValue: "pending",
      },
      aiAdvice: { type: DataTypes.TEXT, allowNull: true },
      aiGeneratedAt: { type: DataTypes.DATE, allowNull: true },
      aiError: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      sequelize,
      modelName: "EcgReport",
      timestamps: true,
    }
  );
  return EcgReport;
};
