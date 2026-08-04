import { useState } from 'react'
import { FaCog, FaLock, FaCheckCircle, FaUserShield } from 'react-icons/fa'
import { useAuthStore } from '../../store/useAuthStore'

export default function ClerkSettings() {
  const { user } = useAuthStore()
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirmPass: '' })
  const [notice, setNotice] = useState('')

  const handlePasswordChange = (e) => {
    e.preventDefault()
    if (passwords.newPass !== passwords.confirmPass) {
      alert('New password and confirm password do not match!')
      return
    }
    setNotice('Password updated successfully!')
    setPasswords({ current: '', newPass: '', confirmPass: '' })
    setTimeout(() => setNotice(''), 4000)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <span className="badge badge-gold text-xs font-bold inline-flex items-center gap-1.5 px-3 py-1">
          <FaCog size={12} /> Account Preferences
        </span>
        <h1 className="text-3xl font-black text-[#0E4429] mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
          Clerk Desk Settings
        </h1>
        <p className="text-xs text-[#3a4a40]">Manage security, update password, and view office credentials.</p>
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-xs flex items-center gap-2">
          <FaCheckCircle size={14} className="text-emerald-700" />
          <span>{notice}</span>
        </div>
      )}

      {/* Account Info */}
      <div className="card !p-6 space-y-4">
        <h3 className="font-extrabold text-base text-[#0E4429] flex items-center gap-2">
          <FaUserShield className="text-[#147a4a]" /> Office Profile Credentials
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="font-extrabold text-[#3a4a40] block">Staff Name:</span>
            <span className="font-bold text-[#0E4429]">{user?.fullName || 'Academy Office Clerk'}</span>
          </div>
          <div>
            <span className="font-extrabold text-[#3a4a40] block">Office Email:</span>
            <span className="font-bold text-[#0E4429]">{user?.email || 'clerk@staracademy.edu.pk'}</span>
          </div>
          <div>
            <span className="font-extrabold text-[#3a4a40] block">Role Designation:</span>
            <span className="badge badge-emerald font-extrabold">Official Clerk (Front Office)</span>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="card !p-6 space-y-4">
        <h3 className="font-extrabold text-base text-[#0E4429] flex items-center gap-2">
          <FaLock className="text-[#147a4a]" /> Change Password
        </h3>

        <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
          <div>
            <label className="block uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              required
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8DD] font-semibold focus:outline-none"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">
              New Password
            </label>
            <input
              type="password"
              required
              value={passwords.newPass}
              onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8DD] font-semibold focus:outline-none"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={passwords.confirmPass}
              onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8DD] font-semibold focus:outline-none"
            />
          </div>

          <button type="submit" className="btn-primary text-xs !py-2.5 !px-6 shadow-xs">
            Update Security Password
          </button>
        </form>
      </div>
    </div>
  )
}
