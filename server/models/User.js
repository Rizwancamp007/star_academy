const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'clerk', 'admin'],
      default: 'student',
    },
    studentDetails: {
      grade: {
        type: String,
        enum: ['9', '10', '11', '12'],
      },
      stream: {
        type: String,
        enum: ['pre-medical', 'pre-engineering'],
      },
      rollNo: String,
      batch: String,
    },
    teacherDetails: {
      subject: String,
      qualification: String,
      designation: String,
    },
    isApproved: {
      type: Boolean,
      default: false, // Students & teachers require admin/clerk approval
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)

// Encrypt password before save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Match user password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', UserSchema)
