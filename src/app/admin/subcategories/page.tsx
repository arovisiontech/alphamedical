'use client'

import React, { useState, useEffect } from 'react'
import AdminShell from '@/src/components/admin/AdminShell'
import {
  Sliders,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Save,
  X,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'
import {
  getStoredCategories,
  saveStoredCategories,
  INITIAL_CATEGORIES_SEED,
} from '@/src/lib/dataStore'
import { CategoryItem } from '@/src/types/category'

export default function AdminSubcategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES_SEED)
  const [selectedParentId, setSelectedParentId] = useState<string>('all')
  const [showModal, setShowModal] = useState(false)
  const [editingSub, setEditingSub] = useState<CategoryItem | null>(null)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  // Form states
  const [name, setName] = useState('')
  const [parentId, setParentId] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [sortOrder, setSortOrder] = useState(1)

  const loadData = () => {
    const cats = getStoredCategories()
    setCategories(cats)
    if (!parentId && cats.length > 0) {
      setParentId(cats[0].id)
    }
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('alpha_content_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('alpha_content_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  const handleSaveAll = () => {
    saveStoredCategories(categories)
    setSuccessToast('All subcategories & hierarchies saved and live on website!')
    setTimeout(() => setSuccessToast(null), 3500)
  }

  const parentCategories = categories.filter((c) => !c.parent_id || c.level === 0)
  const subcategories = categories.filter((c) => Boolean(c.parent_id))

  const filteredSubs = subcategories.filter(
    (s) => selectedParentId === 'all' || s.parent_id === selectedParentId
  )

  const handleOpenAdd = () => {
    setEditingSub(null)
    setName('')
    setSlug('')
    setDescription('')
    setSortOrder(subcategories.length + 1)
    if (parentCategories.length > 0) {
      setParentId(parentCategories[0].id)
    }
    setShowModal(true)
  }

  const handleOpenEdit = (sub: CategoryItem) => {
    setEditingSub(sub)
    setName(sub.name)
    setParentId(sub.parent_id || (parentCategories[0]?.id ?? ''))
    setSlug(sub.slug)
    setDescription(sub.description || '')
    setSortOrder(sub.sort_order)
    setShowModal(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this subcategory?')) {
      const updated = categories.filter((c) => c.id !== id)
      saveStoredCategories(updated)
      setCategories(updated)
      setSuccessToast('Subcategory deleted successfully!')
      setTimeout(() => setSuccessToast(null), 3000)
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      alert('Please enter a subcategory name')
      return
    }

    const generatedSlug = slug.trim()
      ? slug.trim().toLowerCase().replace(/\s+/g, '-')
      : name.trim().toLowerCase().replace(/\s+/g, '-')

    const now = new Date().toISOString()

    if (editingSub) {
      const updated = categories.map((c) =>
        c.id === editingSub.id
          ? {
              ...c,
              name,
              parent_id: parentId,
              slug: generatedSlug,
              description,
              sort_order: sortOrder,
              updated_at: now,
              level: 1,
            }
          : c
      )
      saveStoredCategories(updated)
      setCategories(updated)
      setSuccessToast('Subcategory updated successfully!')
    } else {
      const newSub: CategoryItem = {
        id: `sub-${Date.now()}`,
        parent_id: parentId,
        name,
        slug: generatedSlug,
        description,
        sort_order: sortOrder,
        is_published: true,
        created_at: now,
        updated_at: now,
        level: 1,
        product_count: 15,
      }
      const updated = [...categories, newSub]
      saveStoredCategories(updated)
      setCategories(updated)
      setSuccessToast('New subcategory created successfully!')
    }

    setShowModal(false)
    setTimeout(() => setSuccessToast(null), 3000)
  }

  return (
    <AdminShell>
      <div className="space-y-6 animate-fade-in max-w-7xl font-sans">
        
        {/* HEADER BANNER */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#96161B]">
                Division Hierarchies & Lines
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Subcategories Manager
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Manage specialized procedure lines (Dental Surgery, Bone Surgery, Periodontics, Rongeurs, etc.).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSaveAll}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl flex items-center gap-2 shadow-md shadow-emerald-950/20 active:scale-95 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save All & Publish Live</span>
            </button>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="bg-[#96161B] hover:bg-[#7e1216] text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-red-950/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Subcategory</span>
            </button>
          </div>
        </div>

        {/* SUCCESS TOAST */}
        {successToast && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-3 shadow-sm animate-scale-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-bold">{successToast}</span>
          </div>
        )}

        {/* PARENT DIVISION FILTER BAR */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <Layers className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Filter by Parent Division:
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setSelectedParentId('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedParentId === 'all'
                  ? 'bg-[#96161B] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All ({subcategories.length})
            </button>
            {parentCategories.map((p) => {
              const count = subcategories.filter((s) => s.parent_id === p.id).length
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedParentId(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedParentId === p.id
                      ? 'bg-[#96161B] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {p.name} ({count})
                </button>
              )
            })}
          </div>
        </div>

        {/* SUBCATEGORIES TABLE / CARDS */}
        {filteredSubs.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#96161B] flex items-center justify-center mx-auto">
              <Sliders className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">No Subcategories Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Create sub-division mappings like Bone Rongeurs, Dissecting Scissors, or Extraction Forceps under your primary medical divisions.
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="bg-[#96161B] hover:bg-[#7e1216] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow cursor-pointer"
            >
              Add First Subcategory
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSubs.map((sub) => {
              const parent = parentCategories.find((p) => p.id === sub.parent_id)

              return (
                <div
                  key={sub.id}
                  className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#96161B] uppercase tracking-wider bg-red-50 px-2.5 py-0.5 rounded-md border border-red-100">
                        {parent?.name || 'Primary Division'}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">Order: {sub.sort_order}</span>
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                      {sub.name}
                    </h3>
                    <div className="text-[11px] font-mono text-slate-400">
                      /products?query={sub.slug}
                    </div>

                    {sub.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {sub.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600">● Live on Store</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(sub)}
                        className="p-2 rounded-xl text-slate-600 hover:text-[#96161B] hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Edit Subcategory"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(sub.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Subcategory"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* MODAL FOR ADD / EDIT */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm animate-fade-in flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
              <div className="bg-[#96161B] text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-5 h-5 text-white" />
                  <h3 className="font-extrabold text-base">
                    {editingSub ? 'Edit Subcategory' : 'Add New Subcategory'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Parent Category Division *
                  </label>
                  <select
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-[#96161B] bg-white cursor-pointer font-bold"
                  >
                    {parentCategories.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Subcategory Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Bone Rongeurs / Dental Surgery / Scissors"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-[#96161B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. bone-rongeurs"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-[#96161B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Precision surgical instruments designed for bone and tissue excision..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-[#96161B] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Display Sort Order
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-[#96161B]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#96161B] hover:bg-[#7e1216] text-white font-black text-xs px-6 py-2.5 rounded-xl shadow cursor-pointer active:scale-95 transition-all"
                  >
                    Save Subcategory
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
