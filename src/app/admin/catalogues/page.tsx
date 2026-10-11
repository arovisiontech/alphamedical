'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import AdminShell from '@/src/components/admin/AdminShell'
import { FileText, Plus, Edit2, Trash2, Download, X } from 'lucide-react'
import { getStoredCatalogues, saveStoredCatalogues, getStoredCategories } from '@/src/lib/dataStore'
import { CatalogueItem } from '@/src/types/catalogue'
import { CategoryItem } from '@/src/types/category'

export default function AdminCataloguesPage() {
  const [catalogues, setCatalogues] = useState<CatalogueItem[]>([])
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCat, setEditingCat] = useState<CatalogueItem | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    pdf_url: '/pdf/alpha-medical-equipment-catalogue.pdf',
    cover_image: '/images/extracted/image_1.png',
    is_published: true,
  })

  useEffect(() => {
    setCatalogues(getStoredCatalogues())
    setCategories(getStoredCategories())
  }, [])

  const handleOpenAdd = () => {
    setEditingCat(null)
    setFormData({
      title: '',
      description: '',
      category_id: categories[0]?.id || '',
      pdf_url: '/pdf/alpha-medical-equipment-catalogue.pdf',
      cover_image: '/images/extracted/image_1.png',
      is_published: true,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete catalogue?')) {
      const updated = catalogues.filter((c) => c.id !== id)
      setCatalogues(updated)
      saveStoredCatalogues(updated)
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title) return
    const catObj = categories.find((c) => c.id === formData.category_id)

    if (editingCat) {
      const updated = catalogues.map((c) =>
        c.id === editingCat.id
          ? {
              ...c,
              title: formData.title,
              slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              description: formData.description,
              category_id: formData.category_id,
              category_name: catObj?.name || c.category_name,
              pdf_url: formData.pdf_url,
              cover_image: formData.cover_image,
              is_published: formData.is_published,
              updated_at: new Date().toISOString(),
            }
          : c
      )
      setCatalogues(updated)
      saveStoredCatalogues(updated)
    } else {
      const newPdf: CatalogueItem = {
        id: `alpha-pdf-${Date.now()}`,
        category_id: formData.category_id,
        category_name: catObj?.name || 'General',
        title: formData.title,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: formData.description,
        cover_image: formData.cover_image,
        pdf_url: formData.pdf_url,
        is_published: formData.is_published,
        sort_order: catalogues.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      const updated = [newPdf, ...catalogues]
      setCatalogues(updated)
      saveStoredCatalogues(updated)
    }
    setIsModalOpen(false)
  }

  return (
    <AdminShell>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-extrabold text-[#18355E]">PDF Product Catalogues</h1>
            <p className="text-slate-500 text-xs mt-1">
              Manage downloadable product PDF brochures for hospitals and clinical buyers.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-[#B92025] hover:bg-[#96161B] text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Catalogue</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {catalogues.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-4 p-4 flex flex-col justify-between"
            >
              <div className="relative aspect-[16/9] w-full bg-slate-100 rounded-xl overflow-hidden">
                <Image
                  src={cat.cover_image || '/images/extracted/image_1.png'}
                  alt={cat.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-[#18355E]">{cat.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{cat.description}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <a
                  href={cat.pdf_url}
                  download
                  className="text-xs text-[#B92025] font-bold flex items-center gap-1 hover:underline"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-extrabold text-[#18355E] mb-4">
              {editingCat ? 'Edit Catalogue' : 'Upload New Catalogue'}
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
                  placeholder="ALPHA ICU Equipment Catalogue 2026"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#B92025]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of products in this brochure..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#B92025]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  PDF Download Link
                </label>
                <input
                  type="text"
                  value={formData.pdf_url}
                  onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#B92025]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#18355E] hover:bg-[#B92025] text-white text-xs font-bold shadow"
                >
                  Save Brochure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  )
}
