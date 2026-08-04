const SuccessStory = require('../models/SuccessStory')
const { logAudit } = require('../middleware/auditLogger')

// @desc    Get all success stories (public)
// @route   GET /api/success-stories
// @access  Public
exports.getSuccessStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find({}).sort('-year order').populate('createdBy', 'fullName')
    res.status(200).json({ success: true, count: stories.length, data: stories })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Create success story
// @route   POST /api/success-stories
// @access  Private (Clerk, Admin)
exports.createSuccessStory = async (req, res) => {
  try {
    req.body.createdBy = req.user.id
    const story = await SuccessStory.create(req.body)

    await logAudit(req, 'CREATE_SUCCESS_STORY', 'SuccessStory', story._id, `Published success story: ${story.studentName} — ${story.achievement}`)

    res.status(201).json({ success: true, data: story })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update success story
// @route   PATCH /api/success-stories/:id
// @access  Private (Clerk, Admin)
exports.updateSuccessStory = async (req, res) => {
  try {
    const story = await SuccessStory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!story) {
      return res.status(404).json({ success: false, message: 'Success story not found' })
    }

    await logAudit(req, 'UPDATE_SUCCESS_STORY', 'SuccessStory', story._id, `Updated story: ${story.studentName}`)

    res.status(200).json({ success: true, data: story })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Delete success story
// @route   DELETE /api/success-stories/:id
// @access  Private (Clerk, Admin)
exports.deleteSuccessStory = async (req, res) => {
  try {
    const story = await SuccessStory.findById(req.params.id)
    if (!story) {
      return res.status(404).json({ success: false, message: 'Success story not found' })
    }

    const name = story.studentName
    await story.deleteOne()

    await logAudit(req, 'DELETE_SUCCESS_STORY', 'SuccessStory', req.params.id, `Deleted success story: ${name}`)

    res.status(200).json({ success: true, message: `Success story for ${name} removed` })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
