'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import AdminShell from '@/src/components/admin/AdminShell'
import { FileText, Plus, Edit2, Trash2, Download, X, Eye, CheckCircle2, Sparkles, Upload } from 'lucide-react'
import { getStoredCatalogues, saveStoredCatalogues } from '@/src/lib/dataStore'
import { CatalogueItem } from '@/src/types/catalogue'

export default function AdminCataloguesPage() {
  const [catalogues, setCatalogues] = useState<CatalogueItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCat, setEditingCat] = useState<CatalogueItem | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    catalog_number: 'CATALOG 01',
    category: 'GENERAL SURGERY',
    description: '',
    pdf_url: '/catalogues/Artery-Forceps-Section4.pdf',
    cover_image: '/images/categories/image_376.png',
    pages: 48,
    file_size: '2.8 MB',
    is_published: true,
  })

  const pdfInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingPdf, setIsUploadingPdf] = useState(false)
  const [isUploadingCover, setIsUploadingCover] = useState(false)

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingPdf(true)
    try {
      const data = new FormData()
      data.append('file', file)
      data.append('type', 'catalogue')

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      })
      const json = await res.json()
      if (json.success) {
        setFormData((prev) => ({
          ...prev,
          pdf_url: json.url,
          file_size: json.size || prev.file_size,
        }))
        showToast(`PDF uploaded successfully: ${json.filename}`)
      } else {
        showToast(`Upload failed: ${json.error || 'Server error'}`)
      }
    } catch (err: any) {
      console.error('PDF upload error:', err)
      showToast('Error uploading PDF file')
    } finally {
      setIsUploadingPdf(false)
    }
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingCover(true)
    try {
      const data = new FormData()
      data.append('file', file)
      data.append('type', 'category')

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      })
      const json = await res.json()
      if (json.success) {
        setFormData((prev) => ({
          ...prev,
          cover_image: json.url,
        }))
        showToast('Cover image uploaded successfully!')
      } else {
        showToast(`Cover upload failed: ${json.error || 'Server error'}`)
      }
    } catch (err: any) {
      console.error('Cover upload error:', err)
      showToast('Error uploading cover image')
    } finally {
      setIsUploadingCover(false)
    }
  }

  const loadData = async () => {
    // Optimistic local load
    const cats = getStoredCatalogues()
    setCatalogues(cats)

    // Server disk sync
    try {
      const res = await fetch(`/api/catalogues?t=${Date.now()}`, { cache: 'no-store' })
      if (res.ok) {
        const serverCats = await res.json()
        if (Array.isArray(serverCats) && serverCats.length > 0) {
          setCatalogues(serverCats)
          localStorage.setItem('alpha_catalogues', JSON.stringify(serverCats))
        }
      }
    } catch (err) {}
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

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleOpenAdd = () => {
    setEditingCat(null)
    setFormData({
      title: '',
      catalog_number: `CATALOG ${String(catalogues.length + 1).padStart(2, '0')}`,
      category: 'GENERAL SURGERY',
      description: '',
      pdf_url: '/catalogues/Artery-Forceps-Section4.pdf',
      cover_image: '/images/categories/image_376.png',
      pages: 48,
      file_size: '2.8 MB',
      is_published: true,
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (cat: CatalogueItem) => {
    setEditingCat(cat)
    setFormData({
      title: cat.title,
      catalog_number: cat.catalog_number || 'CATALOG 01',
      category: cat.category || 'GENERAL SURGERY',
      description: cat.description || '',
      pdf_url: cat.pdf_url || '/catalogues/Artery-Forceps-Section4.pdf',
      cover_image: cat.cover_image || '/images/categories/image_376.png',
      pages: cat.pages || 48,
      file_size: cat.file_size || '2.8 MB',
      is_published: cat.is_published !== false,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    const target = catalogues.find((c) => c.id === id)
    if (confirm(`Are you sure you want to delete "${target?.title || 'this catalogue'}"? Changes persist immediately.`)) {
      const updated = catalogues.filter((c) => c.id !== id)
      setCatalogues(updated)
      saveStoredCatalogues(updated)
      showToast('Catalogue successfully removed!')
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    if (editingCat) {
      const updated = catalogues.map((c) =>
        c.id === editingCat.id
          ? {
              ...c,
              title: formData.title,
              catalog_number: formData.catalog_number,
              category: formData.category,
              category_name: formData.category,
              description: formData.description,
              pdf_url: formData.pdf_url,
              cover_image: formData.cover_image,
              pages: Number(formData.pages) || 48,
              file_size: formData.file_size,
              is_published: formData.is_published,
              updated_at: new Date().toISOString(),
            }
          : c
      )
      setCatalogues(updated)
      saveStoredCatalogues(updated)
      showToast('Catalogue updated successfully!')
    } else {
      const newCat: CatalogueItem = {
        id: `alpha-cat-${Date.now()}`,
        category_id: `cat-${formData.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        category_name: formData.category,
        catalog_number: formData.catalog_number,
        category: formData.category,
        title: formData.title,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: formData.description,
        cover_image: formData.cover_image,
        pdf_url: formData.pdf_url,
        pages: Number(formData.pages) || 48,
        file_size: formData.file_size,
        is_published: formData.is_published,
        sort_order: catalogues.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      const updated = [newCat, ...catalogues]
      setCatalogues(updated)
      saveStoredCatalogues(updated)
      showToast('New catalogue added and saved to disk!')
    }
    setIsModalOpen(false)
  }

  return (
    <AdminShell>
      <div className="space-y-6 animate-fade-in font-sans">
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#B92025] bg-red-50 px-2 py-0.5 rounded-md">
                100% Dynamic Disk Persistence
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">Official Product Catalogues (PDF)</h1>
            <p className="text-slate-500 text-xs mt-1">
              Manage downloadable brochures matching the official store catalogue gallery.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-[#B92025] hover:bg-[#96161B] text-white font-black text-xs px-5 py-3 rounded-xl transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Catalogue</span>
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {catalogues.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between space-y-4"
            >
              <div className="flex gap-4 items-start">
                <div className="relative w-24 aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                  <Image
                    src={cat.cover_image || '/images/categories/image_376.png'}
                    alt={cat.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-1 left-1 bg-[#B92025] text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                    PDF
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full uppercase">
                    {cat.catalog_number || 'CATALOG'}
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 leading-snug">{cat.title}</h3>
                  <p className="text-[11px] font-semibold text-[#B92025] uppercase tracking-wider">
                    {cat.category || 'GENERAL SURGERY'}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{cat.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                <div className="text-[11px] font-medium">
                  <span>{cat.pages || 48} Pages</span> • <span>{cat.file_size || '2.8 MB'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 text-slate-600 hover:text-[#B92025] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit Catalogue"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Catalogue"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-black text-slate-900 mb-4">
              {editingCat ? 'Edit Catalogue Details' : 'Upload New Master Catalogue'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Catalogue Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. GENERAL SURGERY"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#B92025]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Catalog Code
                  </label>
                  <input
                    type="text"
                    value={formData.catalog_number}
                    onChange={(e) => setFormData({ ...formData, catalog_number: e.target.value })}
                    placeholder="CATALOG 01"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#B92025]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Discipline / Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#B92025]"
                  >
                    <option value="GENERAL SURGERY">GENERAL SURGERY</option>
                    <option value="DENTAL">DENTAL</option>
                    <option value="PLASTIC SURGERY">PLASTIC SURGERY</option>
                    <option value="ENT INSTRUMENTS">ENT INSTRUMENTS</option>
                    <option value="COMPANY PROFILE">COMPANY PROFILE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of instruments and specifications in this brochure..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#B92025]"
                />
              </div>

              {/* COVER IMAGE UPLOAD PLACEHOLDER */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Catalogue Cover Image (Click to Upload or Select)
                </label>
                <input
                  type="file"
                  ref={coverInputRef}
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
                <div
                  onClick={() => coverInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-[#B92025] rounded-2xl p-3.5 flex items-center gap-3.5 cursor-pointer bg-slate-50/70 hover:bg-red-50/30 transition-all group"
                >
                  <div className="w-12 h-16 bg-white rounded-lg border border-slate-200 overflow-hidden relative shrink-0 shadow-sm">
                    <Image
                      src={formData.cover_image || '/images/categories/image_376.png'}
                      alt="Cover Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-800 group-hover:text-[#B92025] flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingCover ? 'Uploading cover...' : 'Click to Upload Cover Image from Laptop'}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">
                      {formData.cover_image || 'JPG, PNG, or WEBP brochure cover thumbnail'}
                    </div>
                  </div>
                </div>
              </div>

              {/* PDF FILE UPLOAD PLACEHOLDER (SCREENSHOT 2 ENHANCEMENT) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  PDF Download File * (Click to Upload from Laptop Gallery)
                </label>
                
                <input
                  type="file"
                  ref={pdfInputRef}
                  accept=".pdf,application/pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                />

                {/* CLICKABLE DROPZONE / PLACEHOLDER */}
                <div
                  onClick={() => pdfInputRef.current?.click()}
                  className="border-2 border-dashed border-[#B92025]/40 hover:border-[#B92025] bg-red-50/40 hover:bg-red-50/80 rounded-2xl p-5 text-center cursor-pointer transition-all space-y-2 group"
                >
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-red-200 flex items-center justify-center mx-auto text-[#B92025] group-hover:scale-110 transition-transform">
                    {isUploadingPdf ? (
                      <div className="w-5 h-5 border-2 border-[#B92025] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-6 h-6" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-extrabold text-slate-900 group-hover:text-[#B92025]">
                      {isUploadingPdf ? 'Uploading PDF to Server...' : 'Click to Browse & Upload PDF from Laptop'}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Supports PDF brochures up to 50MB. File is saved directly to server disk.
                    </div>
                  </div>
                </div>

                {/* ACTIVE UPLOADED FILE STATUS BADGE */}
                {formData.pdf_url && (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div className="overflow-hidden">
                        <div className="font-bold text-emerald-900 truncate max-w-[280px]">
                          {formData.pdf_url.split('/').pop()}
                        </div>
                        <div className="text-[10px] text-emerald-600 font-medium">
                          {formData.file_size} • Saved on disk
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => pdfInputRef.current?.click()}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline shrink-0 ml-2"
                    >
                      Change File
                    </button>
                  </div>
                )}

                {/* MANUAL URL INPUT (OPTIONAL OVERRIDE) */}
                <div className="pt-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Or Enter PDF URL Manually
                  </div>
                  <input
                    type="text"
                    value={formData.pdf_url}
                    onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                    placeholder="/catalogues/Artery-Forceps-Section4.pdf"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#B92025]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Page Count
                  </label>
                  <input
                    type="number"
                    value={formData.pages}
                    onChange={(e) => setFormData({ ...formData, pages: Number(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#B92025]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    File Size
                  </label>
                  <input
                    type="text"
                    value={formData.file_size}
                    onChange={(e) => setFormData({ ...formData, file_size: e.target.value })}
                    placeholder="2.8 MB"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#B92025]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#B92025] hover:bg-[#96161B] text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
                >
                  Save Catalogue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  )
}
