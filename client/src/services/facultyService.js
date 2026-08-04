import api from './api'

export const facultyService = {
  // Get public faculty list (active, sorted by order)
  getFaculty: async () => {
    try {
      const response = await api.get('/faculty')
      return response.data
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message }
    }
  },

  // Get all faculty including inactive (admin only)
  getAllFaculty: async () => {
    try {
      const response = await api.get('/faculty/all')
      return response.data
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message }
    }
  },

  // Create faculty member (admin only)
  createFaculty: async (data) => {
    try {
      const response = await api.post('/faculty', data)
      return response.data
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message }
    }
  },

  // Update faculty member (admin only)
  updateFaculty: async (id, data) => {
    try {
      const response = await api.patch(`/faculty/${id}`, data)
      return response.data
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message }
    }
  },

  // Delete faculty member (admin only)
  deleteFaculty: async (id) => {
    try {
      const response = await api.delete(`/faculty/${id}`)
      return response.data
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message }
    }
  },
}

export default facultyService
