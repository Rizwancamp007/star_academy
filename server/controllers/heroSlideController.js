const HeroSlide = require('../models/HeroSlide')
const { logAudit } = require('../middleware/auditLogger')

// @desc    Get all active hero slides (public)
// @route   GET /api/hero-slides
// @access  Public
exports.getHeroSlides = async (req, res) => {
  try {
    const slides = await HeroSlide.find({ isActive: true }).sort('order')
    res.status(200).json({ success: true, count: slides.length, data: slides })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get all hero slides including inactive (admin)
// @route   GET /api/hero-slides/all
// @access  Private (Admin)
exports.getAllHeroSlides = async (req, res) => {
  try {
    const slides = await HeroSlide.find({}).sort('order')
    res.status(200).json({ success: true, count: slides.length, data: slides })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Create hero slide
// @route   POST /api/hero-slides
// @access  Private (Admin)
exports.createHeroSlide = async (req, res) => {
  try {
    const count = await HeroSlide.countDocuments({})
    req.body.order = req.body.order || count + 1

    const slide = await HeroSlide.create(req.body)

    await logAudit(req, 'CREATE_HERO_SLIDE', 'HeroSlide', slide._id, `Published hero banner: "${slide.title}"`)

    res.status(201).json({ success: true, data: slide })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update hero slide
// @route   PATCH /api/hero-slides/:id
// @access  Private (Admin)
exports.updateHeroSlide = async (req, res) => {
  try {
    const slide = await HeroSlide.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!slide) {
      return res.status(404).json({ success: false, message: 'Hero slide not found' })
    }

    await logAudit(req, 'UPDATE_HERO_SLIDE', 'HeroSlide', slide._id, `Updated hero banner: "${slide.title}"`)

    res.status(200).json({ success: true, data: slide })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Delete hero slide
// @route   DELETE /api/hero-slides/:id
// @access  Private (Admin)
exports.deleteHeroSlide = async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id)
    if (!slide) {
      return res.status(404).json({ success: false, message: 'Hero slide not found' })
    }

    const title = slide.title
    await slide.deleteOne()

    await logAudit(req, 'DELETE_HERO_SLIDE', 'HeroSlide', req.params.id, `Removed hero banner: "${title}"`)

    res.status(200).json({ success: true, message: `Hero slide "${title}" removed` })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
