import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaClipboardCheck, FaClock, FaQuestionCircle, FaStar, FaArrowRight } from 'react-icons/fa'
import testService from '../../services/testService'

export default function StudentTests() {
  const [filterMode, setFilterMode] = useState('all')
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBackendTests = async () => {
      setLoading(true)
      const res = await testService.getAvailableTests()
      if (res && res.success && res.data) {
        const formatted = res.data.map((t) => ({
          id: t._id,
          title: t.title,
          subject: t.subject,
          mode: t.mode || 'test',
          questionsCount: t.questions ? t.questions.length : 10,
          durationMinutes: t.durationMinutes || 30,
          totalMarks: t.totalMarks || 100,
          difficulty: 'Standard',
          status: 'available',
        }))
        setTests(formatted)
      }
      setLoading(false)
    }
    fetchBackendTests()
  }, [])

  const filtered = tests.filter((t) => {
    if (filterMode !== 'all' && t.mode !== filterMode) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
          Online Practice & Timed Tests
        </h1>
        <p className="text-sm text-[#3a4a40] mt-1">
          Select a test mode below. Timed Tests contribute to your performance analytics and have blur/tab switch monitoring.
        </p>
      </div>

      {/* Mode Filters */}
      <div className="flex gap-2">
        {[{ key: 'all', label: 'All Tests' }, { key: 'test', label: '⏱️ Timed Test Mode' }, { key: 'practice', label: '💡 Untimed Practice Mode' }].map((btn) => (
          <button
            key={btn.key}
            onClick={() => setFilterMode(btn.key)}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              filterMode === btn.key
                ? 'bg-[#147a4a] text-white shadow-xs'
                : 'bg-white text-[#1C2620] border border-[#DCE8DD] hover:bg-[#147a4a]/10'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Test Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((test) => (
          <div key={test.id} className="card !p-6 flex flex-col justify-between hover:border-[#147a4a]/40">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`badge ${test.mode === 'test' ? 'badge-emerald' : 'badge-gold'} text-xs`}>
                  {test.subject} • {test.mode === 'test' ? 'Timed Test' : 'Practice'}
                </span>
                <span className="text-xs font-extrabold text-[#b8893a]">{test.difficulty}</span>
              </div>

              <h3 className="font-extrabold text-xl text-[#0E4429] mb-3 leading-snug" style={{ fontFamily: 'var(--font-heading)' }}>
                {test.title}
              </h3>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#F1ECE0] text-xs font-semibold text-[#1C2620] mb-4">
                <div className="text-center">
                  <p className="text-[10px] text-[#3a4a40] uppercase">Questions</p>
                  <p className="font-bold text-sm text-[#0E4429] mt-0.5">{test.questionsCount}</p>
                </div>
                <div className="text-center border-x border-[#DCE8DD]">
                  <p className="text-[10px] text-[#3a4a40] uppercase">Time</p>
                  <p className="font-bold text-sm text-[#0E4429] mt-0.5">{test.mode === 'test' ? `${test.durationMinutes} m` : '∞'}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-[#3a4a40] uppercase">Max Marks</p>
                  <p className="font-bold text-sm text-[#0E4429] mt-0.5">{test.totalMarks}</p>
                </div>
              </div>
            </div>

            <Link
              to={`/dashboard/tests/${test.id}/attempt`}
              className={`w-full ${test.mode === 'test' ? 'btn-primary' : 'btn-gold'} text-xs !py-3`}
            >
              <span>{test.mode === 'test' ? 'Start Timed Test' : 'Start Practice Quiz'}</span>
              <FaArrowRight size={12} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
