import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaClock, FaExclamationTriangle, FaCheckCircle, FaArrowRight, FaArrowLeft, FaFlag } from 'react-icons/fa'
import testService from '../../services/testService'

const sampleQuestions = [
  {
    id: '101',
    questionText: 'A particle moves along a straight line with a constant acceleration of 2 m/s². If its initial velocity is 5 m/s, what is its velocity after 4 seconds?',
    options: ['9 m/s', '13 m/s', '18 m/s', '20 m/s'],
    correctIndex: 1,
    explanation: 'Using the first equation of motion v = u + at: v = 5 + (2 * 4) = 13 m/s.',
  },
  {
    id: '102',
    questionText: 'Which of the following scalar quantities is defined as the rate of change of distance with respect to time?',
    options: ['Velocity', 'Speed', 'Acceleration', 'Displacement'],
    correctIndex: 1,
    explanation: 'Speed is a scalar quantity defined as distance traveled per unit time.',
  },
  {
    id: '103',
    questionText: 'The area under a Velocity-Time graph represents which of the following physical quantities?',
    options: ['Acceleration', 'Work Done', 'Displacement', 'Power'],
    correctIndex: 2,
    explanation: 'The area under a Velocity-Time graph gives the total displacement of the body.',
  },
  {
    id: '104',
    questionText: 'If a body is thrown vertically upward with a speed of 19.6 m/s, how long will it take to reach its maximum height? (g = 9.8 m/s²)',
    options: ['1 second', '2 seconds', '3 seconds', '4 seconds'],
    correctIndex: 1,
    explanation: 'At max height v = 0. Using v = u - gt: 0 = 19.6 - 9.8t => t = 2 seconds.',
  },
  {
    id: '105',
    questionText: 'When a car rounds a curved path at constant speed, its acceleration is:',
    options: ['Zero', 'Directed towards the center of curvature', 'Tangential to the curve', 'Directed away from the center'],
    correctIndex: 1,
    explanation: 'Centripetal acceleration always acts radially inwards towards the center of the circular arc.',
  },
]

