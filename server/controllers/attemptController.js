const Test = require('../models/Test')
const Submission = require('../models/Submission')

// @desc    Submit a test attempt and perform server-authoritative scoring
// @route   POST /api/attempts/:testId/submit
// @access  Private (Student)
exports.submitAttempt = async (req, res) => {
  try {
    const { testId } = req.params
    const { answers = {}, tabSwitches = 0, timeTakenSeconds = 0, autoSubmitted = false } = req.body

    const test = await Test.findById(testId)
    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found' })
    }

    let score = 0
    let correctAnswers = 0
    let wrongAnswers = 0
    const processedAnswers = []

    test.questions.forEach((q) => {
      const qIdStr = q._id.toString()
      const selectedIndex = answers[qIdStr] !== undefined ? answers[qIdStr] : answers[q.id]
      const isCorrect = selectedIndex !== undefined && selectedIndex === q.correctOptionIndex

      if (selectedIndex !== undefined) {
        if (isCorrect) {
          score += 4
          correctAnswers += 1
        } else {
          wrongAnswers += 1
        }
      }

      processedAnswers.push({
        questionId: qIdStr,
        selectedOptionIndex: selectedIndex !== undefined ? selectedIndex : null,
        isCorrect,
      })
    })

    const totalQuestions = test.questions.length
    const maxScore = totalQuestions * 4
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
    const passed = score >= (test.passingMarks || 40)

    const submission = await Submission.create({
      student: req.user ? req.user.id : null,
      test: test._id,
      answers: processedAnswers,
      score,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      percentage,
      passed,
      timeTakenSeconds,
      tabSwitches,
      autoSubmitted,
    })

    res.status(201).json({
      success: true,
      message: 'Test submitted and evaluated successfully',
      data: {
        submissionId: submission._id,
        score,
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        percentage,
        passed,
        tabSwitches,
        autoSubmitted,
        questions: test.questions.map((q) => ({
          id: q._id,
          questionText: q.questionText,
          options: q.options,
          correctOptionIndex: q.correctOptionIndex,
          explanation: q.explanation,
          selectedOptionIndex: answers[q._id.toString()] !== undefined ? answers[q._id.toString()] : null,
        })),
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: `Submission error: ${error.message}` })
  }
}

// @desc    Get submission result by ID
// @route   GET /api/attempts/:id/result
// @access  Private (Student, Teacher, Admin)
exports.getAttemptResult = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('test')
      .populate('student', 'fullName email grade stream')

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' })
    }

    res.status(200).json({ success: true, data: submission })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get student performance analytics summary
// @route   GET /api/attempts/analytics
// @access  Private (Student)
exports.getStudentAnalytics = async (req, res) => {
  try {
    const studentId = req.user ? req.user.id : null
    const submissions = await Submission.find({ student: studentId }).populate('test')

    const totalTests = submissions.length
    const avgPercentage = totalTests > 0
      ? Math.round(submissions.reduce((acc, curr) => acc + curr.percentage, 0) / totalTests)
      : 0

    const totalCorrect = submissions.reduce((acc, curr) => acc + (curr.correctAnswers || 0), 0)
    const totalAttempted = submissions.reduce((acc, curr) => acc + (curr.totalQuestions || 0), 0)
    const overallAccuracy = totalAttempted > 0
      ? Math.round((totalCorrect / totalAttempted) * 100 * 10) / 10
      : 0

    // Subject-wise breakdown
    const subjectMap = {}
    submissions.forEach((sub) => {
      const subject = sub.test?.subject || 'General'
      if (!subjectMap[subject]) {
        subjectMap[subject] = { attempted: 0, correct: 0, tests: 0 }
      }
      subjectMap[subject].attempted += sub.totalQuestions || 0
      subjectMap[subject].correct += sub.correctAnswers || 0
      subjectMap[subject].tests += 1
    })

    const subjectStats = Object.entries(subjectMap).map(([subject, data]) => ({
      subject,
      score: data.attempted > 0 ? Math.round((data.correct / data.attempted) * 100) : 0,
      attempted: data.attempted,
      correct: data.correct,
      tests: data.tests,
    }))

    // Sort subjects: weakest first for recommendations
    const sortedByWeakest = [...subjectStats].sort((a, b) => a.score - b.score)
    const sortedByStrongest = [...subjectStats].sort((a, b) => b.score - a.score)

    // Streak calculation (consecutive days with submissions)
    let streak = 0
    if (submissions.length > 0) {
      const dates = [...new Set(
        submissions.map((s) => new Date(s.createdAt).toISOString().split('T')[0])
      )].sort().reverse()

      const today = new Date().toISOString().split('T')[0]
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

      if (dates[0] === today || dates[0] === yesterday) {
        streak = 1
        for (let i = 1; i < dates.length; i++) {
          const prev = new Date(dates[i - 1])
          const curr = new Date(dates[i])
          const diffDays = Math.round((prev - curr) / 86400000)
          if (diffDays === 1) {
            streak++
          } else {
            break
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      data: {
        totalTests,
        avgPercentage,
        overallAccuracy,
        streak,
        subjectStats,
        strongestSubjects: sortedByStrongest.slice(0, 3),
        weakestSubjects: sortedByWeakest.slice(0, 3),
        recentSubmissions: submissions.slice(-5).reverse(),
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

