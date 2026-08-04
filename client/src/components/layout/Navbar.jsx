import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../store/useAuthStore'
import { FaWhatsapp, FaSignInAlt } from 'react-icons/fa'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import { IoSchool } from 'react-icons/io5'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Faculty', path: '/faculty' },
  { name: 'Success Wall', path: '/success-stories' },
  { name: 'Lectures', path: '/lectures' },
  { name: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const location = useLocation()
  const { user, isAuthenticated } = useAuthStore()

  const getPortalLink = () => {
    if (!user) return { path: '/login', label: 'Login' }
    if (user.role === 'admin' || user.role === 'director') return { path: '/admin', label: 'Admin Portal' }
    if (user.role === 'clerk') return { path: '/clerk', label: 'Clerk Desk' }
    if (user.role === 'teacher') return { path: '/teacher', label: 'Teacher Portal' }
    return { path: '/dashboard', label: 'My Dashboard' }
  }

  const portal = getPortalLink()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileOpen(false)
  }, [location])

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobileOpen])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0E4429]/95 backdrop-blur-md shadow-2xl border-b border-[#D4A64A]/40 py-2'
            : 'bg-[#0E4429] shadow-xl border-b border-[#147a4a]/50 py-3'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
          
          {/* 1. Left Section: Logo & Brand Baseline */}
          <div className="flex-1 flex items-center justify-start min-w-0">
            <Link to="/" className="flex items-center gap-3.5 group shrink-0">
              <div className="relative">
                <img
                  src="/images/logo.png"
                  alt="Star Educational Academy Logo"
                  className="h-11 w-11 sm:h-12 sm:w-12 rounded-full object-cover border-2 border-[#D4A64A] shadow-md transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#0E4429] rounded-full" />
              </div>
              <div className="flex flex-col justify-center">
                <h1
                  className="text-base sm:text-lg font-black leading-none text-white tracking-wide group-hover:text-[#D4A64A] transition-colors"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Star Educational
                </h1>
                <p className="text-[11px] font-black tracking-widest uppercase mt-1 text-[#D4A64A]">
                  Academy • Ghotki
                </p>
              </div>
            </Link>
          </div>

          {/* 2. Center Section: Spacious, High-Contrast Viewport-Centered Navigation */}
          <div className="hidden lg:flex items-center justify-center shrink-0">
            <nav className="flex items-center gap-3 sm:gap-4 bg-black/60 px-5 py-2.5 rounded-2xl border border-white/30 backdrop-blur-xl shadow-2xl">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-4 sm:px-5 py-2.5 rounded-xl text-sm font-extrabold tracking-wide transition-all duration-200 flex items-center justify-center whitespace-nowrap ${
                      isActive
                        ? '!text-[#0E4429] font-black'
                        : '!text-white hover:!text-[#D4A64A]'
                    }`}
                    style={{ color: isActive ? '#0E4429' : '#FFFFFF' }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active-pill"
                        className="absolute inset-0 bg-[#D4A64A] rounded-xl shadow-md z-0"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* 3. Right Section: Action Buttons */}
          <div className="flex-1 flex items-center justify-end gap-3 min-w-0">
            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <a
                href="https://wa.me/923083309704"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-11 w-11 rounded-xl bg-[#25D366] text-white hover:bg-[#20BD5A] transition-all duration-300 shadow-md shrink-0"
                title="Official WhatsApp"
              >
                <FaWhatsapp size={20} />
              </a>

              <Link
                to={portal.path}
                className="h-11 px-4.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/40 text-white font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm shrink-0 whitespace-nowrap"
              >
                <FaSignInAlt size={14} className="text-[#D4A64A]" />
                <span>{portal.label}</span>
              </Link>

              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="h-11 px-5 rounded-xl bg-[#D4A64A] text-[#082d1b] font-black text-xs sm:text-sm hover:bg-[#e6c36e] transition-all shadow-md flex items-center justify-center gap-2 shrink-0 whitespace-nowrap"
                >
                  <IoSchool size={16} />
                  <span>Admission 2026</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden flex items-center justify-center h-11 w-11 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/30 shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-[#082d1b] text-white shadow-2xl flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 pt-24 overflow-y-auto">
                <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-[#147a4a]/40">
                  <img src="/images/logo.png" alt="SEA Logo" className="h-11 w-11 rounded-full border-2 border-[#D4A64A]" />
                  <div>
                    <p className="font-black text-base text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                      Star Educational
                    </p>
                    <p className="text-xs font-bold text-[#D4A64A] uppercase">Academy • Ghotki</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.path
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`px-4 py-3 rounded-xl text-base font-extrabold transition-all flex items-center justify-between ${
                          isActive
                            ? 'bg-[#D4A64A] text-[#082d1b] font-black shadow-md'
                            : 'text-white hover:bg-white/10'
                        }`}
                      >
                        <span>{link.name}</span>
                        {isActive && <span className="w-2.5 h-2.5 rounded-full bg-[#082d1b]" />}
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="p-6 border-t border-[#147a4a]/40 flex flex-col gap-3 bg-[#0E4429]">
                <Link
                  to={portal.path}
                  className="w-full text-center py-3 rounded-xl border border-white/20 text-white font-extrabold text-sm hover:bg-white/10 flex items-center justify-center gap-2"
                >
                  <FaSignInAlt className="text-[#D4A64A]" />
                  <span>{portal.label}</span>
                </Link>
                {!isAuthenticated && (
                  <Link
                    to="/register"
                    className="w-full text-center py-3 rounded-xl bg-[#D4A64A] text-[#082d1b] font-black text-sm hover:bg-[#e6c36e] flex items-center justify-center gap-2 shadow-md"
                  >
                    <IoSchool size={18} />
                    <span>Register for 2026</span>
                  </Link>
                )}
                <a
                  href="https://wa.me/923083309704"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-extrabold bg-[#25D366] hover:bg-[#20BD5A] shadow-md"
                >
                  <FaWhatsapp size={20} />
                  <span>Official WhatsApp</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
