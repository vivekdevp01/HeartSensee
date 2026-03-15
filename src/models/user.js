"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
const { ServerConfig } = require("../config");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.User, { as: "Patients", foreignKey: "doctorId" });

      User.belongsTo(models.User, { as: "Doctor", foreignKey: "doctorId" });

      User.hasOne(models.DoctorProfile, {
        as: "DoctorProfile",
        foreignKey: "userId",
      });
      // ECG reports
      User.hasMany(models.EcgReport, {
        as: "PatientReports",
        foreignKey: "patientId",
      });
      User.hasMany(models.EcgReport, {
        as: "DoctorReviews",
        foreignKey: "doctorId",
      });
      User.hasMany(models.PatientDoctorRequest, {
        as: "SentRequests",
        foreignKey: "patientId",
      }); // requests made by this patient
      User.hasMany(models.PatientDoctorRequest, {
        as: "ReceivedRequests",
        foreignKey: "doctorId",
      }); // requests received by this doctor
    }
  }
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "First name cannot be empty" },
          len: { args: [2, 50], msg: "First name must be 2–50 characters" },
        },
      },
      middleName: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: { args: [0, 50], msg: "Middle name must be max 50 characters" },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Last name cannot be empty" },
          len: { args: [2, 50], msg: "Last name must be 2–50 characters" },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Email must be unique" },
        validate: {
          notEmpty: { msg: "Email cannot be empty" },
          isEmail: { msg: "Must be a valid email address" },
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: {
            args: /^[0-9]{10,15}$/, // only digits, 10–15 length
            msg: "Phone number must be 10–15 digits",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Password cannot be empty" },
          is: {
            args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            msg: "Password must be at least 8 characters long and include one uppercase, one lowercase, one number, and one special character",
          },
        },
      },
      role: {
        type: DataTypes.ENUM("patient", "admin", "doctor", "superadmin"),
        defaultValue: "patient",
        allowNull: true,
        validate: {
          isIn: {
            args: [["patient", "admin", "doctor", "superadmin"]],
            msg: "Role must be either 'patient', 'admin' or 'doctor'",
          },
        },
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: { args: [0], msg: "Age cannot be negative" },
          max: { args: [100], msg: "Age seems invalid" },
        },
      },
      doctorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      mongoReadingId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
          len: { args: [0, 50], msg: "Mongo ID length is too long" },
        },
      },
      gender: {
        type: DataTypes.ENUM("male", "female", "other"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["male", "female", "other"]],
            msg: "Gender must be 'male', 'female', or 'other'",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      timestamps: true,
    }
  );
  User.beforeCreate(function encrypt(user) {
    const encryptedPassword = bcrypt.hashSync(
      user.password,
      +ServerConfig.SALT_ROUND
    );
    user.password = encryptedPassword;
  });
  return User;
};
