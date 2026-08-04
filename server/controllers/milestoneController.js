const Milestone = require('../models/Milestone')
const { logAudit } = require('../middleware/auditLogger')

// @desc    Get all active milestones (public)
// @route   GET /api/milestones
// @access  Public
exports.getMilestones = async (req, res) => {
  try {
    const milestones = await Milestone.find({ isActive: true }).sort('order')
    res.status(200).json({ success: true, count: milestones.length, data: milestones })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Create milestone
// @route   POST /api/milestones
// @access  Private (Admin, Clerk)
exports.createMilestone = async (req, res) => {
  try {
    const count = await Milestone.countDocuments({})
    req.body.order = req.body.order || count + 1
    req.body.createdBy = req.user.id

    const milestone = await Milestone.create(req.body)

    await logAudit(req, 'CREATE_MILESTONE', 'Milestone', milestone._id, `Added milestone: ${milestone.title} (${milestone.year})`)

    res.status(201).json({ success: true, data: milestone })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update milestone
// @route   PATCH /api/milestones/:id
// @access  Private (Admin, Clerk)
exports.updateMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' })
    }

    await logAudit(req, 'UPDATE_MILESTONE', 'Milestone', milestone._id, `Updated milestone: ${milestone.title}`)

    res.status(200).json({ success: true, data: milestone })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Delete milestone
// @route   DELETE /api/milestones/:id
// @access  Private (Admin, Clerk)
exports.deleteMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id)
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' })
    }

    const title = milestone.title
    await milestone.deleteOne()

    await logAudit(req, 'DELETE_MILESTONE', 'Milestone', req.params.id, `Removed milestone: ${title}`)

    res.status(200).json({ success: true, message: `Milestone "${title}" removed` })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
