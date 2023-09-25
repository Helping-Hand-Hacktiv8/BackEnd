const express = require('express')
const { getReward, getRewardDetail } = require('../controllers/reward')
const rewardRouter = express.Router()

rewardRouter.get('/', getReward)
rewardRouter.get('/:id', getRewardDetail)

module.exports = rewardRouter