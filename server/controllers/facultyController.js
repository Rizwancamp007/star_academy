const Faculty = require('../models/Faculty')
const { logAudit } = require('../middleware/auditLogger')

// @desc    Get all active faculty (public)
// @route   GET /api/faculty
// @access  Public
exports.getFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find({ isActive: true }).sort('order')
    res.status(200).json({ success: true, count: faculty.length, data: faculty })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get all faculty including inactive (admin)
// @route   GET /api/faculty/all
// @access  Private (Admin)
exports.getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find({}).sort('order')
    res.status(200).json({ success: true, count: faculty.length, data: faculty })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Create faculty member
// @route   POST /api/faculty
// @access  Private (Admin)
exports.createFaculty = async (req, res) => {
  try {
    const count = await Faculty.countDocuments({})
    req.body.order = req.body.order || count + 1

    const faculty = await Faculty.create(req.body)

    await logAudit(req, 'CREATE_FACULTY', 'Faculty', faculty._id, `Added faculty member: ${faculty.name} (${faculty.subject})`)

    res.status(201).json({ success: true, data: faculty })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update faculty member
// @route   PATCH /api/faculty/:id
// @access  Private (Admin)
exports.updateFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty member not found' })
    }

    await logAudit(req, 'UPDATE_FACULTY', 'Faculty', faculty._id, `Updated faculty profile: ${faculty.name}`)

    res.status(200).json({ success: true, data: faculty })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Delete faculty member
// @route   DELETE /api/faculty/:id
// @access  Private (Admin)
exports.deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id)
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty member not found' })
    }

    const name = faculty.name
    await faculty.deleteOne()

    await logAudit(req, 'DELETE_FACULTY', 'Faculty', req.params.id, `Removed faculty member: ${name}`)

    res.status(200).json({ success: true, message: `Faculty member ${name} removed` })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
