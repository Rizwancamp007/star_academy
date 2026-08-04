import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaUsers, FaReceipt, FaCheckCircle, FaHourglassHalf, FaTrophy, FaArrowRight } from 'react-icons/fa'
import api from '../../services/api'

export default function ClerkDashboard() {
  const [stats, setStats] = useState({
    pendingStudents: 0,
    approvedStudents: 0,
    unpaidChallans: 0,
    totalChallanRevenue: '₨ 0',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await api.get('/admin/metrics')
        if (response.data.success) {
          const m = response.data.metrics
          setStats({
            pendingStudents: m.pendingStudents || 0,
            approvedStudents: m.approvedStudents || 0,
            unpaidChallans: m.pendingStudents || 0,
            totalChallanRevenue: `₨ ${((m.approvedStudents || 0) * 5000).toLocaleString()}`,
          })
        }
      } catch (err) {
        console.error('Failed to fetch clerk metrics:', err)
      }
      setLoading(false)
    }
    fetchMetrics()
  }, [])

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="card !p-8 bg-gradient-to-r from-[#082d1b] via-[#0E4429] to-[#147a4a] text-white border-2 border-[#D4A64A]/40 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="badge badge-gold text-xs font-bold inline-flex items-center gap-1.5 px-3 py-1">
              Front Office Clerk Desk
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              Admission Approval & Fee Station
            </h1>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl">
              Process student admission fee vouchers, grant platform login clearance, and publish student achievement stories.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/clerk/students" className="btn-gold text-xs !py-3 !px-5 shadow-md flex items-center gap-2">
              <FaUsers size={14} />
              <span>Pending Approvals</span>
            </Link>
            <Link to="/clerk/challans" className="btn-primary text-xs !py-3 !px-5 shadow-md flex items-center gap-2">
              <FaReceipt size={14} />
              <span>Issue Fee Voucher</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card !p-6 border-l-4 border-amber-500 space-y-2 bg-white">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs uppercase font-extrabold tracking-wider">Pending Registrations</span>
            <FaHourglassHalf size={20} />
          </div>
          <p className="text-3xl font-black text-[#0E4429]">{stats.pendingStudents}</p>
          <p className="text-[11px] font-semibold text-[#3a4a40]">Requires cash/challan verification</p>
        </div>

        <div className="card !p-6 border-l-4 border-emerald-600 space-y-2 bg-white">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs uppercase font-extrabold tracking-wider">Approved Students</span>
            <FaCheckCircle size={20} />
          </div>
          <p className="text-3xl font-black text-[#0E4429]">{stats.approvedStudents}</p>
          <p className="text-[11px] font-semibold text-[#3a4a40]">Active student portal access</p>
        </div>

        <div className="card !p-6 border-l-4 border-blue-600 space-y-2 bg-white">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-xs uppercase font-extrabold tracking-wider">Unpaid Admission Vouchers</span>
            <FaReceipt size={20} />
          </div>
          <p className="text-3xl font-black text-[#0E4429]">{stats.unpaidChallans}</p>
          <p className="text-[11px] font-semibold text-[#3a4a40]">One-Time Session Fee ₨ 5,000</p>
        </div>

        <div className="card !p-6 border-l-4 border-amber-600 space-y-2 bg-white">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs uppercase font-extrabold tracking-wider">Verified Revenue</span>
            <FaTrophy size={20} />
          </div>
          <p className="text-3xl font-black text-[#0E4429]">{stats.totalChallanRevenue}</p>
          <p className="text-[11px] font-semibold text-[#3a4a40]">Session 2026 Admissions</p>
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/clerk/students" className="card !p-6 space-y-4 hover:border-[#147a4a] transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
            <FaUsers />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#0E4429]">Student Approval Station</h3>
            <p className="text-xs text-[#3a4a40] mt-1">Verify walk-in fee payment at Dav School office and flip student status to Approved.</p>
          </div>
          <div className="flex items-center text-xs font-bold text-[#147a4a] gap-1 pt-2">
            <span>Manage Approvals</span> <FaArrowRight size={12} />
          </div>
        </Link>

        <Link to="/clerk/challans" className="card !p-6 space-y-4 hover:border-[#147a4a] transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-800 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
            <FaReceipt />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#0E4429]">Fee Challans & Voucher Receipts</h3>
            <p className="text-xs text-[#3a4a40] mt-1">Issue official bank/office fee challans and mark status as Paid once received.</p>
          </div>
          <div className="flex items-center text-xs font-bold text-[#147a4a] gap-1 pt-2">
            <span>Generate & Track Challans</span> <FaArrowRight size={12} />
          </div>
        </Link>

        <Link to="/clerk/success-stories" className="card !p-6 space-y-4 hover:border-[#147a4a] transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
            <FaTrophy />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#0E4429]">Success Stories Manager</h3>
            <p className="text-xs text-[#3a4a40] mt-1">Post top student MDCAT & Pre-Engineering positions and MBBS selections onto public website.</p>
          </div>
          <div className="flex items-center text-xs font-bold text-[#147a4a] gap-1 pt-2">
            <span>Manage Achievements</span> <FaArrowRight size={12} />
          </div>
        </Link>
      </div>
    </div>
  )
}
