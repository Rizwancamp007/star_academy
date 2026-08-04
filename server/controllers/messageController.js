const Message = require('../models/Message')
const { logAudit } = require('../middleware/auditLogger')

// @desc    Submit a contact form message (public)
// @route   POST /api/messages
// @access  Public
exports.createMessage = async (req, res) => {
  try {
    const { senderName, senderEmail, senderPhone, subject, message } = req.body

    if (!senderName || !senderEmail || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields' })
    }

    const msg = await Message.create({
      senderName,
      senderEmail,
      senderPhone: senderPhone || '',
      subject,
      message,
    })

    res.status(201).json({
      success: true,
      message: 'Your message has been submitted successfully! We will respond shortly.',
      data: { id: msg._id },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get all messages (admin inbox)
// @route   GET /api/messages
// @access  Private (Admin)
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({}).sort('-createdAt')
    res.status(200).json({ success: true, count: messages.length, data: messages })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update message status (mark read/replied)
// @route   PATCH /api/messages/:id/status
// @access  Private (Admin)
exports.updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body
    if (!['unread', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' })
    }

    const msg = await Message.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' })
    }

    res.status(200).json({ success: true, data: msg })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private (Admin)
exports.deleteMessage = async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id)
    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' })
    }

    const sender = msg.senderName
    await msg.deleteOne()

    await logAudit(req, 'DELETE_MESSAGE', 'Message', req.params.id, `Deleted inquiry from: ${sender}`)

    res.status(200).json({ success: true, message: `Message from ${sender} deleted` })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
