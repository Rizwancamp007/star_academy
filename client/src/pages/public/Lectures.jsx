import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaSearch, FaLock, FaPlayCircle, FaFileAlt, FaGraduationCap } from 'react-icons/fa'
import { GiAtom, GiDna1 } from 'react-icons/gi'
import { FaFlask } from 'react-icons/fa'
import { TbMathSymbols } from 'react-icons/tb'
import ScrollReveal from '../../components/animations/ScrollReveal'
import { StaggerContainer, StaggerItem } from '../../components/animations/ScrollReveal'
import api from '../../services/api'

const subjects = [
  { name: 'All', icon: null },
  { name: 'Physics', icon: <GiAtom size={15} /> },
  { name: 'Chemistry', icon: <FaFlask size={14} /> },
  { name: 'Biology', icon: <GiDna1 size={15} /> },
  { name: 'Mathematics', icon: <TbMathSymbols size={15} /> },
  { name: 'English', icon: <FaFileAlt size={14} /> },
]

export default function Lectures() {
  const [lectures, setLectures] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeSubject, setActiveSubject] = useState('All')
  const [activeType, setActiveType] = useState('all')
  const [search, setSearch] = useState('')

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

  const filtered = lectures.filter((l) => {
    if (activeSubject !== 'All' && l.subject !== activeSubject) return false
    if (activeType !== 'all' && l.type !== activeType) return false
    if (search && !l.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <>
      <section className="relative py-24 sm:py-32 overflow-hidden bg-gradient-to-br from-emerald-deepest to-emerald-dark">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-20 w-72 h-72 rounded-full blur-3xl bg-gold" />
        </div>
        <div className="section-container relative z-10">
          <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto space-y-4 pt-4 sm:pt-6">
            <span className="badge badge-gold font-extrabold inline-flex items-center gap-2 px-4 py-1.5 text-xs rounded-full shadow-xs mx-auto">
              <FaPlayCircle size={12} className="text-[#D4A64A]" />
              <span>Learning Resources</span>
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-white leading-tight text-center tracking-tight sm:whitespace-nowrap" style={{ fontFamily: 'var(--font-heading)' }}>
              Video <span className="text-gradient-gold inline">Lectures</span> & Notes
            </h1>
            <p className="text-base sm:text-lg max-w-2xl mx-auto text-center leading-relaxed text-white/90 font-medium">
              Access recorded lectures and study notes. Login to unlock full content.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Toolbar */}
      <section className="py-6 sticky top-[4.5rem] z-30 shadow-md backdrop-blur-md bg-cream/95 border-b border-sage">
        <div className="section-container space-y-4">
          
          {/* Subject Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 py-1">
            {subjects.map((s) => (
              <button
                key={s.name}
                onClick={() => setActiveSubject(s.name)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 shadow-xs ${
                  activeSubject === s.name
                    ? 'bg-[#147a4a] text-white border border-[#147a4a] shadow-md scale-105'
                    : 'bg-white text-[#1C2620] border border-[#DCE8DD] hover:bg-[#147a4a]/10 hover:text-[#147a4a]'
                }`}
              >
                {s.icon}
                <span>{s.name}</span>
              </button>
            ))}
          </div>

          {/* Search Bar and Content Type Selector */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2 border-t border-sage/60">
            <div className="relative flex-1 w-full max-w-xl">
              <FaSearch size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/50 pointer-events-none z-10" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search lectures by title or topic..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#DCE8DD] bg-white text-sm font-semibold text-charcoal focus:outline-none focus:border-[#147a4a] focus:ring-2 focus:ring-[#147a4a]/20 shadow-xs min-h-[48px]"
              />
            </div>
            
            <div className="flex rounded-2xl overflow-hidden shrink-0 border border-[#DCE8DD] p-1.5 bg-white gap-1.5 min-h-[48px] items-center shadow-xs w-full sm:w-auto justify-center">
              {[
                { key: 'all', label: 'All Content' },
                { key: 'video', label: '🎥 Videos' },
                { key: 'notes', label: '📄 Notes' },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveType(t.key)}
                  className={`px-4 py-2 text-xs sm:text-sm font-black rounded-xl transition-all duration-200 ${
                    activeType === t.key
                      ? 'bg-[#147a4a] text-white shadow-xs'
                      : 'text-charcoal-light hover:text-[#147a4a] hover:bg-cream-alt'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Lectures Grid */}
      <section className="section-padding bg-cream">
        <div className="section-container">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-[#147a4a] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <FaPlayCircle size={40} className="mx-auto text-[#147a4a]/40" />
              <h3 className="text-xl font-bold text-[#0E4429]">
                {lectures.length === 0 ? 'No Lectures Published Yet' : 'No Matching Lectures Found'}
              </h3>
              <p className="text-sm text-[#3a4a40]">
                {lectures.length === 0
                  ? 'Lectures will appear here once published by faculty.'
                  : 'Try changing filters or clearing your search.'}
              </p>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filtered.map((lecture, i) => (
                <StaggerItem key={lecture._id || i}>
                  <div className="card group relative overflow-hidden h-full flex flex-col justify-between hover:border-emerald-primary/40 p-6!">
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 p-6 text-center bg-emerald-dark/95 backdrop-blur-md">
                      <FaLock size={32} className="mb-3 text-gold" />
                      <p className="text-white font-extrabold text-base mb-4">Login to Access Full Lecture</p>
                      <Link to="/login" className="btn-gold text-xs font-extrabold px-5 py-2.5"><span>Login Now</span></Link>
                    </div>
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                            lecture.type === 'video' ? 'bg-emerald-primary/10 text-emerald-primary border-emerald-primary/20' : 'bg-gold/15 text-gold-dark border-gold/30'
                          }`}>
                          {lecture.type === 'video' ? '🎥 Video' : '📄 Notes'}
                        </span>
                        <span className="text-xs font-semibold text-charcoal-light">{lecture.chapter || ''}</span>
                      </div>
                      <h3 className="font-extrabold text-lg mb-2 leading-snug text-emerald-dark" style={{ fontFamily: 'var(--font-heading)' }}>{lecture.title}</h3>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-sage">
                      <span className="badge badge-emerald text-xs font-bold">{lecture.subject}</span>
                      <span className="text-xs font-bold text-charcoal-light">{lecture.grade ? `Grade ${lecture.grade}` : ''}</span>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24 bg-cream-alt">
        <div className="section-container text-center">
          <ScrollReveal className="flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-primary/10 border border-emerald-primary/20 flex items-center justify-center mx-auto mb-4 text-emerald-primary">
              <FaLock size={24} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 text-center text-emerald-dark" style={{ fontFamily: 'var(--font-heading)' }}>
              Full Access for Enrolled Students
            </h2>
            <p className="text-base mb-8 max-w-lg mx-auto text-center text-charcoal-light">
              Register and get approved to access all video lectures, downloadable notes, and online practice tests.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-5">
              <Link to="/register" className="btn-gold text-base shadow-md">
                <FaGraduationCap size={18} />
                <span>Register Now</span>
              </Link>
              <Link to="/login" className="btn-outline text-base">
                <span>Login</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
