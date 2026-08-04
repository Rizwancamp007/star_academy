const mongoose = require('mongoose')

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true },
  explanation: { type: String, default: '' },
  subject: { type: String },
})

const TestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    subject: {
      type: String,
      required: true,
      enum: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English', 'MDCAT Mock', 'ECAT Mock'],
    },
    grade: {
      type: String,
      required: true,
      enum: ['9', '10', '11', '12', 'MDCAT', 'ECAT'],
    },
    mode: {
      type: String,
      enum: ['test', 'practice'],
      default: 'test',
    },
    durationMinutes: { type: Number, default: 30 },
    totalMarks: { type: Number, default: 100 },
    passingMarks: { type: Number, default: 40 },
    questions: [QuestionSchema],
    mcqRefs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MCQ' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isPublished: { type: Boolean, default: true },
    isAIGenerated: { type: Boolean, default: false },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Test', TestSchema)
