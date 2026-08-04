import { useState, useEffect } from 'react'
import { FaStar, FaTrophy, FaGraduationCap } from 'react-icons/fa'
import ScrollReveal from '../../components/animations/ScrollReveal'
import { StaggerContainer, StaggerItem } from '../../components/animations/ScrollReveal'
import successStoryService from '../../services/successStoryService'

export default function SuccessStories() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStories = async () => {
      const res = await successStoryService.getStories()
      if (res && res.success) {
        setStories(res.data)
      }
      setLoading(false)
    }
    fetchStories()
  }, [])

  return (
    <>
      {/* Page Header */}
      <section className="relative py-24 sm:py-32 overflow-hidden" style={{ background: 'linear-gradient(160deg, var(--color-emerald-deepest), var(--color-emerald-dark))' }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 right-20 w-72 h-72 rounded-full blur-3xl" style={{ background: 'var(--color-gold)' }} />
        </div>
        <div className="section-container relative z-10">
          <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto space-y-4 pt-4 sm:pt-6">
            <span className="badge badge-gold font-extrabold inline-flex items-center gap-2 px-4 py-1.5 text-xs rounded-full shadow-xs mx-auto">
              <FaTrophy size={12} className="text-[#D4A64A]" />
              <span>Achievements</span>
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-white leading-tight text-center tracking-tight sm:whitespace-nowrap" style={{ fontFamily: 'var(--font-heading)' }}>
              Success <span className="text-gradient-gold inline">Stories</span>
            </h1>
            <p className="text-base sm:text-lg max-w-2xl mx-auto text-center leading-relaxed text-white/90 font-medium">
              Celebrating the outstanding achievements of our students who have made us proud.
            </p>
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="section-padding" style={{ background: 'var(--color-cream)' }}>
        <div className="section-container">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-[#147a4a] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <FaTrophy size={40} className="mx-auto text-[#D4A64A]/40" />
              <h3 className="text-xl font-bold text-[#0E4429]">No Success Stories Published Yet</h3>
              <p className="text-sm text-[#3a4a40]">Student achievements will appear here once published by the academy.</p>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {stories.map((story) => (
                <StaggerItem key={story._id}>
                  <div className="card group relative overflow-hidden">
                    {/* Gold accent top */}
                    <div className="absolute top-0 left-0 right-0 h-1 transition-all duration-500"
                      style={{ background: 'linear-gradient(90deg, var(--color-gold), var(--color-gold-light))' }} />
                    
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <FaStar key={j} size={16} className="transition-all duration-300"
                          style={{ color: 'var(--color-gold)', transitionDelay: `${j * 50}ms` }} />
                      ))}
                    </div>

                    {/* Category Badge */}
                    <span className="badge badge-emerald mb-4">
                      {story.category}
                    </span>

                    <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-emerald-dark)' }}>
                      {story.studentName}
                    </h3>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-charcoal-light)' }}>
                      {story.achievement}
                    </p>

                    {story.institute && (
                      <p className="text-xs font-semibold mb-2" style={{ color: 'var(--color-emerald-primary)' }}>
                        {story.institute} {story.score ? `— ${story.score}` : ''}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-3 py-1 rounded-full"
                        style={{ background: 'rgba(212,166,74,0.1)', color: 'var(--color-gold-dark)' }}>
                        {story.year}
                      </span>
                      <FaGraduationCap size={18} style={{ color: 'var(--color-sage)' }} className="group-hover:text-emerald-primary transition-colors" />
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

          {/* More coming soon */}
          <ScrollReveal className="text-center mt-12">
            <div className="p-8 rounded-2xl" style={{ background: 'var(--color-cream-alt)' }}>
              <FaTrophy size={32} className="mx-auto mb-4" style={{ color: 'var(--color-gold)' }} />
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-emerald-dark)' }}>
                More Success Stories Coming Soon
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-charcoal-light)' }}>
                We're continuously collecting and celebrating the achievements of our students.
                Check back regularly for updates!
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
