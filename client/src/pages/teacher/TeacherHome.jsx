import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import api from '../../services/api'
import { 
  FaChalkboardTeacher, 
  FaVideo, 
  FaQuestionCircle, 
  FaPlusCircle, 
  FaUserGraduate, 
  FaArrowRight, 
  FaCheckCircle,
  FaFileAlt,
  FaRobot
} from 'react-icons/fa'

export default function TeacherHome() {
  const { user } = useAuthStore()
  const teacherName = user?.fullName || 'Faculty Member'

  const [metrics, setMetrics] = useState({ students: 0, mcqs: 0, tests: 0, lectures: 0 })
  const [recentTests, setRecentTests] = useState([])

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.get('/admin/teacher-metrics')
        if (res.data?.success) setMetrics(res.data.metrics)
      } catch (err) {
        console.error('Failed to fetch teacher metrics:', err)
      }
    }
    const fetchRecentTests = async () => {
      try {
        const res = await api.get('/tests')
        const list = res.data?.data || res.data?.tests || []
        setRecentTests(list.slice(0, 3))
      } catch (err) {
        console.error('Failed to fetch tests:', err)
      }
    }
    fetchMetrics()
    fetchRecentTests()
  }, [])

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-10 text-white shadow-xl"
        style={{ background: 'linear-gradient(135deg, var(--color-emerald-dark), var(--color-emerald-primary))' }}>
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="badge badge-gold font-bold inline-flex items-center gap-1.5 px-3 py-1 text-xs">
            <FaChalkboardTeacher size={14} className="text-[#D4A64A]" /> Faculty Control Center
          </span>
          <h1 className="text-3xl sm:text-4xl font-black leading-snug text-white" style={{ fontFamily: 'var(--font-heading)' }}>
            Welcome, <span className="text-gradient-gold inline-block">{teacherName}</span>!
          </h1>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal pt-1">
            Manage online lectures, generate AI exam papers, review student performance, and maintain the central MCQ Question Bank.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/teacher/tests/create" className="btn-gold text-sm shadow-md">
              <FaPlusCircle size={16} />
              <span>Create New Test</span>
            </Link>
            <Link to="/teacher/mcq" className="btn-outline-white text-sm">
              <FaQuestionCircle size={16} />
              <span>Question Bank</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card !p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#147a4a]/10 text-[#147a4a] flex items-center justify-center text-xl font-bold flex-shrink-0">
            <FaUserGraduate />
          </div>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#3a4a40]">Enrolled Students</p>
            <p className="text-2xl font-black text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>{metrics.students}</p>
          </div>
        </div>

        <div className="card !p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D4A64A]/15 text-[#b8893a] flex items-center justify-center text-xl font-bold flex-shrink-0">
            <FaQuestionCircle />
          </div>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#3a4a40]">MCQ Question Bank</p>
            <p className="text-2xl font-black text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>{metrics.mcqs?.toLocaleString()}</p>
          </div>
        </div>

        <div className="card !p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center text-xl font-bold flex-shrink-0">
            <FaFileAlt />
          </div>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#3a4a40]">Active Tests</p>
            <p className="text-2xl font-black text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>{metrics.tests}</p>
          </div>
        </div>

        <div className="card !p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center text-xl font-bold flex-shrink-0">
            <FaVideo />
          </div>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#3a4a40]">Video Lectures</p>
            <p className="text-2xl font-black text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>{metrics.lectures}</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Management Shortcuts & Recent Activities */}
      <div className="grid lg:grid-cols-3 gap-8 pt-2">
        {/* Left 2 Cols: Management Modules */}
        <div className="lg:col-span-2 space-y-5">
          <h2 className="text-2xl font-bold text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
            Faculty Tools & Management
          </h2>

          <div className="grid sm:grid-cols-2 gap-5">
            <Link to="/teacher/tests/create" className="card !p-6 flex flex-col justify-between space-y-4 hover:border-[#147a4a]/50">
              <div className="w-12 h-12 rounded-2xl bg-[#147a4a]/10 text-[#147a4a] flex items-center justify-center text-xl font-bold">
                <FaRobot />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
                  AI Test Generator
                </h3>
                <p className="text-xs text-[#3a4a40] mt-1 leading-relaxed">
                  Generate chapter quizzes automatically with Google Gemini AI or select manually from MCQ Bank.
                </p>
              </div>
              <span className="text-xs font-bold text-[#147a4a] flex items-center gap-1">
                Launch Creator <FaArrowRight size={10} />
              </span>
            </Link>

            <Link to="/teacher/mcq" className="card !p-6 flex flex-col justify-between space-y-4 hover:border-[#147a4a]/50">
              <div className="w-12 h-12 rounded-2xl bg-[#D4A64A]/15 text-[#b8893a] flex items-center justify-center text-xl font-bold">
                <FaQuestionCircle />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Question Bank Manager
                </h3>
                <p className="text-xs text-[#3a4a40] mt-1 leading-relaxed">
                  Add, edit, tag, and categorize multiple choice questions by subject, class, and difficulty rating.
                </p>
              </div>
              <span className="text-xs font-bold text-[#b8893a] flex items-center gap-1">
                Manage Bank <FaArrowRight size={10} />
              </span>
            </Link>

            <Link to="/teacher/lectures" className="card !p-6 flex flex-col justify-between space-y-4 hover:border-[#147a4a]/50">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center text-xl font-bold">
                <FaVideo />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Upload Video Lectures
                </h3>
                <p className="text-xs text-[#3a4a40] mt-1 leading-relaxed">
                  Publish YouTube / Vimeo class recording links and attach downloadable PDF study notes for students.
                </p>
              </div>
              <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                Publish Content <FaArrowRight size={10} />
              </span>
            </Link>

            <Link to="/teacher/results" className="card !p-6 flex flex-col justify-between space-y-4 hover:border-[#147a4a]/50">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl font-bold">
                <FaCheckCircle />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Student Exam Analytics
                </h3>
                <p className="text-xs text-[#3a4a40] mt-1 leading-relaxed">
                  Inspect student test submissions, highest/lowest scores, and tab-switch integrity violation flags.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                View Results <FaArrowRight size={10} />
              </span>
            </Link>
          </div>
        </div>

        {/* Right 1 Col: Recent Exam Activity */}
        <div className="space-y-5">
          <h2 className="text-2xl font-bold text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
            Recent Activity
          </h2>

          <div className="card !p-6 space-y-4">
            {recentTests.length === 0 ? (
              <p className="text-xs text-[#3a4a40] font-semibold">No recent tests created yet.</p>
            ) : (
              recentTests.map((t, i) => (
                <div key={t._id || i} className={`${i < recentTests.length - 1 ? 'border-b border-[#DCE8DD] pb-3' : ''} space-y-1`}>
                  <span className="text-[10px] font-bold text-[#147a4a] uppercase">{t.subject} • {t.mode || 'Test'}</span>
                  <p className="font-bold text-sm text-[#0E4429]">{t.title}</p>
                  <p className="text-xs text-[#3a4a40]">{t.questions?.length || 0} Questions • {new Date(t.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
