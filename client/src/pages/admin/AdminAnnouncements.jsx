import { useState, useEffect } from 'react'
import { FaBullhorn, FaSave, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa'
import settingsService from '../../services/settingsService'

export default function AdminAnnouncements() {
  const [marqueeText, setMarqueeText] = useState('')
  const [startDate, setStartDate] = useState('')
  const [bookingDate, setBookingDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true)
      const res = await settingsService.getSettings()
      if (res && res.success && res.data) {
        setMarqueeText(res.data.marqueeText || '')
        setStartDate(res.data.classesStartDate || '')
        setBookingDate(res.data.bookingDate || '')
      }
      setLoading(false)
    }
    fetchSettings()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const res = await settingsService.updateSettings({
      marqueeText,
      classesStartDate: startDate,
      bookingDate,
    })
    setSaving(false)
    if (res && res.success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-[#147a4a] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <span className="badge badge-gold text-xs font-bold inline-flex items-center gap-1.5 px-3 py-1">
          <FaBullhorn size={12} /> Marquee & Site Announcements
        </span>
        <h1 className="text-3xl font-black text-[#0E4429] mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
          Public Broadcast Control
        </h1>
        <p className="text-xs text-[#3a4a40]">Update the marquee ticker banner displayed on the homepage and student portal header.</p>
      </div>

      {/* Ticker Live Preview */}
      <div className="card !p-5 border-l-4 border-l-[#D4A64A] space-y-2 bg-[#0E4429] text-white">
        <span className="text-[10px] font-extrabold tracking-widest text-[#D4A64A] uppercase flex items-center gap-1">
          <FaInfoCircle /> Live Marquee Preview
        </span>
        <div className="overflow-hidden whitespace-nowrap bg-black/30 p-3 rounded-xl border border-white/10 text-xs font-semibold text-[#D4A64A]">
          {marqueeText || 'No marquee text set. Enter your announcement below.'}
        </div>
      </div>

      {/* Announcement Form */}
      <div className="card !p-8 space-y-6">
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">
              Live Ticker Marquee Message
            </label>
            <textarea
              required
              rows={4}
              value={marqueeText}
              onChange={(e) => setMarqueeText(e.target.value)}
              placeholder="Enter marquee announcement message..."
              className="w-full px-4 py-3 rounded-xl border border-[#DCE8DD] text-sm focus:outline-none focus:border-[#147a4a]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">
                <span className="inline-flex items-center gap-1"><FaCalendarAlt size={12} /> Advance Booking Date</span>
              </label>
              <input
                type="date"
                required
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#DCE8DD] text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">
                <span className="inline-flex items-center gap-1"><FaCalendarAlt size={12} /> Classes Commencement Date</span>
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#DCE8DD] text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button type="submit" disabled={saving} className="btn-primary text-xs !py-3 !px-6 shadow-md">
              <FaSave size={14} />
              <span>{saving ? 'Saving...' : 'Publish Ticker Broadcast'}</span>
            </button>
          </div>

          {saved && (
            <div className="p-4 rounded-xl text-xs font-bold text-center bg-emerald-500/10 text-emerald-800 border border-emerald-500/30">
              🎉 Announcement marquee updated and broadcast live!
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
