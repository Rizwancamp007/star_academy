const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Protect routes (Verify JWT token)
exports.protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route (No token provided)',
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'star_educational_academy_secret_key_2026_ghotki')
    req.user = await User.findById(decoded.id)

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists',
      })
    }

    if (!req.user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact administration.',
      })
    }

    next()
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed: Invalid or expired token',
    })
  }
}

// Role authorization middleware
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      })
    }
    next()
  }
}
