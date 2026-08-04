import { useState, useEffect } from 'react'
import { FaChartLine, FaTrophy, FaLightbulb, FaCheckCircle, FaBullseye, FaFire } from 'react-icons/fa'
import api from '../../services/api'

const subjectColors = {
  Physics: '#147a4a',
  Chemistry: '#D4A64A',
  Biology: '#1a9e5f',
  Mathematics: '#0E4429',
  English: '#3a4a40',
}

export default function StudentAnalytics() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/attempts/analytics')
        if (res.data) {
          setAnalytics(res.data)
        }
      } catch (err) {
        console.error('Failed to fetch analytics:', err)
      }
      setLoading(false)
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-[#147a4a] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const overallAccuracy = analytics?.overallAccuracy ?? 0
  const streak = analytics?.streak ?? 0
  const subjectStats = analytics?.subjectBreakdown || []
  const strengths = analytics?.strengths || []
  const weakAreas = analytics?.weakAreas || []
  const totalAttempts = analytics?.totalAttempts ?? 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
          AI Performance Analytics & Progress Tracker
        </h1>
        <p className="text-sm text-[#3a4a40] mt-1">
          Detailed subject-wise breakdown calculated from your practice and timed exam submissions.
        </p>
      </div>

      {totalAttempts === 0 ? (
        <div className="card !p-12 text-center space-y-3 border-2 border-dashed border-[#DCE8DD]">
          <FaChartLine size={40} className="mx-auto text-[#147a4a]/40" />
          <h3 className="font-extrabold text-base text-[#0E4429]">No Analytics Data Yet</h3>
          <p className="text-xs text-[#3a4a40] max-w-sm mx-auto">Complete your first mock test or practice quiz to see your performance insights here.</p>
        </div>
      ) : (
        <>
          {/* Top Overview Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="card !p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center text-2xl font-bold">
                <FaBullseye />
              </div>
              <div>
                <p className="text-xs font-bold text-[#3a4a40] uppercase">Overall Accuracy</p>
                <p className="text-3xl font-black text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {overallAccuracy.toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="card !p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-2xl font-bold">
                <FaTrophy />
              </div>
              <div>
                <p className="text-xs font-bold text-[#3a4a40] uppercase">Tests Completed</p>
                <p className="text-3xl font-black text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {totalAttempts}
                </p>
              </div>
            </div>

            <div className="card !p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center text-2xl font-bold">
                <FaFire />
              </div>
              <div>
                <p className="text-xs font-bold text-[#3a4a40] uppercase">Current Active Streak</p>
                <p className="text-3xl font-black text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {streak} Day{streak !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Subject Performance Breakdown */}
          {subjectStats.length > 0 && (
            <div className="card !p-8 space-y-6">
              <h2 className="text-xl font-bold text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
                Subject Accuracy Breakdown
              </h2>

              <div className="space-y-6">
                {subjectStats.map((item) => (
                  <div key={item.subject} className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-bold">
                      <span className="text-[#0E4429]">{item.subject}</span>
                      <span className="text-[#147a4a]">
                        {item.accuracy?.toFixed(1)}% ({item.correct}/{item.attempted} Correct)
                      </span>
                    </div>
                    <div className="h-3 w-full bg-[#F1ECE0] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.accuracy || 0}%`,
                          backgroundColor: subjectColors[item.subject] || '#147a4a',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Recommendations */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card !p-6 border-l-4 border-l-emerald-600 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                <FaCheckCircle />
                <h3>Strongest Modules</h3>
              </div>
              {strengths.length > 0 ? (
                <ul className="text-xs text-[#3a4a40] space-y-2 list-disc list-inside leading-relaxed">
                  {strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-[#3a4a40]">Complete more tests to discover your strongest subjects.</p>
              )}
            </div>

            <div className="card !p-6 border-l-4 border-l-amber-500 space-y-3">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-base">
                <FaLightbulb />
                <h3>Recommended Focus Areas</h3>
              </div>
              {weakAreas.length > 0 ? (
                <ul className="text-xs text-[#3a4a40] space-y-2 list-disc list-inside leading-relaxed">
                  {weakAreas.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-[#3a4a40]">Keep practicing to receive personalized recommendations.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
