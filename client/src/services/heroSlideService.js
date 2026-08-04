import api from './api'

export const heroSlideService = {
  // Get active hero slides (public)
  getSlides: async () => {
    try {
      const response = await api.get('/hero-slides')
      return response.data
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message }
    }
  },

  // Get all slides including inactive (admin)
  getAllSlides: async () => {
    try {
      const response = await api.get('/hero-slides/all')
      return response.data
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message }
    }
  },

  // Create hero slide (admin)
  createSlide: async (data) => {
    try {
      const response = await api.post('/hero-slides', data)
      return response.data
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message }
    }
  },

  // Update hero slide (admin)
  updateSlide: async (id, data) => {
    try {
      const response = await api.patch(`/hero-slides/${id}`, data)
      return response.data
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message }
    }
  },

  // Delete hero slide (admin)
  deleteSlide: async (id) => {
    try {
      const response = await api.delete(`/hero-slides/${id}`)
      return response.data
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message }
    }
  },
}

export default heroSlideService
