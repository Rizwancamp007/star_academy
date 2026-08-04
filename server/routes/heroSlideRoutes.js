const express = require('express')
const { getHeroSlides, getAllHeroSlides, createHeroSlide, updateHeroSlide, deleteHeroSlide } = require('../controllers/heroSlideController')
const { protect, authorize } = require('../middleware/auth')

const router = express.Router()

router.get('/', getHeroSlides)
router.get('/all', protect, authorize('admin'), getAllHeroSlides)
router.post('/', protect, authorize('admin'), createHeroSlide)
router.patch('/:id', protect, authorize('admin'), updateHeroSlide)
router.delete('/:id', protect, authorize('admin'), deleteHeroSlide)

module.exports = router
