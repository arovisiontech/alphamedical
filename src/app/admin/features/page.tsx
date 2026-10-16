'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import AdminShell from '@/src/components/admin/AdminShell'
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Upload,
  RefreshCw,
  Eye,
  Award,
  Truck,
  Headphones,
  CheckCircle,
} from 'lucide-react'
import {
  getStoredTrustFeatures,
  saveStoredTrustFeatures,
} from '@/src/lib/dataStore'
import { TrustFeatureItem } from '@/src/types/trustFeature'

export default function AdminTrustFeaturesPage() {
  const [features, setFeatures] = useState<TrustFeatureItem[]>([])
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingFeature, setEditingFeature] = useState<TrustFeatureItem | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    icon_url: '/images/features/preimum-1.svg',
    sort_order: 1,
    is_published: true,
  })

  const loadData = () => {
    const data = getStoredTrustFeatures()
    setFeatures(data)
  }

  useEffect(() => {
    loadData()

    const handleUpdate = () => {
      loadData()
    }
    window.addEventListener('alpha_content_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)

    return () => {
      window.removeEventListener('alpha_content_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleOpenAdd = () => {
    setEditingFeature(null)
    setFormData({
      title: 'Premium Quality',
      subtitle: 'Certified Instruments',
      icon_url: '/images/features/preimum-1.svg',
      sort_order: features.length + 1,
      is_published: true,
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (feat: TrustFeatureItem) => {
    setEditingFeature(feat)
    setFormData({
      title: feat.title,
      subtitle: feat.subtitle,
      icon_url: feat.icon_url || '/images/features/preimum-1.svg',
      sort_order: feat.sort_order,
      is_published: feat.is_published,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    const target = features.find((f) => f.id === id)
    if (confirm(`Are you sure you want to delete "${target?.title || 'this feature badge'}"?`)) {
      const updated = features.filter((f) => f.id !== id)
      setFeatures(updated)
      saveStoredTrustFeatures(updated)
      showToast('Badge deleted! Storefront updated.')
    }
  }

  const handleTogglePublish = (feat: TrustFeatureItem) => {
    const updated = features.map((f) =>
      f.id === feat.id ? { ...f, is_published: !f.is_published } : f
    )
    setFeatures(updated)
    saveStoredTrustFeatures(updated)
    showToast(`"${feat.title}" visibility toggled!`)
  }

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      if (result) {
        setFormData((prev) => ({ ...prev, icon_url: result }))
        showToast('Custom icon loaded successfully!')
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    if (editingFeature) {
      const updated = features.map((f) =>
        f.id === editingFeature.id
          ? {
              ...f,
              title: formData.title,
              subtitle: formData.subtitle,
              icon_url: formData.icon_url,
              sort_order: Number(formData.sort_order),
              is_published: formData.is_published,
              updated_at: new Date().toISOString(),
            }
          : f
      )
      setFeatures(updated)
      saveStoredTrustFeatures(updated)
      showToast('Badge updated! Changes are live & saved across page reload.')
    } else {
      const newFeature: TrustFeatureItem = {
        id: `feat-${Date.now()}`,
        title: formData.title,
        subtitle: formData.subtitle,
        icon_url: formData.icon_url,
        sort_order: Number(formData.sort_order),
        is_published: formData.is_published,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      const updated = [...features, newFeature]
      setFeatures(updated)
      saveStoredTrustFeatures(updated)
      showToast('New badge created! Live on storefront & saved across page reload.')
    }

    setIsModalOpen(false)
  }

  return (
    <AdminShell>
      <div className="w-full max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2500px] 4xl:max-w-[3200px] mx-auto space-y-6 sm:space-y-8 animate-fade-in">
        
        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#96161B] uppercase tracking-wider mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#96161B] animate-pulse" />
              <span>Category Bar Sub-Section</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Trust Badges & Value Propositions Manager
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Manage the 4 trust features displayed right below the Categories section. Add, edit, delete, or customize icons and text. Everything updates live and persists across page reloads.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                loadData()
                showToast('Refreshed data from storage!')
              }}
              className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              id="admin-add-badge-btn"
              onClick={handleOpenAdd}
              className="flex items-center gap-2 bg-[#96161B] hover:bg-[#7d1216] text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl transition-all shadow-md shadow-red-950/20 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Badge</span>
            </button>
          </div>
        </div>

        {/* LIVE STOREFRONT PREVIEW (MATCHING SCREENSHOT) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
            <div>
              <div className="text-[11px] font-bold text-[#96161B] uppercase tracking-wider">
                Live Storefront Preview
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Active Trust Bar Layout (Displayed Under Categories)
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              Interactive real-time storefront preview
            </span>
          </div>

          {/* THE ACTUAL BAR AS RENDERED ON LIVE HOMEPAGE */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-md overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 sm:divide-slate-200/70">
              {features
                .filter((f) => f.is_published !== false)
                .map((feat) => {
                  return (
                    <div
                      key={`preview-${feat.id}`}
                      className="p-5 sm:p-6 flex items-center justify-between gap-4 group hover:bg-red-50/20 transition-colors"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Circular Pink/Red Tinted Icon */}
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#fdecef] shrink-0 flex items-center justify-center p-3 shadow-sm border border-red-100/60">
                          <div className="relative w-full h-full flex items-center justify-center">
                            <Image
                              src={feat.icon_url || '/images/features/preimum-1.svg'}
                              alt={feat.title}
                              fill
                              className="object-contain"
                            />
                          </div>
                        </div>

                        {/* Text */}
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                            {feat.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-400 font-medium truncate mt-0.5">
                            {feat.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Quick Edit Actions inside Preview */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleOpenEdit(feat)}
                          className="p-1.5 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100"
                          title="Quick Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(feat.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
                          title="Quick Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-5 sm:p-6 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
              All Trust Badges & Icons ({features.length})
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              Reorder, edit titles or subtitles, and change icons.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4 sm:p-5">Icon & Badge Title</th>
                  <th className="p-4 sm:p-5">Subtitle / Description</th>
                  <th className="p-4 sm:p-5 text-center">Order</th>
                  <th className="p-4 sm:p-5 text-center">Status</th>
                  <th className="p-4 sm:p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {features.map((feat) => (
                  <tr key={feat.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Icon & Title */}
                    <td className="p-4 sm:p-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#fdecef] shrink-0 flex items-center justify-center p-2.5 border border-red-100">
                        <div className="relative w-full h-full">
                          <Image
                            src={feat.icon_url || '/images/features/preimum-1.svg'}
                            alt={feat.title}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900 text-sm sm:text-base">
                          {feat.title}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          ID: {feat.id}
                        </div>
                      </div>
                    </td>

                    {/* Subtitle */}
                    <td className="p-4 sm:p-5 font-medium text-slate-600">
                      {feat.subtitle}
                    </td>

                    {/* Sort Order */}
                    <td className="p-4 sm:p-5 text-center font-bold text-slate-700">
                      #{feat.sort_order}
                    </td>

                    {/* Published Status Toggle */}
                    <td className="p-4 sm:p-5 text-center">
                      <button
                        onClick={() => handleTogglePublish(feat)}
                        className={`text-[11px] font-bold px-3 py-1 rounded-full cursor-pointer transition-all ${
                          feat.is_published !== false
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {feat.is_published !== false ? 'Live on Store' : 'Hidden'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4 sm:p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(feat)}
                          className="p-2.5 text-slate-600 hover:text-[#96161B] hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="Edit Badge"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(feat.id)}
                          className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="Delete Badge"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto border border-slate-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <span className="text-[11px] font-bold text-[#96161B] uppercase tracking-wider">
                Badge Details
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {editingFeature ? 'Edit Trust Badge' : 'Add New Trust Badge'}
              </h3>
            </div>

            <form onSubmit={handleSave} className="space-y-4 sm:space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Badge Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Premium Quality"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B] font-semibold"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Subtitle / Description *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Certified Instruments"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B]"
                />
              </div>

              {/* Icon Presets Grid */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Icon (Provided SVG Logos or Upload)
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Preset 1: preimum-1.svg */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, icon_url: '/images/features/preimum-1.svg' })}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      formData.icon_url === '/images/features/preimum-1.svg'
                        ? 'border-[#96161B] bg-red-50 text-[#96161B] font-bold shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#fdecef] flex items-center justify-center p-2 shrink-0">
                      <Image src="/images/features/preimum-1.svg" alt="Premium" width={24} height={24} className="object-contain" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">preimum 1.svg</div>
                      <div className="text-[10px] text-slate-400 font-normal">Medal Diamond</div>
                    </div>
                  </button>

                  {/* Preset 2: fastshipping-1.svg */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, icon_url: '/images/features/fastshipping-1.svg' })}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      formData.icon_url === '/images/features/fastshipping-1.svg'
                        ? 'border-[#96161B] bg-red-50 text-[#96161B] font-bold shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#fdecef] flex items-center justify-center p-2 shrink-0">
                      <Image src="/images/features/fastshipping-1.svg" alt="Fast Shipping" width={24} height={24} className="object-contain" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">fastshipping 1.svg</div>
                      <div className="text-[10px] text-slate-400 font-normal">Speed Truck</div>
                    </div>
                  </button>

                  {/* Preset 3: support-1.svg */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, icon_url: '/images/features/support-1.svg' })}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      formData.icon_url === '/images/features/support-1.svg'
                        ? 'border-[#96161B] bg-red-50 text-[#96161B] font-bold shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#fdecef] flex items-center justify-center p-2 shrink-0">
                      <Image src="/images/features/support-1.svg" alt="Support" width={24} height={24} className="object-contain" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">support 1.svg</div>
                      <div className="text-[10px] text-slate-400 font-normal">Headset Agent</div>
                    </div>
                  </button>

                  {/* Preset 4: quality-icon-1.svg */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, icon_url: '/images/features/quality-icon-1.svg' })}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      formData.icon_url === '/images/features/quality-icon-1.svg'
                        ? 'border-[#96161B] bg-red-50 text-[#96161B] font-bold shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#fdecef] flex items-center justify-center p-2 shrink-0">
                      <Image src="/images/features/quality-icon-1.svg" alt="Quality" width={24} height={24} className="object-contain" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">quality-icon 1.svg</div>
                      <div className="text-[10px] text-slate-400 font-normal">Medal Check</div>
                    </div>
                  </button>
                </div>

                {/* Custom URL and File Upload Input */}
                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="text"
                    value={formData.icon_url}
                    onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                    placeholder="/images/features/... or custom image URL"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B]"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageFileUpload}
                    accept="image/*,.svg"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload SVG</span>
                  </button>
                </div>
              </div>

              {/* Sort Order and Visibility */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B]"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_published}
                      onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                      className="w-4 h-4 accent-[#96161B]"
                    />
                    <span>Live on Storefront</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="admin-save-badge-submit-btn"
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-[#96161B] hover:bg-[#7d1216] text-white text-xs sm:text-sm font-bold shadow-md shadow-red-950/20 active:scale-95 cursor-pointer transition-all"
                >
                  {editingFeature ? 'Save Changes' : 'Create & Publish Badge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  )
}
