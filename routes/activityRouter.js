const express = require('express')
const { allActivity, postActivity, updateActivity, deleteActivity, getActivityDetail, cancelActivity, finishActivity } = require('../controllers/activity')
const updateActivityAuthorization = require('../middlewares/updateActivityAuthorization')
const activityRouter = express.Router()

activityRouter.get('/', allActivity)
activityRouter.post("/", postActivity)
activityRouter.put('/:id', updateActivityAuthorization, updateActivity)
activityRouter.delete("/:id", deleteActivity)
activityRouter.get("/:id", getActivityDetail)
activityRouter.patch('/cancel/:id', cancelActivity)
activityRouter.put('/finish/:id', finishActivity)

module.exports = activityRouter