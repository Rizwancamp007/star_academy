const express = require('express')
const router = express.Router()
const {
  getStudents,
  updateStudentStatus,
  approveStudent,
  declineStudent,
  resetStudentPassword,
  getAdminMetrics,
  getPublicStats,
  getTeacherMetrics,
  getStaffAccounts,
  deleteStaffAccount,
} = require('../controllers/adminController')
const { protect, authorize } = require('../middleware/auth')

// Public stats route
router.get('/public-stats', getPublicStats)

// Protect all following routes for Admin/Director access
router.use(protect)
router.use(authorize('admin', 'director', 'clerk', 'teacher'))

router.get('/students', getStudents)
router.patch('/students/:id/status', updateStudentStatus)
router.patch('/students/:id/approve', approveStudent)
router.patch('/students/:id/decline', declineStudent)
router.post('/students/:id/reset-password', resetStudentPassword)
router.get('/metrics', getAdminMetrics)
router.get('/teacher-metrics', getTeacherMetrics)
router.get('/staff', getStaffAccounts)
router.delete('/staff/:id', deleteStaffAccount)

module.exports = router
