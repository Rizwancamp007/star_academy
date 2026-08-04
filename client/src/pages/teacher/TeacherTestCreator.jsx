import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaPlusCircle, FaRobot, FaCheckCircle, FaClock, FaTrophy, FaQuestionCircle } from 'react-icons/fa'

export default function TeacherTestCreator() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('manual') // 'manual' | 'ai'
  const [formData, setFormData] = useState({
    title: '',
    subject: 'Physics',
    classLevel: 'XI',
    timeLimitMinutes: 30,
    passingScore: 50,
    totalMarks: 100,
    examMode: 'timed', // 'timed' | 'practice'
  })
  const [created, setCreated] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setCreated(true)
    setTimeout(() => {
      navigate('/teacher')
    }, 2000)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <span className="badge badge-emerald text-xs font-bold inline-flex items-center gap-1.5 px-3 py-1">
          <FaPlusCircle size={12} /> Test Construction Wizard
        </span>
        <h1 className="text-3xl font-black text-[#0E4429] mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
          Create New Examination
        </h1>
        <p className="text-xs text-[#3a4a40]">Publish a timed mock exam or practice test for MDCAT, ECAT, or Board preparation.</p>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => setMode('manual')}
          className={`card !p-5 text-left border-2 transition-all ${
            mode === 'manual'
              ? 'border-[#147a4a] bg-emerald-50/40 shadow-md'
              : 'border-[#DCE8DD] hover:border-[#147a4a]/40'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <FaQuestionCircle className={mode === 'manual' ? 'text-[#147a4a]' : 'text-[#3a4a40]'} size={20} />
            <h3 className="font-bold text-base text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
              Bank Selector
            </h3>
          </div>
          <p className="text-xs text-[#3a4a40]">Manually select specific questions from central MCQ Question Bank.</p>
        </button>

        <button
          type="button"
          onClick={() => setMode('random')}
          className={`card !p-5 text-left border-2 transition-all ${
            mode === 'random'
              ? 'border-[#147a4a] bg-emerald-50/40 shadow-md'
              : 'border-[#DCE8DD] hover:border-[#147a4a]/40'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <FaClock className={mode === 'random' ? 'text-[#147a4a]' : 'text-[#3a4a40]'} size={20} />
            <h3 className="font-bold text-base text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
              Random Auto-Sampler
            </h3>
          </div>
          <p className="text-xs text-[#3a4a40]">Auto-pick randomized MCQs matching selected Subject, Grade, and Difficulty Ratio.</p>
        </button>

        <button
          type="button"
          onClick={() => setMode('ai')}
          className={`card !p-5 text-left border-2 transition-all ${
            mode === 'ai'
              ? 'border-[#D4A64A] bg-amber-50/40 shadow-md'
              : 'border-[#DCE8DD] hover:border-[#D4A64A]/40'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <FaRobot className={mode === 'ai' ? 'text-[#b8893a]' : 'text-[#3a4a40]'} size={20} />
            <h3 className="font-bold text-base text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
              AI Automated Builder
            </h3>
          </div>
          <p className="text-xs text-[#3a4a40]">Use Gemini AI / Uploaded File batch to generate randomized questions.</p>
        </button>
      </div>

      {/* Creation Form */}
      <div className="card !p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Test Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. MDCAT Physics Mock Exam 2026 — Vectors & Motion"
              className="w-full px-4 py-3 rounded-xl border border-[#DCE8DD] text-sm focus:outline-none focus:border-[#147a4a]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Subject</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#DCE8DD] text-sm font-semibold focus:outline-none"
              >
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Mathematics">Mathematics</option>
                <option value="English">English</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Target Grade</label>
              <select
                value={formData.classLevel}
                onChange={(e) => setFormData({ ...formData, classLevel: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#DCE8DD] text-sm font-semibold focus:outline-none"
              >
                <option value="IX">Grade IX</option>
                <option value="X">Grade X</option>
                <option value="XI">Grade XI</option>
                <option value="XII">Grade XII</option>
                <option value="MDCAT">MDCAT</option>
                <option value="ECAT">ECAT</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Exam Mode</label>
              <select
                value={formData.examMode}
                onChange={(e) => setFormData({ ...formData, examMode: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#DCE8DD] text-sm font-semibold focus:outline-none"
              >
                <option value="timed">Timed Examination Mode</option>
                <option value="practice">Untimed Practice Mode</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">
                <span className="inline-flex items-center gap-1"><FaClock size={12} /> Time Limit (Mins)</span>
              </label>
              <input
                type="number"
                min="5"
                max="180"
                value={formData.timeLimitMinutes}
                onChange={(e) => setFormData({ ...formData, timeLimitMinutes: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border border-[#DCE8DD] text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">
                <span className="inline-flex items-center gap-1"><FaTrophy size={12} /> Total Marks</span>
              </label>
              <input
                type="number"
                min="10"
                max="500"
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border border-[#DCE8DD] text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Passing Score (%)</label>
              <input
                type="number"
                min="30"
                max="90"
                value={formData.passingScore}
                onChange={(e) => setFormData({ ...formData, passingScore: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border border-[#DCE8DD] text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-4">
            <button type="button" onClick={() => navigate('/teacher')} className="px-5 py-3 rounded-xl border border-[#DCE8DD] text-xs font-bold text-[#3a4a40]">
              Cancel
            </button>
            <button type="submit" className="btn-primary text-xs !py-3 !px-6 shadow-md">
              <FaCheckCircle size={14} />
              <span>Publish Examination</span>
            </button>
          </div>

          {created && (
            <div className="p-4 rounded-xl text-sm font-bold text-center bg-emerald-500/10 text-emerald-800 border border-emerald-500/30">
              🎉 Examination published successfully! Redirecting to Overview...
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
