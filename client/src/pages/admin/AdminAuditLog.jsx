import { useState, useEffect } from 'react'
import { FaHistory, FaSearch, FaUserShield } from 'react-icons/fa'
import auditLogService from '../../services/auditLogService'

export default function AdminAuditLog() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const fetchLogs = async () => {
    setLoading(true)
    const res = await auditLogService.getLogs({
      role: roleFilter !== 'all' ? roleFilter : undefined,
      search: search || undefined,
      limit: 100,
    })
    if (res && res.success) {
      setLogs(res.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchLogs()
  }, [roleFilter])

  const handleSearch = (e) => {
    setSearch(e.target.value)
    // Debounce search
    clearTimeout(window._auditSearchTimer)
    window._auditSearchTimer = setTimeout(() => {
      fetchLogs()
    }, 500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="badge badge-gold text-xs font-bold inline-flex items-center gap-1.5 px-3 py-1">
            <FaHistory size={12} /> System Audit Trail
          </span>
          <h1 className="text-3xl font-black text-[#0E4429] mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
            Administrative Audit Log
          </h1>
          <p className="text-xs text-[#3a4a40]">
            Complete security trail tracking staff actions, student approvals, fee vouchers, and content modifications.
          </p>
        </div>

        <div className="flex rounded-xl bg-[#F1ECE0] p-1 gap-1">
          {['all', 'admin', 'clerk', 'teacher'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                roleFilter === role ? 'bg-[#0E4429] text-white shadow-xs' : 'text-[#3a4a40]'
              }`}
            >
              {role === 'all' ? 'All Logs' : `${role.charAt(0).toUpperCase() + role.slice(1)} Actions`}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="card !p-4">
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3a4a40]/60" size={14} />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Filter audit logs by staff member, action, or target..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DCE8DD] text-xs font-semibold focus:outline-none focus:border-[#147a4a]"
          />
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-[#147a4a] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <div className="card !p-12 text-center space-y-3 border-2 border-dashed border-[#DCE8DD]">
          <FaHistory size={40} className="mx-auto text-[#147a4a]/40" />
          <h3 className="font-extrabold text-base text-[#0E4429]">No Audit Logs Yet</h3>
          <p className="text-xs text-[#3a4a40] max-w-sm mx-auto">Administrative actions will be automatically logged here as staff perform operations.</p>
        </div>
      ) : (
        /* Audit Log Table */
        <div className="card !p-0 overflow-hidden border-2 border-[#DCE8DD]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0E4429] text-white font-extrabold border-b border-[#DCE8DD]">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Staff Member</th>
                  <th className="p-4">Action Type</th>
                  <th className="p-4">Target Entity</th>
                  <th className="p-4">Details Logged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE8DD]">
                {logs.map((l) => (
                  <tr key={l._id} className="hover:bg-[#F1ECE0]/40 transition-colors">
                    <td className="p-4 font-extrabold text-[#3a4a40] whitespace-nowrap">
                      {new Date(l.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4 font-bold text-[#0E4429]">
                      <p>{l.actorName}</p>
                      <span className="badge badge-gold text-[9px] font-extrabold uppercase">{l.actorRole}</span>
                    </td>
                    <td className="p-4 font-black">
                      <span className="px-2.5 py-1 rounded-md bg-[#147a4a]/10 text-[#147a4a] border border-[#147a4a]/20">
                        {l.action}
                      </span>
                    </td>
                    <td className="p-4 font-extrabold text-[#0E4429]">{l.targetType || '—'}</td>
                    <td className="p-4 font-medium text-[#3a4a40]">{l.details || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
