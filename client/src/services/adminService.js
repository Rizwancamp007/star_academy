import api from './api'

export const adminService = {
  // Fetch all registered students
  getStudents: async () => {
    const response = await api.get('/admin/students')
    return response.data
  },

  // Update student approval or active status
  updateStudentStatus: async (id, statusData) => {
    const response = await api.patch(`/admin/students/${id}/status`, statusData)
    return response.data
  },

  // Reset student password administratively
  resetStudentPassword: async (id, newPassword) => {
    const response = await api.post(`/admin/students/${id}/reset-password`, { newPassword })
    return response.data
  },

  // Fetch admin dashboard metrics
  getAdminMetrics: async () => {
    const response = await api.get('/admin/metrics')
    return response.data
  },
}
