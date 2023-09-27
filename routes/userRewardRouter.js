const express = require('express')
const { getAll, getDetail, claimReward } = require('../controllers/userReward')
const userRewardRouter = express.Router()

userRewardRouter.get('/', getAll)
userRewardRouter.post('/', claimReward)
userRewardRouter.get('/:id', getDetail)

module.exports = userRewardRouter