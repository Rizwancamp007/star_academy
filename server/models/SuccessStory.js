const mongoose = require('mongoose')

const SuccessStorySchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    achievement: {
      type: String,
      required: [true, 'Achievement title is required'],
      trim: true,
    },
    year: {
      type: String,
      default: new Date().getFullYear().toString(),
    },
    institute: {
      type: String,
      trim: true,
    },
    score: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ['MDCAT', 'ECAT', 'Board Position', 'Scholarship', 'Other'],
      default: 'MDCAT',
    },
    photoUrl: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
)

SuccessStorySchema.index({ year: -1, order: 1 })

module.exports = mongoose.model('SuccessStory', SuccessStorySchema)
