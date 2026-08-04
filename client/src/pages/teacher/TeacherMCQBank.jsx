import { useState } from 'react'
import {
  FaQuestionCircle,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaFilePdf,
  FaFileUpload,
  FaLayerGroup,
  FaListUl,
  FaExchangeAlt,
  FaTrash,
} from 'react-icons/fa'
import DocMcqParserModal from '../../components/modals/DocMcqParserModal'
import McqReviewEditorModal from '../../components/modals/McqReviewEditorModal'
import api from '../../services/api'

const sampleMCQs = [
  {
    id: 1,
    questionText: 'What is the rate of change of displacement with respect to time?',
    options: ['Speed', 'Velocity', 'Acceleration', 'Force'],
    correctIndex: 1,
    subject: 'Physics',
    classLevel: 'XI',
    chapter: 'Kinematics',
    difficulty: 'medium',
    sourceDoc: 'Physics_Chapter2_Kinematics.pdf',
  },
  {
    id: 2,
    questionText: 'Which of the following elements has the highest electronegativity?',
    options: ['Chlorine', 'Fluorine', 'Oxygen', 'Nitrogen'],
    correctIndex: 1,
    subject: 'Chemistry',
    classLevel: 'XI',
    chapter: 'Periodic Table',
    difficulty: 'medium',
    sourceDoc: 'MDCAT_Chemistry_PastPaper_2025.docx',
  },
  {
    id: 3,
    questionText: 'Which cell organelle is known as the powerhouse of the cell?',
    options: ['Ribosome', 'Golgi Complex', 'Mitochondria', 'Endoplasmic Reticulum'],
    correctIndex: 2,
    subject: 'Biology',
    classLevel: 'XI',
    chapter: 'Cell Biology',
    difficulty: 'easy',
    sourceDoc: 'Biology_Cell_Biology_Test.pdf',
  },
  {
    id: 4,
    questionText: 'What is the derivative of sin(x) with respect to x?',
    options: ['-cos(x)', 'cos(x)', 'tan(x)', '-sin(x)'],
    correctIndex: 1,
    subject: 'Mathematics',
    classLevel: 'XII',
    chapter: 'Calculus',
    difficulty: 'medium',
    sourceDoc: 'Math_Calculus_Batch1.docx',
  },
]

