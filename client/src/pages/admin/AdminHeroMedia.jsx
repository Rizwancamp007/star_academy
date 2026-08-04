import { useState, useEffect } from 'react'
import { FaImage, FaPlus, FaTrash, FaCheckCircle, FaEdit } from 'react-icons/fa'
import heroSlideService from '../../services/heroSlideService'

export default function AdminHeroMedia() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [notice, setNotice] = useState('')
  const [form, setForm] = useState({ title: '', subtitle: '', imageUrl: '', badge: '' })

  const fetchSlides = async () => {
    setLoading(true)
    const res = await heroSlideService.getAllSlides()
    if (res && res.success) {
      setSlides(res.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSlides()
  }, [])

  const handleOpenCreate = () => {
    setEditingId(null)
    setForm({ title: '', subtitle: '', imageUrl: '', badge: '' })
    setShowModal(true)
  }

  const handleOpenEdit = (s) => {
    setEditingId(s._id)
    setForm({ title: s.title || '', subtitle: s.subtitle || '', imageUrl: s.imageUrl || '', badge: s.badge || '' })
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.title) return

    if (editingId) {
      const res = await heroSlideService.updateSlide(editingId, form)
      if (res && res.success) {
        setNotice('Hero banner slide updated!')
      }
    } else {
      const res = await heroSlideService.createSlide(form)
      if (res && res.success) {
        setNotice('Hero banner slide published to homepage!')
      }
    }
    setShowModal(false)
    fetchSlides()
    setTimeout(() => setNotice(''), 4000)
  }

  const handleDelete = async (id) => {
    if (slides.length <= 1) {
      alert('Homepage requires at least 1 hero banner slide.')
      return
    }
    if (window.confirm('Remove this hero banner slide?')) {
      const res = await heroSlideService.deleteSlide(id)
      if (res && res.success) {
        setNotice('Hero banner slide removed.')
        fetchSlides()
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
            <FaImage size={12} /> Homepage Branding
          </span>
          <h1 className="text-3xl font-black text-[#0E4429] mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
            Hero Slider & Media Banner Manager
          </h1>
          <p className="text-xs text-[#3a4a40]">
            Update background banner images, titles, and admission announcement slides on the main landing page.
          </p>
        </div>

        <button onClick={handleOpenCreate} className="btn-gold text-xs !py-3 !px-5 shadow-md flex items-center gap-2">
          <FaPlus size={12} />
          <span>Add Hero Banner Slide</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-xs flex items-center gap-2">
          <FaCheckCircle size={14} className="text-emerald-700" />
          <span>{notice}</span>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-[#147a4a] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : slides.length === 0 ? (
        <div className="card !p-12 text-center space-y-3 border-2 border-dashed border-[#DCE8DD]">
          <FaImage size={40} className="mx-auto text-[#147a4a]/40" />
          <h3 className="font-extrabold text-base text-[#0E4429]">No Hero Slides Yet</h3>
          <p className="text-xs text-[#3a4a40] max-w-sm mx-auto">Click "Add Hero Banner Slide" to publish the first banner on the homepage.</p>
        </div>
      ) : (
        /* Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {slides.map((s) => (
            <div key={s._id} className="card !p-6 space-y-4 border-2 border-[#147a4a]/20 shadow-md relative bg-white">
              <div className="flex items-center justify-between">
                <span className="badge badge-emerald text-[10px] font-extrabold">{s.badge || 'Banner Slide'}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleOpenEdit(s)} className="p-1.5 rounded-lg text-[#147a4a] hover:bg-[#147a4a]/10">
                    <FaEdit size={13} />
                  </button>
                  <button onClick={() => handleDelete(s._id)} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 font-bold text-xs">
                    <FaTrash size={13} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-extrabold text-lg text-[#0E4429] leading-snug">{s.title}</h3>
                <p className="text-xs text-[#3a4a40]">{s.subtitle}</p>
              </div>

              <div className="pt-2 border-t border-[#DCE8DD] text-[11px] font-bold text-[#147a4a] truncate">
                Image Path: {s.imageUrl}
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
              {editingId ? 'Edit Hero Banner' : 'Add Homepage Hero Banner'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">
                  Banner Headline Title
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Session 2026 Admissions Now Open"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#DCE8DD] font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">
                  Subtitle Description
                </label>
                <input
                  type="text"
                  required
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="e.g. Join the #1 Entry Test Academy in Ghotki District"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#DCE8DD] font-bold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    placeholder="e.g. MDCAT 2026"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DCE8DD] font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">
                    Image File URL / Path
                  </label>
                  <input
                    type="text"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="/images/hero-bg.jpg"
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
                  {editingId ? 'Update Slide' : 'Publish Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
