import { Link } from 'react-router-dom'
import { FaWhatsapp, FaFacebookF, FaInstagram, FaYoutube, FaPhoneAlt, FaMapMarkerAlt, FaGraduationCap } from 'react-icons/fa'
import { IoSchool } from 'react-icons/io5'

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Faculty', path: '/faculty' },
  { name: 'Success Stories', path: '/success-stories' },
  { name: 'Lectures', path: '/lectures' },
  { name: 'Contact Us', path: '/contact' },
]

const programLinks = [
  { name: 'Pre-Medical Track (MDCAT)', path: '/about' },
  { name: 'Pre-Engineering Track (ECAT)', path: '/about' },
  { name: 'Grade IX & X Coaching', path: '/about' },
  { name: 'Grade XI & XII Coaching', path: '/about' },
  { name: 'Video Lectures & Notes', path: '/lectures' },
  { name: 'Online Test System', path: '/login' },
]

export default function Footer() {
  return (
    <footer className="bg-[#082d1b] text-white">
      {/* Session 2026 Announcement Banner */}
      <div className="py-3.5 bg-gradient-to-r from-[#D4A64A] via-[#e6c36e] to-[#D4A64A] text-[#082d1b] border-b border-[#082d1b]/10">
        <div className="section-container flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-center">
          <p className="font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 text-[#082d1b]">
            <FaGraduationCap size={18} />
            <span>Session 2026 Admissions Open — Classes Commence 10-08-2026</span>
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-black transition-transform hover:scale-105 shadow-md bg-[#082d1b] !text-[#D4A64A] border border-[#082d1b] shrink-0"
          >
            <span>Apply Online</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Academy Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Star Educational Academy Logo"
                className="h-12 w-12 rounded-full object-cover border-2 border-[#D4A64A]"
              />
              <div>
                <h3 className="text-lg font-black text-white leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                  Star Educational
                </h3>
                <p className="text-xs font-black tracking-wider uppercase text-[#D4A64A]">
                  Academy, Ghotki
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-white/90 font-medium">
              Where hardworking boys and girls build a bright and successful future through dedication and excellence. Premier coaching for Grades IX–XII.
            </p>

            {/* Official App Colored Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1877F2] text-white hover:bg-[#166FE5] transition-all duration-300 hover:scale-110 shadow-md"
                aria-label="Facebook"
              >
                <FaFacebookF size={16} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white hover:opacity-90 transition-all duration-300 hover:scale-110 shadow-md"
                aria-label="Instagram"
              >
                <FaInstagram size={17} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#FF0000] text-white hover:bg-[#CC0000] transition-all duration-300 hover:scale-110 shadow-md"
                aria-label="YouTube"
              >
                <FaYoutube size={17} />
              </a>
              <a
                href="https://wa.me/923083309704"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#25D366] text-white hover:bg-[#20BD5A] transition-all duration-300 hover:scale-110 shadow-md"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <div className="flex items-center gap-2 mb-5 pb-2 border-b border-white/20">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4A64A]" />
              <h4 className="text-base font-black uppercase tracking-wider text-[#D4A64A]">
                Quick Links
              </h4>
            </div>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm font-bold text-white hover:text-[#D4A64A] transition-all duration-200 hover:translate-x-1 inline-block py-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs Column */}
          <div>
            <div className="flex items-center gap-2 mb-5 pb-2 border-b border-white/20">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4A64A]" />
              <h4 className="text-base font-black uppercase tracking-wider text-[#D4A64A]">
                Our Programs
              </h4>
            </div>
            <ul className="space-y-2">
              {programLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.path}
                    className="text-sm font-bold text-white hover:text-[#D4A64A] transition-all duration-200 inline-block py-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details Column */}
          <div>
            <div className="flex items-center gap-2 mb-5 pb-2 border-b border-white/20">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4A64A]" />
              <h4 className="text-base font-black uppercase tracking-wider text-[#D4A64A]">
                Contact Info
              </h4>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-[#D4A64A]">Director</p>
                <p className="text-sm text-white font-extrabold">Sir Irshad Ahmed Ogahi</p>
                <a href="tel:03083309704" className="inline-flex items-center gap-2 text-xs mt-1 transition-colors hover:text-[#D4A64A] text-white/90 font-bold">
                  <FaPhoneAlt size={11} className="text-[#D4A64A]" />
                  0308-3309704
                </a>
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-[#D4A64A]">Administrator</p>
                <p className="text-sm text-white font-extrabold">Muhammad Jamil Arain</p>
                <a href="tel:03063004887" className="inline-flex items-center gap-2 text-xs mt-1 transition-colors hover:text-[#D4A64A] text-white/90 font-bold">
                  <FaPhoneAlt size={11} className="text-[#D4A64A]" />
                  0306-3004887
                </a>
              </div>
              <div className="pt-2 space-y-2 border-t border-white/20">
                <div className="flex items-start gap-2 text-xs text-white/90 font-medium">
                  <FaMapMarkerAlt size={13} className="mt-0.5 shrink-0 text-[#D4A64A]" />
                  <span>D.A.V. School, Ladies Bazaar, Ghotki</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/90 font-medium">
                  <IoSchool size={13} className="shrink-0 text-[#D4A64A]" />
                  <span>Class Timings: 3:15 PM – 7:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10 py-5 bg-[#051f12]">
        <div className="section-container flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-xs font-bold text-white/80">
            © {new Date().getFullYear()} Star Educational Academy, Ghotki. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-2 text-xs font-black text-[#D4A64A]">
            <span>MDCAT 1st Position</span>
            <span className="opacity-40">•</span>
            <span>30+ MBBS/BDS Admissions</span>
            <span className="opacity-40">•</span>
            <span>100% Pre-Eng Success</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
