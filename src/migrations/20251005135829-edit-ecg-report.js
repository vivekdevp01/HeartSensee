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
    // 🧠 AI Job Tracking
    await queryInterface.addColumn("EcgReports", "aiStatus", {
      type: Sequelize.ENUM("pending", "done", "failed"),
      allowNull: false,
      defaultValue: "pending",
    });
    await queryInterface.addColumn("EcgReports", "aiAdvice", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("EcgReports", "aiGeneratedAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn("EcgReports", "aiError", {
      type: Sequelize.TEXT,
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
    await queryInterface.removeColumn("EcgReports", "aiStatus");
    await queryInterface.removeColumn("EcgReports", "aiAdvice");
    await queryInterface.removeColumn("EcgReports", "aiGeneratedAt");
    await queryInterface.removeColumn("EcgReports", "aiError");
  },
};
