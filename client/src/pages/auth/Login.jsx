import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaExclamationTriangle, FaReceipt, FaPhoneAlt } from 'react-icons/fa'
import { useAuthStore } from '../../store/useAuthStore'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const navigate = useNavigate()
  
  const { login, loading, error } = useAuthStore()
  const [localError, setLocalError] = useState('')
  const [isPendingApproval, setIsPendingApproval] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')
    setIsPendingApproval(false)

    const result = await login(form.email, form.password)
    if (result.success) {
      const role = result.user?.role
      if (role === 'admin' || role === 'director') {
        navigate('/admin')
      } else if (role === 'clerk') {
        navigate('/clerk')
      } else if (role === 'teacher') {
        navigate('/teacher')
      } else {
        navigate('/dashboard')
      }
    } else {
      setLocalError(result.error)
      if (result.isPendingApproval) {
        setIsPendingApproval(true)
      }
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center pt-24 sm:pt-28 pb-12 px-4 bg-[#F1ECE0]/50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/images/logo.png" alt="SEA Logo" className="w-16 h-16 mx-auto mb-3 rounded-full border-2 border-gold shadow-sm" />
          <h1 className="text-3xl font-black text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>Welcome Back</h1>
          <p className="text-xs text-[#3a4a40] font-semibold mt-1">Sign in to your Star Educational Academy student portal</p>
        </div>

        <div className="card !p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Email Address</label>
              <div className="relative">
                <FaEnvelope size={14} className="input-icon" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="khan@gmail.com"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Password</label>
              <div className="relative">
                <FaLock size={14} className="input-icon" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  placeholder="Enter your password"
                  className="input-field !pr-11"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3a4a40] z-10">
                  {showPw ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-bold">
              <label className="flex items-center gap-2 cursor-pointer text-[#3a4a40]">
                <input type="checkbox" className="w-4 h-4 rounded text-[#147a4a]" />
                <span>Remember me</span>
              </label>
              <Link to="/contact" className="text-[#147a4a] hover:underline">Need Help?</Link>
            </div>

            {/* Error or Pending Approval Banner */}
            {(localError || error) && (
              <div className={`p-4 rounded-2xl text-xs font-semibold leading-relaxed border ${
                isPendingApproval
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {isPendingApproval ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-amber-800 font-extrabold text-xs">
                      <FaExclamationTriangle size={14} className="text-amber-600 flex-shrink-0" />
                      <span>Account Approval Required</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      {localError || error}
                    </p>
                    <div className="pt-2 border-t border-amber-200/60 flex flex-col gap-1 text-[11px] font-bold text-amber-900">
                      <span className="flex items-center gap-1.5"><FaReceipt size={12} /> Pay Admission Fee Challan at Office</span>
                      <span className="flex items-center gap-1.5"><FaPhoneAlt size={12} /> Helpline: 0308-3309704 / 0306-3004887</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-center font-bold">{localError || error}</p>
                )}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full text-xs font-extrabold !py-3">
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
            </button>
          </form>

          <div className="mt-6 text-center text-xs font-semibold text-[#3a4a40]">
            Don't have an account?{' '}
            <Link to="/register" className="font-extrabold text-[#147a4a] hover:underline">Register Now</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
