const express = require('express')
const { allActivity, postActivity, updateActivity, deleteActivity, getActivityDetail } = require('../controllers/activity')
const activityRouter = express.Router()

activityRouter.get('/', allActivity)
activityRouter.post("/", postActivity)
activityRouter.put('/:id', updateActivity)
activityRouter.delete("/:id", deleteActivity)
activityRouter.get("/:id", getActivityDetail)

module.exports = activityRouter