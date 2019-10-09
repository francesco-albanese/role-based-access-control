const jwt = require('jsonwebtoken')

const { hashPassword, validatePassword } = require('../utils')
const { User } = require('../models')
const { roles } = require('../roles')

exports.signup = async(req, res, next) => {
  try {
    const {
      email,
      password,
      role
    } = req.body

    const hashedPassword = await hashPassword(password)
    const newUser = new User({
      email, 
      password: hashedPassword,
      role: role || 'basic'
    })

    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    newUser.accessToken = accessToken
    await newUser.save()
    res.json({
      data: newUser
    })
  } catch(e) {
    next(e)
  }
}

exports.login = async(req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return next(new Error('Email does not exist!'))
    }
    const validPassword = await validatePassword(password, user.password)
    if (!validPassword) { 
      return next(new Error('Password is not correct!'))
    }
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d'
      }
    )

    await User.findByIdAndUpdate(user._id, { accessToken })
    res.status(200).json({
      data: {
        email: user.email,
        role: user.role,
        accessToken
      }
    })
  } catch(e) {
    next(e)
  }
}

exports.getUsers = async(_, res) => {
  const users = await User.find({})
  res.status(200).json({
    data: users
  })
}

exports.getUser = async(req, res, next) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId)
    if (!user) {
      return next(new Error('User does not exist!'))
    }
    res.status(200).json({
      data: user
    })
  } catch(e) {
    next(e)
  }
}

exports.updateUser = async(req, res) => {
  try {
    const update = req.body
    const { userId } = req.params
    await User.findByIdAndUpdate(userId, update)
    const user = await User.findById(userId)
    res.status(200).json({
      data: user,
      message: 'User has been updated',
      update
    })
  } catch(e) {

  }
}

exports.deleteUser = async(req, res) => {
  try {
    const { userId } = req.params
    const user = await User.findByIdAndDelete(userId)
    res.status(200).json({
      data: user,
      message: 'User has been deleted'
    })
  } catch(e) {

  }
}

exports.grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource)
      if (!permission.granted) {
        return res.status(401).json({
          error: 'You don\'t have enough permission to perform this action'
        })
      }
      next()
    } catch(e) {
      next(e)
    }
  }
}

exports.allowIfLoggedin = async(req, res, next) => {
  try {
    const user = res.locals.loggedInUser
    if (!user) {
      return res.status(401).json({
        error: 'You need to be logged in to access this route'
      })
    }
    req.user = user
    next()
  } catch(e) {
    next(e)
  }
}