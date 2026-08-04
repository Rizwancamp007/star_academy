const mongoose = require('mongoose')

const LectureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Lecture title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      enum: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English'],
    },
    grade: {
      type: String,
      required: [true, 'Grade is required'],
      enum: ['9', '10', '11', '12'],
    },
    stream: {
      type: String,
      enum: ['pre-medical', 'pre-engineering', 'both'],
      default: 'both',
    },
    mediaType: {
      type: String,
      enum: ['youtube', 'gdrive', 'onedrive', 'mega', 'pdf', 'other'],
      required: true,
    },
    mediaUrl: {
      type: String,
      required: [true, 'Media URL is required'],
    },
    chapter: {
      type: String,
      default: 'General',
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isPublicPreview: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Lecture', LectureSchema)
