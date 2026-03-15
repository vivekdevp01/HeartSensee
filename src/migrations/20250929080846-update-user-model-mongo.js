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
    await queryInterface.addColumn("Users", "mongoReadingId", {
      type: Sequelize.STRING,
      allowNull: true, // optional, can be null initially
      unique: true, // ensure no duplicate mongoIds
      comment: "Reference to MongoDB user ID",
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("Users", "mongoReadingId");
  },
};
