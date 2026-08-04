import { useState, useEffect } from 'react'
import { FaUserGraduate, FaPlus, FaEdit, FaTrash, FaStar } from 'react-icons/fa'
import facultyService from '../../services/facultyService'

export default function AdminFaculty() {
  const [faculty, setFaculty] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [notice, setNotice] = useState('')
  const [form, setForm] = useState({
    name: '',
    designation: '',
    qualification: '',
    experience: '',
    subject: 'Chemistry',
    phone: '',
  })

  const fetchFaculty = async () => {
    setLoading(true)
    const res = await facultyService.getAllFaculty()
    if (res && res.success) {
      setFaculty(res.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchFaculty()
  }, [])

  const handleOpenCreate = () => {
    setEditingId(null)
    setForm({ name: '', designation: '', qualification: '', experience: '', subject: 'Chemistry', phone: '' })
    setShowModal(true)
  }

  const handleOpenEdit = (f) => {
    setEditingId(f._id)
    setForm({
      name: f.name || '',
      designation: f.designation || '',
      qualification: f.qualification || '',
      experience: f.experience || '',
      subject: f.subject || 'Chemistry',
      phone: f.phone || '',
    })
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name) return

    if (editingId) {
      const res = await facultyService.updateFaculty(editingId, form)
      if (res && res.success) {
        setNotice(`Updated ${form.name}'s profile!`)
      }
    } else {
      const res = await facultyService.createFaculty(form)
      if (res && res.success) {
        setNotice(`Added ${form.name} to faculty directory!`)
      }
    }
    setShowModal(false)
    fetchFaculty()
    setTimeout(() => setNotice(''), 4000)
  }

  const handleDelete = async (id, name) => {
    if (window.confirm(`Remove ${name} from public Faculty Directory?`)) {
      const res = await facultyService.deleteFaculty(id)
      if (res && res.success) {
        setNotice(`Removed ${name} from directory.`)
        fetchFaculty()
        setTimeout(() => setNotice(''), 4000)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="badge badge-gold text-xs font-bold inline-flex items-center gap-1.5 px-3 py-1">
            <FaUserGraduate size={12} /> Academic Leadership
          </span>
          <h1 className="text-3xl font-black text-[#0E4429] mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
            Faculty Members Directory
          </h1>
          <p className="text-xs text-[#3a4a40]">
            Update public website faculty profiles, designations, qualifications, and display order.
          </p>
        </div>

        <button onClick={handleOpenCreate} className="btn-gold text-xs !py-3 !px-5 shadow-md flex items-center gap-2">
          <FaPlus size={12} />
          <span>Add Faculty Member</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-xs flex items-center gap-2">
          <FaStar size={14} className="text-emerald-700" />
          <span>{notice}</span>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-[#147a4a] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : faculty.length === 0 ? (
        <div className="card !p-12 text-center space-y-3 border-2 border-dashed border-[#DCE8DD]">
          <FaUserGraduate size={40} className="mx-auto text-[#147a4a]/40" />
          <h3 className="font-extrabold text-base text-[#0E4429]">No Faculty Members Yet</h3>
          <p className="text-xs text-[#3a4a40] max-w-sm mx-auto">Click "Add Faculty Member" to create the first profile for the public website directory.</p>
        </div>
      ) : (
        /* Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {faculty.map((f) => (
            <div key={f._id} className="card !p-6 space-y-4 border-2 border-[#147a4a]/20 shadow-md relative">
              <div className="flex items-center justify-between">
                <span className="badge badge-gold text-[10px] font-extrabold">Order #{f.order}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleOpenEdit(f)} className="p-1.5 rounded-lg text-[#147a4a] hover:bg-[#147a4a]/10">
                    <FaEdit size={13} />
                  </button>
                  <button onClick={() => handleDelete(f._id, f.name)} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50">
                    <FaTrash size={13} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#0E4429] text-white font-black text-xl flex items-center justify-center border-2 border-[#D4A64A]">
                  {f.name.charAt(4) || f.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#0E4429] leading-tight">{f.name}</h3>
                  <p className="text-xs text-[#147a4a] font-bold mt-0.5">{f.designation}</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-[#DCE8DD] text-xs">
                <p className="text-[#3a4a40] font-semibold"><span className="font-extrabold">Degree:</span> {f.qualification || '—'}</p>
                <p className="text-[#3a4a40] font-semibold"><span className="font-extrabold">Experience:</span> {f.experience || '—'}</p>
                <p className="text-amber-700 font-extrabold"><span className="font-extrabold text-[#3a4a40]">Subject:</span> {f.subject}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="card w-full max-w-lg !p-6 space-y-4 bg-white border-2 border-[#147a4a]/30 shadow-2xl">
            <h2 className="text-xl font-black text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
              {editingId ? 'Edit Faculty Profile' : 'Add New Faculty Member'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">
                  Full Name & Title
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Sir Irshad Ahmed Ogahi"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#DCE8DD] font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">
                  Designation / Role
                </label>
                <input
                  type="text"
                  required
                  value={form.designation}
                  onChange={(e) => setForm({ ...form, designation: e.target.value })}
                  placeholder="e.g. Director & Chemistry Specialist"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#DCE8DD] font-bold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">
                    Qualification
                  </label>
                  <input
                    type="text"
                    value={form.qualification}
                    onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                    placeholder="e.g. M.Sc Chemistry (Gold Medalist)"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DCE8DD] font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">
                    Teaching Experience
                  </label>
                  <input
                    type="text"
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    placeholder="e.g. 18+ Years"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DCE8DD] font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">
                    Subject
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DCE8DD] font-bold focus:outline-none"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="English">English</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">
                    Phone (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g. 0308-3309704"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DCE8DD] font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#DCE8DD] font-bold text-[#3a4a40]"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-gold text-xs !py-2 !px-5 shadow-xs">
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
