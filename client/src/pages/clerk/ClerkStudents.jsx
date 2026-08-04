import { useState, useEffect } from 'react'
import { FaUserCheck, FaUserTimes, FaSearch, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaLock } from 'react-icons/fa'
import api from '../../services/api'

export default function ClerkStudents() {
  const [students, setStudents] = useState([
    {
      _id: 's1',
      fullName: 'Ali Hassan',
      email: 'ali.hassan@example.com',
      phone: '0300-1234567',
      class: '11',
      stream: 'pre-medical',
      isApproved: false,
      createdAt: '2026-08-01',
    },
    {
      _id: 's2',
      fullName: 'Sana Fatima',
      email: 'sana.fatima@example.com',
      phone: '0301-7654321',
      class: '12',
      stream: 'pre-engineering',
      isApproved: true,
      createdAt: '2026-07-28',
    },
    {
      _id: 's3',
      fullName: 'Zubair Ahmed',
      email: 'zubair.ahmed@example.com',
      phone: '0302-9988776',
      class: 'MDCAT',
      stream: 'pre-medical',
      isApproved: false,
      createdAt: '2026-08-02',
    },
  ])

  const [filter, setFilter] = useState('pending') // 'pending', 'approved', 'all'
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const res = await api.get('/admin/students')
      if (res.data.data && Array.isArray(res.data.data)) {
        setStudents(res.data.data)
      }
    } catch (err) {
      console.warn('Backend connection fallback to local list:', err.message)
    }
  }

  const handleApprove = async (id, name) => {
    try {
      await api.patch(`/admin/students/${id}/approve`)
      setStudents((prev) => prev.map((s) => (s._id === id ? { ...s, isApproved: true } : s)))
      setNotice(`Approved ${name}! Student can now log in to access portal.`)
      setTimeout(() => setNotice(''), 5000)
    } catch (err) {
      // Fallback update
      setStudents((prev) => prev.map((s) => (s._id === id ? { ...s, isApproved: true } : s)))
      setNotice(`Approved ${name}!`)
      setTimeout(() => setNotice(''), 5000)
    }
  }

  const handleDecline = async (id, name) => {
    try {
      await api.patch(`/admin/students/${id}/decline`)
      setStudents((prev) => prev.map((s) => (s._id === id ? { ...s, isApproved: false } : s)))
      setNotice(`Set ${name} status to pending.`)
      setTimeout(() => setNotice(''), 5000)
    } catch (err) {
      setStudents((prev) => prev.map((s) => (s._id === id ? { ...s, isApproved: false } : s)))
    }
  }

  const filtered = students.filter((s) => {
    const matchesFilter =
      filter === 'all' ? true : filter === 'approved' ? s.isApproved : !s.isApproved
    const matchesSearch =
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.phone && s.phone.includes(search))
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="badge badge-gold text-xs font-bold inline-flex items-center gap-1.5 px-3 py-1">
            <FaUserCheck size={12} /> Student Admission Queue
          </span>
          <h1 className="text-3xl font-black text-[#0E4429] mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
            Registration Approvals
          </h1>
          <p className="text-xs text-[#3a4a40]">
            Review student registrations and grant platform access upon one-time fee verification.
          </p>
        </div>

        <div className="flex rounded-xl bg-[#F1ECE0] p-1 gap-1">
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              filter === 'pending' ? 'bg-[#0E4429] text-white shadow-xs' : 'text-[#3a4a40]'
            }`}
          >
            Pending ({students.filter((s) => !s.isApproved).length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              filter === 'approved' ? 'bg-[#0E4429] text-white shadow-xs' : 'text-[#3a4a40]'
            }`}
          >
            Approved ({students.filter((s) => s.isApproved).length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              filter === 'all' ? 'bg-[#0E4429] text-white shadow-xs' : 'text-[#3a4a40]'
            }`}
          >
            All Students
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-xs flex items-center gap-2">
          <FaCheckCircle size={14} className="text-emerald-700" />
          <span>{notice}</span>
        </div>
      )}

      {/* Filter & Search */}
      <div className="card !p-4">
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3a4a40]/60" size={14} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student by name, email, or phone number..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DCE8DD] text-xs font-semibold focus:outline-none focus:border-[#147a4a]"
          />
        </div>
      </div>

      {/* Roster Table */}
      <div className="card !p-0 overflow-hidden border-2 border-[#DCE8DD]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0E4429] text-white font-extrabold border-b border-[#DCE8DD]">
                <th className="p-4">Student Name</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Grade & Stream</th>
                <th className="p-4">Admission Status</th>
                <th className="p-4 text-right">Office Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE8DD]">
              {filtered.map((s) => (
                <tr key={s._id} className="hover:bg-[#F1ECE0]/40 transition-colors">
                  <td className="p-4 font-bold text-[#0E4429]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#147a4a]/10 text-[#147a4a] flex items-center justify-center font-black">
                        {s.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-extrabold">{s.fullName}</p>
                        <p className="text-[10px] text-[#3a4a40] font-normal">Registered {s.createdAt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-[#3a4a40]">
                    <p>{s.email}</p>
                    <p className="text-[11px] text-[#0E4429] font-bold">{s.phone || '0308-3309704'}</p>
                  </td>
                  <td className="p-4">
                    <span className="badge badge-emerald text-[10px] font-extrabold">
                      Grade {s.class || 'XI'} • {s.stream || 'Pre-Medical'}
                    </span>
                  </td>
                  <td className="p-4">
                    {s.isApproved ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                        <FaCheckCircle size={10} /> Approved (Active Login)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
                        <FaHourglassHalf size={10} /> Pending Admission Fee
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {s.isApproved ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDecline(s._id, s.fullName)}
                          className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-800 hover:bg-amber-500/20 font-bold text-xs"
                        >
                          Revoke
                        </button>
                        <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md" title="Clerk restriction: Approved records locked from deletion">
                          <FaLock size={9} /> Immutable
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleApprove(s._id, s.fullName)}
                        className="btn-gold text-xs !py-1.5 !px-4 shadow-xs"
                      >
                        Approve Access
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
