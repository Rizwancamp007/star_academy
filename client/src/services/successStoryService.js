import api from './api'

export const successStoryService = {
  // Get all success stories (public)
  getStories: async () => {
    try {
      const response = await api.get('/success-stories')
      return response.data
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message }
    }
  },

  // Create success story (clerk/admin)
  createStory: async (data) => {
    try {
      const response = await api.post('/success-stories', data)
      return response.data
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message }
    }
  },

  // Update success story (clerk/admin)
  updateStory: async (id, data) => {
    try {
      const response = await api.patch(`/success-stories/${id}`, data)
      return response.data
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message }
    }
  },

  // Delete success story (clerk/admin)
  deleteStory: async (id) => {
    try {
      const response = await api.delete(`/success-stories/${id}`)
      return response.data
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message }
    }
  },
}

export default successStoryService
