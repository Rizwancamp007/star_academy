const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const connectDB = require('./config/db')

// Load environment variables
dotenv.config()

// Connect to MongoDB
connectDB()

const app = express()

// Security & Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    academy: 'Star Educational Academy, Ghotki',
    session: '2026',
    timestamp: new Date().toISOString(),
  })
})

// Route Mounting
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/lectures', require('./routes/lectureRoutes'))
app.use('/api/tests', require('./routes/testRoutes'))
app.use('/api/attempts', require('./routes/attemptRoutes'))
app.use('/api/admin', require('./routes/adminRoutes'))
app.use('/api/faculty', require('./routes/facultyRoutes'))
app.use('/api/success-stories', require('./routes/successStoryRoutes'))
app.use('/api/hero-slides', require('./routes/heroSlideRoutes'))
app.use('/api/settings', require('./routes/settingsRoutes'))
app.use('/api/messages', require('./routes/messageRoutes'))
app.use('/api/milestones', require('./routes/milestoneRoutes'))
app.use('/api/audit-logs', require('./routes/auditLogRoutes'))

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Star Educational Academy API running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`)
})
