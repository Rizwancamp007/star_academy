import { useState } from 'react'
import { FaUsers, FaSearch, FaCheckCircle, FaExclamationTriangle, FaKey, FaTrashAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa'

const sampleStudents = [
  {
    id: 1,
    fullName: 'Sir Irshad Ahmed Ogahi',
    email: 'student@staracademy.edu.pk',
    phone: '0308-3309704',
    class: 'XI',
    stream: 'Pre-Medical',
    status: 'approved',
    joinedDate: '2026-07-20',
  },
  {
    id: 2,
    fullName: 'Ali Raza Arain',
    email: 'ali.raza@gmail.com',
    phone: '0300-1234567',
    class: 'XI',
    stream: 'Pre-Engineering',
    status: 'approved',
    joinedDate: '2026-07-22',
  },
  {
    id: 3,
    fullName: 'Muhammad Hamza',
    email: 'hamza.m@gmail.com',
    phone: '0312-9876543',
    class: 'XI',
    stream: 'Pre-Medical',
    status: 'pending',
    joinedDate: '2026-08-01',
  },
  {
    id: 4,
    fullName: 'Sobia Malik',
    email: 'sobia.malik@gmail.com',
    phone: '0333-4567890',
    class: 'XII',
    stream: 'Pre-Engineering',
    status: 'pending',
    joinedDate: '2026-08-02',
  },
  {
    id: 5,
    fullName: 'Zainab Fatima',
    email: 'zainab.f@gmail.com',
    phone: '0305-6543210',
    class: 'XII',
    stream: 'Pre-Medical',
    status: 'approved',
    joinedDate: '2026-07-15',
  },
]

export default function AdminStudents() {
  const [students, setStudents] = useState(sampleStudents)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [classFilter, setClassFilter] = useState('All')

  // Password reset modal state
  const [resetModalUser, setResetModalUser] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [resetSuccess, setResetSuccess] = useState(false)

  const filtered = students.filter((s) => {
    const matchesSearch = s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase()) || s.phone.includes(searchTerm)
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter
    const matchesClass = classFilter === 'All' || s.class === classFilter
    return matchesSearch && matchesStatus && matchesClass
  })

  const toggleApproval = (id) => {
    setStudents(
      students.map((s) => {
        if (s.id === id) {
          const newStatus = s.status === 'approved' ? 'pending' : 'approved'
          return { ...s, status: newStatus }
        }
        return s
      })
    )
  }

  const handleDelete = (id) => {
    setStudents(students.filter((s) => s.id !== id))
  }

  const handlePasswordReset = (e) => {
    e.preventDefault()
    if (!newPassword || newPassword.length < 6) return
    setResetSuccess(true)
    setTimeout(() => {
      setResetSuccess(false)
      setResetModalUser(null)
      setNewPassword('')
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="badge badge-emerald text-xs font-bold inline-flex items-center gap-1.5 px-3 py-1">
          <FaUsers size={12} /> Student Governance
        </span>
        <h1 className="text-3xl font-black text-emerald-dark mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
          Student Roster & Verification
        </h1>
        <p className="text-xs text-charcoal-light">Approve student accounts, manage enrollment statuses, and perform administrative password resets.</p>
      </div>

      {/* Filter Bar */}
      <div className="card p-4! flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-light/60" size={14} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, email, or phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sage text-xs font-semibold focus:outline-none focus:border-emerald-primary"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-sage text-xs font-bold text-emerald-dark focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-sage text-xs font-bold text-emerald-dark focus:outline-none"
          >
            <option value="All">All Grades</option>
            <option value="IX">Grade IX</option>
            <option value="X">Grade X</option>
            <option value="XI">Grade XI</option>
            <option value="XII">Grade XII</option>
          </select>
        </div>
      </div>

      {/* Student Roster Table */}
      <div className="card p-0! overflow-hidden border border-sage">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-emerald-deepest text-white text-xs font-extrabold uppercase tracking-wider">
                <th className="p-4">Student Info</th>
                <th className="p-4">Grade & Track</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage text-xs font-semibold">
              {filtered.map((student) => (
                <tr key={student.id} className="hover:bg-cream-alt/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gold text-emerald-dark font-black text-sm flex items-center justify-center shrink-0">
                        {student.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-emerald-dark">{student.fullName}</p>
                        <p className="text-[11px] text-charcoal-light flex items-center gap-1"><FaEnvelope size={10} /> {student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-extrabold text-emerald-dark">Grade {student.class}</span>
                    <p className="text-[11px] text-charcoal-light capitalize">{student.stream}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-emerald-dark flex items-center gap-1"><FaPhoneAlt size={10} className="text-emerald-primary" /> {student.phone}</p>
                    <p className="text-[10px] text-charcoal-light">Joined {student.joinedDate}</p>
                  </td>
                  <td className="p-4">
                    {student.status === 'approved' ? (
                      <span className="inline-flex items-center gap-1 font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full text-[11px]">
                        <FaCheckCircle size={10} /> Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-extrabold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full text-[11px]">
                        <FaExclamationTriangle size={10} /> Pending
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleApproval(student.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          student.status === 'approved'
                            ? 'bg-amber-500/10 text-amber-700 hover:bg-amber-500/20'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                        }`}
                      >
                        {student.status === 'approved' ? 'Revoke' : 'Approve'}
                      </button>

                      <button
                        onClick={() => setResetModalUser(student)}
                        className="p-2 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 text-xs font-bold"
                        title="Reset Password"
                      >
                        <FaKey size={12} />
                      </button>

                      <button
                        onClick={() => handleDelete(student.id)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 text-xs font-bold"
                        title="Remove Student"
                      >
                        <FaTrashAlt size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Password Reset Modal */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="card w-full max-w-md p-6! space-y-4 bg-white">
            <h2 className="text-xl font-bold text-emerald-dark" style={{ fontFamily: 'var(--font-heading)' }}>
              Reset Account Password
            </h2>
            <p className="text-xs text-charcoal-light">
              Administrative override for student <strong className="text-emerald-dark">{resetModalUser.fullName}</strong> ({resetModalUser.email}).
            </p>

            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-extrabold text-emerald-dark mb-1.5">New Password</label>
                <input
                  type="text"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password..."
                  className="w-full px-4 py-3 rounded-xl border border-sage text-sm focus:outline-none focus:border-emerald-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setResetModalUser(null)} className="px-4 py-2 rounded-xl border border-sage text-xs font-bold text-charcoal-light">
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs py-2! px-4!">
                  <span>Update Password</span>
                </button>
              </div>

              {resetSuccess && (
                <div className="p-3 rounded-xl text-xs font-bold text-center bg-emerald-500/10 text-emerald-800 border border-emerald-500/30">
                  ✅ Password successfully updated!
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
