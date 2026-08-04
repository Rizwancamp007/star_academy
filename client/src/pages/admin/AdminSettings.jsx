import { useState, useEffect } from 'react'
import { FaCog, FaDownload, FaSave } from 'react-icons/fa'
import settingsService from '../../services/settingsService'
import api from '../../services/api'

export default function AdminSettings() {
  const [academyName, setAcademyName] = useState('')
  const [directorName, setDirectorName] = useState('')
  const [adminPhone, setAdminPhone] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true)
      const res = await settingsService.getSettings()
      if (res && res.success && res.data) {
        setAcademyName(res.data.academyName || 'Star Educational Academy')
        setDirectorName(res.data.directorName || '')
        setAdminPhone(res.data.adminPhone || '')
        setAddress(res.data.address || '')
      }
      setLoading(false)
    }
    fetchSettings()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const res = await settingsService.updateSettings({
      academyName,
      directorName,
      adminPhone,
      address,
    })
    setSaving(false)
    if (res && res.success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  const exportStudentData = async () => {
    try {
      const response = await api.get('/admin/students')
      const students = response.data.students || []

      if (students.length === 0) {
        alert('No student records to export.')
        return
      }

      const headers = ['Full Name', 'Email', 'Phone', 'Grade', 'Stream', 'Status', 'Registered']
      const rows = students.map((s) => [
        s.fullName || '',
        s.email || '',
        s.phone || '',
        s.studentDetails?.grade || '',
        s.studentDetails?.stream || '',
        s.isApproved ? 'Approved' : 'Pending',
        s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '',
      ])

      const csvContent = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `star_academy_students_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      alert('Failed to export student data: ' + (err.response?.data?.message || err.message))
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
        <span className="badge badge-emerald text-xs font-bold inline-flex items-center gap-1.5 px-3 py-1">
          <FaCog size={12} /> System Configuration
        </span>
        <h1 className="text-3xl font-black text-[#0E4429] mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
          Academy Settings & Data Export
        </h1>
        <p className="text-xs text-[#3a4a40]">Configure academy profile information and export student roster reports.</p>
      </div>

      {/* Settings Form */}
      <div className="card !p-8 space-y-6">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Academy Title</label>
              <input
                type="text"
                required
                value={academyName}
                onChange={(e) => setAcademyName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#DCE8DD] text-sm focus:outline-none focus:border-[#147a4a]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Director Name</label>
              <input
                type="text"
                required
                value={directorName}
                onChange={(e) => setDirectorName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#DCE8DD] text-sm focus:outline-none focus:border-[#147a4a]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Official Helpline</label>
              <input
                type="text"
                required
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#DCE8DD] text-sm focus:outline-none focus:border-[#147a4a]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Academy Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#DCE8DD] text-sm focus:outline-none focus:border-[#147a4a]"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button type="submit" disabled={saving} className="btn-primary text-xs !py-3 !px-6 shadow-md">
              <FaSave size={14} />
              <span>{saving ? 'Saving...' : 'Save System Settings'}</span>
            </button>
          </div>

          {saved && (
            <div className="p-4 rounded-xl text-xs font-bold text-center bg-emerald-500/10 text-emerald-800 border border-emerald-500/30">
              ✅ Settings updated successfully!
            </div>
          )}
        </form>
      </div>

      {/* Export Section */}
      <div className="card !p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-[#147a4a]">
        <div>
          <h3 className="font-bold text-base text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
            Export Student Data Report
          </h3>
          <p className="text-xs text-[#3a4a40] mt-0.5">Download official CSV roster file containing all student contact records and enrollment statuses.</p>
        </div>

        <button onClick={exportStudentData} className="btn-gold text-xs !py-2.5 !px-5 self-start sm:self-center">
          <FaDownload size={12} />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  )
}
