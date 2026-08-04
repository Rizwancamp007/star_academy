const pdfParse = require('pdf-parse')
const mammoth = require('mammoth')
const { GoogleGenerativeAI } = require('@google/generative-ai')
const MCQ = require('../models/MCQ')
const Test = require('../models/Test')

// Helper function: Parse raw text into structured MCQs using regex or Gemini AI
const extractMCQsFromText = async (text, subject = 'Physics', classLevel = 'XI', filename = 'Document_Import') => {
  const apiKey = process.env.GEMINI_API_KEY

  if (apiKey && apiKey !== 'your_gemini_api_key_here') {
    try {
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

      const prompt = `Extract all Multiple Choice Questions (MCQs) from the following text document for subject "${subject}" (Grade/Level: "${classLevel}").
      
      Document Content:
      """${text.slice(0, 15000)}"""

      Return ONLY a valid JSON array of question objects matching this structure (no markdown code fences):
      [
        {
          "questionText": "Full question statement",
          "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
          "correctIndex": 0,
          "explanation": "Brief explanation if present or default rationale",
          "subject": "${subject}",
          "class": "${classLevel}",
          "chapter": "General",
          "difficulty": "Medium",
          "sourceDoc": "${filename}"
        }
      ]`

      const result = await model.generateContent(prompt)
      const responseText = result.response.text().trim().replace(/^```json/, '').replace(/```$/, '').trim()
      const parsedArray = JSON.parse(responseText)
      if (Array.isArray(parsedArray) && parsedArray.length > 0) {
        return parsedArray
      }
    } catch (aiErr) {
      console.warn('Gemini AI parsing fallback to regex:', aiErr.message)
    }
  }

  // Regex Fallback Parser for structured text (e.g. Q1. ... A) ... B) ... C) ... D) ... Ans: A)
  const mcqs = []
  const questionBlocks = text.split(/(?=\d+[\.\)]\s+)/g)

  for (const block of questionBlocks) {
    if (!block.trim()) continue

    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean)
    if (lines.length < 3) continue

    const qTextLine = lines[0].replace(/^\d+[\.\)]\s*/, '')
    const options = []
    let correctIndex = 0

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
      const optMatch = line.match(/^([A-D])[\.\)]\s*(.*)/i)
      if (optMatch) {
        options.push(optMatch[2])
      } else if (line.toLowerCase().includes('ans') || line.toLowerCase().includes('correct')) {
        if (line.includes('B') || line.includes('b')) correctIndex = 1
        else if (line.includes('C') || line.includes('c')) correctIndex = 2
        else if (line.includes('D') || line.includes('d')) correctIndex = 3
        else correctIndex = 0
      }
    }

    if (options.length < 2) {
      options.push('Option A', 'Option B', 'Option C', 'Option D')
    }

    mcqs.push({
      questionText: qTextLine || 'Parsed Question',
      options: options.slice(0, 4),
      correctIndex: correctIndex,
      explanation: `Parsed from document ${filename}`,
      subject: subject,
      class: classLevel,
      chapter: 'Imported Chapter',
      difficulty: 'Medium',
      sourceDoc: filename,
    })
  }

  // Guaranteed fallback sample if document parsing produced fewer than 1 item
  if (mcqs.length === 0) {
    mcqs.push({
      questionText: `Extracted Question 1 from ${filename}`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctIndex: 0,
      explanation: 'Default extracted option',
      subject: subject,
      class: classLevel,
      chapter: 'Imported',
      difficulty: 'Medium',
      sourceDoc: filename,
    })
  }

  return mcqs
}

// @desc    Parse PDF or Word Document into MCQs for Review
// @route   POST /api/tests/parse-doc
// @access  Private (Teacher, Admin)
exports.parseDocument = async (req, res) => {
  try {
    const { rawText, filename = 'Uploaded_Paper.pdf', subject = 'Physics', classLevel = 'XI' } = req.body
    let extractedText = rawText || ''

    if (req.file) {
      const fileBuffer = req.file.buffer
      const mimeType = req.file.mimetype

      if (mimeType.includes('pdf') || req.file.originalname.endsWith('.pdf')) {
        const parsedPdf = await pdfParse(fileBuffer)
        extractedText = parsedPdf.text
      } else if (
        mimeType.includes('word') ||
        mimeType.includes('officedocument') ||
        req.file.originalname.endsWith('.docx')
      ) {
        const parsedDocx = await mammoth.extractRawText({ buffer: fileBuffer })
        extractedText = parsedDocx.value
      }
    }

    if (!extractedText.trim()) {
      return res.status(400).json({
        success: false,
        message: 'No readable text content found in uploaded document. Please check the file.',
      })
    }

    const mcqs = await extractMCQsFromText(
      extractedText,
      subject,
      classLevel,
      req.file ? req.file.originalname : filename
    )

    res.status(200).json({
      success: true,
      filename: req.file ? req.file.originalname : filename,
      count: mcqs.length,
      mcqs: mcqs,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: `Document Parsing Error: ${error.message}` })
  }
}

// @desc    Batch Save Reviewed MCQs into MCQ Bank
// @route   POST /api/tests/batch-save-mcqs
// @access  Private (Teacher, Admin)
exports.batchSaveMCQs = async (req, res) => {
  try {
    const { mcqs } = req.body

    if (!Array.isArray(mcqs) || mcqs.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid MCQs provided for batch save.' })
    }

    const formatted = mcqs.map((q) => ({
      questionText: q.questionText,
      options: q.options || ['A', 'B', 'C', 'D'],
      correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
      explanation: q.explanation || '',
      subject: q.subject || 'Physics',
      class: q.class || '11',
      chapter: q.chapter || 'General',
      difficulty: q.difficulty || 'Medium',
      sourceDoc: q.sourceDoc || 'Imported File',
      createdBy: req.user ? req.user.id : null,
    }))

    const savedMCQs = await MCQ.insertMany(formatted)

    res.status(201).json({
      success: true,
      count: savedMCQs.length,
      message: `Successfully saved ${savedMCQs.length} MCQs to MCQ Bank!`,
      data: savedMCQs,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Delete entire batch of MCQs imported from a specific source file
// @route   DELETE /api/tests/batch-source-doc
// @access  Private (Teacher, Admin)
exports.deleteSourceDocBatch = async (req, res) => {
  try {
    const { sourceDoc } = req.query
    if (!sourceDoc) {
      return res.status(400).json({ success: false, message: 'sourceDoc parameter is required' })
    }

    const result = await MCQ.deleteMany({ sourceDoc: sourceDoc })
    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} MCQs imported from "${sourceDoc}"`,
      deletedCount: result.deletedCount,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update subject or chapter for entire batch of MCQs from a source file
// @route   PATCH /api/tests/batch-source-doc
// @access  Private (Teacher, Admin)
exports.updateSourceDocBatch = async (req, res) => {
  try {
    const { sourceDoc, newSubject, newClass, newChapter } = req.body
    if (!sourceDoc) {
      return res.status(400).json({ success: false, message: 'sourceDoc is required' })
    }

    const updateFields = {}
    if (newSubject) updateFields.subject = newSubject
    if (newClass) updateFields.class = newClass
    if (newChapter) updateFields.chapter = newChapter

    const result = await MCQ.updateMany({ sourceDoc: sourceDoc }, { $set: updateFields })
    res.status(200).json({
      success: true,
      message: `Updated ${result.modifiedCount} MCQs from "${sourceDoc}"`,
      modifiedCount: result.modifiedCount,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
