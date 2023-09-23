'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Activities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull:false
      },
      description: {
        type: Sequelize.STRING,
        allowNull:false
      },
      fromDate: {
        type: Sequelize.DATE,
        allowNull:false
      },
      toDate: {
        type: Sequelize.DATE,
        allowNull:false
      },
      participant: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      reward: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      location: {
        type: Sequelize.STRING,
        allowNull:false
      },
      lat: {
        type: Sequelize.FLOAT,
        allowNull:false
      },
      lon: {
        type: Sequelize.FLOAT,
        allowNull:false
      },
      photoAct: {
        type: Sequelize.STRING,
        allowNull:false
      },
      status: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Activities');
  }
};