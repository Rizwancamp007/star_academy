const mongoose = require('mongoose')

const AnswerSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  selectedOptionIndex: { type: Number },
  isCorrect: { type: Boolean, default: false },
})

const SubmissionSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
    answers: [AnswerSchema],
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    wrongAnswers: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    passed: { type: Boolean, default: false },
    timeTakenSeconds: { type: Number, default: 0 },
    tabSwitches: { type: Number, default: 0 },
    autoSubmitted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Submission', SubmissionSchema)
