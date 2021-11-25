const User = require('../models/user.model')
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const signin = async (req, res) => {
  try {
    let user = await User.findOne({
      "email": req.body.email
    })
    if (!user)
      return res.status('401').json({
        error: "User not found"
      })

    if (!user.authenticate(req.body.password)) {
      return res.status('401').send({
        error: "Email and password don't match."
      })
    }

    const token = jwt.sign({
      _id: user._id
    }, config.jwtSecret)

    res.cookie("t", token, {
      expire: new Date() + 9999
    })

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
      }
    })

  } catch (err) {

    return res.status('401').json({
      error: "Could not sign in"
    })

  }
}

const signout = (req, res) => {
  res.clearCookie("t")
  return res.status('200').json({
    message: "signed out"
  })
}

// const requireSignin = expressJwt({
//   secret: config.jwtSecret,
//   algorithms: ['RS256'],
//   userProperty: 'auth'
// })

// const jwt = require('jsonwebtoken')
// const db = require('../models');

// Protect routes
const requireSignin = async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }
  
  if (!token) {
    return next(res.status(401).json('Not authorize to access this route'))
  }
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.auth = await User.findOne(decoded);
    next();
  } catch (error) {
    res.status(401).json({
      error: 'Not authorized, token failed'
    })
  }
}

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id.toString() === req.auth._id.toString()
  if (!(authorized)) {
    return res.status('403').json({
      error: "User is not authorized"
    })
  }
  next()
}

module.exports = {signin, signout, requireSignin, hasAuthorization}