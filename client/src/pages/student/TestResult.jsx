import { useLocation, Link, useParams } from 'react'
import { FaTrophy, FaCheckCircle, FaTimesCircle, FaArrowLeft, FaRedo, FaDownload } from 'react-icons/fa'

const sampleQuestions = [
  {
    id: 101,
    questionText: 'A particle moves along a straight line with a constant acceleration of 2 m/s². If its initial velocity is 5 m/s, what is its velocity after 4 seconds?',
    options: ['9 m/s', '13 m/s', '18 m/s', '20 m/s'],
    correctIndex: 1,
    explanation: 'Using the first equation of motion v = u + at: v = 5 + (2 * 4) = 13 m/s.',
  },
  {
    id: 102,
    questionText: 'Which of the following scalar quantities is defined as the rate of change of distance with respect to time?',
    options: ['Velocity', 'Speed', 'Acceleration', 'Displacement'],
    correctIndex: 1,
    explanation: 'Speed is a scalar quantity defined as distance traveled per unit time.',
  },
  {
    id: 103,
    questionText: 'The area under a Velocity-Time graph represents which of the following physical quantities?',
    options: ['Acceleration', 'Work Done', 'Displacement', 'Power'],
    correctIndex: 2,
    explanation: 'The area under a Velocity-Time graph gives the total displacement of the body.',
  },
  {
    id: 104,
    questionText: 'If a body is thrown vertically upward with a speed of 19.6 m/s, how long will it take to reach its maximum height? (g = 9.8 m/s²)',
    options: ['1 second', '2 seconds', '3 seconds', '4 seconds'],
    correctIndex: 1,
    explanation: 'At max height v = 0. Using v = u - gt: 0 = 19.6 - 9.8t => t = 2 seconds.',
  },
  {
    id: 105,
    questionText: 'When a car rounds a curved path at constant speed, its acceleration is:',
    options: ['Zero', 'Directed towards the center of curvature', 'Tangential to the curve', 'Directed away from the center'],
    correctIndex: 1,
    explanation: 'Centripetal acceleration always acts radially inwards towards the center of the circular arc.',
  },
]

export default function TestResult() {
  const { id } = useParams()
  const location = useLocation()
  const state = location.state || {}
  const userAnswers = state.answers || { 101: 1, 102: 1, 103: 2, 104: 0, 105: 1 }

  let correctCount = 0
  sampleQuestions.forEach((q) => {
    if (userAnswers[q.id] === q.correctIndex) correctCount++
  })

  const scorePercentage = Math.round((correctCount / sampleQuestions.length) * 100)

  return (
    <div className="space-y-8">
      {/* Result Hero Header */}
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-10 text-white shadow-xl text-center"
        style={{ background: 'linear-gradient(135deg, var(--color-emerald-dark), var(--color-emerald-primary))' }}>
        <div className="w-16 h-16 rounded-2xl bg-[#D4A64A]/20 border border-[#D4A64A]/40 flex items-center justify-center mx-auto mb-4 text-[#D4A64A] text-3xl shadow-sm">
          <FaTrophy />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-black mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          Test Results & Performance Summary
        </h1>
        <p className="text-sm text-white/80 max-w-xl mx-auto mb-6">
          Kinematics & Dynamics Model Exam • Physics (Grade XI)
        </p>

        {/* Score Pill Card */}
        <div className="inline-flex items-center gap-6 px-8 py-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md">
          <div>
            <p className="text-xs uppercase font-bold text-white/70">Correct Score</p>
            <p className="text-3xl font-black text-[#D4A64A]" style={{ fontFamily: 'var(--font-heading)' }}>
              {correctCount} / {sampleQuestions.length}
            </p>
          </div>
          <div className="h-10 w-px bg-white/20" />
          <div>
            <p className="text-xs uppercase font-bold text-white/70">Percentage</p>
            <p className="text-3xl font-black text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              {scorePercentage}%
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/dashboard/tests" className="btn-gold text-xs">
            <FaArrowLeft size={12} />
            <span>Back to All Tests</span>
          </Link>
          <Link to={`/dashboard/tests/${id}/attempt`} className="btn-outline-white text-xs">
            <FaRedo size={12} />
            <span>Retake Exam</span>
          </Link>
        </div>
      </div>

      {/* Answer Sheet Solutions Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
          Detailed Solution & Answer Key
        </h2>

        <div className="space-y-6">
          {sampleQuestions.map((q, idx) => {
            const studentAns = userAnswers[q.id]
            const isCorrect = studentAns === q.correctIndex
            const isSkipped = studentAns === undefined

            return (
              <div
                key={q.id}
                className={`card !p-6 border-l-4 ${
                  isCorrect
                    ? 'border-l-emerald-600 bg-emerald-50/20'
                    : isSkipped
                    ? 'border-l-amber-500 bg-amber-50/20'
                    : 'border-l-red-500 bg-red-50/20'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-bold text-xs text-[#0E4429]">Question {idx + 1}</span>
                  {isCorrect ? (
                    <span className="badge text-xs font-bold bg-emerald-100 text-emerald-800 border-emerald-300">
                      <FaCheckCircle size={12} /> Correct (+4)
                    </span>
                  ) : isSkipped ? (
                    <span className="badge text-xs font-bold bg-amber-100 text-amber-800 border-amber-300">
                      Unanswered (0)
                    </span>
                  ) : (
                    <span className="badge text-xs font-bold bg-red-100 text-red-800 border-red-300">
                      <FaTimesCircle size={12} /> Incorrect (0)
                    </span>
                  )}
                </div>

                <p className="font-bold text-[#1C2620] mb-4 text-base leading-relaxed">
                  {q.questionText}
                </p>

                {/* Options Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {q.options.map((opt, optIdx) => {
                    const isOptionCorrect = optIdx === q.correctIndex
                    const isStudentChosen = optIdx === studentAns

                    let optionStyle = 'bg-white border-[#DCE8DD] text-[#3a4a40]'
                    if (isOptionCorrect) {
                      optionStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold'
                    } else if (isStudentChosen && !isOptionCorrect) {
                      optionStyle = 'bg-red-100 border-red-400 text-red-900 font-bold'
                    }

                    return (
                      <div key={optIdx} className={`p-3.5 rounded-xl border text-xs flex items-center gap-3 ${optionStyle}`}>
                        <span className="font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                        <span>{opt}</span>
                        {isOptionCorrect && <span className="ml-auto text-xs font-bold text-emerald-700">✓ Correct</span>}
                        {isStudentChosen && !isOptionCorrect && <span className="ml-auto text-xs font-bold text-red-700">Your Choice</span>}
                      </div>
                    )
                  })}
                </div>

                {/* Explanation Box */}
                <div className="p-4 rounded-xl bg-[#F1ECE0] border border-[#DCE8DD] text-xs space-y-1">
                  <p className="font-bold text-[#0E4429]">💡 Solution Explanation:</p>
                  <p className="text-[#3a4a40] leading-relaxed">{q.explanation}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
