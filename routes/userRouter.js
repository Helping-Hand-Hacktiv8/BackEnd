const express = require('express')
const { getUserById, editUser, deleteUser } = require('../controllers/user')
const userRouter = express.Router()

userRouter.get('/profile/:id', getUserById)
userRouter.put('/profile/:id', editUser)
userRouter.delete('/profile/:id', deleteUser)

module.exports = userRouter