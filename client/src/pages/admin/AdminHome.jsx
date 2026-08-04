import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuthStore } from '../../store/useAuthStore'
import { 
  FaUserShield, 
  FaUsers, 
  FaReceipt, 
  FaBullhorn, 
  FaCheckCircle, 
  FaClock, 
  FaArrowRight,
  FaFileInvoiceDollar
} from 'react-icons/fa'

export default function AdminHome() {
  const { user, token } = useAuthStore()
  const adminName = user?.fullName || 'Sir Irshad Ahmed Ogahi'

  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    pendingStudents: 0,
    approvedStudents: 0,
    totalSubmissions: 0,
    totalLectures: 0,
    totalTests: 0,
    totalMCQs: 0,
    recentPending: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axios.get('/api/admin/metrics', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.data?.success && res.data?.metrics) {
          setMetrics(res.data.metrics)
        }
      } catch (err) {
        console.error('Failed to fetch admin metrics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [token])

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-10 text-white shadow-xl bg-gradient-to-r from-emerald-deepest to-emerald-dark">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="badge badge-gold font-bold inline-flex items-center gap-1.5 px-3 py-1 text-xs">
            <FaUserShield size={14} className="text-gold" /> Executive Control Panel
          </span>
          <h1 className="text-3xl sm:text-4xl font-black leading-snug text-white" style={{ fontFamily: 'var(--font-heading)' }}>
            Welcome, <span className="text-gradient-gold inline-block">{adminName}</span>!
          </h1>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal pt-1">
            Star Educational Academy administrative oversight center. Manage student admissions, approve pending accounts, and issue fee vouchers.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/admin/students" className="btn-gold text-sm shadow-md">
              <FaUsers size={16} />
              <span>Manage Student Accounts</span>
            </Link>
            <Link to="/admin/fees" className="btn-outline-white text-sm">
              <FaReceipt size={16} />
              <span>Fee Vouchers</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card p-5! flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-primary/10 text-emerald-primary flex items-center justify-center text-xl font-bold shrink-0">
            <FaUsers />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-charcoal-light truncate">Total Registered</p>
            <p className="text-xl sm:text-2xl font-black text-emerald-dark truncate" style={{ fontFamily: 'var(--font-heading)' }}>
              {loading ? '...' : `${metrics.totalStudents} Students`}
            </p>
          </div>
        </div>

        <div className="card p-5! flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gold/15 text-gold-dark flex items-center justify-center text-xl font-bold shrink-0">
            <FaClock />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-charcoal-light truncate">Pending Approvals</p>
            <p className="text-xl sm:text-2xl font-black text-amber-700 truncate" style={{ fontFamily: 'var(--font-heading)' }}>
              {loading ? '...' : `${metrics.pendingStudents} Accounts`}
            </p>
          </div>
        </div>

        <div className="card p-5! flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl font-bold shrink-0">
            <FaCheckCircle />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-charcoal-light truncate">Approved Accounts</p>
            <p className="text-xl sm:text-2xl font-black text-emerald-800 truncate" style={{ fontFamily: 'var(--font-heading)' }}>
              {loading ? '...' : `${metrics.approvedStudents} Active`}
            </p>
          </div>
        </div>

        <div className="card p-5! flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center text-xl font-bold shrink-0">
            <FaFileInvoiceDollar />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-charcoal-light truncate">Test Submissions</p>
            <p className="text-xl sm:text-2xl font-black text-emerald-dark truncate" style={{ fontFamily: 'var(--font-heading)' }}>
              {loading ? '...' : `${metrics.totalSubmissions} Attempts`}
            </p>
          </div>
        </div>
      </div>

      {/* Control Modules Grid */}
      <div className="grid lg:grid-cols-3 gap-8 pt-2">
        <div className="lg:col-span-2 space-y-5">
          <h2 className="text-2xl font-bold text-emerald-dark" style={{ fontFamily: 'var(--font-heading)' }}>
            Administrative Operations
          </h2>

          <div className="grid sm:grid-cols-2 gap-5">
            <Link to="/admin/students" className="card p-6! flex flex-col justify-between space-y-4 hover:border-emerald-primary/50">
              <div className="w-12 h-12 rounded-2xl bg-emerald-primary/10 text-emerald-primary flex items-center justify-center text-xl font-bold">
                <FaUsers />
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-dark" style={{ fontFamily: 'var(--font-heading)' }}>
                  Student Roster & Verification
                </h3>
                <p className="text-xs text-charcoal-light mt-1 leading-relaxed">
                  Approve newly registered students, manage enrollment status, and execute password recovery.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-primary flex items-center gap-1">
                Open Student Directory <FaArrowRight size={10} />
              </span>
            </Link>

            <Link to="/admin/fees" className="card p-6! flex flex-col justify-between space-y-4 hover:border-emerald-primary/50">
              <div className="w-12 h-12 rounded-2xl bg-gold/15 text-gold-dark flex items-center justify-center text-xl font-bold">
                <FaReceipt />
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-dark" style={{ fontFamily: 'var(--font-heading)' }}>
                  Fee Challan & Vouchers
                </h3>
                <p className="text-xs text-charcoal-light mt-1 leading-relaxed">
                  Track monthly tuition fee payments, mark vouchers paid, and issue printable Star Academy Challans.
                </p>
              </div>
              <span className="text-xs font-bold text-gold-dark flex items-center gap-1">
                Manage Fee Records <FaArrowRight size={10} />
              </span>
            </Link>

            <Link to="/admin/messages" className="card p-6! flex flex-col justify-between space-y-4 hover:border-emerald-primary/50">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center text-xl font-bold">
                <FaBullhorn />
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-dark" style={{ fontFamily: 'var(--font-heading)' }}>
                  Contact Form Inquiries
                </h3>
                <p className="text-xs text-charcoal-light mt-1 leading-relaxed">
                  Read visitor messages, parent inquiries, and reply to student admission questions.
                </p>
              </div>
              <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                View Messages Inbox <FaArrowRight size={10} />
              </span>
            </Link>

            <Link to="/admin/announcements" className="card p-6! flex flex-col justify-between space-y-4 hover:border-emerald-primary/50">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center text-xl font-bold">
                <FaBullhorn />
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-dark" style={{ fontFamily: 'var(--font-heading)' }}>
                  Marquee Ticker & Announcements
                </h3>
                <p className="text-xs text-charcoal-light mt-1 leading-relaxed">
                  Update real-time alert tickers on homepage and set Session 2026 admissions open dates.
                </p>
              </div>
              <span className="text-xs font-bold text-purple-600 flex items-center gap-1">
                Edit Announcements <FaArrowRight size={10} />
              </span>
            </Link>
          </div>
        </div>

        {/* Right Column: Pending Account Requests */}
        <div className="space-y-5">
          <h2 className="text-2xl font-bold text-emerald-dark" style={{ fontFamily: 'var(--font-heading)' }}>
            Action Required
          </h2>

          <div className="card p-6! space-y-4 border-l-4 border-l-gold">
            <span className="badge badge-gold text-[10px] font-bold">Pending Student Registrations</span>
            
            <div className="space-y-3 pt-1">
              {metrics.recentPending && metrics.recentPending.length > 0 ? (
                metrics.recentPending.map((st) => (
                  <div key={st._id} className="p-3 rounded-xl bg-cream-alt/50 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs text-emerald-dark">{st.fullName}</p>
                      <p className="text-[11px] text-charcoal-light">Grade {st.grade || 'XI'} • {st.stream || 'Pre-Medical'}</p>
                    </div>
                    <Link to="/admin/students" className="px-2.5 py-1 rounded-lg bg-emerald-primary text-white text-[11px] font-bold">
                      Review
                    </Link>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center rounded-xl bg-cream-alt/30 border border-sage text-xs text-charcoal-light font-medium">
                  🎉 All registered students are currently verified!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
