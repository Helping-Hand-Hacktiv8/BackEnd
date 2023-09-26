if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const path = require('path')
const express = require('express')
const router = require('./routes/router')
const cors = require('cors')
const app = express()

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(router)

module.exports = app