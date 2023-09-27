'use strict';

const { hashPassword } = require('../helpers/bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = require('../db/data.json')

    let dataUser = data.Users
    dataUser.forEach(el => {
      delete el.id
      el.password = hashPassword(el.password)
      el.createdAt = new Date()
      el.updatedAt = new Date()
    })
    await queryInterface.bulkInsert('Users', dataUser)

    let dataActivity = data.Activities
    dataActivity.forEach(el => {
      delete el.id
      el.coordinate = Sequelize.fn('ST_GeomFromText',`POINT(${el.lon} ${el.lat})`,0)
      delete el.lat
      delete el.lon
      el.createdAt = new Date()
      el.updatedAt = new Date()
    })
    await queryInterface.bulkInsert('Activities', dataActivity)

    let dataReward = data.Rewards
    dataReward.forEach(el => {
      delete el.id
      el.createdAt = new Date()
      el.updatedAt = new Date()
    })
    await queryInterface.bulkInsert('Rewards', dataReward)

    let dataUserReward = data.UserRewards
    dataUserReward.forEach(el => {
      delete el.id
      el.createdAt = new Date()
      el.updatedAt = new Date()
    })
    await queryInterface.bulkInsert('UserRewards', dataUserReward)

    let dataUserActivity = data.UserActivities
    dataUserActivity.forEach(el => {
      delete el.id
      el.createdAt = new Date()
      el.updatedAt = new Date()
    })
    await queryInterface.bulkInsert('UserActivities', dataUserActivity)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UserActivities', null, {})
    await queryInterface.bulkDelete('UserRewards', null, {})
    await queryInterface.bulkDelete('Rewards', null, {})
    await queryInterface.bulkDelete('Activities', null, {})
    await queryInterface.bulkDelete('Users', null, {}) 
  }
};