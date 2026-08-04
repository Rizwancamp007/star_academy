import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { FaStar, FaGraduationCap, FaTrophy, FaFlask, FaBookOpen, FaArrowRight, FaUserGraduate, FaChevronRight, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaChalkboardTeacher, FaAward } from 'react-icons/fa'
import { GiDna1, GiAtom } from 'react-icons/gi'
import { TbMathSymbols } from 'react-icons/tb'
import CountUp from '../../components/animations/CountUp'
import ScrollReveal from '../../components/animations/ScrollReveal'
import { StaggerContainer, StaggerItem } from '../../components/animations/ScrollReveal'
import TiltCard from '../../components/animations/TiltCard'
import ParticleStars from '../../components/animations/ParticleStars'

const subjectIcons = {
  Physics: <GiAtom />,
  Mathematics: <TbMathSymbols />,
  Chemistry: <FaFlask />,
  Biology: <GiDna1 />,
  English: <FaBookOpen />,
  'Computer Science': <FaBookOpen />,
  General: <FaStar />,
}

export default function Home() {
  const [liveStats, setLiveStats] = useState({
    students: 0,
    lectures: 0,
    tests: 0,
    mcqs: 0,
    faculty: 0,
  })
  const [facultyPreview, setFacultyPreview] = useState([])
  const [achievements, setAchievements] = useState([])

  useEffect(() => {
    axios.get('/api/admin/public-stats').then((res) => {
      if (res.data?.success && res.data?.stats) setLiveStats(res.data.stats)
    }).catch(() => {})

    axios.get('/api/faculty').then((res) => {
      if (res.data?.success) setFacultyPreview(res.data.data.slice(0, 6))
    }).catch(() => {})

    axios.get('/api/success-stories').then((res) => {
      if (res.data?.success) setAchievements(res.data.data.slice(0, 4))
    }).catch(() => {})
  }, [])

  const stats = [
    { icon: <FaGraduationCap />, value: liveStats.students, suffix: '+', label: 'Enrolled Students', sub: 'Pre-Med & Pre-Eng' },
    { icon: <FaChalkboardTeacher />, value: liveStats.faculty || facultyPreview.length, suffix: '+', label: 'Expert Faculty', sub: 'Dedicated Educators' },
    { icon: <FaAward />, value: liveStats.lectures, suffix: '+', label: 'Video Lectures', sub: 'Structured Courses' },
    { icon: <FaTrophy />, value: liveStats.tests, suffix: '+', label: 'Mock Tests', sub: 'Online Practice' },
  ]
  return (
    <>
      {/* ========== HERO SECTION ========== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-28 sm:pt-32 lg:pt-36 pb-32 sm:pb-40 lg:pb-44" style={{ background: 'linear-gradient(160deg, #082d1b 0%, #0E4429 45%, #147a4a 100%)' }}>
        <ParticleStars count={60} />
        
        {/* Ambient Gradient Orbs */}
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: '#D4A64A' }} />
        <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: '#1a9e5f' }} />

        <div className="section-container relative z-10 mb-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            
            {/* Left Column: Balanced Text Content Block */}
            <div className="flex flex-col justify-center space-y-6 max-w-2xl">
              
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="badge badge-gold font-bold inline-flex items-center gap-2 px-4 py-2 text-xs rounded-xl shadow-xs">
                  <FaStar size={12} className="text-[#D4A64A]" />
                  <span>Session 2026 — Admissions Open</span>
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.15] text-white tracking-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Shape Your{' '}
                <span className="text-gradient-gold inline">Future</span>
                <br />
                With Excellence
              </motion.h1>

              {/* Description Paragraph */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg leading-relaxed font-medium text-white/95"
              >
                Premier coaching for Grades IX–XII. Pre-Medical & Pre-Engineering 
                tracks with expert faculty and proven results. ECAT & MCAT preparation 
                that delivers <strong className="font-extrabold text-[#e6c36e]">outstanding success</strong>.
              </motion.p>

              {/* CTA Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <Link
                  to="/register"
                  className="h-12 px-10 rounded-xl bg-[#D4A64A] text-[#082d1b] font-black text-sm hover:bg-[#e6c36e] transition-all duration-300 shadow-xl flex items-center justify-center gap-2.5 shrink-0"
                >
                  <FaGraduationCap size={24} />
                  <span>Apply Now</span>
                </Link>
                
                <Link
                  to="/about"
                  className="h-12 px-6 rounded-xl bg-white/15 hover:bg-white/25 border border-white/50 !text-white font-black text-sm transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-2.5 shrink-0 shadow-md"
                  style={{ color: '#FFFFFF' }}
                >
                  <span className="!text-white">Explore Programs</span>
                  <FaArrowRight size={20} className="text-[#D4A64A]" />
                </Link>
              </motion.div>

              {/* Session Meta Information Cards */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 pt-8 border-t border-white/20 grid grid-cols-1 sm:grid-cols-3 gap-3"
              >
                <div className="flex items-center gap-2.5 px-4 py-3.5 rounded-2xl bg-black/40 border border-white/30 backdrop-blur-md text-white shadow-lg">
                  <FaCalendarAlt className="text-[#D4A64A] shrink-0" size={16} />
                  <div className="text-xs">
                    <span className="text-white/80 block text-[10px] uppercase font-bold tracking-wider">Commences</span>
                    <strong className="text-[#e6c36e] font-extrabold text-xs">10-08-2026</strong>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5 px-4 py-3.5 rounded-2xl bg-black/40 border border-white/30 backdrop-blur-md text-white shadow-lg">
                  <FaClock className="text-[#D4A64A] shrink-0" size={16} />
                  <div className="text-xs">
                    <span className="text-white/80 block text-[10px] uppercase font-bold tracking-wider">Timings</span>
                    <strong className="text-white font-extrabold text-xs">3:15 – 7:00 PM</strong>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5 px-4 py-3.5 rounded-2xl bg-black/40 border border-white/30 backdrop-blur-md text-white shadow-lg">
                  <FaMapMarkerAlt className="text-[#D4A64A] shrink-0" size={16} />
                  <div className="text-xs">
                    <span className="text-white/80 block text-[10px] uppercase font-bold tracking-wider">Campus</span>
                    <strong className="text-white font-extrabold truncate block text-xs">D.A.V. School</strong>
                  </div>
                </div>
              </motion.div>

            </div>

            {/* Right Column: Hero Image Frame & Doped Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:flex flex-col gap-4 w-full"
            >
              {/* Image Box */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4A64A]/40 bg-[#082d1b] aspect-[4/3] w-full">
                <img
                  src="/images/adv-1.jpg"
                  alt="Star Educational Academy - Admissions Open 2026"
                  className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                />
              </div>

              {/* Statistics Card (Neatly Docked Below Image - ZERO Image Overlap) */}
              <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#D4A64A]/40 shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-[#147a4a]/10 flex items-center justify-center shrink-0">
                    <FaTrophy size={22} className="text-[#b8893a]" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-[#0E4429] leading-none" style={{ fontFamily: 'var(--font-heading)' }}>
                      30+
                    </p>
                    <p className="text-xs font-bold text-[#3a4a40] mt-1">
                      MBBS/BDS Admissions in 2025
                    </p>
                  </div>
                </div>

                <div className="hidden sm:block text-right border-l border-gray-200 pl-4">
                  <p className="text-xs font-extrabold text-[#147a4a] uppercase tracking-wider">
                    District Ghotki
                  </p>
                  <p className="text-[11px] font-bold text-gray-500">
                    1st Position MDCAT
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-20">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 50L48 45C96 40 192 30 288 33C384 36 480 52 576 58C672 64 768 60 864 52C960 44 1056 32 1152 30C1248 28 1344 36 1392 40L1440 44V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z" fill="var(--color-cream)"/>
          </svg>
        </div>
      </section>

      {/* ========== STATS SECTION ========== */}
      <section className="section-padding relative overflow-hidden bg-cream">
        <div className="section-container">
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <StaggerItem key={i}>
                <div className="card text-center group hover:border-emerald-primary/40 p-6!">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-emerald-primary/10 text-emerald-primary flex items-center justify-center text-2xl transition-all duration-300 group-hover:scale-110 shadow-xs">
                    {stat.icon}
                  </div>
                  <p className="text-3xl sm:text-4xl font-black mb-1 text-emerald-dark" style={{ fontFamily: 'var(--font-heading)' }}>
                    <CountUp end={stat.value} suffix={stat.suffix} duration={2.5} />
                  </p>
                  <p className="font-bold text-sm mb-0.5 text-charcoal">{stat.label}</p>
                  <p className="text-xs font-semibold text-charcoal-light">{stat.sub}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ========== ABOUT PREVIEW ========== */}
      <section className="section-padding relative overflow-hidden bg-cream-alt">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="rounded-3xl overflow-hidden shadow-xl border-2 border-sage">
                <img
                  src="/images/adv-2.jpg"
                  alt="Star Educational Academy"
                  className="w-full h-auto object-cover"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" className="space-y-5">
              <span className="badge badge-emerald font-bold inline-flex items-center gap-1.5 px-4 py-1 text-xs">
                <FaBookOpen size={12} />
                About Us
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-[1.25] text-emerald-dark pt-1" style={{ fontFamily: 'var(--font-heading)' }}>
                Building Bright Futures Through{' '}
                <span className="text-gradient-gold inline-block">Dedication & Excellence</span>
              </h2>
              <p className="text-base leading-relaxed text-charcoal-light">
                Star Educational Academy is where hardworking boys and girls build a bright 
                and successful future through dedication and excellence. With separate classes 
                for Pre-Medical and Pre-Engineering tracks, we provide focused coaching for 
                Grades IX, X, XI & XII.
              </p>
              <p className="text-base leading-relaxed text-charcoal-light">
                Our expert faculty, led by Sir Irshad Ahmed Ogahi, has consistently delivered 
                outstanding results — including the 1st Position in MDCAT across District Ghotki 
                and 30+ medical admissions in a single year.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                {[
                  { label: 'Expert Faculty', value: '6+ Teachers' },
                  { label: 'Programs', value: 'Pre-Med & Pre-Eng' },
                  { label: 'Grades Covered', value: 'IX to XII' },
                  { label: 'Track Record', value: '100% Success' },
                ].map((item, i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-sage bg-white/80 shadow-xs">
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-primary">{item.label}</p>
                    <p className="font-extrabold text-sm text-charcoal mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* 2nd image fix: Moved button down with mt-8 pt-4 and centered/aligned padding */}
              <div className="mt-8 pt-4 flex justify-center lg:justify-start">
                <Link
                  to="/about"
                  className="h-12 px-7 rounded-xl bg-[#147a4a] hover:bg-[#0E4429] text-white font-extrabold text-sm transition-all duration-300 shadow-lg flex items-center justify-center gap-2.5"
                >
                  <span>Learn More About Us</span>
                  <FaChevronRight size={13} className="text-[#D4A64A]" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ========== FACULTY PREVIEW ========== */}
      <section className="section-padding relative overflow-hidden bg-cream">
        <div className="section-container relative z-10">
          <ScrollReveal className="flex flex-col items-center justify-center text-center mb-12 space-y-3">
            <span className="badge badge-gold font-bold inline-flex items-center gap-1.5 px-4 py-1 text-xs">
              <FaStar size={12} className="text-gold" />
              Our Team
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.25] text-center text-emerald-dark" style={{ fontFamily: 'var(--font-heading)' }}>
              Meet Our <span className="text-gradient-gold inline-block">Distinguished</span> Faculty
            </h2>
            <p className="text-base sm:text-lg max-w-2xl mx-auto text-center leading-relaxed text-charcoal-light">
              Highly qualified and experienced educators committed to guiding every student towards their academic goals.
            </p>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {facultyPreview.map((member, i) => (
              <StaggerItem key={member._id || i}>
                <TiltCard intensity={8}>
                  <div className="card group text-center overflow-hidden h-full flex flex-col items-center justify-between p-6! space-y-4">
                    <div className="flex flex-col items-center text-center w-full">
                      <div className="relative mx-auto w-28 h-28 mb-4 rounded-full overflow-hidden ring-4 ring-sage group-hover:ring-gold/60 transition-all duration-300 shadow-md bg-emerald-primary/10 flex items-center justify-center">
                        {member.photoUrl ? (
                          <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-4xl font-black text-emerald-primary">{member.name?.charAt(4) || member.name?.charAt(0)}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-center gap-2 mb-1.5">
                        <span className="text-lg text-emerald-primary">{subjectIcons[member.subject] || <FaStar />}</span>
                        <span className="text-xs font-extrabold uppercase tracking-wider text-gold-dark">
                          {member.subject}
                        </span>
                      </div>
                      <h3 className="text-lg font-extrabold text-emerald-dark text-center" style={{ fontFamily: 'var(--font-heading)' }}>
                        {member.name}
                      </h3>
                    </div>
                    {member.designation && member.designation !== 'Faculty Member' ? (
                      <div className="mt-2 text-center">
                        <span className="badge badge-emerald text-xs font-bold">
                          {member.designation}
                        </span>
                      </div>
                    ) : (
                      <div className="h-6" />
                    )}
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <ScrollReveal className="text-center mt-12 sm:mt-16">
            <Link to="/faculty" className="btn-outline shadow-xs">
              <span>View All Faculty</span>
              <FaArrowRight size={14} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ========== SUCCESS STORIES ========== */}
      <section className="section-padding relative overflow-hidden bg-gradient-to-r from-emerald-deepest via-emerald-dark to-emerald-primary">
        <div className="section-container relative z-10">
          <ScrollReveal className="flex flex-col items-center justify-center text-center mb-12 space-y-3">
            <span className="badge badge-gold font-bold inline-flex items-center gap-1.5 px-4 py-1 text-xs">
              <FaTrophy size={12} className="text-gold" />
              Achievements
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.25] text-center" style={{ fontFamily: 'var(--font-heading)' }}>
              Our Students <span className="text-gradient-gold inline">Shine Bright</span>
            </h2>
            <p className="text-base sm:text-lg max-w-2xl mx-auto text-center leading-relaxed text-white/90">
              Every year, our students achieve remarkable results in board exams, MDCAT, ECAT, 
              and secure admissions in top universities across Pakistan.
            </p>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((story, i) => (
              <StaggerItem key={story._id || i}>
                <div className="p-6 rounded-2xl h-full flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg bg-white/10 border border-white/20 backdrop-blur-md">
                  <div className="space-y-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, j) => (
                        <FaStar key={j} size={13} className="text-gold" />
                      ))}
                    </div>
                    <h3 className="text-lg font-bold text-white leading-snug" style={{ fontFamily: 'var(--font-heading)' }}>
                      {story.studentName || story.name}
                    </h3>
                    <p className="text-xs leading-relaxed text-white/80 font-medium">
                      {story.achievement}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-extrabold bg-gold/25 text-gold-light border border-gold/40">
                      {story.year}
                    </span>
                    <span className="text-[11px] font-bold text-white/60">{story.category || 'Achievement'}</span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <ScrollReveal className="text-center mt-12 sm:mt-16">
            <Link to="/success-stories" className="btn-outline-white text-base">
              <span>View All Success Stories</span>
              <FaArrowRight size={14} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ========== CTA BANNER SECTION ========== */}
      <section className="section-padding relative overflow-hidden bg-cream">
        <div className="section-container">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-3xl p-8 sm:p-14 lg:p-20 text-center shadow-2xl max-w-4xl mx-auto bg-gradient-to-br from-[#0E4429] via-[#147a4a] to-[#082d1b] border-2 border-[#D4A64A]/40">
              <div className="relative z-10 flex flex-col items-center text-center gap-6 sm:gap-8">
                
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.2] text-center" style={{ fontFamily: 'var(--font-heading)' }}>
                  Session 2026 is <span className="text-gradient-gold inline">Now Open</span>
                </h2>
                
                <p className="text-base sm:text-lg leading-relaxed text-white/95 text-center max-w-2xl font-medium">
                  Admission forms & advance seat booking available from <strong className="text-[#e6c36e] font-extrabold">20-07-2026</strong>. 
                  Classes commence <strong className="text-[#e6c36e] font-extrabold">10-08-2026</strong>.
                </p>

                <div className="inline-flex flex-wrap items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-black/40 border border-white/30 text-white text-xs sm:text-sm font-bold backdrop-blur-md shadow-md my-1">
                  <span className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#D4A64A]" size={16} />
                    <span>D.A.V. School, Ladies Bazaar, Ghotki</span>
                  </span>
                  <span className="hidden sm:inline opacity-40">|</span>
                  <span className="flex items-center gap-2">
                    <FaClock className="text-[#D4A64A]" size={16} />
                    <span>3:15 PM – 7:00 PM</span>
                  </span>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 pt-3">
                  <Link
                    to="/register"
                    className="py-3.5 px-8 rounded-xl bg-[#D4A64A] text-[#082d1b] font-black text-base hover:bg-[#e6c36e] transition-all duration-300 shadow-2xl flex items-center justify-center gap-2.5 shrink-0 min-h-[52px]"
                  >
                    <FaGraduationCap size={20} />
                    <span>Apply Now</span>
                  </Link>

                  <a
                    href="https://wa.me/923083309704?text=Hello! I'm interested in admissions for Session 2026."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3.5 px-8 rounded-xl bg-white/15 hover:bg-white/25 border border-white/40 !text-white font-black text-base transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-2.5 shrink-0 shadow-xl min-h-[52px]"
                    style={{ color: '#FFFFFF' }}
                  >
                    <span className="!text-white">Contact Us</span>
                    <FaArrowRight size={15} className="text-[#D4A64A]" />
                  </a>
                </div>

              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
