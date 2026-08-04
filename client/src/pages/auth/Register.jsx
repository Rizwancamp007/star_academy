import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPhoneAlt, FaGraduationCap, FaCheckCircle, FaReceipt, FaMapMarkerAlt } from 'react-icons/fa'
import { useAuthStore } from '../../store/useAuthStore'

export default function Register() {
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', password: '', confirmPassword: '', class: '', stream: '' })
  const [showPw, setShowPw] = useState(false)
  const [localError, setLocalError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const { register, loading, error } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (form.password !== form.confirmPassword) {
      setLocalError('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      setLocalError('Password must be at least 6 characters')
      return
    }
    if (!form.class) {
      setLocalError('Please select your class')
      return
    }
    if (!form.stream) {
      setLocalError('Please select your stream')
      return
    }

    const payload = {
      fullName: form.fullName,
      phone: form.phone,
      email: form.email,
      password: form.password,
      role: 'student',
      grade: form.class,
      stream: form.stream,
    }

    const result = await register(payload)
    if (result.success) {
      setSuccessMsg(result.message || 'Registration submitted successfully!')
    } else {
      setLocalError(result.error)
    }
  }

  const update = (field, value) => setForm({ ...form, [field]: value })

  if (successMsg) {
    return (
      <section className="min-h-[calc(100vh-var(--nav-height))] flex items-center justify-center py-12 px-4 bg-[#F1ECE0]/50">
        <div className="card max-w-lg text-center !p-8 space-y-5 border-2 border-emerald-500/30">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
            <FaCheckCircle size={36} />
          </div>
          <h2 className="text-2xl font-black text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
            Registration Submitted!
          </h2>
          <p className="text-xs text-[#3a4a40] leading-relaxed font-semibold">
            {successMsg}
          </p>

          <div className="p-4 rounded-2xl bg-[#0E4429] text-white text-left space-y-2 text-xs">
            <p className="font-bold text-[#D4A64A] flex items-center gap-1.5 text-xs">
              <FaReceipt size={14} /> Next Step to Activate Your Account:
            </p>
            <p className="text-white/90 leading-relaxed text-[11px]">
              Visit Star Educational Academy office with your student registration details, pay your one-time admission fee, and our administrator/clerk will approve your account.
            </p>
            <p className="text-[10px] text-white/70 flex items-center gap-1 pt-1 border-t border-white/10">
              <FaMapMarkerAlt size={10} className="text-[#D4A64A]" /> Location: D.A.V. School, Ladies Bazaar, Ghotki
            </p>
          </div>

          <Link to="/login" className="btn-gold w-full text-xs font-extrabold !py-3">
            <span>Proceed to Sign In</span>
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen flex items-center justify-center pt-24 sm:pt-28 pb-12 px-4 bg-[#F1ECE0]/50">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <img src="/images/logo.png" alt="SEA Logo" className="w-16 h-16 mx-auto mb-3 rounded-full border-2 border-gold shadow-sm" />
          <h1 className="text-3xl font-black text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>Create Student Account</h1>
          <p className="text-xs text-[#3a4a40] font-semibold mt-1">Register for Star Educational Academy — Session 2026</p>
        </div>

        <div className="card !p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Full Name</label>
              <div className="relative">
                <FaUser size={14} className="input-icon" />
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                  required
                  placeholder=" Khan"
                  className="input-field"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Phone Number</label>
              <div className="relative">
                <FaPhoneAlt size={14} className="input-icon" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  required
                  placeholder="0308-3309704"
                  className="input-field"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Email Address</label>
              <div className="relative">
                <FaEnvelope size={14} className="input-icon" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  required
                  placeholder="khan@star.com"
                  className="input-field"
                />
              </div>
            </div>

            {/* Class & Stream */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Class</label>
                <select
                  value={form.class}
                  onChange={(e) => update('class', e.target.value)}
                  required
                  className="w-full px-4 py-3 min-h-[46px] rounded-xl border border-[#DCE8DD] text-xs font-bold text-[#0E4429] focus:outline-none focus:border-[#147a4a] bg-white cursor-pointer"
                >
                  <option value="">Select Class</option>
                  <option value="9">Grade IX (Matric)</option>
                  <option value="10">Grade X (Matric)</option>
                  <option value="11">Grade XI (F.Sc)</option>
                  <option value="12">Grade XII (F.Sc)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Stream / Group</label>
                <select
                  value={form.stream}
                  onChange={(e) => update('stream', e.target.value)}
                  required
                  className="w-full px-4 py-3 min-h-[46px] rounded-xl border border-[#DCE8DD] text-xs font-bold text-[#0E4429] focus:outline-none focus:border-[#147a4a] bg-white cursor-pointer"
                >
                  <option value="">Select Stream</option>
                  <option value="general">Matric / General Science (Grade 9-10)</option>
                  <option value="pre-medical">Pre-Medical (Grade 11-12)</option>
                  <option value="pre-engineering">Pre-Engineering (Grade 11-12)</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Password</label>
              <div className="relative">
                <FaLock size={14} className="input-icon" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  required
                  placeholder="Min. 6 characters"
                  className="input-field !pr-11"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3a4a40] z-10">
                  {showPw ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Confirm Password</label>
              <div className="relative">
                <FaLock size={14} className="input-icon" />
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => update('confirmPassword', e.target.value)}
                  required
                  placeholder="Re-enter your password"
                  className="input-field"
                />
              </div>
            </div>

            {(localError || error) && (
              <div className="p-3 rounded-xl text-xs text-center font-bold bg-red-50 text-red-700 border border-red-200">
                {localError || error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-gold w-full !mt-6 text-xs font-extrabold !py-3">
              <FaGraduationCap size={16} />
              <span>{loading ? 'Creating Account...' : 'Register for Session 2026'}</span>
            </button>
          </form>

          <div className="mt-5 text-center text-xs font-semibold text-[#3a4a40]">
            Already have an account?{' '}
            <Link to="/login" className="font-extrabold text-[#147a4a] hover:underline">Sign In</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
