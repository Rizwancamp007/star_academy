const User = require('../models/User')
const jwt = require('jsonwebtoken')

// Helper: Generate JWT Token
const sendTokenResponse = (user, statusCode, res, extraData = {}) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'star_educational_academy_secret_key_2026_ghotki',
    { expiresIn: process.env.JWT_EXPIRE || '1d' }
  )

  const options = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    httpOnly: true,
  }

  if (process.env.NODE_ENV === 'production') {
    options.secure = true
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isApproved: user.isApproved,
        studentDetails: user.studentDetails,
        teacherDetails: user.teacherDetails,
        avatar: user.avatar,
      },
      ...extraData,
    })
}

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { fullName, email, phone, password, role, grade, stream, subject, qualification } = req.body

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' })
    }

    const userData = {
      fullName,
      email,
      phone,
      password,
      role: role || 'student',
      // Admin accounts are auto-approved; students/teachers require clerk/admin approval
      isApproved: role === 'admin' ? true : false,
    }

    if (userData.role === 'student') {
      userData.studentDetails = {
        grade: grade || '11',
        stream: stream || 'pre-medical',
      }
    } else if (userData.role === 'teacher') {
      userData.teacherDetails = {
        subject: subject || 'Physics',
        qualification: qualification || 'M.Sc',
      }
    }

    const user = await User.create(userData)

    // For students, inform them that admission fee payment is required for approval
    if (user.role === 'student') {
      return res.status(201).json({
        success: true,
        isPendingApproval: true,
        message: 'Registration submitted successfully! Please pay your one-time admission fee challan at Star Educational Academy office (D.A.V. School, Ghotki) to activate your account.',
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          isApproved: false,
        },
      })
    }

    sendTokenResponse(user, 201, res)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' })
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact administration.' })
    }

    // STRICT APPROVAL CHECK FOR STUDENTS: Block login if not approved by admin/clerk
    if (user.role === 'student' && !user.isApproved) {
      return res.status(403).json({
        success: false,
        isPendingApproval: true,
        message: 'Your registration is pending approval. Please pay your admission fee challan at Star Educational Academy (D.A.V. School, Ghotki) to get your account approved into the Star Academy portal.',
      })
    }

    sendTokenResponse(user, 200, res)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    res.status(200).json({ success: true, user })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })
  res.status(200).json({ success: true, message: 'Logged out successfully' })
}

// @desc    Update user profile (name, phone)
// @route   PATCH /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone } = req.body
    const updateFields = {}
    if (fullName) updateFields.fullName = fullName
    if (phone) updateFields.phone = phone

    const user = await User.findByIdAndUpdate(req.user.id, updateFields, {
      new: true,
      runValidators: true,
    })

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isApproved: user.isApproved,
        studentDetails: user.studentDetails,
        teacherDetails: user.teacherDetails,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Change user password
// @route   POST /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new password' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' })
    }

    const user = await User.findById(req.user.id).select('+password')
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const isMatch = await user.matchPassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' })
    }

    user.password = newPassword
    await user.save()

    res.status(200).json({ success: true, message: 'Password changed successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
