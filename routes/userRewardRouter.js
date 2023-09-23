const express = require('express')
const { getAll, getDetail, claimReward } = require('../controllers/userReward')
const userRewardRouter = express.Router()

userRewardRouter.get('/', getAll)
userRewardRouter.get('/:id', getDetail)
userRewardRouter.post('/', claimReward)

module.exports = userRewardRouter