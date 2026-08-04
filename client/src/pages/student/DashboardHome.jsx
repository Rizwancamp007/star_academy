import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import api from '../../services/api'
import testService from '../../services/testService'
import { 
  FaGraduationCap, 
  FaPlayCircle, 
  FaClipboardCheck, 
  FaReceipt, 
  FaFire, 
  FaArrowRight, 
  FaBookOpen,
  FaCheckCircle,
  FaClock,
  FaQuestionCircle,
  FaTrophy
} from 'react-icons/fa'

export default function DashboardHome() {
  const { user } = useAuthStore()
  const studentName = user?.fullName || 'Student'

  const [metrics, setMetrics] = useState({ testsAttempted: 0, avgScore: 0, streak: 0 })
  const [recentTests, setRecentTests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analyticsRes = await api.get('/attempts/analytics')
        if (analyticsRes.data) {
          setMetrics({
            testsAttempted: analyticsRes.data.totalAttempts || 0,
            avgScore: analyticsRes.data.overallAccuracy ? analyticsRes.data.overallAccuracy.toFixed(0) : 0,
            streak: analyticsRes.data.streak || 0,
          })
        }
      } catch (err) {
        console.error('Failed to fetch analytics:', err)
      }

      try {
        const testsRes = await testService.getAvailableTests()
        if (testsRes && testsRes.success && testsRes.data) {
          setRecentTests(testsRes.data.slice(0, 2))
        }
      } catch (err) {
        console.error('Failed to fetch tests:', err)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-10 text-white shadow-xl"
        style={{ background: 'linear-gradient(135deg, var(--color-emerald-dark), var(--color-emerald-primary))' }}>
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="badge badge-gold font-bold inline-flex items-center gap-1.5 px-3 py-1 text-xs">
            <FaGraduationCap size={14} className="text-[#D4A64A]" /> Student Portal Overview
          </span>
          <h1 className="text-3xl sm:text-4xl font-black leading-snug text-white" style={{ fontFamily: 'var(--font-heading)' }}>
            Welcome back, <span className="text-gradient-gold inline-block">{studentName}</span>!
          </h1>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal pt-1">
            Track your progress, attempt online practice tests, and download class notes for Pre-Medical & Pre-Engineering tracks.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/dashboard/tests" className="btn-gold text-sm shadow-md">
              <FaClipboardCheck size={16} />
              <span>Attempt Online Test</span>
            </Link>
            <Link to="/dashboard/lectures" className="btn-outline-white text-sm">
              <FaPlayCircle size={16} />
              <span>View Lectures</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card !p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#147a4a]/10 text-[#147a4a] flex items-center justify-center text-xl font-bold flex-shrink-0">
            <FaClipboardCheck />
          </div>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#3a4a40]">Tests Attempted</p>
            <p className="text-2xl font-black text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>{metrics.testsAttempted}</p>
          </div>
        </div>

        <div className="card !p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D4A64A]/15 text-[#b8893a] flex items-center justify-center text-xl font-bold flex-shrink-0">
            <FaCheckCircle />
          </div>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#3a4a40]">Average Score</p>
            <p className="text-2xl font-black text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>{metrics.avgScore}%</p>
          </div>
        </div>

        <div className="card !p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center text-xl font-bold flex-shrink-0">
            <FaFire />
          </div>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#3a4a40]">Study Streak</p>
            <p className="text-2xl font-black text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>{metrics.streak} Day{metrics.streak !== 1 ? 's' : ''} 🔥</p>
          </div>
        </div>

        <div className="card !p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center text-xl font-bold flex-shrink-0">
            <FaReceipt />
          </div>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#3a4a40]">Fee Status</p>
            <p className="text-sm font-bold text-emerald-700 mt-0.5">{user?.isApproved ? 'Paid & Verified' : 'Pending Verification'}</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Tests & Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-8 pt-2">
        {/* Left 2 Cols: Active & Practice Tests */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-2xl font-bold text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
              Active & Practice Tests
            </h2>
            <Link to="/dashboard/tests" className="text-xs font-extrabold text-[#147a4a] hover:underline flex items-center gap-1">
              View All <FaArrowRight size={10} />
            </Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-[#147a4a] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : recentTests.length === 0 ? (
              <div className="card !p-8 text-center space-y-2 border-2 border-dashed border-[#DCE8DD]">
                <FaClipboardCheck size={32} className="mx-auto text-[#147a4a]/30" />
                <p className="text-sm font-bold text-[#0E4429]">No tests available yet</p>
                <p className="text-xs text-[#3a4a40]">Tests will appear here once published by faculty.</p>
              </div>
            ) : (
              recentTests.map((t) => (
                <div key={t._id} className={`card !p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-l-4 ${
                  t.mode === 'practice' ? 'border-l-[#D4A64A]' : 'border-l-[#147a4a]'
                }`}>
                  <div className="space-y-2">
                    <span className={`badge ${t.mode === 'practice' ? 'badge-gold' : 'badge-emerald'} text-[11px] font-extrabold`}>
                      {t.subject} • {t.mode === 'practice' ? 'Practice Mode' : 'Timed Test'}
                    </span>
                    <h3 className="font-bold text-lg text-[#0E4429] leading-snug" style={{ fontFamily: 'var(--font-heading)' }}>
                      {t.title}
                    </h3>
                    <div className="text-xs text-[#3a4a40] flex flex-wrap items-center gap-4 font-medium pt-1">
                      <span className="flex items-center gap-1">
                        <FaClock className="text-[#147a4a]" /> {t.durationMinutes ? `${t.durationMinutes} Mins` : 'Untimed'}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaQuestionCircle className="text-[#147a4a]" /> {t.questions?.length || 0} MCQs
                      </span>
                      <span className="flex items-center gap-1">
                        <FaTrophy className="text-[#D4A64A]" /> Max: {t.totalMarks || 100}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/dashboard/tests/${t._id}/attempt`}
                    className={`${t.mode === 'practice' ? 'btn-gold' : 'btn-primary'} text-xs !py-2.5 !px-5 self-start sm:self-center shrink-0`}
                  >
                    <span>{t.mode === 'practice' ? 'Practice Now' : 'Start Test'}</span>
                    <FaArrowRight size={12} />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Quick Links */}
        <div className="space-y-5">
          <h2 className="text-2xl font-bold text-[#0E4429] pb-1" style={{ fontFamily: 'var(--font-heading)' }}>
            Quick Shortcuts
          </h2>

          <div className="space-y-3">
            <Link to="/dashboard/lectures" className="card !p-4 flex items-center gap-3 hover:bg-[#F1ECE0] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#147a4a]/10 text-[#147a4a] flex items-center justify-center font-bold flex-shrink-0">
                <FaBookOpen />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-[#0E4429] truncate">Class Video Lectures</p>
                <p className="text-xs text-[#3a4a40] truncate">Physics, Chem, Biology, Math</p>
              </div>
              <FaArrowRight size={12} className="text-[#147a4a] flex-shrink-0" />
            </Link>

            <Link to="/dashboard/challan" className="card !p-4 flex items-center gap-3 hover:bg-[#F1ECE0] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                <FaReceipt />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-[#0E4429] truncate">Download Fee Challan</p>
                <p className="text-xs text-[#3a4a40] truncate">Official Star Academy Voucher</p>
              </div>
              <FaArrowRight size={12} className="text-[#147a4a] flex-shrink-0" />
            </Link>

            <Link to="/dashboard/analytics" className="card !p-4 flex items-center gap-3 hover:bg-[#F1ECE0] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold flex-shrink-0">
                <FaClock />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-[#0E4429] truncate">Performance Insights</p>
                <p className="text-xs text-[#3a4a40] truncate">Subject-wise Score Radar</p>
              </div>
              <FaArrowRight size={12} className="text-[#147a4a] flex-shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
