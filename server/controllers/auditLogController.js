const AuditLog = require('../models/AuditLog')

// @desc    Get audit logs with optional filters
// @route   GET /api/audit-logs
// @access  Private (Admin)
exports.getAuditLogs = async (req, res) => {
  try {
    const { role, search, limit = 100, page = 1 } = req.query
    const query = {}

    if (role && role !== 'all') {
      query.actorRole = role
    }

    if (search) {
      query.$or = [
        { actorName: { $regex: search, $options: 'i' } },
        { action: { $regex: search, $options: 'i' } },
        { details: { $regex: search, $options: 'i' } },
        { targetType: { $regex: search, $options: 'i' } },
      ]
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const total = await AuditLog.countDocuments(query)
    const logs = await AuditLog.find(query)
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit))

    res.status(200).json({
      success: true,
      count: logs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: logs,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
