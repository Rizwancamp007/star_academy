import { useState, useEffect } from 'react'
import { FaUserShield, FaPlus, FaChalkboardTeacher, FaIdCard, FaLock, FaTrash, FaCheckCircle, FaSearch } from 'react-icons/fa'
import api from '../../services/api'

export default function AdminStaffAccounts() {
  const [staffList, setStaffList] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [notice, setNotice] = useState('')
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'teacher',
    subject: '',
  })

  const fetchStaff = async () => {
    setLoading(true)
    try {
      const response = await api.get('/admin/staff')
      if (response.data.success) {
        setStaffList(response.data.data)
      }
    } catch (err) {
      console.error('Failed to fetch staff:', err)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  const handleCreateStaff = async (e) => {
    e.preventDefault()
    if (!form.fullName || !form.email || !form.password) return

    setCreating(true)
    try {
      const response = await api.post('/auth/register', {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: form.role,
        subject: form.subject || (form.role === 'clerk' ? 'Front Office' : 'Faculty Member'),
      })

      if (response.data.success || response.data.isPendingApproval !== undefined) {
        setShowModal(false)
        setNotice(`Created official ${form.role.toUpperCase()} account for ${form.fullName}!`)
        setForm({ fullName: '', email: '', password: '', role: 'teacher', subject: '' })
        fetchStaff()
        setTimeout(() => setNotice(''), 5000)
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create account')
    }
    setCreating(false)
  }

  const handleDelete = async (id, name, role) => {
    if (role === 'admin') {
      alert('Super Admin accounts cannot be removed.')
      return
    }
    if (window.confirm(`Revoke access and remove staff account for ${name}?`)) {
      try {
        await api.delete(`/admin/staff/${id}`)
        setNotice(`Revoked account for ${name}.`)
        fetchStaff()
        setTimeout(() => setNotice(''), 5000)
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete account')
      }
    }
  }

  const filtered = staffList.filter((s) =>
    (s.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.role || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="badge badge-gold text-xs font-bold inline-flex items-center gap-1.5 px-3 py-1">
            <FaUserShield size={12} /> Staff Governance
          </span>
          <h1 className="text-3xl font-black text-[#0E4429] mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
            Staff Accounts & Access Management
          </h1>
          <p className="text-xs text-[#3a4a40]">
            Create, issue, and manage login credentials for Teachers and Front Office Clerks.
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn-gold text-xs !py-3 !px-5 shadow-md flex items-center gap-2">
          <FaPlus size={12} />
          <span>Create New Staff Login</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-xs flex items-center gap-2">
          <FaCheckCircle size={14} className="text-emerald-700" />
          <span>{notice}</span>
        </div>
      )}

      {/* Search */}
      <div className="card !p-4">
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3a4a40]/60" size={14} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search staff by name, email, or role (teacher / clerk / admin)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DCE8DD] text-xs font-semibold focus:outline-none focus:border-[#147a4a]"
          />
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-[#147a4a] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card !p-12 text-center space-y-3 border-2 border-dashed border-[#DCE8DD]">
          <FaUserShield size={40} className="mx-auto text-[#147a4a]/40" />
          <h3 className="font-extrabold text-base text-[#0E4429]">No Staff Accounts Found</h3>
          <p className="text-xs text-[#3a4a40]">Create a new staff login to get started.</p>
        </div>
      ) : (
        /* Table */
        <div className="card !p-0 overflow-hidden border-2 border-[#DCE8DD]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0E4429] text-white font-extrabold border-b border-[#DCE8DD]">
                  <th className="p-4">Staff Member</th>
                  <th className="p-4">Email Credentials</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4">Department / Subject</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE8DD]">
                {filtered.map((s) => (
                  <tr key={s._id} className="hover:bg-[#F1ECE0]/40 transition-colors">
                    <td className="p-4 font-bold text-[#0E4429]">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#D4A64A] text-[#0E4429] flex items-center justify-center font-black">
                          {(s.fullName || '?').charAt(0)}
                        </div>
                        <div>
                          <p className="font-extrabold text-sm">{s.fullName}</p>
                          <p className="text-[10px] text-[#3a4a40]">Joined: {new Date(s.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-[#3a4a40]">{s.email}</td>
                    <td className="p-4">
                      {s.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                          <FaUserShield size={10} /> Super Admin
                        </span>
                      ) : s.role === 'teacher' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-blue-900 bg-blue-100 px-2.5 py-1 rounded-full border border-blue-300">
                          <FaChalkboardTeacher size={10} /> Faculty Teacher
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
                          <FaIdCard size={10} /> Front Office Clerk
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-semibold text-[#0E4429]">{s.teacherDetails?.subject || s.role === 'clerk' ? 'Front Office' : '—'}</td>
                    <td className="p-4 text-right">
                      {s.role === 'admin' ? (
                        <span className="text-[10px] font-bold text-gray-400 flex items-center justify-end gap-1">
                          <FaLock size={9} /> System Root
                        </span>
                      ) : (
                        <button
                          onClick={() => handleDelete(s._id, s.fullName, s.role)}
                          className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs flex items-center gap-1.5 ml-auto"
                        >
                          <FaTrash size={11} /> Revoke Account
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="card w-full max-w-lg !p-6 space-y-4 bg-white border-2 border-[#147a4a]/30 shadow-2xl">
            <h2 className="text-xl font-black text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
              Issue Staff Access Account
            </h2>

            <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="e.g. Sir Aslam Physics"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#DCE8DD] font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Official Email (Login Identifier)</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. aslam.physics@staracademy.edu.pk"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#DCE8DD] font-bold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Account Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DCE8DD] font-bold focus:outline-none"
                  >
                    <option value="teacher">Faculty Teacher</option>
                    <option value="clerk">Front Office Clerk</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Initial Password</label>
                  <input
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DCE8DD] font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Subject / Department Note</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="e.g. Senior Physics Lecturer / Accounts Desk"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#DCE8DD] font-bold focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#DCE8DD] font-bold text-[#3a4a40]"
                >
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="btn-gold text-xs !py-2 !px-5 shadow-xs">
                  {creating ? 'Creating...' : 'Issue Credentials'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
