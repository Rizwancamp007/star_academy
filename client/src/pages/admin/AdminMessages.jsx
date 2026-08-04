import { useState, useEffect } from 'react'
import { FaEnvelope, FaSearch, FaCheckCircle, FaTrash, FaReply, FaRegEnvelopeOpen, FaPhone, FaUser } from 'react-icons/fa'
import messageService from '../../services/messageService'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedMsg, setSelectedMsg] = useState(null)
  const [notice, setNotice] = useState('')

  const fetchMessages = async () => {
    setLoading(true)
    const res = await messageService.getMessages()
    if (res && res.success) {
      setMessages(res.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleOpenMessage = async (msg) => {
    setSelectedMsg(msg)
    if (msg.status === 'unread') {
      await messageService.updateStatus(msg._id, 'read')
      setMessages(messages.map((m) => (m._id === msg._id ? { ...m, status: 'read' } : m)))
    }
  }

  const handleMarkReplied = async (id) => {
    const res = await messageService.updateStatus(id, 'replied')
    if (res && res.success) {
      setMessages(messages.map((m) => (m._id === id ? { ...m, status: 'replied' } : m)))
      if (selectedMsg && selectedMsg._id === id) {
        setSelectedMsg({ ...selectedMsg, status: 'replied' })
      }
      setNotice('Message marked as Replied.')
      setTimeout(() => setNotice(''), 4000)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this inquiry message from inbox?')) {
      const res = await messageService.deleteMessage(id)
      if (res && res.success) {
        setMessages(messages.filter((m) => m._id !== id))
        if (selectedMsg && selectedMsg._id === id) setSelectedMsg(null)
        setNotice('Message deleted.')
        setTimeout(() => setNotice(''), 4000)
      }
    }
  }

  const filtered = messages.filter((m) => {
    const matchesFilter = filter === 'all' ? true : m.status === filter
    const matchesSearch =
      (m.senderName || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.senderEmail || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.subject || '').toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="badge badge-gold text-xs font-bold inline-flex items-center gap-1.5 px-3 py-1">
            <FaEnvelope size={12} /> Contact Inquiries Inbox
          </span>
          <h1 className="text-3xl font-black text-[#0E4429] mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
            Admission & Visitor Messages
          </h1>
          <p className="text-xs text-[#3a4a40]">
            Review, manage, and respond to incoming inquiry messages submitted through the website Contact form.
          </p>
        </div>

        <div className="flex rounded-xl bg-[#F1ECE0] p-1 gap-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              filter === 'all' ? 'bg-[#0E4429] text-white shadow-xs' : 'text-[#3a4a40]'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              filter === 'unread' ? 'bg-amber-600 text-white shadow-xs' : 'text-[#3a4a40]'
            }`}
          >
            Unread ({messages.filter((m) => m.status === 'unread').length})
          </button>
          <button
            onClick={() => setFilter('replied')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              filter === 'replied' ? 'bg-[#0E4429] text-white shadow-xs' : 'text-[#3a4a40]'
            }`}
          >
            Replied
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-xs flex items-center gap-2">
          <FaCheckCircle size={14} className="text-emerald-700" />
          <span>{notice}</span>
        </div>
      )}

      {/* Search */}
      <div className="card !p-4">
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3a4a40]/60" size={14} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inquiries by sender name, email, or subject..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DCE8DD] text-xs font-semibold focus:outline-none focus:border-[#147a4a]"
          />
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-[#147a4a] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <div className="card !p-12 text-center space-y-3 border-2 border-dashed border-[#DCE8DD]">
          <FaRegEnvelopeOpen size={40} className="mx-auto text-[#147a4a]/40" />
          <h3 className="font-extrabold text-base text-[#0E4429]">No Messages Yet</h3>
          <p className="text-xs text-[#3a4a40] max-w-sm mx-auto">Messages submitted through the Contact form will appear here.</p>
        </div>
      ) : (
        /* Inbox Split View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-5 space-y-3">
            {filtered.map((msg) => (
              <div
                key={msg._id}
                onClick={() => handleOpenMessage(msg)}
                className={`card !p-5 cursor-pointer transition-all border-2 ${
                  selectedMsg?._id === msg._id
                    ? 'border-[#147a4a] bg-emerald-50/40 shadow-md'
                    : msg.status === 'unread'
                    ? 'border-amber-400 bg-amber-50/20'
                    : 'border-[#DCE8DD] hover:border-[#147a4a]/40 bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <FaUser className="text-[#147a4a]" size={12} />
                    <h3 className="font-extrabold text-sm text-[#0E4429]">{msg.senderName}</h3>
                  </div>
                  {msg.status === 'unread' ? (
                    <span className="badge badge-gold text-[9px] font-black uppercase">New Message</span>
                  ) : msg.status === 'replied' ? (
                    <span className="badge badge-emerald text-[9px] font-extrabold uppercase">Replied</span>
                  ) : (
                    <span className="text-[10px] text-[#3a4a40] font-semibold">Read</span>
                  )}
                </div>

                <p className="font-bold text-xs text-[#147a4a] truncate">{msg.subject}</p>
                <p className="text-xs text-[#3a4a40] line-clamp-2 mt-1">{msg.message}</p>
                <p className="text-[10px] text-gray-400 font-semibold text-right mt-2">
                  {new Date(msg.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Detail View */}
          <div className="lg:col-span-7">
            {selectedMsg ? (
              <div className="card !p-8 space-y-6 bg-white border-2 border-[#147a4a]/30 shadow-lg sticky top-28">
                <div className="flex items-start justify-between gap-4 border-b border-[#DCE8DD] pb-4">
                  <div>
                    <h2 className="text-xl font-black text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
                      {selectedMsg.subject}
                    </h2>
                    <p className="text-xs text-[#3a4a40] mt-1 font-semibold">
                      Received: {new Date(selectedMsg.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMarkReplied(selectedMsg._id)}
                      className="btn-gold text-xs !py-2 !px-3 shadow-xs flex items-center gap-1.5"
                    >
                      <FaReply size={12} />
                      <span>Mark Replied</span>
                    </button>
                    <button
                      onClick={() => handleDelete(selectedMsg._id)}
                      className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-bold"
                    >
                      <FaTrash size={13} />
                    </button>
                  </div>
                </div>

                {/* Sender Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#F1ECE0] text-xs font-semibold text-[#0E4429]">
                  <div>
                    <span className="text-[#3a4a40] block font-extrabold uppercase text-[10px]">Sender Name</span>
                    <span className="font-extrabold text-sm">{selectedMsg.senderName}</span>
                  </div>
                  <div>
                    <span className="text-[#3a4a40] block font-extrabold uppercase text-[10px]">Contact Email</span>
                    <a href={`mailto:${selectedMsg.senderEmail}`} className="font-bold text-[#147a4a] underline">
                      {selectedMsg.senderEmail}
                    </a>
                  </div>
                  <div>
                    <span className="text-[#3a4a40] block font-extrabold uppercase text-[10px]">Phone Number</span>
                    <span className="font-bold text-[#0E4429] flex items-center gap-1.5 mt-0.5">
                      <FaPhone size={11} className="text-[#147a4a]" /> {selectedMsg.senderPhone || 'Not provided'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#3a4a40] block font-extrabold uppercase text-[10px]">Status</span>
                    <span className="badge badge-gold font-extrabold capitalize mt-0.5">{selectedMsg.status}</span>
                  </div>
                </div>

                {/* Message Body */}
                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-extrabold text-[#0E4429] tracking-wider">Inquiry Body Message</h4>
                  <div className="p-5 rounded-2xl bg-[#FBF8F1] border border-[#DCE8DD] text-sm text-[#1C2620] leading-relaxed font-medium">
                    {selectedMsg.message}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card !p-12 text-center text-[#3a4a40] space-y-3 border-2 border-dashed border-[#DCE8DD]">
                <FaRegEnvelopeOpen size={40} className="mx-auto text-[#147a4a]/40" />
                <h3 className="font-extrabold text-base text-[#0E4429]">No Message Selected</h3>
                <p className="text-xs max-w-xs mx-auto">Click any inquiry message from the left list to read details.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
