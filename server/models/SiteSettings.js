const mongoose = require('mongoose')

const SiteSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)

// Default settings keys and their initial values
SiteSettingsSchema.statics.getAll = async function () {
  const settings = await this.find({})
  const map = {}
  settings.forEach((s) => {
    map[s.key] = s.value
  })
  return map
}

SiteSettingsSchema.statics.bulkUpsert = async function (settingsObj) {
  const ops = Object.entries(settingsObj).map(([key, value]) => ({
    updateOne: {
      filter: { key },
      update: { key, value: String(value) },
      upsert: true,
    },
  }))
  if (ops.length > 0) {
    await this.bulkWrite(ops)
  }
  return this.getAll()
}

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema)
