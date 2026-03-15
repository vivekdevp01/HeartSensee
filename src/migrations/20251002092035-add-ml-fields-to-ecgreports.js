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
    // 1. Remove signalData column
    await queryInterface.removeColumn("EcgReports", "signalData");

    // 2. Add mongoReadingId column
    await queryInterface.addColumn("EcgReports", "mongoReadingId", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("EcgReports", "predictedClass", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("EcgReports", "classLabel", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("EcgReports", "probabilities", {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.addColumn("EcgReports", "signalData", {
      type: Sequelize.JSON,
      allowNull: false,
    });

    await queryInterface.removeColumn("EcgReports", "mongoReadingId");
    await queryInterface.removeColumn("EcgReports", "predictedClass");
    await queryInterface.removeColumn("EcgReports", "classLabel");
    await queryInterface.removeColumn("EcgReports", "probabilities");
  },
};
