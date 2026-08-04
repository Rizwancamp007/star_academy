const express = require('express')
const { submitAttempt, getAttemptResult, getStudentAnalytics } = require('../controllers/attemptController')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.post('/:testId/submit', protect, submitAttempt)
router.get('/:id/result', protect, getAttemptResult)
router.get('/analytics', protect, getStudentAnalytics)

module.exports = router