export default function TestAttempt() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState({}) // { questionId: optionIndex }
  const [flagged, setFlagged] = useState({}) // { questionId: boolean }
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes
  const [tabSwitches, setTabSwitches] = useState(0)
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitTest(true)
      return
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  // Window blur / Tab switch detector
  useEffect(() => {
    const handleBlur = () => {
      setTabSwitches((prev) => {
        const next = prev + 1
        setShowWarningModal(true)
        if (next >= 3) {
          handleSubmitTest(true)
        }
        return next
      })
    }
    window.addEventListener('blur', handleBlur)
    return () => window.removeEventListener('blur', handleBlur)
  }, [])

  const currentQ = sampleQuestions[currentIndex]

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleSelectOption = (optionIndex) => {
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: optionIndex }))
  }

  const toggleFlag = () => {
    setFlagged((prev) => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }))
  }

  const handleSubmitTest = async (auto = false) => {
    if (isSubmitting) return
    setIsSubmitting(true)

    // Call backend API evaluation if available
    const payload = {
      answers: userAnswers,
      tabSwitches,
      timeTakenSeconds: 600 - timeLeft,
      autoSubmitted: auto,
    }

    const apiRes = await testService.submitTestAttempt(id, payload)

    let score = 0
    let resultPayload = null

    if (apiRes && apiRes.success && apiRes.data) {
      score = apiRes.data.score
      resultPayload = apiRes.data
    } else {
      // Fallback local scoring
      sampleQuestions.forEach((q) => {
        if (userAnswers[q.id] === q.correctIndex) {
          score += 4
        }
      })
    }

    navigate(`/dashboard/tests/${id}/result`, {
      state: {
        answers: userAnswers,
        score,
        totalQuestions: sampleQuestions.length,
        autoSubmitted: auto,
        tabSwitches,
        apiData: resultPayload,
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Top Test Header Bar */}
      <div className="card !p-5 bg-[#0E4429] text-white flex flex-wrap items-center justify-between gap-4 border-none shadow-lg">
        <div>
          <span className="badge badge-gold text-xs font-bold mb-1">Physics • MDCAT Test</span>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
            Kinematics & Dynamics Model Exam
          </h1>
        </div>

        {/* Server Timer */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/20">
            <FaClock className="text-[#D4A64A]" />
            <span className="font-mono text-lg font-bold text-white">{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={() => handleSubmitTest(false)}
            disabled={isSubmitting}
            className="btn-gold text-xs !py-2.5 !px-5"
          >
            <span>{isSubmitting ? 'Evaluating...' : 'Submit Test'}</span>
            <FaCheckCircle size={14} />
          </button>
        </div>
      </div>

      {/* Tab Switch Warning Notice */}
      {tabSwitches > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs font-bold flex items-center gap-3">
          <FaExclamationTriangle size={18} className="text-amber-600 flex-shrink-0" />
          <span>Warning: Tab switch detected ({tabSwitches}/3). Exceeding 3 tab switches will automatically trigger final submission.</span>
        </div>
      )}

      {/* Main Attempt Grid */}
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Question Panel (Left 3 cols) */}
        <div className="lg:col-span-3 card !p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#DCE8DD]">
            <span className="font-bold text-sm text-[#0E4429]">
              Question {currentIndex + 1} of {sampleQuestions.length}
            </span>
            <button
              onClick={toggleFlag}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                flagged[currentQ.id]
                  ? 'bg-amber-500 text-white'
                  : 'bg-[#F1ECE0] text-[#3a4a40] hover:bg-amber-500/20'
              }`}
            >
              <FaFlag size={11} />
              <span>{flagged[currentQ.id] ? 'Flagged' : 'Flag Question'}</span>
            </button>
          </div>

          <p className="text-base sm:text-lg font-bold text-[#1C2620] leading-relaxed">
            {currentQ.questionText}
          </p>

          {/* MCQ Options */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((opt, idx) => {
              const isSelected = userAnswers[currentQ.id] === idx
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                    isSelected
                      ? 'border-[#147a4a] bg-[#147a4a]/10 font-bold text-[#0E4429]'
                      : 'border-[#DCE8DD] hover:border-[#147a4a]/40 bg-white'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    isSelected ? 'bg-[#147a4a] text-white' : 'bg-[#F1ECE0] text-[#1C2620]'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm">{opt}</span>
                </button>
              )
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-[#DCE8DD]">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              className="btn-outline text-xs !py-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FaArrowLeft size={12} />
              <span>Previous</span>
            </button>

            <button
              disabled={currentIndex === sampleQuestions.length - 1}
              onClick={() => setCurrentIndex((prev) => Math.min(sampleQuestions.length - 1, prev + 1))}
              className="btn-primary text-xs !py-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <FaArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* Question Navigator Drawer (Right 1 col) */}
        <div className="card !p-6 space-y-4 h-fit">
          <h3 className="font-bold text-sm text-[#0E4429] uppercase tracking-wider">Question Navigator</h3>
          
          <div className="grid grid-cols-5 gap-2">
            {sampleQuestions.map((q, idx) => {
              const isCurrent = idx === currentIndex
              const isAnswered = userAnswers[q.id] !== undefined
              const isFlagged = flagged[q.id]

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-10 rounded-xl text-xs font-bold transition-all relative ${
                    isCurrent
                      ? 'ring-2 ring-[#0E4429] bg-[#147a4a] text-white shadow-xs'
                      : isAnswered
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-[#F1ECE0] text-[#1C2620] hover:bg-[#147a4a]/20'
                  }`}
                >
                  {idx + 1}
                  {isFlagged && <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500" />}
                </button>
              )
            })}
          </div>

          <div className="pt-4 border-t border-[#DCE8DD] space-y-2 text-xs font-semibold text-[#3a4a40]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#147a4a]" /> Answered
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#F1ECE0] border" /> Unanswered
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" /> Flagged
            </div>
          </div>
        </div>
      </div>

      {/* Blur Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl border border-amber-500/40">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto text-2xl">
              <FaExclamationTriangle />
            </div>
            <h3 className="font-bold text-xl text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
              Window Blur Detected
            </h3>
            <p className="text-sm text-[#3a4a40] leading-relaxed">
              Navigating away from the test tab is monitored during timed exams. You have switched windows {tabSwitches} time(s). 3 switches will force auto-submission.
            </p>
            <button
              onClick={() => setShowWarningModal(false)}
              className="btn-primary w-full text-xs !py-3"
            >
              <span>I Understand — Resume Test</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
