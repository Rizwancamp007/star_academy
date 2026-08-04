import { useState, useEffect } from 'react'
import { FaTrophy, FaPlus, FaEdit, FaTrash, FaGraduationCap } from 'react-icons/fa'
import successStoryService from '../../services/successStoryService'

export default function ClerkSuccessStories() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [notice, setNotice] = useState('')
  const [form, setForm] = useState({
    studentName: '',
    achievement: '',
    year: new Date().getFullYear().toString(),
    institute: '',
    score: '',
    category: 'MDCAT',
  })

  const fetchStories = async () => {
    setLoading(true)
    const res = await successStoryService.getStories()
    if (res && res.success) {
      setStories(res.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchStories()
  }, [])

  const handleOpenCreate = () => {
    setEditingId(null)
    setForm({ studentName: '', achievement: '', year: new Date().getFullYear().toString(), institute: '', score: '', category: 'MDCAT' })
    setShowModal(true)
  }

  const handleOpenEdit = (story) => {
    setEditingId(story._id)
    setForm({
      studentName: story.studentName || '',
      achievement: story.achievement || '',
      year: story.year || '',
      institute: story.institute || '',
      score: story.score || '',
      category: story.category || 'MDCAT',
    })
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.studentName) return

    if (editingId) {
      const res = await successStoryService.updateStory(editingId, form)
      if (res && res.success) {
        setNotice(`Updated ${form.studentName}'s story!`)
      }
    } else {
      const res = await successStoryService.createStory(form)
      if (res && res.success) {
        setNotice(`Published ${form.studentName}'s achievement!`)
      }
    }
    setShowModal(false)
    fetchStories()
    setTimeout(() => setNotice(''), 4000)
  }

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete this success story for ${name} from public website wall?`)) {
      const res = await successStoryService.deleteStory(id)
      if (res && res.success) {
        setNotice(`Removed ${name}'s story.`)
        fetchStories()
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
            <FaTrophy size={12} /> Public Achievement Wall
          </span>
          <h1 className="text-3xl font-black text-[#0E4429] mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
            Success Stories Manager
          </h1>
          <p className="text-xs text-[#3a4a40]">
            Manage student rankings, medical seat admissions, and engineering top position badges.
          </p>
        </div>

        <button onClick={handleOpenCreate} className="btn-gold text-xs !py-3 !px-5 shadow-md flex items-center gap-2">
          <FaPlus size={12} />
          <span>Add New Achievement Story</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-xs flex items-center gap-2">
          <FaTrophy size={14} className="text-emerald-700" />
          <span>{notice}</span>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-[#147a4a] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : stories.length === 0 ? (
        <div className="card !p-12 text-center space-y-3 border-2 border-dashed border-[#DCE8DD]">
          <FaTrophy size={40} className="mx-auto text-[#D4A64A]/40" />
          <h3 className="font-extrabold text-base text-[#0E4429]">No Success Stories Yet</h3>
          <p className="text-xs text-[#3a4a40] max-w-sm mx-auto">Click "Add New Achievement Story" to publish the first student achievement.</p>
        </div>
      ) : (
        /* Story Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div key={story._id} className="card !p-6 space-y-4 border-2 border-[#D4A64A]/30 relative shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 font-black flex items-center justify-center">
                    <FaGraduationCap size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-[#0E4429]">{story.studentName}</h3>
                    <span className="badge badge-gold text-[10px] font-bold">Session {story.year}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button onClick={() => handleOpenEdit(story)} className="p-2 rounded-lg text-[#147a4a] hover:bg-[#147a4a]/10">
                    <FaEdit size={13} />
                  </button>
                  <button onClick={() => handleDelete(story._id, story.studentName)} className="p-2 rounded-lg text-red-600 hover:bg-red-50">
                    <FaTrash size={13} />
                  </button>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-[#DCE8DD]">
                <p className="font-extrabold text-xs text-[#147a4a]">{story.achievement}</p>
                <p className="text-xs text-[#3a4a40] font-semibold">{story.institute}</p>
                <p className="text-xs text-amber-700 font-bold">Score / Rank: {story.score || '—'}</p>
                <span className="badge badge-emerald text-[9px] font-bold">{story.category}</span>
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
              {editingId ? 'Edit Success Story' : 'Add New Success Story'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Student Name</label>
                <input
                  type="text"
                  required
                  value={form.studentName}
                  onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                  placeholder="e.g. Muhammad Ahmed"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#DCE8DD] text-xs font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Achievement / Distinction Title</label>
                <input
                  type="text"
                  required
                  value={form.achievement}
                  onChange={(e) => setForm({ ...form, achievement: e.target.value })}
                  placeholder="e.g. 1st Position in MDCAT, District Ghotki"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#DCE8DD] text-xs font-bold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Admitted University / Seat</label>
                  <input
                    type="text"
                    value={form.institute}
                    onChange={(e) => setForm({ ...form, institute: e.target.value })}
                    placeholder="e.g. MBBS - CMC Larkana"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DCE8DD] text-xs font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Score / Marks</label>
                  <input
                    type="text"
                    value={form.score}
                    onChange={(e) => setForm({ ...form, score: e.target.value })}
                    placeholder="e.g. 188/200"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DCE8DD] text-xs font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DCE8DD] text-xs font-bold focus:outline-none"
                  >
                    <option value="MDCAT">MDCAT</option>
                    <option value="ECAT">ECAT</option>
                    <option value="Board Position">Board Position</option>
                    <option value="Scholarship">Scholarship</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Session Year</label>
                  <input
                    type="text"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    placeholder="2025"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DCE8DD] text-xs font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border border-[#DCE8DD] text-xs font-bold text-[#3a4a40]">
                  Cancel
                </button>
                <button type="submit" className="btn-gold text-xs !py-2 !px-5 shadow-xs">
                  Save Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
