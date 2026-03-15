"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn("Users", "role", {
      type: Sequelize.ENUM("patient", "admin", "doctor", "superadmin"),
      allowNull: true,
      defaultValue: "patient",
      validate: {
        isIn: {
          args: [["patient", "admin", "doctor", "superadmin"]],
          msg: "Role must be either 'patient', 'admin', 'doctor'",
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn("Users", "role", {
      type: Sequelize.ENUM("patient", "admin", "doctor"),
      allowNull: true,
      defaultValue: "patient",
      validate: {
        isIn: {
          args: [["patient", "admin", "doctor"]],
          msg: "Role must be either 'patient', 'admin' or 'doctor'",
        },
      },
    });
  },
};
