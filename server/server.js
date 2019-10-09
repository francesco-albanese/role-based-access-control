const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const path = require('path')

const app = express()

const { User } = require('./models')

const routes = require('./routes/route')

require('dotenv').config({
  path: path.join(__dirname, '../.env')
})

const PORT = process.env.PORT || 3377

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(async (req, res, next) => {
  if (req.headers['x-access-token']) {
    const accessToken = req.headers['x-access-token']
    const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET)

    //Check if token has expired
    if (exp < Date.now().valueOf() / 1000) {
      return res.status(401).json({
        error: 'JWT token has expired, please login to obtain a new one!'
      })
    }

    res.locals.loggedInUser = await User.findById(userId);
    next()
  } else {
    next()
  }
})

app.use('/', routes)

const runServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (e) {
    console.error('Error from runServer', JSON.stringify(e))
  }
}

runServer()