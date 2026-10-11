'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AdminShell from '@/src/components/admin/AdminShell'
import {
  Layers,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Upload,
  Save,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Eye,
  Check,
} from 'lucide-react'
import {
  getStoredCategories,
  saveStoredCategories,
  INITIAL_CATEGORIES_SEED,
} from '@/src/lib/dataStore'
import { CategoryItem } from '@/src/types/category'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES_SEED)
  const [isLoaded, setIsLoaded] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  // Form states
  const [formName, setFormName] = useState('')
  const [formSlug, setFormSlug] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formCardImage, setFormCardImage] = useState('/images/categories/image_376.png')
  const [formIcon, setFormIcon] = useState('✂️')
  const [formProductCount, setFormProductCount] = useState(42)
  const [formSortOrder, setFormSortOrder] = useState(1)
  const [formIsPublished, setFormIsPublished] = useState(true)

  // Preset Card Images (Image 376, 377, 378, 379)
  const PRESET_CARDS = [
    {
      name: 'Card 376: General Surgery Instruments',
      url: '/images/categories/image_376.png',
      defaultIcon: '✂️',
      defaultTitle: 'SET BY PROCEDURE',
    },
    {
      name: 'Card 377: Orthopedic & Bone Surgery',
      url: '/images/categories/image_377.png',
      defaultIcon: '🦴',
      defaultTitle: 'ORTHOPEDIC INSTRUMENTS',
    },
    {
      name: 'Card 378: Titanium Instruments (22 Ti)',
      url: '/images/categories/image_378.png',
      defaultIcon: 'Ti',
      defaultTitle: 'TITANIUM INSTRUMENTS',
    },
    {
      name: 'Card 379: Neuro & Spine Instruments',
      url: '/images/categories/image_379.png',
      defaultIcon: '🧠',
      defaultTitle: 'NEURO & SPINE INSTRUMENTS',
    },
    {
      name: 'Medical Equipment & ICU Solutions',
      url: '/images/extracted/image_7.png',
      defaultIcon: '🩺',
      defaultTitle: 'MEDICAL EQUIPMENT',
    },
    {
      name: 'Hospital Ward Furniture',
      url: '/images/extracted/image_9.png',
      defaultIcon: '🛏️',
      defaultTitle: 'HOSPITAL FURNITURE',
    },
  ]

  // Load categories from persistent storage
  useEffect(() => {
    const data = getStoredCategories()
    setCategories(data)
    setIsLoaded(true)
  }, [])

  const showNotification = (msg: string) => {
    setSuccessToast(msg)
    setTimeout(() => {
      setSuccessToast(null)
    }, 4000)
  }

  // Open modal for Adding new category
  const handleOpenAdd = () => {
    setEditingCategory(null)
    setFormName('New Surgical Discipline')
    setFormSlug('new-surgical-discipline')
    setFormDescription('High-precision German stainless steel clinical instruments.')
    setFormCardImage('/images/categories/image_376.png')
    setFormIcon('✂️')
    setFormProductCount(35)
    setFormSortOrder(categories.length + 1)
    setFormIsPublished(true)
    setShowModal(true)
  }

  // Open modal for Editing existing category
  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat)
    setFormName(cat.name)
    setFormSlug(cat.slug)
    setFormDescription(cat.description || '')
    setFormCardImage(cat.card_image || cat.image_url || '/images/categories/image_376.png')
    setFormIcon(cat.icon || '✂️')
    setFormProductCount(cat.product_count || 30)
    setFormSortOrder(cat.sort_order || 1)
    setFormIsPublished(cat.is_published)
    setShowModal(true)
  }

  // Image upload via FileReader
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormCardImage(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  // Auto-generate slug from name
  const handleNameChange = (val: string) => {
    setFormName(val)
    if (!editingCategory) {
      setFormSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
      )
    }
  }

  // Save category (Add or Edit) with 100% reload-safe persistence
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formName.trim()) {
      alert('Please enter a category name')
      return
    }

    let updatedList: CategoryItem[] = []

    if (editingCategory) {
      updatedList = categories.map((c) =>
        c.id === editingCategory.id
          ? {
              ...c,
              name: formName,
              slug: formSlug || formName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              description: formDescription,
              card_image: formCardImage,
              image_url: formCardImage,
              icon: formIcon,
              product_count: formProductCount,
              sort_order: formSortOrder,
              is_published: formIsPublished,
              updated_at: new Date().toISOString(),
            }
          : c
      )
    } else {
      const newCat: CategoryItem = {
        id: `cat-${Date.now()}`,
        parent_id: null,
        name: formName,
        slug: formSlug || formName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: formDescription,
        card_image: formCardImage,
        image_url: formCardImage,
        icon: formIcon,
        product_count: formProductCount,
        sort_order: formSortOrder,
        is_published: formIsPublished,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      updatedList = [...categories, newCat]
    }

    // Sort by order
    updatedList.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))

    setCategories(updatedList)
    saveStoredCategories(updatedList)
    setShowModal(false)
    showNotification('✓ Category saved & live on website (persists on reload)!')
  }

  // Delete category
  const handleDeleteCategory = (id: string) => {
    if (categories.length <= 1) {
      if (!confirm('This is the only category. Are you sure you want to delete it?')) return
    } else {
      if (!confirm('Are you sure you want to delete this category?')) return
    }

    const updated = categories.filter((c) => c.id !== id)
    setCategories(updated)
    saveStoredCategories(updated)
    showNotification('✓ Category deleted & live on website!')
  }

  // Toggle active/published
  const handleTogglePublished = (id: string) => {
    const updated = categories.map((c) =>
      c.id === id ? { ...c, is_published: !c.is_published } : c
    )
    setCategories(updated)
    saveStoredCategories(updated)
    showNotification('✓ Category visibility updated live on website!')
  }

  // Reorder Left / Right
  const handleMoveOrder = (index: number, direction: 'prev' | 'next') => {
    if (direction === 'prev' && index === 0) return
    if (direction === 'next' && index === categories.length - 1) return

    const newIndex = direction === 'prev' ? index - 1 : index + 1
    const updated = [...categories]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp

    updated.forEach((c, idx) => {
      c.sort_order = idx + 1
    })

    setCategories(updated)
    saveStoredCategories(updated)
    showNotification('✓ Category position updated!')
  }

  // Reset to default cards (Image 376, 377, 378, 379)
  const handleResetToDefault = () => {
    if (confirm('Reset to default cards (Cards 376, 377, 378, 379)?')) {
      setCategories(INITIAL_CATEGORIES_SEED)
      saveStoredCategories(INITIAL_CATEGORIES_SEED)
      showNotification('✓ Categories reset to default cards 376, 377, 378, 379!')
    }
  }

  const activeCategories = categories.filter((c) => c.is_published)

  return (
    <AdminShell>
      <div className="space-y-8 animate-fade-in pb-16">
        {/* SUCCESS NOTIFICATION TOAST */}
        {successToast && (
          <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
        )}

        {/* HEADER SECTION */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#B92025] uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#B92025]" />
              <span>ALPHA Categories Collection Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18355E]">
              Homepage Category Cards & Slider
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl">
              100% Dynamic management of category cards (Images 376, 377, 378, 379). Any edit, add, or delete persists across page refreshes and updates live on the storefront.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleResetToDefault}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-3 rounded-xl transition-all"
              title="Reset to default Cards 376-379"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Cards 376-379</span>
            </button>

            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 bg-[#B92025] hover:bg-[#96161B] text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Category</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold px-4 py-3 rounded-xl transition-all shadow"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Storefront</span>
            </Link>
          </div>
        </div>

        {/* LIVE STOREFRONT CARDS SLIDER PREVIEW */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h2 className="text-sm font-bold tracking-wide uppercase text-slate-200">
                Live Storefront Category Slider Preview
              </h2>
            </div>
            <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800 px-3 py-1 rounded-full">
              ● Live on Homepage ({activeCategories.length} Active Cards)
            </span>
          </div>

          {/* PREVIEW CAROUSEL OF CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 overflow-x-auto pb-2">
            {activeCategories.map((cat, idx) => (
              <div
                key={cat.id || idx}
                className="relative rounded-2xl overflow-hidden aspect-[442/536] bg-slate-800 border border-slate-700 shadow-lg group shrink-0"
              >
                <Image
                  src={cat.card_image || cat.image_url || '/images/categories/image_376.png'}
                  alt={cat.name}
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-center">
                  <span className="text-[11px] font-black text-white uppercase block line-clamp-1">
                    {cat.name}
                  </span>
                  <span className="text-[9px] text-red-200 font-semibold block">
                    {cat.product_count || 30}+ Products
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CATEGORY CARDS GRID MANAGEMENT */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#18355E]">
              Configured Categories ({categories.length})
            </h3>
            <span className="text-xs text-slate-500">
              Drag or use Left/Right arrows to reorder • Changes auto-saved
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((cat, index) => (
              <div
                key={cat.id}
                className={`bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${
                  cat.is_published ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
                }`}
              >
                {/* CARD PREVIEW TOP (442x536 Aspect Ratio) */}
                <div className="relative aspect-[442/536] w-full bg-slate-100 overflow-hidden border-b border-slate-100">
                  <Image
                    src={cat.card_image || cat.image_url || '/images/categories/image_376.png'}
                    alt={cat.name}
                    fill
                    className="object-cover object-top"
                  />

                  {/* BADGES */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                        cat.is_published
                          ? 'bg-emerald-600 text-white shadow'
                          : 'bg-slate-500 text-white shadow'
                      }`}
                    >
                      {cat.is_published ? 'Active' : 'Disabled'}
                    </span>
                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-black w-8 h-8 rounded-full flex items-center justify-center border border-slate-200 shadow">
                    {cat.icon || '✂️'}
                  </div>

                  {/* BOTTOM ARCH OVERLAY TEXT */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-center">
                    <h4 className="text-sm font-black text-white uppercase tracking-wider line-clamp-1 drop-shadow">
                      {cat.name}
                    </h4>
                    <p className="text-[10px] text-red-200 font-semibold">
                      {cat.product_count || 30}+ Products Available
                    </p>
                  </div>
                </div>

                {/* DETAILS & ACTIONS */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {cat.description || 'Precision surgical instruments manufactured to ISO 13485 standards.'}
                    </p>
                    <div className="pt-1 text-[11px] font-mono text-slate-400">
                      Slug: /{cat.slug}
                    </div>
                  </div>

                  {/* CONTROLS */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {/* REORDER BUTTONS */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveOrder(index, 'prev')}
                        disabled={index === 0}
                        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
                        title="Move Left in Slider"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveOrder(index, 'next')}
                        disabled={index === categories.length - 1}
                        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
                        title="Move Right in Slider"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* STATUS, EDIT & DELETE */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTogglePublished(cat.id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                          cat.is_published
                            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {cat.is_published ? 'Disable' : 'Enable'}
                      </button>

                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#18355E] flex items-center justify-center transition-colors"
                        title="Edit Category"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-[#B92025] flex items-center justify-center transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ADD / EDIT CATEGORY MODAL */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-scale-up my-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-black text-[#18355E]">
                    {editingCategory ? 'Edit Category Card' : 'Add New Category Card'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Changes save to persistent storage and reflect live on the homepage category section.
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-5">
                {/* NAME & SLUG */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Category Name *</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g. ORTHOPEDIC INSTRUMENTS"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 outline-none focus:border-[#B92025]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Category Slug *</label>
                    <input
                      type="text"
                      required
                      value={formSlug}
                      onChange={(e) => setFormSlug(e.target.value)}
                      placeholder="e.g. orthopedic-instruments"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 outline-none focus:border-[#B92025]"
                    />
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Description</label>
                  <textarea
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Short summary of instruments and tools in this category..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 outline-none focus:border-[#B92025]"
                  />
                </div>

                {/* CARD IMAGE SELECTION (PRESET PICKER FOR CARDS 376, 377, 378, 379) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Category Card Image *</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      Exact 442x536 Aspect Ratio
                    </span>
                  </label>

                  <input
                    type="text"
                    required
                    value={formCardImage}
                    onChange={(e) => setFormCardImage(e.target.value)}
                    placeholder="/images/categories/image_376.png"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 outline-none focus:border-[#B92025]"
                  />

                  {/* PRESET CARDS SELECTOR */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-slate-500">
                      Select from official cards (Image 376, 377, 378, 379):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {PRESET_CARDS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setFormCardImage(p.url)
                            setFormIcon(p.defaultIcon)
                            if (!formName || formName === 'New Surgical Discipline') {
                              handleNameChange(p.defaultTitle)
                            }
                          }}
                          className={`text-left p-2 rounded-lg border text-[11px] font-medium transition-all flex items-center gap-2.5 ${
                            formCardImage === p.url
                              ? 'border-[#B92025] bg-red-50/50 text-[#B92025] font-bold'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="relative w-8 h-10 shrink-0 rounded overflow-hidden bg-slate-900">
                            <Image src={p.url} alt={p.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="line-clamp-1 block font-bold">{p.name}</span>
                            <span className="text-[10px] text-slate-400">Icon: {p.defaultIcon}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* COMPUTER UPLOAD OPTION */}
                  <div className="pt-2">
                    <label className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer transition-colors border border-slate-200">
                      <Upload className="w-3.5 h-3.5 text-[#B92025]" />
                      <span>Upload Card Image from Computer</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* ICON & PRODUCT COUNT & SORT ORDER */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Icon Emblem</label>
                    <input
                      type="text"
                      value={formIcon}
                      onChange={(e) => setFormIcon(e.target.value)}
                      placeholder="e.g. ✂️, 🦴, Ti, 🧠"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 outline-none focus:border-[#B92025]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Product Count</label>
                    <input
                      type="number"
                      min={0}
                      value={formProductCount}
                      onChange={(e) => setFormProductCount(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 outline-none focus:border-[#B92025]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Sort Position</label>
                    <input
                      type="number"
                      min={1}
                      value={formSortOrder}
                      onChange={(e) => setFormSortOrder(parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 outline-none focus:border-[#B92025]"
                    />
                  </div>
                </div>

                {/* PUBLISHED CHECKBOX */}
                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="isCatPublished"
                    checked={formIsPublished}
                    onChange={(e) => setFormIsPublished(e.target.checked)}
                    className="w-4 h-4 text-[#B92025] rounded border-slate-300 focus:ring-[#B92025]"
                  />
                  <label htmlFor="isCatPublished" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Publish Active in Homepage Categories Slider
                  </label>
                </div>

                {/* MODAL ACTIONS */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-[#B92025] hover:bg-[#96161B] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes & Live Sync</span>
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
