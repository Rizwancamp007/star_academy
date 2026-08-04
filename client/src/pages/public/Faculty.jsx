import { useState, useEffect } from 'react'
import { FaStar, FaBookOpen, FaFlask, FaPhoneAlt } from 'react-icons/fa'
import { GiDna1, GiAtom } from 'react-icons/gi'
import { TbMathSymbols } from 'react-icons/tb'
import ScrollReveal from '../../components/animations/ScrollReveal'
import { StaggerContainer, StaggerItem } from '../../components/animations/ScrollReveal'
import TiltCard from '../../components/animations/TiltCard'
import facultyService from '../../services/facultyService'

const subjectIcons = {
  Physics: <GiAtom size={20} />,
  Mathematics: <TbMathSymbols size={20} />,
  Chemistry: <FaFlask size={20} />,
  Biology: <GiDna1 size={20} />,
  English: <FaBookOpen size={20} />,
  'Computer Science': <FaBookOpen size={20} />,
  General: <FaStar size={20} />,
}

export default function Faculty() {
  const [faculty, setFaculty] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFaculty = async () => {
      const res = await facultyService.getFaculty()
      if (res && res.success) {
        setFaculty(res.data)
      }
      setLoading(false)
    }
    fetchFaculty()
  }, [])

  return (
    <>
      {/* Page Header */}
      <section className="relative py-24 sm:py-32 overflow-hidden bg-gradient-to-br from-emerald-deepest to-emerald-dark">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-20 w-72 h-72 rounded-full blur-3xl bg-gold" />
        </div>
        <div className="section-container relative z-10">
          <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto space-y-4 pt-4 sm:pt-6">
            <span className="badge badge-gold font-extrabold inline-flex items-center gap-2 px-4 py-1.5 text-xs rounded-full shadow-xs mx-auto">
              <FaStar size={12} className="text-[#D4A64A]" />
              <span>Our Team</span>
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-white leading-tight text-center tracking-tight sm:whitespace-nowrap" style={{ fontFamily: 'var(--font-heading)' }}>
              Our <span className="text-gradient-gold inline">Expert</span> Faculty
            </h1>
            <p className="text-base sm:text-lg max-w-2xl mx-auto text-center leading-relaxed text-white/90 font-medium">
              Highly qualified and experienced educators committed to guiding every student towards their academic goals.
            </p>
          </div>
        </div>
      </section>

      {/* Faculty Grid */}
      <section className="section-padding bg-cream">
        <div className="section-container">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-[#147a4a] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : faculty.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <FaStar size={40} className="mx-auto text-[#D4A64A]/40" />
              <h3 className="text-xl font-bold text-[#0E4429]">Faculty Profiles Coming Soon</h3>
              <p className="text-sm text-[#3a4a40]">Our team is being updated. Check back shortly.</p>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {faculty.map((member) => (
                <StaggerItem key={member._id}>
                  <TiltCard intensity={6}>
                    <div className="card group overflow-hidden h-full flex flex-col justify-between hover:border-emerald-primary/40">
                      <div>
                        {/* Photo */}
                        <div className="relative mx-auto w-36 h-36 mb-6 rounded-full overflow-hidden ring-4 ring-sage group-hover:ring-gold/50 transition-all duration-500 shadow-md bg-emerald-primary/10 flex items-center justify-center">
                          {member.photoUrl ? (
                            <img
                              src={member.photoUrl}
                              alt={member.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <span className="text-5xl font-black text-emerald-primary">
                              {member.name?.charAt(4) || member.name?.charAt(0)}
                            </span>
                          )}
                        </div>

                        {/* Subject Badge */}
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <span className="text-emerald-primary">{subjectIcons[member.subject] || <FaStar size={20} />}</span>
                          <span className="text-xs font-extrabold uppercase tracking-wider text-gold-dark">
                            {member.subject}
                          </span>
                        </div>

                        {/* Name & Role */}
                        <h3 className="text-xl font-extrabold text-center mb-2 text-emerald-dark" style={{ fontFamily: 'var(--font-heading)' }}>
                          {member.name}
                        </h3>
                        <div className="text-center mb-4">
                          <span className="badge badge-emerald text-xs font-bold">{member.designation}</span>
                        </div>

                        {/* Bio */}
                        {member.bio && (
                          <p className="text-sm text-center leading-relaxed mb-4 text-charcoal-light">
                            {member.bio}
                          </p>
                        )}

                        {/* Qualifications */}
                        {(member.qualification || member.experience) && (
                          <div className="text-center space-y-1 mb-3 text-xs text-charcoal-light font-semibold">
                            {member.qualification && <p>{member.qualification}</p>}
                            {member.experience && <p>{member.experience} Experience</p>}
                          </div>
                        )}
                      </div>

                      {/* Phone */}
                      {member.phone && (
                        <div className="pt-3 border-t border-sage/50 text-center">
                          <a
                            href={`tel:${member.phone.replace(/-/g, '')}`}
                            className="inline-flex items-center justify-center gap-2 text-sm font-bold transition-colors duration-200 text-emerald-primary"
                          >
                            <FaPhoneAlt size={12} />
                            <span>{member.phone}</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>
    </>
  )
}
