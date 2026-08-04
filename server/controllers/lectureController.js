const Lecture = require('../models/Lecture')

// @desc    Get all lectures (with optional filtering)
// @route   GET /api/lectures
// @access  Public (preview) / Private (full links)
exports.getLectures = async (req, res) => {
  try {
    const { subject, grade, stream, search, mediaType } = req.query
    let query = {}

    if (subject && subject !== 'All') query.subject = subject
    if (grade) query.grade = grade
    if (stream) query.stream = { $in: [stream, 'both'] }
    if (mediaType && mediaType !== 'all') query.mediaType = mediaType
    if (search) {
      query.title = { $regex: search, $options: 'i' }
    }

    const lectures = await Lecture.find(query).sort('-createdAt').populate('teacher', 'fullName subject')

    // If user is not authenticated or not approved, conceal full mediaUrl unless it's a public preview
    const isAuthAndApproved = req.user && req.user.isApproved
    const processedLectures = lectures.map((lecture) => {
      const obj = lecture.toObject()
      if (!isAuthAndApproved && !obj.isPublicPreview) {
        obj.mediaUrl = 'LOCKED_PLEASE_LOGIN'
        obj.isLocked = true
      } else {
        obj.isLocked = false
      }
      return obj
    })

    res.status(200).json({ success: true, count: processedLectures.length, data: processedLectures })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Create new lecture
// @route   POST /api/lectures
// @access  Private (Teacher, Admin)
exports.createLecture = async (req, res) => {
  try {
    req.body.teacher = req.user.id
    const lecture = await Lecture.create(req.body)
    res.status(201).json({ success: true, data: lecture })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Delete lecture
// @route   DELETE /api/lectures/:id
// @access  Private (Teacher, Admin)
exports.deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id)
    if (!lecture) {
      return res.status(404).json({ success: false, message: 'Lecture not found' })
    }
    await lecture.deleteOne()
    res.status(200).json({ success: true, message: 'Lecture removed' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
