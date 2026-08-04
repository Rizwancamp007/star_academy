import api from './api'

export const messageService = {
  // Submit contact form message (public)
  sendMessage: async (data) => {
    try {
      const response = await api.post('/messages', data)
      return response.data
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message }
    }
  },

  // Get all messages (admin)
  getMessages: async () => {
    try {
      const response = await api.get('/messages')
      return response.data
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message }
    }
  },

  // Update message status (admin)
  updateStatus: async (id, status) => {
    try {
      const response = await api.patch(`/messages/${id}/status`, { status })
      return response.data
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message }
    }
  },

  // Delete message (admin)
  deleteMessage: async (id) => {
    try {
      const response = await api.delete(`/messages/${id}`)
      return response.data
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message }
    }
  },
}

export default messageService
