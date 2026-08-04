const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema(
  {
    senderName: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    senderEmail: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
    },
    senderPhone: {
      type: String,
      trim: true,
      default: '',
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message body is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'replied'],
      default: 'unread',
    },
  },
  { timestamps: true }
)

MessageSchema.index({ status: 1, createdAt: -1 })

module.exports = mongoose.model('Message', MessageSchema)
