import { useState } from 'react'
import { FaReceipt, FaSearch, FaCheckCircle, FaTimesCircle, FaPrint, FaPhoneAlt, FaUserCheck } from 'react-icons/fa'

const sampleFeeRecords = [
  {
    id: 1,
    studentName: 'Sir Irshad Ahmed Ogahi',
    email: 'student@staracademy.edu.pk',
    phone: '0308-3309704',
    class: 'XI',
    stream: 'Pre-Medical',
    amount: 'Rs. 6,000',
    feeType: 'One-Time Admission Fee',
    status: 'Paid',
    paidDate: '2026-08-01',
  },
  {
    id: 2,
    studentName: 'Ali Raza Arain',
    email: 'ali.raza@gmail.com',
    phone: '0300-1234567',
    class: 'XI',
    stream: 'Pre-Engineering',
    amount: 'Rs. 6,000',
    feeType: 'One-Time Admission Fee',
    status: 'Paid',
    paidDate: '2026-08-02',
  },
  {
    id: 3,
    studentName: 'Muhammad Hamza',
    email: 'hamza.m@gmail.com',
    phone: '0312-9876543',
    class: 'XI',
    stream: 'Pre-Medical',
    amount: 'Rs. 6,000',
    feeType: 'One-Time Admission Fee',
    status: 'Unpaid',
    paidDate: null,
  },
  {
    id: 4,
    studentName: 'Sobia Malik',
    email: 'sobia.malik@gmail.com',
    phone: '0333-4567890',
    class: 'XII',
    stream: 'Pre-Engineering',
    amount: 'Rs. 6,000',
    feeType: 'One-Time Admission Fee',
    status: 'Unpaid',
    paidDate: null,
  },
]

export default function AdminFees() {
  const [feeRecords, setFeeRecords] = useState(sampleFeeRecords)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedVoucher, setSelectedVoucher] = useState(null)

  const filtered = feeRecords.filter((r) => {
    const matchesSearch = r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || r.phone.includes(searchTerm)
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const toggleFeeStatus = (id) => {
    setFeeRecords(
      feeRecords.map((r) => {
        if (r.id === id) {
          const newStatus = r.status === 'Paid' ? 'Unpaid' : 'Paid'
          const paidDate = newStatus === 'Paid' ? new Date().toISOString().split('T')[0] : null
          return { ...r, status: newStatus, paidDate }
        }
        return r
      })
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="badge badge-gold text-xs font-bold inline-flex items-center gap-1.5 px-3 py-1">
          <FaReceipt size={12} /> Fee & Admission Approval
        </span>
        <h1 className="text-3xl font-black text-emerald-dark mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
          One-Time Admission Fee Verification
        </h1>
        <p className="text-xs text-charcoal-light">Mark admission fees as paid to automatically approve student accounts for portal login.</p>
      </div>

      {/* Filter Bar */}
      <div className="card p-4! flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-light/60" size={14} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name or phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sage text-xs font-semibold focus:outline-none focus:border-emerald-primary"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl border border-sage text-xs font-bold text-emerald-dark focus:outline-none w-full sm:w-auto"
        >
          <option value="All">All Payment Statuses</option>
          <option value="Paid">Paid & Approved</option>
          <option value="Unpaid">Unpaid (Pending Approval)</option>
        </select>
      </div>

      {/* Fee Table */}
      <div className="card p-0! overflow-hidden border border-sage">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-emerald-deepest text-white text-xs font-extrabold uppercase tracking-wider">
                <th className="p-4">Student Info</th>
                <th className="p-4">Fee Structure</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Fee Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage text-xs font-semibold">
              {filtered.map((record) => (
                <tr key={record.id} className="hover:bg-cream-alt/40 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-sm text-emerald-dark">{record.studentName}</p>
                    <p className="text-[11px] text-charcoal-light flex items-center gap-1"><FaPhoneAlt size={10} className="text-emerald-primary" /> {record.phone}</p>
                  </td>
                  <td className="p-4">
                    <span className="font-extrabold text-emerald-dark">Grade {record.class} ({record.stream})</span>
                    <p className="text-[11px] text-charcoal-light">{record.feeType}</p>
                  </td>
                  <td className="p-4 font-extrabold text-emerald-primary text-sm">{record.amount}</td>
                  <td className="p-4">
                    {record.status === 'Paid' ? (
                      <span className="inline-flex items-center gap-1 font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full text-[11px]">
                        <FaCheckCircle size={10} /> Paid & Account Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-extrabold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full text-[11px]">
                        <FaTimesCircle size={10} /> Unpaid (Login Blocked)
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleFeeStatus(record.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                          record.status === 'Paid'
                            ? 'bg-amber-500/10 text-amber-800 hover:bg-amber-500/20'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                        }`}
                      >
                        <FaUserCheck size={11} />
                        {record.status === 'Paid' ? 'Mark Unpaid' : 'Mark Paid & Approve'}
                      </button>

                      <button
                        onClick={() => setSelectedVoucher(record)}
                        className="p-2 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 text-xs font-bold flex items-center gap-1"
                        title="Print Fee Voucher"
                      >
                        <FaPrint size={12} /> Voucher
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Voucher Preview Modal */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="card w-full max-w-lg p-6! space-y-5 bg-white border-2 border-gold">
            <div className="text-center border-b border-sage pb-4 space-y-1">
              <img src="/images/logo.png" alt="Star Logo" className="h-12 w-12 mx-auto rounded-full border-2 border-gold" />
              <h2 className="text-xl font-black text-emerald-dark" style={{ fontFamily: 'var(--font-heading)' }}>
                STAR EDUCATIONAL ACADEMY
              </h2>
              <p className="text-[10px] font-extrabold uppercase text-gold-dark">Official Admission Fee Voucher</p>
            </div>

            <div className="space-y-2 text-xs font-semibold">
              <div className="flex justify-between py-1 border-b border-sage/60">
                <span className="text-charcoal-light">Student Name:</span>
                <span className="font-bold text-emerald-dark">{selectedVoucher.studentName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sage/60">
                <span className="text-charcoal-light">Grade & Track:</span>
                <span className="font-bold text-emerald-dark">Grade {selectedVoucher.class} • {selectedVoucher.stream}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sage/60">
                <span className="text-charcoal-light">Billing Structure:</span>
                <span className="font-bold text-emerald-dark">{selectedVoucher.feeType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sage/60">
                <span className="text-charcoal-light">Total Amount:</span>
                <span className="font-extrabold text-emerald-primary text-sm">{selectedVoucher.amount}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sage/60">
                <span className="text-charcoal-light">Payment & Portal Status:</span>
                <span className={`font-bold ${selectedVoucher.status === 'Paid' ? 'text-emerald-700' : 'text-amber-800'}`}>
                  {selectedVoucher.status === 'Paid' ? 'Paid & Account Approved' : 'Unpaid (Pending Approval)'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setSelectedVoucher(null)} className="px-4 py-2 rounded-xl border border-sage text-xs font-bold text-charcoal-light">
                Close
              </button>
              <button onClick={() => window.print()} className="btn-gold text-xs py-2! px-4!">
                <FaPrint size={12} />
                <span>Print Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
