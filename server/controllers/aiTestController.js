const { GoogleGenerativeAI } = require('@google/generative-ai')
const Test = require('../models/Test')

// @desc    Generate MCQ Test using Gemini AI from topic or raw text
// @route   POST /api/tests/generate-ai
// @access  Private (Teacher, Admin)
exports.generateAITest = async (req, res) => {
  try {
    const { topic, subject, grade, numQuestions = 10, contentText } = req.body

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      // Fallback generator if API key is not yet set in .env
      const mockQuestions = Array.from({ length: numQuestions }, (_, i) => ({
        questionText: `Sample AI Question ${i + 1} regarding ${topic || subject || 'Physics'}?`,
        options: [
          `Option A for Q${i + 1}`,
          `Option B for Q${i + 1}`,
          `Option C for Q${i + 1}`,
          `Option D for Q${i + 1}`,
        ],
        correctOptionIndex: 0,
        explanation: `Explanation for sample AI question ${i + 1}.`,
        subject: subject || 'Physics',
      }))

      const newTest = await Test.create({
        title: `AI Generated Test: ${topic || subject}`,
        description: `Automated test generated for Grade ${grade || 'XI'} on ${topic || subject}.`,
        subject: subject || 'Physics',
        grade: grade || '11',
        durationMinutes: 20,
        totalMarks: numQuestions * 5,
        questions: mockQuestions,
        createdBy: req.user ? req.user.id : null,
        isAIGenerated: true,
      })

      return res.status(201).json({
        success: true,
        message: 'AI Test generated successfully (Fallback mode — add GEMINI_API_KEY to .env for live Gemini output)',
        data: newTest,
      })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `You are an expert examiner for Star Educational Academy, Ghotki. 
    Create a ${numQuestions}-question Multiple Choice Question (MCQ) test for subject: ${subject || 'Physics'}, Grade: ${grade || '11'}, Topic: "${topic || 'General Science'}".
    ${contentText ? `Use the following study text as source content:\n"""${contentText}"""\n` : ''}

    Return ONLY a valid JSON object matching this structure (no markdown fences, no formatting backticks):
    {
      "title": "${topic || subject} Practice Test",
      "description": "AI-generated quiz based on ${topic || subject}",
      "questions": [
        {
          "questionText": "Question string here...",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "correctOptionIndex": 0,
          "explanation": "Brief solution explanation..."
        }
      ]
    }`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text().trim().replace(/^```json/, '').replace(/```$/, '').trim()
    const parsedData = JSON.parse(responseText)

    const newTest = await Test.create({
      title: parsedData.title || `AI Test: ${topic}`,
      description: parsedData.description || 'AI-generated test',
      subject: subject || 'Physics',
      grade: grade || '11',
      durationMinutes: numQuestions * 2,
      totalMarks: numQuestions * 5,
      questions: parsedData.questions,
      createdBy: req.user ? req.user.id : null,
      isAIGenerated: true,
    })

    res.status(201).json({
      success: true,
      data: newTest,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: `AI Generation Error: ${error.message}` })
  }
}

// @desc    Get all tests
// @route   GET /api/tests
// @access  Private / Public preview
exports.getTests = async (req, res) => {
  try {
    const { subject, grade } = req.query
    let query = { isPublished: true }
    if (subject) query.subject = subject
    if (grade) query.grade = grade

    const tests = await Test.find(query).sort('-createdAt')
    res.status(200).json({ success: true, count: tests.length, data: tests })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
