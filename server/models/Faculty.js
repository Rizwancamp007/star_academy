const mongoose = require('mongoose')

const FacultySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Faculty name is required'],
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
      default: 'Faculty Member',
    },
    qualification: {
      type: String,
      trim: true,
    },
    experience: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      enum: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English', 'Computer Science', 'General'],
    },
    phone: {
      type: String,
      trim: true,
    },
    photoUrl: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

FacultySchema.index({ order: 1 })

module.exports = mongoose.model('Faculty', FacultySchema)
