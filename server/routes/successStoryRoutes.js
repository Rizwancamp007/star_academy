const express = require('express')
const { getSuccessStories, createSuccessStory, updateSuccessStory, deleteSuccessStory } = require('../controllers/successStoryController')
const { protect, authorize } = require('../middleware/auth')

const router = express.Router()

router.get('/', getSuccessStories)
router.post('/', protect, authorize('clerk', 'admin'), createSuccessStory)
router.patch('/:id', protect, authorize('clerk', 'admin'), updateSuccessStory)
router.delete('/:id', protect, authorize('clerk', 'admin'), deleteSuccessStory)

module.exports = router
