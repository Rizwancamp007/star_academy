import { create } from 'zustand'
import api from '../services/api'

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('sea_user')) || null,
  token: localStorage.getItem('sea_token') || null,
  isAuthenticated: !!localStorage.getItem('sea_token'),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, user } = response.data
      
      localStorage.setItem('sea_token', token)
      localStorage.setItem('sea_user', JSON.stringify(user))

      set({
        user,
        token,
        isAuthenticated: true,
        loading: false,
        error: null,
      })
      return { success: true, user }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.'
      const isPendingApproval = err.response?.data?.isPendingApproval || false
      set({ loading: false, error: message })
      return { success: false, error: message, isPendingApproval }
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null })
    try {
      const response = await api.post('/auth/register', userData)
      
      if (response.data.isPendingApproval) {
        set({ loading: false, error: null })
        return { 
          success: true, 
          isPendingApproval: true, 
          message: response.data.message || 'Registration submitted! Pay your admission fee challan at the academy office to get approved.' 
        }
      }

      const { token, user } = response.data
      localStorage.setItem('sea_token', token)
      localStorage.setItem('sea_user', JSON.stringify(user))

      set({
        user,
        token,
        isAuthenticated: true,
        loading: false,
        error: null,
      })
      return { success: true, user }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.'
      set({ loading: false, error: message })
      return { success: false, error: message }
    }
  },

  logout: () => {
    localStorage.removeItem('sea_token')
    localStorage.removeItem('sea_user')
    set({ user: null, token: null, isAuthenticated: false })
  },
}))
