const express = require('express')
const { register, login, getUserById, editUser, deleteUser } = require('../controllers/user')
const userRouter = express.Router()

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.get('/profile/:id', getUserById)
userRouter.put('/profile/:id', editUser)
userRouter.delete('/profile/:id', deleteUser)

module.exports = userRouter