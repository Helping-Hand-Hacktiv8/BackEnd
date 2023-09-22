const express = require('express')
const errorHandler = require('../middlewares/errorHandler')
const userRouter = require('./userRouter')
const activityRouter = require('./activityRouter')
const router = express.Router()

router.post('/register', Controller.postRegister )


router.use('/users', userRouter)
router.use('/activities', activityRouter)

router.use(errorHandler)

module.exports = router