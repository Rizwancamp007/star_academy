const mongoose = require('mongoose')

const MilestoneSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Milestone title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    year: {
      type: String,
      default: new Date().getFullYear().toString(),
    },
    icon: {
      type: String,
      default: 'trophy',
      enum: ['trophy', 'star', 'medal', 'graduation', 'chart', 'book', 'award', 'flag'],
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
)

MilestoneSchema.index({ order: 1 })

module.exports = mongoose.model('Milestone', MilestoneSchema)
