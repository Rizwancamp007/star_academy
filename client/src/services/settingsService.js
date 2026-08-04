import api from './api'

export const settingsService = {
  // Get all site settings (public)
  getSettings: async () => {
    try {
      const response = await api.get('/settings')
      return response.data
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message }
    }
  },

  // Update site settings (admin)
  updateSettings: async (settingsObj) => {
    try {
      const response = await api.patch('/settings', settingsObj)
      return response.data
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message }
    }
  },
}

export default settingsService
