const express = require('express')
const errorHandler = require('../middlewares/errorHandler')
const userRouter = require('./userRouter')
const { register, login, googleLogin, midtransWebhook } = require('../controllers/user')
const authentication = require('../middlewares/authentication')
const activityRouter = require('./activityRouter')
const rewardRouter = require('./rewardRouter')
const userActivityRouter = require('./userActivityRouter')
const userRewardRouter = require('./userRewardRouter')
const router = express.Router()

router.post('/register', register)
router.post('/login', login)
// router.post('google-login', googleLogin)
router.post('/midtrans-webhook', midtransWebhook)

router.use(authentication)

router.use('/users', userRouter)
router.use('/activities', activityRouter)
router.use('/rewards', rewardRouter)
router.use('/user-activities', userActivityRouter)
router.use('/user-rewards', userRewardRouter)

router.use(errorHandler)

module.exports = router