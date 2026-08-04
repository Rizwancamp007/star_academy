import api from './api'

export const milestoneService = {
  // Get all active milestones (public)
  getMilestones: async () => {
    try {
      const response = await api.get('/milestones')
      return response.data
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message }
    }
  },

  // Create milestone (admin/clerk)
  createMilestone: async (data) => {
    try {
      const response = await api.post('/milestones', data)
      return response.data
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message }
    }
  },

  // Update milestone (admin/clerk)
  updateMilestone: async (id, data) => {
    try {
      const response = await api.patch(`/milestones/${id}`, data)
      return response.data
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message }
    }
  },

  // Delete milestone (admin/clerk)
  deleteMilestone: async (id) => {
    try {
      const response = await api.delete(`/milestones/${id}`)
      return response.data
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message }
    }
  },
}

export default milestoneService
