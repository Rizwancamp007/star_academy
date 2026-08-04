import api from './api'

export const testService = {
  // Get active tests with optional filters
  getAvailableTests: async (params = {}) => {
    try {
      const response = await api.get('/tests', { params })
      return response.data
    } catch (err) {
      console.warn('Backend API connection warning, using fallback test data:', err.message)
      return { success: false, error: err.response?.data?.message || err.message }
    }
  },

  // Submit test attempt for server-side evaluation
  submitTestAttempt: async (testId, payload) => {
    try {
      const response = await api.post(`/attempts/${testId}/submit`, payload)
      return response.data
    } catch (err) {
      console.warn('Backend API connection warning during submission:', err.message)
      return { success: false, error: err.response?.data?.message || err.message }
    }
  },

  // Fetch test attempt result by submission ID
  getAttemptResult: async (submissionId) => {
    try {
      const response = await api.get(`/attempts/${submissionId}/result`)
      return response.data
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message }
    }
  },

  // Fetch student performance analytics
  getStudentAnalytics: async () => {
    try {
      const response = await api.get('/attempts/analytics')
      return response.data
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message }
    }
  },
}

export default testService
