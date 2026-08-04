import { useState } from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import { FaUser, FaLock, FaSave, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import api from '../../services/api'

export default function StudentSettings() {
  const { user, setUser } = useAuthStore()

  const [fullName, setFullName] = useState(user?.fullName || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [savedMsg, setSavedMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    setSavedMsg('')
    setErrorMsg('')

    try {
      const res = await api.patch('/auth/profile', { fullName, phone })
      if (res.data?.success) {
        setSavedMsg('Profile settings updated successfully!')
        if (setUser) setUser({ ...user, fullName, phone })
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.')
    }
    setSavingProfile(false)
    setTimeout(() => { setSavedMsg(''); setErrorMsg('') }, 4000)
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (!currentPassword || !newPassword) return
    setSavingPassword(true)
    setSavedMsg('')
    setErrorMsg('')

    try {
      const res = await api.post('/auth/change-password', { currentPassword, newPassword })
      if (res.data?.success) {
        setSavedMsg('Password changed successfully!')
        setCurrentPassword('')
        setNewPassword('')
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to change password.')
    }
    setSavingPassword(false)
    setTimeout(() => { setSavedMsg(''); setErrorMsg('') }, 4000)
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-black text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
          Account Settings & Security
        </h1>
        <p className="text-sm text-[#3a4a40] mt-1">
          Manage your personal details and account credentials.
        </p>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <FaCheckCircle />
          <span>{savedMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs font-bold flex items-center gap-2">
          <FaExclamationTriangle />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Profile Info Card */}
      <form onSubmit={handleSaveProfile} className="card !p-8 space-y-6">
        <h2 className="text-xl font-bold text-[#0E4429] flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
          <FaUser size={18} className="text-[#147a4a]" />
          <span>Personal Details</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#0E4429] mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F1ECE0] border border-[#DCE8DD] focus:outline-none focus:ring-2 focus:ring-[#147a4a]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0E4429] mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F1ECE0] border border-[#DCE8DD] focus:outline-none focus:ring-2 focus:ring-[#147a4a]"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#0E4429] mb-1">Class / Grade</label>
            <input
              type="text"
              disabled
              value={user?.studentDetails?.grade || user?.class || '—'}
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-gray-100 text-gray-500 border border-[#DCE8DD]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0E4429] mb-1">Track / Stream</label>
            <input
              type="text"
              disabled
              value={user?.studentDetails?.stream || user?.stream || '—'}
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-gray-100 text-gray-500 border border-[#DCE8DD]"
            />
          </div>
        </div>

        <button type="submit" disabled={savingProfile} className="btn-primary text-xs !py-3">
          <FaSave size={14} />
          <span>{savingProfile ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </form>

      {/* Change Password Card */}
      <form onSubmit={handleChangePassword} className="card !p-8 space-y-6">
        <h2 className="text-xl font-bold text-[#0E4429] flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
          <FaLock size={18} className="text-[#147a4a]" />
          <span>Change Security Password</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#0E4429] mb-1">Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F1ECE0] border border-[#DCE8DD] focus:outline-none focus:ring-2 focus:ring-[#147a4a]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0E4429] mb-1">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F1ECE0] border border-[#DCE8DD] focus:outline-none focus:ring-2 focus:ring-[#147a4a]"
            />
          </div>
        </div>

        <button type="submit" disabled={savingPassword} className="btn-gold text-xs !py-3">
          <FaLock size={14} />
          <span>{savingPassword ? 'Updating...' : 'Update Password'}</span>
        </button>
      </form>
    </div>
  )
}
