import { useAuthStore } from '../../store/useAuthStore'
import { FaPrint, FaPhone, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'

export default function StudentChallan() {
  const { user } = useAuthStore()
  const student = user || {
    fullName: 'Student User',
    rollNo: 'STA-2026-894',
    class: 'XI',
    stream: 'Pre-Medical',
    isApproved: true,
  }

  const challanData = {
    challanNo: 'CH-2026-0814',
    feeType: 'One-Time Session 2026 Admission & Tuition Fee',
    issueDate: '01-08-2026',
    status: student.isApproved ? 'paid' : 'unpaid',
    admissionFee: 2000,
    sessionTuitionFee: 4000,
    totalAmount: 6000,
    bankName: 'Academy Office / Direct Cash Deposit',
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Top Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-black text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
            Admission Fee Challan
          </h1>
          <p className="text-xs text-[#3a4a40] mt-1 font-semibold">
            Official One-Time Admission Fee Voucher for Star Educational Academy, Ghotki.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="btn-gold text-xs shadow-md self-start sm:self-center"
        >
          <FaPrint size={14} />
          <span>Print Fee Voucher</span>
        </button>
      </div>

      {/* Official Voucher Card */}
      <div className="card !p-8 max-w-3xl mx-auto space-y-6 border-2 border-[#147a4a]/20 shadow-xl bg-white" id="challan-voucher">
        {/* Header Branding */}
        <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b-2 border-[#0E4429] gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Star Academy Logo" className="h-14 w-14 rounded-full border-2 border-gold" />
            <div>
              <h2 className="text-xl font-black text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
                STAR EDUCATIONAL ACADEMY
              </h2>
              <p className="text-xs font-extrabold text-[#b8893a] tracking-wider uppercase">
                D.A.V. High School, Ladies Bazaar, Ghotki
              </p>
              <p className="text-[11px] font-semibold text-[#3a4a40] flex items-center gap-2 justify-center sm:justify-start mt-0.5">
                <FaPhone size={10} className="text-[#147a4a]" /> 0308-3309704 • 0306-3004887
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className={`inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-black border ${
              challanData.status === 'paid'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}>
              {challanData.status === 'paid' ? <><FaCheckCircle /> PAID & ACTIVATED</> : <><FaExclamationCircle /> PENDING PAYMENT</>}
            </span>
            <p className="text-xs font-mono font-bold text-[#0E4429] mt-2">Challan #: {challanData.challanNo}</p>
          </div>
        </div>

        {/* Student & Bank Meta Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#F1ECE0] border border-[#DCE8DD] text-xs font-semibold">
          <div className="space-y-1">
            <p><strong className="text-[#0E4429]">Student Name:</strong> {student.fullName}</p>
            <p><strong className="text-[#0E4429]">Roll / Reg ID:</strong> {student.rollNo || 'STA-2026-REG'}</p>
            <p><strong className="text-[#0E4429]">Class & Track:</strong> Grade {student.class || 'XI'} ({student.stream || 'Pre-Medical'})</p>
          </div>
          <div className="space-y-1 sm:text-right">
            <p><strong className="text-[#0E4429]">Billing Type:</strong> {challanData.feeType}</p>
            <p><strong className="text-[#0E4429]">Issue Date:</strong> {challanData.issueDate}</p>
          </div>
        </div>

        {/* Fee Itemization Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0E4429] text-white">
                <th className="p-3 rounded-tl-xl font-bold">Sr #</th>
                <th className="p-3 font-bold">Fee Particulars</th>
                <th className="p-3 rounded-tr-xl font-bold text-right">Amount (PKR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE8DD]">
              <tr>
                <td className="p-3">1</td>
                <td className="p-3 font-semibold">One-Time Registration & Admission Fee</td>
                <td className="p-3 text-right font-mono font-bold">Rs. {challanData.admissionFee}</td>
              </tr>
              <tr>
                <td className="p-3">2</td>
                <td className="p-3 font-semibold">Session 2026 Complete Coaching & Online Portal Fee</td>
                <td className="p-3 text-right font-mono font-bold">Rs. {challanData.sessionTuitionFee}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-[#147a4a]/10 font-bold text-sm text-[#0E4429]">
                <td colSpan={2} className="p-3 text-right">Total One-Time Fee:</td>
                <td className="p-3 text-right font-mono text-base font-black text-[#0E4429]">
                  Rs. {challanData.totalAmount}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Instructions */}
        <div className="pt-4 border-t border-[#DCE8DD] text-[11px] text-[#3a4a40] space-y-1 font-medium">
          <p className="font-bold text-[#0E4429]">Payment Instructions:</p>
          <p>Please pay this one-time fee challan at Star Educational Academy Office (D.A.V. School, Ghotki).</p>
          <p>Once paid, the clerk or administrator will approve your account, enabling full login access to online tests and lectures.</p>
        </div>
      </div>
    </div>
  )
}
