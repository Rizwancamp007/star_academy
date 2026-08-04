import { useState, useEffect } from 'react'
import { FaSearch, FaPlay, FaDownload, FaFilePdf, FaBookOpen } from 'react-icons/fa'
import { GiAtom, GiDna1 } from 'react-icons/gi'
import { FaFlask } from 'react-icons/fa'
import { TbMathSymbols } from 'react-icons/tb'
import api from '../../services/api'

const subjects = ['All', 'Physics', 'Chemistry', 'Biology', 'Mathematics', 'English']

export default function StudentLectures() {
  const [lectures, setLectures] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeSubject, setActiveSubject] = useState('All')
  const [activeType, setActiveType] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedVideo, setSelectedVideo] = useState(null)

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const res = await api.get('/lectures')
        if (res.data) {
          const list = Array.isArray(res.data) ? res.data : res.data.data || res.data.lectures || []
          setLectures(list)
        }
      } catch (err) {
        console.error('Failed to fetch lectures:', err)
      }
      setLoading(false)
    }
    fetchLectures()
  }, [])

  const filtered = lectures.filter((item) => {
    if (activeSubject !== 'All' && item.subject !== activeSubject) return false
    if (activeType !== 'all' && item.type !== activeType) return false
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
            Lectures & Study Notes
          </h1>
          <p className="text-sm text-[#3a4a40] mt-1">
            Access unlocked recorded video sessions and official PDF notes for your grade.
          </p>
        </div>
      </div>

      {/* Subject Filter Bar */}
      <div className="card !p-4 space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubject(sub)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex-shrink-0 transition-all ${
                activeSubject === sub
                  ? 'bg-[#147a4a] text-white shadow-xs'
                  : 'bg-[#F1ECE0] text-[#1C2620] hover:bg-[#147a4a]/10 hover:text-[#147a4a]'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FaSearch size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3a4a40]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by topic or chapter..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-[#F1ECE0] border border-[#DCE8DD] focus:outline-none focus:ring-2 focus:ring-[#147a4a]"
            />
          </div>
          <div className="flex rounded-xl overflow-hidden border border-[#DCE8DD] p-1 bg-[#F1ECE0] gap-1 flex-shrink-0">
            {[{ key: 'all', label: 'All' }, { key: 'video', label: '🎥 Videos' }, { key: 'notes', label: '📄 Notes' }].map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveType(t.key)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeType === t.key ? 'bg-[#147a4a] text-white' : 'text-[#1C2620]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div key={item.id} className="card !p-6 flex flex-col justify-between hover:border-[#147a4a]/40">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="badge badge-emerald text-xs">{item.subject}</span>
                <span className="text-xs font-bold text-[#3a4a40]">{item.chapter}</span>
              </div>
              <h3 className="font-extrabold text-lg text-[#0E4429] mb-2 leading-snug" style={{ fontFamily: 'var(--font-heading)' }}>
                {item.title}
              </h3>
              <p className="text-xs text-[#3a4a40]">
                {item.type === 'video' ? `⏱️ ${item.duration}` : `📄 ${item.size}`} • {item.date}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#DCE8DD]">
              {item.type === 'video' ? (
                <button
                  onClick={() => setSelectedVideo(item)}
                  className="btn-primary w-full text-xs !py-2.5"
                >
                  <FaPlay size={10} />
                  <span>Play Video Lecture</span>
                </button>
              ) : (
                <a
                  href="#download-notes"
                  onClick={(e) => { e.preventDefault(); alert(`Downloading PDF: ${item.title}`) }}
                  className="btn-gold w-full text-xs !py-2.5"
                >
                  <FaDownload size={10} />
                  <span>Download PDF Notes</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Player */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#0E4429] text-white rounded-3xl max-w-3xl w-full p-6 space-y-4 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                {selectedVideo.title}
              </h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="px-3 py-1 bg-white/20 text-white rounded-lg hover:bg-white/30 text-xs font-bold"
              >
                Close ✖
              </button>
            </div>

            <div className="relative aspect-video rounded-2xl bg-black flex items-center justify-center border border-white/10 overflow-hidden">
              <div className="text-center p-6 space-y-3">
                <FaPlay size={48} className="mx-auto text-[#D4A64A]" />
                <p className="font-extrabold text-lg text-white">Lecture Streaming Active</p>
                <p className="text-xs text-white/70">Subject: {selectedVideo.subject} • Grade XI/XII</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-white/80">
              <span>Chapter: {selectedVideo.chapter}</span>
              <span>Duration: {selectedVideo.duration}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
