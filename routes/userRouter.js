const express = require('express')
const { getUserById, editUser, deleteUser, generateMidtransToken } = require('../controllers/user')
const { uploadProfileUser } = require('../helpers/imageUploader')
const userRouter = express.Router()

userRouter.get('/profile/:id', getUserById)
userRouter.put('/profile/:id', uploadProfileUser, editUser)
userRouter.delete('/profile/:id', deleteUser)
userRouter.post('/generate-midtrans-token', generateMidtransToken)

module.exports = userRouter