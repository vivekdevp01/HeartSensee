'use strict';
const bcrypt = require('bcrypt');
const {ServerConfig}=require("../config");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   const passwordHash=bcrypt.hashSync('Abcd@1234',+ServerConfig.SALT_ROUND);
   await queryInterface.bulkInsert('Users',[
    {
      firstName:'Vivek',
      lastName:'Pundir',
      email:'superadmin@gmail.com',
      password:passwordHash,
      role:'superadmin',
      age:30,
      createdAt:new Date(),
      updatedAt:new Date()
    }
   ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users',{email:'superadmin@gmail.com'})
  }
};
