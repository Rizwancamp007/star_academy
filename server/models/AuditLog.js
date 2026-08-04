const mongoose = require('mongoose')

const AuditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    actorName: {
      type: String,
      default: 'System',
    },
    actorRole: {
      type: String,
      default: 'system',
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    targetType: {
      type: String,
      trim: true,
    },
    targetId: {
      type: String,
      trim: true,
    },
    details: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
)

AuditLogSchema.index({ createdAt: -1 })
AuditLogSchema.index({ actorRole: 1, createdAt: -1 })

module.exports = mongoose.model('AuditLog', AuditLogSchema)
