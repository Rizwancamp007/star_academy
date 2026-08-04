const express = require('express')
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })

const { generateAITest, getTests } = require('../controllers/aiTestController')
const {
  parseDocument,
  batchSaveMCQs,
  deleteSourceDocBatch,
  updateSourceDocBatch,
} = require('../controllers/docUploadController')
const { protect, authorize } = require('../middleware/auth')

const router = express.Router()

router.get('/', getTests)
router.post('/generate-ai', protect, authorize('teacher', 'admin'), generateAITest)

// Document Parsing & Batch Management Endpoints
router.post('/parse-doc', upload.single('file'), parseDocument)
router.post('/batch-save-mcqs', protect, authorize('teacher', 'admin'), batchSaveMCQs)
router.delete('/batch-source-doc', protect, authorize('teacher', 'admin'), deleteSourceDocBatch)
router.patch('/batch-source-doc', protect, authorize('teacher', 'admin'), updateSourceDocBatch)

module.exports = router
