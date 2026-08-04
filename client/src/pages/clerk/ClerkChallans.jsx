import { useState } from 'react'
import { FaReceipt, FaCheck, FaTimes, FaDownload, FaPlus, FaLock, FaPrint, FaSearch } from 'react-icons/fa'

export default function ClerkChallans() {
  const [challans, setChallans] = useState([
    {
      id: 'CH-2026-001',
      studentName: 'Ali Hassan',
      rollNo: 'SEA-2026-101',
      amount: 5000,
      description: 'One-Time Admission & Annual Session Fee (2026)',
      dueDate: '10-08-2026',
      status: 'unpaid',
    },
    {
      id: 'CH-2026-002',
      studentName: 'Sana Fatima',
      rollNo: 'SEA-2026-102',
      amount: 5000,
      description: 'One-Time Admission & Annual Session Fee (2026)',
      dueDate: '10-08-2026',
      status: 'paid',
    },
    {
      id: 'CH-2026-003',
      studentName: 'Zubair Ahmed',
      rollNo: 'SEA-2026-103',
      amount: 5000,
      description: 'One-Time Admission & Annual Session Fee (2026)',
      dueDate: '10-08-2026',
      status: 'unpaid',
    },
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [search, setSearch] = useState('')
  const [newChallan, setNewChallan] = useState({
    studentName: '',
    rollNo: '',
    amount: 5000,
    dueDate: '10-08-2026',
    description: 'One-Time Admission & Session Fee (2026)',
  })

  const handleMarkPaid = (id) => {
    setChallans(
      challans.map((c) => (c.id === id ? { ...c, status: c.status === 'paid' ? 'unpaid' : 'paid' } : c))
    )
  }

  const handleCreate = (e) => {
    e.preventDefault()
    if (!newChallan.studentName) return

    const created = {
      id: `CH-2026-00${challans.length + 1}`,
      studentName: newChallan.studentName,
      rollNo: newChallan.rollNo || `SEA-2026-10${challans.length + 1}`,
      amount: Number(newChallan.amount),
      description: newChallan.description,
      dueDate: newChallan.dueDate,
      status: 'unpaid',
    }

    setChallans([created, ...challans])
    setShowCreateModal(false)
    setNewChallan({
      studentName: '',
      rollNo: '',
      amount: 5000,
      dueDate: '10-08-2026',
      description: 'One-Time Admission & Session Fee (2026)',
    })
  }

  const filtered = challans.filter((c) =>
    c.studentName.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="badge badge-gold text-xs font-bold inline-flex items-center gap-1.5 px-3 py-1">
            <FaReceipt size={12} /> Office Billing Counter
          </span>
          <h1 className="text-3xl font-black text-[#0E4429] mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
            Admission Fee Challans
          </h1>
          <p className="text-xs text-[#3a4a40]">
            Issue standard one-time session vouchers (₨ 5,000) and log paid receipt verifications.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-gold text-xs !py-3 !px-5 self-start sm:self-center shadow-md flex items-center gap-2"
        >
          <FaPlus size={12} />
          <span>Issue New Challan Voucher</span>
        </button>
      </div>

      {/* Search */}
      <div className="card !p-4">
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3a4a40]/60" size={14} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name or voucher ID (e.g. CH-2026-001)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DCE8DD] text-xs font-semibold focus:outline-none focus:border-[#147a4a]"
          />
        </div>
      </div>

      {/* Challans Table */}
      <div className="card !p-0 overflow-hidden border-2 border-[#DCE8DD]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0E4429] text-white font-extrabold border-b border-[#DCE8DD]">
                <th className="p-4">Voucher ID</th>
                <th className="p-4">Student & Roll No</th>
                <th className="p-4">Fee Structure</th>
                <th className="p-4">Amount & Due Date</th>
                <th className="p-4">Payment Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE8DD]">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-[#F1ECE0]/40 transition-colors">
                  <td className="p-4 font-black text-[#147a4a]">{c.id}</td>
                  <td className="p-4 font-bold text-[#0E4429]">
                    <p className="font-extrabold text-sm">{c.studentName}</p>
                    <p className="text-[10px] text-[#3a4a40] font-medium">{c.rollNo}</p>
                  </td>
                  <td className="p-4 font-medium text-[#3a4a40]">
                    <p>{c.description}</p>
                    <p className="text-[10px] text-amber-700 font-bold">Venue: D.A.V. School, Ghotki</p>
                  </td>
                  <td className="p-4 font-extrabold text-[#0E4429]">
                    <p className="text-sm">₨ {c.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-[#3a4a40] font-normal">Due: {c.dueDate}</p>
                  </td>
                  <td className="p-4">
                    {c.status === 'paid' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                        <FaCheck size={10} /> Paid & Cleared
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
                        <FaTimes size={10} /> Unpaid
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleMarkPaid(c.id)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs ${
                          c.status === 'paid'
                            ? 'bg-amber-500/10 text-amber-800 hover:bg-amber-500/20'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {c.status === 'paid' ? 'Mark Unpaid' : 'Mark Received'}
                      </button>

                      <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 bg-gray-100 px-2 py-1.5 rounded-md" title="Issued challans cannot be deleted (Audit Trail Protected)">
                        <FaLock size={9} /> Retained
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="card w-full max-w-lg !p-6 space-y-4 bg-white border-2 border-[#147a4a]/30 shadow-2xl">
            <h2 className="text-xl font-black text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
              Issue Admission Fee Voucher
            </h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">
                  Student Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newChallan.studentName}
                  onChange={(e) => setNewChallan({ ...newChallan, studentName: e.target.value })}
                  placeholder="e.g. Muhammad Raza"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#DCE8DD] text-xs font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">
                  Roll / Registration No.
                </label>
                <input
                  type="text"
                  value={newChallan.rollNo}
                  onChange={(e) => setNewChallan({ ...newChallan, rollNo: e.target.value })}
                  placeholder="e.g. SEA-2026-104"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#DCE8DD] text-xs font-bold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">
                    Amount (PKR)
                  </label>
                  <input
                    type="number"
                    required
                    value={newChallan.amount}
                    onChange={(e) => setNewChallan({ ...newChallan, amount: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DCE8DD] text-xs font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="text"
                    required
                    value={newChallan.dueDate}
                    onChange={(e) => setNewChallan({ ...newChallan, dueDate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DCE8DD] text-xs font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#DCE8DD] text-xs font-bold text-[#3a4a40]"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-gold text-xs !py-2 !px-5 shadow-xs">
                  Issue Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
