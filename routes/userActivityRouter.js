const express = require('express')
const { getUserActivity, userActivityDetail, postUserActivity, deleteUserActivity } = require('../controllers/userActivity')
const userActivityRouter = express.Router()

userActivityRouter.get('/', getUserActivity)
userActivityRouter.post('/', postUserActivity)
userActivityRouter.get('/:id', userActivityDetail)
userActivityRouter.delete('/:id', deleteUserActivity)

module.exports = userActivityRouter