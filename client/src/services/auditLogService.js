import api from './api'

export const auditLogService = {
  // Get audit logs with optional filters (admin)
  getLogs: async (params = {}) => {
    try {
      const response = await api.get('/audit-logs', { params })
      return response.data
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message }
    }
  },
}

export default auditLogService
