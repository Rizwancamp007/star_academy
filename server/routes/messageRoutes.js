const express = require('express')
const { createMessage, getMessages, updateMessageStatus, deleteMessage } = require('../controllers/messageController')
const { protect, authorize } = require('../middleware/auth')

const router = express.Router()

router.post('/', createMessage)
router.get('/', protect, authorize('admin'), getMessages)
router.patch('/:id/status', protect, authorize('admin'), updateMessageStatus)
router.delete('/:id', protect, authorize('admin'), deleteMessage)

module.exports = router
