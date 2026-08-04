const mongoose = require('mongoose')

const MCQSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true, trim: true },
    options: [{ type: String, required: true }],
    correctIndex: { type: Number, required: true },
    explanation: { type: String, default: '' },
    subject: {
      type: String,
      required: true,
      enum: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English'],
    },
    chapter: { type: String, default: 'General' },
    class: {
      type: String,
      required: true,
      enum: ['9', '10', '11', '12', 'MDCAT', 'ECAT'],
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard', 'MDCAT Level'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['pending_review', 'published', 'archived'],
      default: 'published',
    },
    sourceDoc: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('MCQ', MCQSchema)
