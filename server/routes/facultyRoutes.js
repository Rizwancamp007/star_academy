const express = require('express')
const { getFaculty, getAllFaculty, createFaculty, updateFaculty, deleteFaculty } = require('../controllers/facultyController')
const { protect, authorize } = require('../middleware/auth')

const router = express.Router()

router.get('/', getFaculty)
router.get('/all', protect, authorize('admin'), getAllFaculty)
router.post('/', protect, authorize('admin'), createFaculty)
router.patch('/:id', protect, authorize('admin'), updateFaculty)
router.delete('/:id', protect, authorize('admin'), deleteFaculty)

module.exports = router
