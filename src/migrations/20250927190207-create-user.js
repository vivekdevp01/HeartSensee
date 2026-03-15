"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "First name cannot be empty" },
          len: { args: [2, 50], msg: "First name must be 2–50 characters" },
        },
      },
      middleName: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          len: { args: [0, 50], msg: "Middle name must be max 50 characters" },
        },
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Last name cannot be empty" },
          len: { args: [2, 50], msg: "Last name must be 2–50 characters" },
        },
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: { msg: "Email must be unique" },
        validate: {
          notEmpty: { msg: "Email cannot be empty" },
          isEmail: { msg: "Must be a valid email address" },
        },
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          is: {
            args: /^[0-9]{10,15}$/, // only digits, 10–15 length
            msg: "Phone number must be 10–15 digits",
          },
        },
      },
      password: {
        type: Sequelize.STRING,
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
        type: Sequelize.ENUM("patient", "admin", "doctor"),
        defaultValue: "patient",
        allowNull: true,
        validate: {
          isIn: {
            args: [["patient", "admin", "doctor"]],
            msg: "Role must be either 'patient', 'admin' or 'doctor'",
          },
        },
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: { args: [0], msg: "Age cannot be negative" },
          max: { args: [100], msg: "Age seems unrealistic" },
        },
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
