const AuditLog = require('../models/AuditLog')

/**
 * Log an administrative action to the audit trail.
 * Call this inside controllers after any create/update/delete mutation.
 *
 * @param {Object} req - Express request (must have req.user)
 * @param {string} action - Action identifier e.g. 'CREATE_FACULTY', 'DELETE_STORY'
 * @param {string} targetType - Entity type e.g. 'Faculty', 'SuccessStory', 'Student'
 * @param {string} targetId - The _id of the affected document
 * @param {string} details - Human-readable description of what happened
 */
const logAudit = async (req, action, targetType, targetId, details) => {
  try {
    await AuditLog.create({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.fullName || req.user.email || 'Unknown' : 'System',
      actorRole: req.user ? req.user.role : 'system',
      action,
      targetType,
      targetId: String(targetId || ''),
      details,
    })
  } catch (err) {
    // Audit logging should never crash the main request
    console.error('Audit log write failed:', err.message)
  }
}

module.exports = { logAudit }
