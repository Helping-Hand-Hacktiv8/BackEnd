const express = require('express')
const { getUserById, editUser, deleteUser, generateMidtransToken } = require('../controllers/user')
const userRouter = express.Router()

userRouter.get('/profile', getUserById)
userRouter.put('/profile/:id', editUser)
userRouter.delete('/profile/:id', deleteUser)
userRouter.post('/generate-midtrans-token', generateMidtransToken)

module.exports = userRouter