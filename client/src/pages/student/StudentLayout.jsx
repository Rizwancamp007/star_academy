import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { 
  FaGraduationCap, 
  FaBookOpen, 
  FaClipboardList, 
  FaReceipt, 
  FaChartLine, 
  FaCog, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes, 
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa'

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: <FaGraduationCap size={18} /> },
  { name: 'Lectures & Notes', path: '/dashboard/lectures', icon: <FaBookOpen size={18} /> },
  { name: 'Online Tests', path: '/dashboard/tests', icon: <FaClipboardList size={18} /> },
  { name: 'Fee Challan', path: '/dashboard/challan', icon: <FaReceipt size={18} /> },
  { name: 'AI Analytics', path: '/dashboard/analytics', icon: <FaChartLine size={18} /> },
  { name: 'Settings', path: '/dashboard/settings', icon: <FaCog size={18} /> },
]

export default function StudentLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  // Default fallback user if viewing without login
  const student = user || {
    fullName: 'Sir Irshad Ahmed Ogahi',
    email: 'student@staracademy.edu.pk',
    class: 'XI',
    stream: 'Pre-Medical',
    status: 'pending',
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#FBF8F1] flex flex-col lg:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#0E4429] text-white flex-shrink-0 min-h-screen sticky top-0 shadow-xl border-r border-[#147a4a]/30">
        {/* Brand Header */}
        <div className="p-6 border-b border-[#147a4a]/40 flex items-center gap-3">
          <img src="/images/logo.png" alt="Star Academy Logo" className="h-10 w-10 rounded-full border-2 border-[#D4A64A]" />
          <div>
            <h2 className="font-black text-base leading-tight text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              Star Academy
            </h2>
            <p className="text-[10px] font-extrabold tracking-widest text-[#D4A64A] uppercase mt-0.5">
              Student Portal
            </p>
          </div>
        </div>

        {/* Student Profile Card */}
        <div className="p-4 mx-4 my-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D4A64A] text-[#0E4429] font-black text-base flex items-center justify-center shadow-xs flex-shrink-0">
              {student.fullName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-sm text-white truncate leading-tight">{student.fullName}</p>
              <p className="text-xs text-[#e6c36e] font-semibold truncate capitalize mt-0.5">
                Grade {student.class || 'XI'} • {student.stream || 'Pre-Medical'}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-white/70 text-[11px] font-semibold">Account Status:</span>
            {student.status === 'approved' ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-300 bg-emerald-900/60 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                <FaCheckCircle size={10} /> Approved
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-300 bg-amber-900/60 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                <FaExclamationTriangle size={10} /> Pending
              </span>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-2 flex flex-col gap-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-[#147a4a] text-white shadow-md border border-white/20'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className={isActive ? 'text-[#D4A64A]' : 'text-white/70'}>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-[#147a4a]/40">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 font-bold text-sm transition-all duration-200"
          >
            <FaSignOutAlt size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <header className="lg:hidden bg-[#0E4429] text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <img src="/images/logo.png" alt="Logo" className="h-8 w-8 rounded-full border border-gold" />
          <span className="font-bold text-sm text-white" style={{ fontFamily: 'var(--font-heading)' }}>Student Dashboard</span>
        </Link>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
        >
          {mobileSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="relative z-10 w-72 max-w-[80vw] bg-[#0E4429] text-white flex flex-col justify-between p-4 shadow-2xl">
            <div>
              <div className="p-4 border-b border-[#147a4a]/40 flex items-center gap-3 mb-4">
                <img src="/images/logo.png" alt="Star Logo" className="h-9 w-9 rounded-full border border-gold" />
                <div>
                  <h3 className="font-bold text-sm text-white">Star Academy</h3>
                  <p className="text-[10px] text-[#D4A64A] uppercase font-bold">Grade {student.class}</p>
                </div>
              </div>
              <nav className="flex flex-col gap-1.5">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${
                        isActive ? 'bg-[#147a4a] text-white' : 'text-white/80 hover:bg-white/10'
                      }`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
            <button
              onClick={handleLogout}
              className="mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/20 text-red-200 font-bold text-sm"
            >
              <FaSignOutAlt />
              <span>Sign Out</span>
            </button>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  )
}
