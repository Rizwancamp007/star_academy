const mongoose = require('mongoose')

const HeroSlideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Slide title is required'],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    badge: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '/images/hero-bg.jpg',
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

HeroSlideSchema.index({ order: 1 })

module.exports = mongoose.model('HeroSlide', HeroSlideSchema)
