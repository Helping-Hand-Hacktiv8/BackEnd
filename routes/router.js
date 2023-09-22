const express = require('express')
const errorHandler = require('../middlewares/errorHandler')
const userRouter = require('./userRouter')

const router = express.Router()

router.get('/register', (req, res) => {
  res.send('Connection successfull!')
})


router.use('/users', userRouter)


router.use(errorHandler)

module.exports = router