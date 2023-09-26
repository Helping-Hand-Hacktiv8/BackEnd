const express = require('express')
const { allActivity, postActivity, updateActivity, deleteActivity, getActivityDetail, cancelActivity, finishActivity } = require('../controllers/activity')
const updateActivityAuthorization = require('../middlewares/updateActivityAuthorization')
const { uploadPhotoActivity } = require('../helpers/imageUploader')
const activityRouter = express.Router()

activityRouter.post('/all', allActivity)
activityRouter.post("/", uploadPhotoActivity, postActivity)
activityRouter.put('/:id', updateActivityAuthorization, uploadPhotoActivity, updateActivity)
activityRouter.delete("/:id", deleteActivity)
activityRouter.get("/:id", getActivityDetail)
activityRouter.patch('/cancel/:id', cancelActivity)
activityRouter.put('/finish/:id', finishActivity)

module.exports = activityRouter