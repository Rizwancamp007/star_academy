import { useState } from 'react'
import { FaPhoneAlt, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane } from 'react-icons/fa'
import ScrollReveal from '../../components/animations/ScrollReveal'
import messageService from '../../services/messageService'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [status, setStatus] = useState(null) // 'success' | 'error' | null
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setStatus(null)

    const res = await messageService.sendMessage({
      senderName: form.name,
      senderEmail: form.email,
      senderPhone: form.phone,
      subject: form.subject,
      message: form.message,
    })

    setSubmitting(false)
    if (res && res.success) {
      setStatus('success')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } else {
      setStatus('error')
    }
    setTimeout(() => setStatus(null), 6000)
  }

  return (
    <>
      {/* Page Header */}
      <section className="relative py-24 sm:py-32 overflow-hidden bg-gradient-to-br from-emerald-deepest to-emerald-dark">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute bottom-10 left-20 w-72 h-72 rounded-full blur-3xl bg-gold" />
        </div>
        <div className="section-container relative z-10">
          <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto space-y-4 pt-4 sm:pt-6">
            <span className="badge badge-gold font-extrabold inline-flex items-center gap-2 px-4 py-1.5 text-xs rounded-full shadow-xs mx-auto">
              <FaEnvelope size={12} className="text-[#D4A64A]" />
              <span>Get In Touch</span>
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-white leading-tight text-center tracking-tight sm:whitespace-nowrap" style={{ fontFamily: 'var(--font-heading)' }}>
              Contact <span className="text-gradient-gold inline">Us</span>
            </h1>
            <p className="text-base sm:text-lg max-w-2xl mx-auto text-center leading-relaxed text-white/90 font-medium">
              Have questions about admissions, MDCAT/ECAT courses, or timings? Reach out directly to our team.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding bg-cream">
        <div className="section-container">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Contact Form */}
            <ScrollReveal direction="left" className="lg:col-span-3">
              <div className="card p-8! sm:p-10 space-y-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-dark" style={{ fontFamily: 'var(--font-heading)' }}>
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-extrabold text-emerald-dark mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        placeholder=" Khan"
                        className="w-full px-4 py-3 rounded-xl text-xs font-semibold focus:outline-none border border-sage bg-white text-charcoal focus:border-emerald-primary min-h-[46px]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-extrabold text-emerald-dark mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        placeholder="khan@gmail.com"
                        className="w-full px-4 py-3 rounded-xl text-xs font-semibold focus:outline-none border border-sage bg-white text-charcoal focus:border-emerald-primary min-h-[46px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-extrabold text-emerald-dark mb-2">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="e.g. 0308-3309704"
                      className="w-full px-4 py-3 rounded-xl text-xs font-semibold focus:outline-none border border-sage bg-white text-charcoal focus:border-emerald-primary min-h-[46px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-extrabold text-emerald-dark mb-2">
                      Subject / Inquiry Type
                    </label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      required
                      placeholder="e.g. Admission for MDCAT Session 2026"
                      className="w-full px-4 py-3 rounded-xl text-xs font-semibold focus:outline-none border border-sage bg-white text-charcoal focus:border-emerald-primary min-h-[46px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-extrabold text-emerald-dark mb-2">
                      Message Details
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      rows={4}
                      placeholder="Tell us how we can help you..."
                      className="w-full px-4 py-3 rounded-xl text-xs font-semibold focus:outline-none resize-none border border-sage bg-white text-charcoal focus:border-emerald-primary"
                    />
                  </div>

                  <button type="submit" disabled={submitting} className="btn-primary w-full text-xs font-extrabold py-3.5! shadow-md">
                    <FaPaperPlane size={14} />
                    <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                  </button>

                  {status === 'success' && (
                    <div className="p-4 rounded-xl text-xs font-bold text-center bg-emerald-500/10 text-emerald-800 border border-emerald-500/30">
                      ✅ Message sent successfully! We will get back to you shortly.
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="p-4 rounded-xl text-xs font-bold text-center bg-red-500/10 text-red-800 border border-red-500/30">
                      ❌ Failed to send message. Please try again or contact us directly.
                    </div>
                  )}
                </form>
              </div>
            </ScrollReveal>

            {/* Contact Info Cards */}
            <ScrollReveal direction="right" className="lg:col-span-2">
              <div className="flex flex-col gap-6 sm:gap-8">
                {/* Director Card */}
                <div className="card p-7! space-y-4 border-l-4 border-l-[#D4A64A] shadow-md bg-white">
                  <div className="flex items-center justify-between">
                    <span className="badge badge-gold text-[11px] font-black uppercase tracking-wider px-3 py-1">
                      Executive Director
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
                    Sir Irshad Ahmed Ogahi
                  </h3>
                  <p className="text-xs font-bold text-charcoal-light">Senior Physics Faculty & Director</p>
                  <div className="space-y-2 pt-3 border-t border-sage">
                    <a href="tel:03083309704" className="flex items-center gap-3 text-xs font-bold p-2.5 rounded-xl transition-colors hover:bg-cream-alt text-charcoal">
                      <FaPhoneAlt size={14} className="text-[#147a4a]" />
                      <span>0308-3309704</span>
                    </a>
                    <a href="https://wa.me/923083309704" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs font-bold p-2.5 rounded-xl transition-colors hover:bg-cream-alt text-charcoal">
                      <FaWhatsapp size={16} className="text-[#25D366]" />
                      <span>Chat on Official WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Administrator Card */}
                <div className="card p-7! space-y-4 border-l-4 border-l-[#147a4a] shadow-md bg-white">
                  <div className="flex items-center justify-between">
                    <span className="badge badge-emerald text-[11px] font-black uppercase tracking-wider px-3 py-1">
                      Administrator
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
                    Muhammad Jamil Arain
                  </h3>
                  <p className="text-xs font-bold text-charcoal-light">Senior Mathematics & Administration</p>
                  <div className="space-y-2 pt-3 border-t border-sage">
                    <a href="tel:03063004887" className="flex items-center gap-3 text-xs font-bold p-2.5 rounded-xl transition-colors hover:bg-cream-alt text-charcoal">
                      <FaPhoneAlt size={14} className="text-[#147a4a]" />
                      <span>0306-3004887</span>
                    </a>
                    <a href="https://wa.me/923063004887" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs font-bold p-2.5 rounded-xl transition-colors hover:bg-cream-alt text-charcoal">
                      <FaWhatsapp size={16} className="text-[#25D366]" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Location & Timings Card */}
                <div className="card p-6! space-y-4">
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt size={16} className="mt-0.5 text-emerald-primary shrink-0" />
                    <div>
                      <p className="font-extrabold text-xs uppercase tracking-wider text-emerald-dark">Location</p>
                      <p className="text-xs font-medium text-charcoal-light mt-0.5">
                        D.A.V. School, Ladies Bazaar, Ghotki, Sindh
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pt-3 border-t border-sage">
                    <FaClock size={16} className="mt-0.5 text-emerald-primary shrink-0" />
                    <div>
                      <p className="font-extrabold text-xs uppercase tracking-wider text-emerald-dark">Class Timings</p>
                      <p className="text-xs font-medium text-charcoal-light mt-0.5">3:15 PM – 7:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Map Container */}
          <ScrollReveal className="mt-12">
            <div className="rounded-3xl overflow-hidden shadow-lg border border-sage" style={{ height: '350px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14136.927364!2d69.315!3d27.965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x393d9e9e9e9e9e9f%3A0x9e9e9e9e9e9e9e9e!2sGhotki%2C+Sindh%2C+Pakistan!5e0!3m2!1sen!2s!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Star Educational Academy - Ghotki Location"
              ></iframe>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
