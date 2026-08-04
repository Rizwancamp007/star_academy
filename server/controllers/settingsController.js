const SiteSettings = require('../models/SiteSettings')
const { logAudit } = require('../middleware/auditLogger')

// @desc    Get all site settings (public)
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.getAll()
    res.status(200).json({ success: true, data: settings })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Bulk update site settings
// @route   PATCH /api/settings
// @access  Private (Admin)
exports.updateSettings = async (req, res) => {
  try {
    const settingsObj = req.body

    if (!settingsObj || Object.keys(settingsObj).length === 0) {
      return res.status(400).json({ success: false, message: 'No settings provided' })
    }

    const updated = await SiteSettings.bulkUpsert(settingsObj)

    await logAudit(
      req,
      'UPDATE_SITE_SETTINGS',
      'SiteSettings',
      '',
      `Updated settings: ${Object.keys(settingsObj).join(', ')}`
    )

    res.status(200).json({ success: true, data: updated })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
