'use client'

import React, { useState, useEffect } from 'react'
import AdminShell from '@/src/components/admin/AdminShell'
import {
  HelpCircle,
  Plus,
  Trash2,
  Edit3,
  Save,
  CheckCircle2,
  Search,
  RefreshCw,
  FolderOpen,
  Filter,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'
import Link from 'next/link'
import initialFaqsSeed from '@/src/data/faqs.json'

interface FaqItem {
  id: string
  category: string
  question: string
  answer: string
}

const CATEGORIES = [
  'Quality & Certifications',
  'OEM & Custom Manufacturing',
  'Orders & Shipping',
  'Warranty & Sterilization',
  'General & Payments',
]

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqsSeed as FaqItem[])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Edit / Add Modal state
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Load FAQs from API
  const loadFaqs = async () => {
    try {
      const res = await fetch('/api/faqs', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setFaqs(data)
        }
      }
    } catch (err) {
      console.error('Failed to load FAQs:', err)
    }
  }

  useEffect(() => {
    loadFaqs()
  }, [])

  // Save entire FAQ list to disk via API
  const handlePersistFaqs = async (updatedList: FaqItem[], successNotice?: string) => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedList),
      })
      if (res.ok) {
        setFaqs(updatedList)
        if (typeof window !== 'undefined') {
          localStorage.setItem('alpha_faqs_v1', JSON.stringify(updatedList))
          window.dispatchEvent(new Event('alpha_faqs_updated'))
        }
        showToast(successNotice || 'FAQs saved to disk! Live storefront updated across page refresh.')
      } else {
        showToast('Failed to save FAQs to disk.')
      }
    } catch (err) {
      console.error('Error saving FAQs:', err)
      showToast('Error connecting to /api/faqs')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddNew = () => {
    setEditingFaq({
      id: `faq-${Date.now()}`,
      category: selectedCategory === 'All' ? 'General & Payments' : selectedCategory,
      question: '',
      answer: '',
    })
    setIsModalOpen(true)
  }

  const handleEdit = (faq: FaqItem) => {
    setEditingFaq({ ...faq })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return
    const updated = faqs.filter((f) => f.id !== id)
    await handlePersistFaqs(updated, 'FAQ deleted successfully!')
  }

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingFaq || !editingFaq.question.trim() || !editingFaq.answer.trim()) {
      alert('Please fill out both Question and Answer.')
      return
    }

    const exists = faqs.some((f) => f.id === editingFaq.id)
    let updated: FaqItem[] = []
    if (exists) {
      updated = faqs.map((f) => (f.id === editingFaq.id ? editingFaq : f))
    } else {
      updated = [editingFaq, ...faqs]
    }

    await handlePersistFaqs(updated, 'FAQ saved successfully! Disk updated.')
    setIsModalOpen(false)
    setEditingFaq(null)
  }

  // Filtered
  const filtered = faqs.filter((f) => {
    const matchCat = selectedCategory === 'All' || f.category === selectedCategory
    const q = searchQuery.toLowerCase().trim()
    const matchSearch =
      !q ||
      f.question.toLowerCase().includes(q) ||
      f.answer.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  return (
    <AdminShell>
      <div className="w-full max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2500px] 4xl:max-w-[3200px] mx-auto space-y-6 sm:space-y-8 animate-fade-in font-sans">
        
        {/* TOAST */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-black tracking-widest text-[#B92025] uppercase">
                110% Dynamic FAQs Knowledgebase
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Manage Frequently Asked Questions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Add, edit, or delete questions. All changes are written directly to disk (<code>src/data/faqs.json</code>) and immediately reflect live on the public <Link href="/faq" target="_blank" className="text-[#B92025] font-bold underline inline-flex items-center gap-1">/faq storefront <ExternalLink className="w-3 h-3" /></Link>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadFaqs}
              className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-colors cursor-pointer"
              title="Reload from disk"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleAddNew}
              className="px-5 py-3 bg-[#B92025] hover:bg-[#96161B] text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New FAQ</span>
            </button>
          </div>
        </div>

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div
            onClick={() => setSelectedCategory('All')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="text-[10px] font-black uppercase tracking-wider opacity-70">All Topics</div>
            <div className="text-2xl font-black mt-1">{faqs.length}</div>
          </div>
          {CATEGORIES.map((cat) => {
            const count = faqs.filter((f) => f.category === cat).length
            const isSel = selectedCategory === cat
            return (
              <div
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSel
                    ? 'bg-[#B92025] text-white border-[#B92025] shadow-md'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-[9px] font-black uppercase tracking-wider truncate opacity-70">
                  {cat.split(' ')[0]}
                </div>
                <div className="text-2xl font-black mt-1">{count}</div>
              </div>
            )
          })}
        </div>

        {/* FILTER & SEARCH BAR */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search question, keyword, or answer..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B92025]/30 focus:border-[#B92025]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <span className="text-xs font-bold text-slate-400 shrink-0">Filter:</span>
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({faqs.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#B92025] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ CARDS LIST */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-3">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-600">No questions found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('All')
                }}
                className="text-xs font-bold text-[#B92025] underline cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm transition-all flex flex-col md:flex-row md:items-start justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-[#B92025] text-[10px] font-black uppercase tracking-wider border border-red-100">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">ID: {item.id}</span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 leading-snug">
                    {item.question}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed pt-1">
                    {item.answer}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-start pt-2 md:pt-0">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* MODAL: ADD / EDIT FAQ */}
        {isModalOpen && editingFaq && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-up">
              <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {faqs.some((f) => f.id === editingFaq.id) ? 'Edit Question' : 'Add New Question'}
                  </h3>
                  <p className="text-xs text-slate-500">Live preview & disk persistence</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/60"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveModal} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    Category Topic
                  </label>
                  <select
                    value={editingFaq.category}
                    onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#B92025]/30 focus:border-[#B92025]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    Question Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingFaq.question}
                    onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                    placeholder="e.g. Which surgical specialties do you support?"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#B92025]/30 focus:border-[#B92025]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    Detailed Answer / Description
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={editingFaq.answer}
                    onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                    placeholder="Enter comprehensive answer with specifications, policies, or procedures..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#B92025]/30 focus:border-[#B92025]"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-[#B92025] hover:bg-[#96161B] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Saving to Disk...' : 'Save & Publish Live'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminShell>
  )
}
