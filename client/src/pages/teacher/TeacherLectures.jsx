import { useState } from 'react'
import { FaVideo, FaPlus, FaTrashAlt, FaCheck, FaFilePdf, FaBookOpen, FaExternalLinkAlt } from 'react-icons/fa'

const initialLectures = [
  {
    id: 1,
    title: 'Kinematics & Equations of Motion — Full Lecture',
    subject: 'Physics',
    classLevel: 'XI',
    chapter: 'Chapter 2: Motion in One Dimension',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    dateAdded: '2026-08-01',
  },
  {
    id: 2,
    title: 'Atomic Structure & Bohr Model Principles',
    subject: 'Chemistry',
    classLevel: 'XI',
    chapter: 'Chapter 3: Atomic Structure',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    dateAdded: '2026-08-02',
  },
]

export default function TeacherLectures() {
  const [lectures, setLectures] = useState(initialLectures)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    subject: 'Physics',
    classLevel: 'XI',
    chapter: '',
    videoUrl: '',
    pdfUrl: '',
  })

  const handleCreate = (e) => {
    e.preventDefault()
    if (!formData.title || !formData.videoUrl) return

    const newLect = {
      id: Date.now(),
      ...formData,
      dateAdded: new Date().toISOString().split('T')[0],
    }

    setLectures([newLect, ...lectures])
    setFormData({
      title: '',
      subject: 'Physics',
      classLevel: 'XI',
      chapter: '',
      videoUrl: '',
      pdfUrl: '',
    })
    setShowModal(false)
  }

  const handleDelete = (id) => {
    setLectures(lectures.filter((l) => l.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="badge badge-emerald text-xs font-bold inline-flex items-center gap-1.5 px-3 py-1">
            <FaVideo size={12} /> Lecture Portal
          </span>
          <h1 className="text-3xl font-black text-[#0E4429] mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
            Class Lectures & Study Notes
          </h1>
          <p className="text-xs text-[#3a4a40]">Publish video lecture links and PDF notes for enrolled students.</p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn-primary text-xs !py-3 !px-5 self-start sm:self-center">
          <FaPlus size={12} />
          <span>Add New Lecture</span>
        </button>
      </div>

      {/* Lecture List */}
      <div className="space-y-4">
        {lectures.map((lecture) => (
          <div key={lecture.id} className="card !p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 border-l-4 border-l-[#147a4a]">
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge badge-emerald text-[11px] font-extrabold">{lecture.subject} • Grade {lecture.classLevel}</span>
                <span className="text-xs text-[#3a4a40] font-medium">{lecture.chapter}</span>
              </div>
              <h3 className="font-bold text-lg text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
                {lecture.title}
              </h3>
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#3a4a40] font-semibold pt-1">
                <a href={lecture.videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:underline">
                  <FaVideo /> Video Stream Link <FaExternalLinkAlt size={10} />
                </a>
                {lecture.pdfUrl && (
                  <a href={lecture.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-red-600 hover:underline">
                    <FaFilePdf /> Download Notes PDF <FaExternalLinkAlt size={10} />
                  </a>
                )}
                <span className="text-white/60">• Published {lecture.dateAdded}</span>
              </div>
            </div>

            <button
              onClick={() => handleDelete(lecture.id)}
              className="p-2.5 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500/20 self-start md:self-center transition-colors"
              title="Delete Lecture"
            >
              <FaTrashAlt size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="card w-full max-w-xl !p-6 sm:!p-8 space-y-5 bg-white">
            <h2 className="text-2xl font-bold text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
              Publish Class Lecture
            </h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Lecture Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Kinematics & Motion Equations"
                  className="w-full px-4 py-3 rounded-xl border border-[#DCE8DD] text-sm focus:outline-none focus:border-[#147a4a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#DCE8DD] text-sm font-semibold focus:outline-none focus:border-[#147a4a]"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="English">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Grade Level</label>
                  <select
                    value={formData.classLevel}
                    onChange={(e) => setFormData({ ...formData, classLevel: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#DCE8DD] text-sm font-semibold focus:outline-none focus:border-[#147a4a]"
                  >
                    <option value="IX">Grade IX</option>
                    <option value="X">Grade X</option>
                    <option value="XI">Grade XI</option>
                    <option value="XII">Grade XII</option>
                    <option value="MDCAT">MDCAT</option>
                    <option value="ECAT">ECAT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Chapter / Topic</label>
                <input
                  type="text"
                  value={formData.chapter}
                  onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                  placeholder="e.g. Chapter 2: Vectors & Equilibrium"
                  className="w-full px-4 py-3 rounded-xl border border-[#DCE8DD] text-sm focus:outline-none focus:border-[#147a4a]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">YouTube / Video Stream URL</label>
                <input
                  type="url"
                  required
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-3 rounded-xl border border-[#DCE8DD] text-sm focus:outline-none focus:border-[#147a4a]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">PDF Study Notes Link (Optional)</label>
                <input
                  type="url"
                  value={formData.pdfUrl}
                  onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                  placeholder="https://example.com/notes.pdf"
                  className="w-full px-4 py-3 rounded-xl border border-[#DCE8DD] text-sm focus:outline-none focus:border-[#147a4a]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-xl border border-[#DCE8DD] text-xs font-bold text-[#3a4a40]">
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs !py-2.5 !px-5">
                  <FaCheck size={12} />
                  <span>Publish Lecture</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
