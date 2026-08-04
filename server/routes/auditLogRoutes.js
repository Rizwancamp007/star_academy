const express = require('express')
const { getAuditLogs } = require('../controllers/auditLogController')
const { protect, authorize } = require('../middleware/auth')

const router = express.Router()

router.get('/', protect, authorize('admin'), getAuditLogs)

module.exports = router
