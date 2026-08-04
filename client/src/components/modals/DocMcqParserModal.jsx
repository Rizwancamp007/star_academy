import { useState } from 'react'
import { FaFileUpload, FaFilePdf, FaFileWord, FaPaste, FaMagic, FaTimes, FaSpinner } from 'react-icons/fa'
import api from '../../services/api'

export default function DocMcqParserModal({ isOpen, onClose, onParsedSuccess }) {
  const [activeTab, setActiveTab] = useState('file') // 'file' or 'paste'
  const [selectedFile, setSelectedFile] = useState(null)
  const [pastedText, setPastedText] = useState('')
  const [subject, setSubject] = useState('Physics')
  const [classLevel, setClassLevel] = useState('XI')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  if (!isOpen) return null

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setErrorMsg('')
    }
  }

  const handleParseSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      if (activeTab === 'file') {
        if (!selectedFile) {
          setErrorMsg('Please select a PDF or Word document file first.')
          setLoading(false)
          return
        }

        const formData = new FormData()
        formData.append('file', selectedFile)
        formData.append('subject', subject)
        formData.append('classLevel', classLevel)
        formData.append('filename', selectedFile.name)

        const response = await api.post('/tests/parse-doc', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        if (response.data.success) {
          onParsedSuccess(response.data.mcqs, response.data.filename, subject, classLevel)
          onClose()
        }
      } else {
        if (!pastedText.trim()) {
          setErrorMsg('Please paste study text or question content.')
          setLoading(false)
          return
        }

        const response = await api.post('/tests/parse-doc', {
          rawText: pastedText,
          filename: 'Pasted_Text_Import',
          subject,
          classLevel,
        })

        if (response.data.success) {
          onParsedSuccess(response.data.mcqs, 'Pasted_Text_Import', subject, classLevel)
          onClose()
        }
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to parse document. Please check the file format.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="card w-full max-w-xl !p-6 space-y-5 bg-white border-2 border-[#147a4a]/30 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#DCE8DD] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#147a4a]/10 text-[#147a4a] flex items-center justify-center font-bold">
              <FaMagic size={18} />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
                Auto PDF / Word to MCQs Parser
              </h2>
              <p className="text-xs text-[#3a4a40] font-medium">
                Upload test paper document to automatically extract MCQs for review & banking.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-[#3a4a40] hover:bg-[#F1ECE0]">
            <FaTimes size={16} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-[#F1ECE0] p-1 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'file' ? 'bg-[#147a4a] text-white shadow-xs' : 'text-[#3a4a40]'
            }`}
          >
            <FaFileUpload size={12} /> Upload PDF / Word
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'paste' ? 'bg-[#147a4a] text-white shadow-xs' : 'text-[#3a4a40]'
            }`}
          >
            <FaPaste size={12} /> Paste Raw Text
          </button>
        </div>

        <form onSubmit={handleParseSubmit} className="space-y-4">
          {/* Metadata Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">
                Target Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#DCE8DD] text-xs font-bold text-[#0E4429] focus:outline-none"
              >
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Mathematics">Mathematics</option>
                <option value="English">English</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">
                Grade / Track Level
              </label>
              <select
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#DCE8DD] text-xs font-bold text-[#0E4429] focus:outline-none"
              >
                <option value="IX">Grade IX</option>
                <option value="X">Grade X</option>
                <option value="XI">Grade XI</option>
                <option value="XII">Grade XII</option>
                <option value="MDCAT">MDCAT Track</option>
                <option value="ECAT">ECAT Track</option>
              </select>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'file' ? (
            <div className="border-2 border-dashed border-[#147a4a]/40 rounded-2xl p-6 text-center space-y-3 bg-[#F1ECE0]/40">
              <div className="flex justify-center gap-3 text-2xl text-[#147a4a]">
                <FaFilePdf />
                <FaFileWord />
              </div>
              <p className="text-xs font-extrabold text-[#0E4429]">
                Choose or drag & drop `.pdf` or `.docx` test paper
              </p>
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
                className="hidden"
                id="doc-file-upload"
              />
              <label
                htmlFor="doc-file-upload"
                className="btn-gold text-xs !py-2 !px-4 inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <FaFileUpload size={12} />
                <span>{selectedFile ? selectedFile.name : 'Select File'}</span>
              </label>
            </div>
          ) : (
            <div>
              <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">
                Paste Question Content
              </label>
              <textarea
                rows={5}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste question text here (e.g. 1. What is acceleration? A) Speed B) Change of velocity...)"
                className="w-full px-4 py-3 rounded-xl border border-[#DCE8DD] text-xs font-semibold focus:outline-none"
              />
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl text-xs font-bold text-center bg-red-50 text-red-700 border border-red-200">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#DCE8DD] text-xs font-bold text-[#3a4a40]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary text-xs !py-2.5 !px-5 shadow-md flex items-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" size={12} />
                  <span>Parsing Document...</span>
                </>
              ) : (
                <>
                  <FaMagic size={12} />
                  <span>Extract & Review MCQs</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
