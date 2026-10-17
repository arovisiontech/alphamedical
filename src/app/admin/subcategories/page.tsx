'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
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
  Package,
  Info,
  Sparkles,
  Upload,
} from 'lucide-react'
import {
  getStoredCategories,
  saveStoredCategories,
  getStoredProducts,
  INITIAL_CATEGORIES_SEED,
} from '@/src/lib/dataStore'
import { CategoryItem } from '@/src/types/category'
import { ProductItem } from '@/src/types/product'
import { compressImageFile } from '@/src/lib/imageCompressor'

export default function AdminSubcategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES_SEED)
  const [products, setProducts] = useState<ProductItem[]>([])
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
  const [cardImage, setCardImage] = useState('')
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadData = () => {
    const cats = getStoredCategories()
    const prods = getStoredProducts()
    setCategories(cats)
    setProducts(prods)
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

  const getProductCountForSub = (sub: CategoryItem): number => {
    return products.filter((p) => {
      if (p.category_id === sub.id) return true
      if (p.specifications?.Subcategory?.toLowerCase() === sub.name.toLowerCase()) return true
      if (p.category_name?.toLowerCase() === sub.name.toLowerCase()) return true
      if (p.title?.toLowerCase().includes(sub.name.toLowerCase())) return true
      return false
    }).length
  }

  const handleOpenAdd = () => {
    setEditingSub(null)
    setName('')
    setSlug('')
    setDescription('')
    setCardImage('')
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
    setCardImage(sub.card_image || sub.image_url || '')
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploadingImage(true)
    try {
      const { dataUrl } = await compressImageFile(file, 600, 600, 0.85)
      if (dataUrl) {
        setCardImage(dataUrl)
      }
    } catch (err) {
      console.error('Image compression error:', err)
    } finally {
      setIsUploadingImage(false)
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
              card_image: cardImage || c.card_image,
              image_url: cardImage || c.image_url,
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
        card_image: cardImage || '/images/categories/image_376.png',
        image_url: cardImage || '/images/categories/image_376.png',
        sort_order: sortOrder,
        is_published: true,
        created_at: now,
        updated_at: now,
        level: 1,
        product_count: 0,
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
                Store Taxonomy & Subcategories
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Subcategories Manager
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Manage specialized procedure lines (Dental Surgery, Bone Surgery, Periodontics, Disposables, PPE, Equipment, etc.).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/products"
              className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl flex items-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span>Master Products Manager</span>
            </Link>
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

        {/* CLARIFICATION GUIDE BANNER (SOLVING USER CONFUSION) */}
        <div className="bg-gradient-to-r from-red-50 via-amber-50 to-white p-5 sm:p-6 rounded-3xl border border-red-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#96161B] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Looking to Edit Products, Sizes, Prices & Large View Photos for these Subcategories?
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-3xl">
                Subcategories define your store&apos;s navigation menu lines. Physical items (like Bone Rongeurs, Scissors, Osteotomes, PPE, Monitors) with prices, sizes, and multiple large views are stored in <strong>Products & Best Sellers</strong>. Click <strong>&quot;Edit Products in this Subcategory&quot;</strong> on any card below to jump straight to that category&apos;s products!
              </p>
            </div>
          </div>
          <Link
            href="/admin/products"
            className="shrink-0 bg-[#96161B] hover:bg-[#7d1216] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <span>Open All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
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
              Create sub-division mappings like Bone Surgery, Dental Surgery, Disposables, or PPE under your primary medical divisions.
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
              const liveCount = getProductCountForSub(sub)
              const cardImg = sub.card_image || sub.image_url

              return (
                <div
                  key={sub.id}
                  className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#96161B] uppercase tracking-wider bg-red-50 px-2.5 py-0.5 rounded-md border border-red-100">
                        {parent?.name || 'Primary Division'}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">Order: {sub.sort_order}</span>
                    </div>

                    <div className="flex items-start gap-3">
                      {cardImg && (
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 shrink-0 relative overflow-hidden flex items-center justify-center">
                          <Image
                            src={cardImg}
                            alt={sub.name}
                            fill
                            unoptimized
                            className="object-contain p-1"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                          {sub.name}
                        </h3>
                        <div className="text-[11px] font-mono text-slate-400 truncate">
                          /products?query={encodeURIComponent(sub.name)}
                        </div>
                      </div>
                    </div>

                    {sub.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {sub.description}
                      </p>
                    )}

                    {/* PRODUCT COUNT BADGE */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
                      <Package className="w-3.5 h-3.5 text-[#96161B]" />
                      <span>{liveCount} Active Products in this Subcategory</span>
                    </div>

                    {/* DIRECT PRODUCT EDIT ACTIONS */}
                    <div className="pt-2 flex flex-col gap-2">
                      <Link
                        href={`/admin/products?cat=${sub.id}&subcat=${encodeURIComponent(sub.name)}`}
                        className="w-full py-2.5 px-3.5 bg-[#96161B] hover:bg-[#7e1216] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Edit Products in this Subcategory ({liveCount})</span>
                      </Link>
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href={`/admin/products?add=true&cat=${sub.id}`}
                          className="py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>+ Add Product</span>
                        </Link>
                        <Link
                          href={`/products?query=${encodeURIComponent(sub.name)}`}
                          target="_blank"
                          className="py-2 px-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer border border-slate-200"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>View on Store</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600">● Live on Store</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(sub)}
                        className="p-2 rounded-xl text-slate-600 hover:text-[#96161B] hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Edit Subcategory Details"
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
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="bg-[#96161B] text-white p-5 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-5 h-5 text-white" />
                  <h3 className="font-extrabold text-base">
                    {editingSub ? 'Edit Subcategory Details' : 'Add New Subcategory'}
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
                    placeholder="e.g. Bone Surgery / Dental Surgery / Disposables / PPE"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-[#96161B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Subcategory Card Image (Optional)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={cardImage}
                      onChange={(e) => setCardImage(e.target.value)}
                      placeholder="/images/categories/image_376.png or https://..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-[#96161B]"
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingImage}
                      className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingImage ? '...' : 'Upload'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. bone-surgery"
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
                    placeholder="Precision surgical instruments and tools designed for..."
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
