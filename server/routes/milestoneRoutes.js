const express = require('express')
const { getMilestones, createMilestone, updateMilestone, deleteMilestone } = require('../controllers/milestoneController')
const { protect, authorize } = require('../middleware/auth')

const router = express.Router()

router.get('/', getMilestones)
router.post('/', protect, authorize('admin', 'clerk'), createMilestone)
router.patch('/:id', protect, authorize('admin', 'clerk'), updateMilestone)
router.delete('/:id', protect, authorize('admin', 'clerk'), deleteMilestone)

module.exports = router