export default function TeacherMCQBank() {
  const [mcqs, setMcqs] = useState(sampleMCQs)
  const [activeTab, setActiveTab] = useState('questions') // 'questions' or 'batches'
  const [searchTerm, setSearchTerm] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('All')
  const [classFilter, setClassFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 50

  // Modals state
  const [showParserModal, setShowParserModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [parsedData, setParsedData] = useState({ mcqs: [], filename: '', subject: 'Physics', classLevel: 'XI' })
  const [bannerMsg, setBannerMsg] = useState('')

  // Single Question Modal state
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    subject: 'Physics',
    classLevel: 'XI',
    chapter: '',
    difficulty: 'medium',
    sourceDoc: 'Manual Input',
  })

  // Filtering Questions
  const filtered = mcqs.filter((m) => {
    const matchesSearch = m.questionText.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = subjectFilter === 'All' || m.subject === subjectFilter
    const matchesClass = classFilter === 'All' || m.classLevel === classFilter
    return matchesSearch && matchesSubject && matchesClass
  })

  // Pagination (50 items per page limit)
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1
  const paginatedMCQs = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Batch Grouping by sourceDoc
  const documentBatches = Object.values(
    mcqs.reduce((acc, mcq) => {
      const docName = mcq.sourceDoc || 'Manual / Single Additions'
      if (!acc[docName]) {
        acc[docName] = {
          sourceDoc: docName,
          count: 0,
          subject: mcq.subject,
          classLevel: mcq.classLevel,
          items: [],
        }
      }
      acc[docName].count += 1
      acc[docName].items.push(mcq)
      return acc
    }, {})
  )

  const handleParsedSuccess = (extractedMcqs, filename, subj, grade) => {
    setParsedData({
      mcqs: extractedMcqs,
      filename: filename,
      subject: subj,
      classLevel: grade,
    })
    setShowReviewModal(true)
  }

  const handleBatchReviewComplete = (successNotice) => {
    // Add reviewed MCQs into current frontend list
    const newItems = parsedData.mcqs.map((q, idx) => ({
      id: Date.now() + idx,
      questionText: q.questionText,
      options: q.options,
      correctIndex: q.correctIndex,
      subject: q.subject || parsedData.subject,
      classLevel: q.class || parsedData.classLevel,
      chapter: q.chapter || 'General',
      difficulty: q.difficulty || 'medium',
      sourceDoc: parsedData.filename,
    }))

    setMcqs((prev) => [...newItems, ...prev])
    setBannerMsg(successNotice)
    setTimeout(() => setBannerMsg(''), 6000)
  }

  const handleDeleteBatch = async (sourceDoc) => {
    if (window.confirm(`Are you sure you want to delete ALL MCQs imported from "${sourceDoc}"?`)) {
      setMcqs((prev) => prev.filter((m) => m.sourceDoc !== sourceDoc))
      try {
        await api.delete(`/tests/batch-source-doc?sourceDoc=${encodeURIComponent(sourceDoc)}`)
      } catch (err) {
        console.warn('Backend batch delete fallback sync:', err)
      }
    }
  }

  const handleUpdateBatchSubject = (sourceDoc, newSubject) => {
    setMcqs((prev) =>
      prev.map((m) => (m.sourceDoc === sourceDoc ? { ...m, subject: newSubject } : m))
    )
  }

  const handleOpenCreate = () => {
    setEditingId(null)
    setFormData({
      questionText: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      subject: 'Physics',
      classLevel: 'XI',
      chapter: '',
      difficulty: 'medium',
      sourceDoc: 'Manual Addition',
    })
    setShowModal(true)
  }

  const handleOpenEdit = (mcq) => {
    setEditingId(mcq.id)
    setFormData({
      questionText: mcq.questionText,
      options: [...mcq.options],
      correctIndex: mcq.correctIndex,
      subject: mcq.subject,
      classLevel: mcq.classLevel,
      chapter: mcq.chapter,
      difficulty: mcq.difficulty,
      sourceDoc: mcq.sourceDoc || 'Manual Addition',
    })
    setShowModal(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!formData.questionText) return

    if (editingId) {
      setMcqs(mcqs.map((m) => (m.id === editingId ? { ...m, ...formData } : m)))
    } else {
      const newMcq = {
        id: Date.now(),
        ...formData,
      }
      setMcqs([newMcq, ...mcqs])
    }
    setShowModal(false)
  }

  const handleDelete = (id) => {
    setMcqs(mcqs.filter((m) => m.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="badge badge-gold text-xs font-bold inline-flex items-center gap-1.5 px-3 py-1">
            <FaQuestionCircle size={12} /> MCQ Bank Manager
          </span>
          <h1 className="text-3xl font-black text-[#0E4429] mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
            Central Question Bank
          </h1>
          <p className="text-xs text-[#3a4a40]">
            Manage questions by subject or bulk import & review from uploaded PDF/Word test papers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowParserModal(true)}
            className="btn-gold text-xs !py-3 !px-4 shadow-sm flex items-center gap-2"
          >
            <FaFileUpload size={13} />
            <span>Upload PDF / Word Doc</span>
          </button>

          <button onClick={handleOpenCreate} className="btn-primary text-xs !py-3 !px-4 shadow-sm">
            <FaPlus size={12} />
            <span>Add Single Question</span>
          </button>
        </div>
      </div>

      {bannerMsg && (
        <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-xs flex items-center gap-2">
          <FaCheck size={14} className="text-emerald-700" />
          <span>{bannerMsg}</span>
        </div>
      )}

      {/* Main View Tabs (Questions View vs Document Batch View) */}
      <div className="flex rounded-xl bg-[#F1ECE0] p-1 gap-1 w-full max-w-md">
        <button
          onClick={() => setActiveTab('questions')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'questions' ? 'bg-[#0E4429] text-white shadow-xs' : 'text-[#3a4a40]'
          }`}
        >
          <FaListUl size={12} /> All Questions ({mcqs.length})
        </button>
        <button
          onClick={() => setActiveTab('batches')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'batches' ? 'bg-[#0E4429] text-white shadow-xs' : 'text-[#3a4a40]'
          }`}
        >
          <FaLayerGroup size={12} /> View by Source File ({documentBatches.length})
        </button>
      </div>

      {activeTab === 'questions' ? (
        <>
          {/* Filter Bar */}
          <div className="card !p-4 flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3a4a40]/60" size={14} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search questions by statement or keyword..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DCE8DD] text-xs font-semibold focus:outline-none focus:border-[#147a4a]"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-[#DCE8DD] text-xs font-bold text-[#0E4429] focus:outline-none"
              >
                <option value="All">All Subjects</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Mathematics">Mathematics</option>
                <option value="English">English</option>
              </select>

              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-[#DCE8DD] text-xs font-bold text-[#0E4429] focus:outline-none"
              >
                <option value="All">All Grades</option>
                <option value="IX">Grade IX</option>
                <option value="X">Grade X</option>
                <option value="XI">Grade XI</option>
                <option value="XII">Grade XII</option>
                <option value="MDCAT">MDCAT</option>
                <option value="ECAT">ECAT</option>
              </select>
            </div>
          </div>

          {/* MCQ Table / Card List */}
          <div className="space-y-4">
            {paginatedMCQs.map((mcq, idx) => (
              <div key={mcq.id} className="card !p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCE8DD] pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black text-[#147a4a]">#{(currentPage - 1) * itemsPerPage + idx + 1}</span>
                    <span className="badge badge-emerald text-[10px] font-extrabold">{mcq.subject} • Grade {mcq.classLevel}</span>
                    <span className="text-xs text-[#3a4a40] font-medium">{mcq.chapter}</span>
                    {mcq.sourceDoc && (
                      <span className="text-[10px] font-bold text-[#b8893a] bg-[#F1ECE0] px-2 py-0.5 rounded-md border border-[#DCE8DD]">
                        Source: {mcq.sourceDoc}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleOpenEdit(mcq)}
                      className="p-2 rounded-lg bg-[#147a4a]/10 text-[#147a4a] hover:bg-[#147a4a]/20 text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <FaEdit size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(mcq.id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 text-xs font-bold transition-colors"
                    >
                      <FaTrashAlt size={12} />
                    </button>
                  </div>
                </div>

                <p className="font-bold text-base text-[#0E4429]">{mcq.questionText}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {mcq.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between border ${
                        oIdx === mcq.correctIndex
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold'
                          : 'bg-[#F1ECE0]/50 border-[#DCE8DD] text-[#1C2620]'
                      }`}
                    >
                      <span>
                        <strong className="mr-2">{String.fromCharCode(65 + oIdx)}.</strong> {opt}
                      </span>
                      {oIdx === mcq.correctIndex && <FaCheck className="text-emerald-600" size={12} />}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between card !p-4">
            <p className="text-xs font-semibold text-[#3a4a40]">
              Showing {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} MCQs
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-2 rounded-lg border border-[#DCE8DD] disabled:opacity-40 text-xs font-bold"
              >
                <FaChevronLeft size={12} />
              </button>
              <span className="text-xs font-bold text-[#0E4429] px-2">Page {currentPage} of {totalPages}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-2 rounded-lg border border-[#DCE8DD] disabled:opacity-40 text-xs font-bold"
              >
                <FaChevronRight size={12} />
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Source File / Batch Management Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documentBatches.map((batch, index) => (
            <div key={index} className="card !p-6 space-y-4 border-2 border-[#147a4a]/20 shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold flex-shrink-0">
                    <FaFilePdf size={22} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#0E4429]">{batch.sourceDoc}</h3>
                    <span className="badge badge-emerald text-[10px] font-extrabold mt-1">
                      {batch.count} Questions Extracted
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteBatch(batch.sourceDoc)}
                  className="p-2.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-extrabold flex items-center gap-1.5 border border-red-200"
                  title="Bulk Delete All MCQs from this Document"
                >
                  <FaTrash size={12} />
                  <span>Remove File</span>
                </button>
              </div>

              {/* Batch Edit Controls */}
              <div className="p-3.5 rounded-xl bg-[#F1ECE0]/60 border border-[#DCE8DD] flex items-center justify-between gap-3 text-xs">
                <span className="font-bold text-[#0E4429] flex items-center gap-1.5">
                  <FaExchangeAlt size={12} className="text-[#147a4a]" /> Batch Subject:
                </span>

                <select
                  value={batch.subject}
                  onChange={(e) => handleUpdateBatchSubject(batch.sourceDoc, e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-[#DCE8DD] font-bold text-[#0E4429] focus:outline-none bg-white"
                >
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="English">English</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Parser Modal */}
      <DocMcqParserModal
        isOpen={showParserModal}
        onClose={() => setShowParserModal(false)}
        onParsedSuccess={handleParsedSuccess}
      />

      {/* Review Editor Modal */}
      <McqReviewEditorModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        mcqs={parsedData.mcqs}
        sourceDoc={parsedData.filename}
        subject={parsedData.subject}
        classLevel={parsedData.classLevel}
        onCompleteSuccess={handleBatchReviewComplete}
      />

      {/* Create / Edit Single Question Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="card w-full max-w-2xl !p-6 sm:!p-8 space-y-5 bg-white max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#0E4429]" style={{ fontFamily: 'var(--font-heading)' }}>
              {editingId ? 'Edit Question' : 'Create New MCQ'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Question Statement</label>
                <textarea
                  required
                  rows={3}
                  value={formData.questionText}
                  onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  placeholder="Enter MCQ statement..."
                  className="w-full px-4 py-3 rounded-xl border border-[#DCE8DD] text-sm focus:outline-none focus:border-[#147a4a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429] mb-1.5">Grade Level</label>
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
              </div>

              {/* Options */}
              <div className="space-y-3">
                <label className="block text-xs uppercase tracking-wider font-extrabold text-[#0E4429]">Multiple Choice Options</label>
                {formData.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-3">
                    <span className="w-6 text-xs font-extrabold text-[#0E4429]">{String.fromCharCode(65 + oIdx)}.</span>
                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...formData.options]
                        newOpts[oIdx] = e.target.value
                        setFormData({ ...formData, options: newOpts })
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-[#DCE8DD] text-sm focus:outline-none focus:border-[#147a4a]"
                    />
                    <label className="flex items-center gap-1 text-xs font-bold text-[#147a4a] cursor-pointer">
                      <input
                        type="radio"
                        name="correctIndex"
                        checked={formData.correctIndex === oIdx}
                        onChange={() => setFormData({ ...formData, correctIndex: oIdx })}
                      />
                      <span>Correct</span>
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-xl border border-[#DCE8DD] text-xs font-bold text-[#3a4a40]">
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs !py-2.5 !px-5">
                  <FaCheck size={12} />
                  <span>Save Question</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
