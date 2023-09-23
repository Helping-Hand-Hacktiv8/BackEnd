const express = require('express')
const { getReward } = require('../controllers/reward')
const rewardRouter = express.Router()

rewardRouter.get('/', getReward)

module.exports = rewardRouter