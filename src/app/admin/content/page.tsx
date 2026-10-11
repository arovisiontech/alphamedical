'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AdminShell from '@/src/components/admin/AdminShell'
import {
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Eye,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Save,
  RotateCcw,
} from 'lucide-react'
import {
  getStoredBanners,
  saveStoredBanners,
  INITIAL_BANNERS_SEED,
} from '@/src/lib/dataStore'
import { BannerItem } from '@/src/types/banner'

export default function AdminBannersContentPage() {
  const [banners, setBanners] = useState<BannerItem[]>(INITIAL_BANNERS_SEED)
  const [isLoaded, setIsLoaded] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  // Form state
  const [formTitle, setFormTitle] = useState('')
  const [formSubtitle, setFormSubtitle] = useState('')
  const [formTagline, setFormTagline] = useState('')
  const [formImageUrl, setFormImageUrl] = useState('/images/banners/hero-banner-kerrison.jpg')
  const [formLinkUrl, setFormLinkUrl] = useState('/products?cat=surgical-instruments')
  const [formButtonText, setFormButtonText] = useState('SHOP NOW')
  const [formDisplayMode, setFormDisplayMode] = useState<'full_image' | 'overlay_text'>('full_image')
  const [formIsActive, setFormIsActive] = useState(true)
  const [formSortOrder, setFormSortOrder] = useState(1)

  // Quick Preset Images
  const PRESET_IMAGES = [
    {
      name: 'Kerrison Rongeur (Official Screenshot 3 Banner)',
      url: '/images/banners/hero-banner-kerrison.jpg',
    },
    {
      name: 'Alpha Retractor Tool (German Stainless)',
      url: '/images/image-399.png',
    },
    {
      name: 'Surgical Dissection Instruments Master Set',
      url: '/images/extracted/image_2.png',
    },
    {
      name: 'Hospital ICU Equipment Solutions',
      url: '/images/extracted/image_7.png',
    },
    {
      name: 'Critical Care Patient Monitoring',
      url: '/images/extracted/image_11.png',
    },
  ]

  useEffect(() => {
    setBanners(getStoredBanners())
    setIsLoaded(true)
  }, [])

  const showNotification = (msg: string) => {
    setSuccessToast(msg)
    setTimeout(() => {
      setSuccessToast(null)
    }, 4000)
  }

  // Open modal for new banner
  const handleOpenAddModal = () => {
    setEditingBanner(null)
    setFormTitle('New Surgical Hero Banner')
    setFormSubtitle('Engineered for Precision. Trusted in Every Procedure.')
    setFormTagline('PRECISION / QUALITY / BETTER CARE')
    setFormImageUrl('/images/banners/hero-banner-kerrison.jpg')
    setFormLinkUrl('/products?cat=surgical-instruments')
    setFormButtonText('SHOP NOW')
    setFormDisplayMode('full_image')
    setFormIsActive(true)
    setFormSortOrder(banners.length + 1)
    setShowModal(true)
  }

  // Open modal for editing banner
  const handleOpenEditModal = (banner: BannerItem) => {
    setEditingBanner(banner)
    setFormTitle(banner.title)
    setFormSubtitle(banner.subtitle || '')
    setFormTagline(banner.tagline || '')
    setFormImageUrl(banner.image_url)
    setFormLinkUrl(banner.link_url)
    setFormButtonText(banner.button_text || 'SHOP NOW')
    setFormDisplayMode(banner.display_mode || 'full_image')
    setFormIsActive(banner.is_active)
    setFormSortOrder(banner.sort_order || 1)
    setShowModal(true)
  }

  // Handle local image upload via FileReader
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormImageUrl(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  // Save banner (Add or Edit)
  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formImageUrl.trim()) {
      alert('Please provide or select a Banner Image URL')
      return
    }

    let updatedList: BannerItem[] = []

    if (editingBanner) {
      // Update existing
      updatedList = banners.map((b) =>
        b.id === editingBanner.id
          ? {
              ...b,
              title: formTitle,
              subtitle: formSubtitle,
              tagline: formTagline,
              image_url: formImageUrl,
              link_url: formLinkUrl,
              button_text: formButtonText,
              display_mode: formDisplayMode,
              is_active: formIsActive,
              sort_order: formSortOrder,
              updated_at: new Date().toISOString(),
            }
          : b
      )
    } else {
      // Add new
      const newBanner: BannerItem = {
        id: `banner-${Date.now()}`,
        title: formTitle,
        subtitle: formSubtitle,
        tagline: formTagline,
        image_url: formImageUrl,
        link_url: formLinkUrl,
        button_text: formButtonText,
        display_mode: formDisplayMode,
        is_active: formIsActive,
        sort_order: formSortOrder,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      updatedList = [...banners, newBanner]
    }

    // Sort by order
    updatedList.sort((a, b) => a.sort_order - b.sort_order)

    setBanners(updatedList)
    saveStoredBanners(updatedList)
    setShowModal(false)
    showNotification('✓ Banner successfully saved & live on website!')
  }

  // Delete banner
  const handleDeleteBanner = (id: string) => {
    if (banners.length <= 1) {
      if (!confirm('This is the only banner. Are you sure you want to delete it?')) return
    } else {
      if (!confirm('Are you sure you want to delete this banner?')) return
    }

    const updated = banners.filter((b) => b.id !== id)
    setBanners(updated)
    saveStoredBanners(updated)
    showNotification('✓ Banner deleted & updated live on website!')
  }

  // Toggle active status
  const handleToggleActive = (id: string) => {
    const updated = banners.map((b) => (b.id === id ? { ...b, is_active: !b.is_active } : b))
    setBanners(updated)
    saveStoredBanners(updated)
    showNotification('✓ Banner visibility updated live on website!')
  }

  // Move banner order Up / Down
  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === banners.length - 1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const updated = [...banners]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp

    // Update sort_order numbers
    updated.forEach((b, idx) => {
      b.sort_order = idx + 1
    })

    setBanners(updated)
    saveStoredBanners(updated)
    showNotification('✓ Banner order updated live on website!')
  }

  // Reset to default Kerrison Rongeur banner
  const handleResetToDefault = () => {
    if (confirm('Reset to default Kerrison Rongeur Banner (Screenshot 3)?')) {
      setBanners(INITIAL_BANNERS_SEED)
      saveStoredBanners(INITIAL_BANNERS_SEED)
      showNotification('✓ Reset to default Kerrison Rongeur banner!')
    }
  }

  if (!isLoaded) {
    return (
      <AdminShell>
        <div className="p-8 text-center text-slate-500 text-sm">Loading Banner Manager...</div>
      </AdminShell>
    )
  }

  const activeBanners = banners.filter((b) => b.is_active)
  const currentPreviewBanner = activeBanners[0] || banners[0]

  return (
    <AdminShell>
      <div className="space-y-8 animate-fade-in pb-16">
        {/* SUCCESS TOAST NOTIFICATION */}
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
              <span>ALPHA Hero Banner Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18355E]">
              Homepage Hero Banners & Slider
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl">
              Add, edit, reorder, or delete storefront banners. Any change saved here is immediately reflected live on the public website.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleResetToDefault}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-3 rounded-xl transition-all"
              title="Reset to default SS3 Kerrison Rongeur Banner"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>

            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 bg-[#B92025] hover:bg-[#96161B] text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Banner</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold px-4 py-3 rounded-xl transition-all shadow"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Website</span>
            </Link>
          </div>
        </div>

        {/* LIVE STOREFRONT PREVIEW CONTAINER */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h2 className="text-sm font-bold tracking-wide uppercase text-slate-200">
                Live Storefront Banner Preview
              </h2>
            </div>
            <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800 px-3 py-1 rounded-full">
              ● Live on Homepage
            </span>
          </div>

          {currentPreviewBanner ? (
            <div className="relative aspect-[1920/728] max-h-[380px] w-full rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 shadow-inner group">
              <Image
                src={currentPreviewBanner.image_url}
                alt={currentPreviewBanner.title}
                fill
                className="object-cover object-center"
              />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-lg border border-white/20">
                Current Active: {currentPreviewBanner.title}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              No active banners currently enabled. Please add or enable at least one banner.
            </div>
          )}
        </div>

        {/* BANNERS LIST */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#18355E]">
              All Configured Banners ({banners.length})
            </h3>
            <span className="text-xs text-slate-500">
              {activeBanners.length} active • {banners.length - activeBanners.length} inactive
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`bg-white rounded-3xl border overflow-hidden transition-all shadow-sm hover:shadow-md flex flex-col justify-between ${
                  banner.is_active ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
                }`}
              >
                {/* BANNER PREVIEW IMAGE */}
                <div className="relative aspect-[1920/728] w-full bg-slate-100 border-b border-slate-100">
                  <Image
                    src={banner.image_url}
                    alt={banner.title}
                    fill
                    className="object-cover object-center"
                  />

                  {/* STATUS BADGE */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                        banner.is_active
                          ? 'bg-emerald-500 text-white shadow'
                          : 'bg-slate-500 text-white shadow'
                      }`}
                    >
                      {banner.is_active ? 'Active' : 'Disabled'}
                    </span>
                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full">
                      Order: #{banner.sort_order || index + 1}
                    </span>
                  </div>

                  {/* DISPLAY MODE BADGE */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-200">
                    {banner.display_mode === 'overlay_text' ? 'Text Overlay' : 'Full Graphic'}
                  </div>
                </div>

                {/* BANNER DETAILS */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h4 className="text-base font-extrabold text-[#18355E] line-clamp-1">
                      {banner.title}
                    </h4>
                    {banner.subtitle && (
                      <p className="text-xs text-slate-500 line-clamp-2">{banner.subtitle}</p>
                    )}
                    <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-[10px]">
                        Link: {banner.link_url}
                      </span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-bold text-[10px] text-[#B92025]">
                        CTA: {banner.button_text || 'SHOP NOW'}
                      </span>
                    </div>
                  </div>

                  {/* ACTION CONTROLS */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    {/* ORDER REARRANGEMENT */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveOrder(index, 'up')}
                        disabled={index === 0}
                        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveOrder(index, 'down')}
                        disabled={index === banners.length - 1}
                        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* STATUS TOGGLE & EDIT / DELETE */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(banner.id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                          banner.is_active
                            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {banner.is_active ? 'Disable' : 'Enable'}
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(banner)}
                        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#18355E] flex items-center justify-center transition-colors"
                        title="Edit Banner"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteBanner(banner.id)}
                        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-[#B92025] flex items-center justify-center transition-colors"
                        title="Delete Banner"
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

        {/* ADD / EDIT BANNER MODAL */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-scale-up my-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-black text-[#18355E]">
                    {editingBanner ? 'Edit Banner' : 'Add New Hero Banner'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Changes will be saved and updated live on the homepage hero section.
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveBanner} className="space-y-5">
                {/* BANNER TITLE */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Banner Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Kerrison Rongeur Instruments"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 outline-none focus:border-[#B92025]"
                  />
                </div>

                {/* BANNER IMAGE SELECTION / UPLOAD */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Banner Image * (Path or URL)</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      Recommended: 1920x728 aspect ratio
                    </span>
                  </label>

                  <input
                    type="text"
                    required
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="/images/banners/hero-banner-kerrison.jpg"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 outline-none focus:border-[#B92025]"
                  />

                  {/* QUICK PRESET PICKER */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-slate-500">
                      Or choose from store assets:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {PRESET_IMAGES.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormImageUrl(p.url)}
                          className={`text-left p-2 rounded-lg border text-[11px] font-medium transition-all flex items-center gap-2 ${
                            formImageUrl === p.url
                              ? 'border-[#B92025] bg-red-50/50 text-[#B92025] font-bold'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="relative w-8 h-5 shrink-0 rounded overflow-hidden bg-slate-100">
                            <Image src={p.url} alt={p.name} fill className="object-cover" />
                          </div>
                          <span className="line-clamp-1">{p.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* FILE UPLOAD INPUT */}
                  <div className="pt-2">
                    <label className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer transition-colors border border-slate-200">
                      <Upload className="w-3.5 h-3.5 text-[#B92025]" />
                      <span>Upload Image from Computer</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* IMAGE PREVIEW IN MODAL */}
                  {formImageUrl && (
                    <div className="relative aspect-[1920/728] w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 mt-2">
                      <Image
                        src={formImageUrl}
                        alt="Preview"
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                  )}
                </div>

                {/* TARGET LINK & BUTTON TEXT */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Target Link URL *</label>
                    <input
                      type="text"
                      required
                      value={formLinkUrl}
                      onChange={(e) => setFormLinkUrl(e.target.value)}
                      placeholder="/products?cat=surgical-instruments"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 outline-none focus:border-[#B92025]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">CTA Button Text</label>
                    <input
                      type="text"
                      value={formButtonText}
                      onChange={(e) => setFormButtonText(e.target.value)}
                      placeholder="SHOP NOW"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 outline-none focus:border-[#B92025]"
                    />
                  </div>
                </div>

                {/* DISPLAY MODE & ORDER */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Display Mode</label>
                    <select
                      value={formDisplayMode}
                      onChange={(e) => setFormDisplayMode(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 outline-none focus:border-[#B92025] bg-white cursor-pointer"
                    >
                      <option value="full_image">Full Graphic (Screenshot 3 Style)</option>
                      <option value="overlay_text">Overlay Text on Image</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Sort Order Position</label>
                    <input
                      type="number"
                      min={1}
                      value={formSortOrder}
                      onChange={(e) => setFormSortOrder(parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 outline-none focus:border-[#B92025]"
                    />
                  </div>
                </div>

                {/* ACTIVE STATUS CHECKBOX */}
                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="isActiveCheck"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="w-4 h-4 text-[#B92025] rounded border-slate-300 focus:ring-[#B92025]"
                  />
                  <label htmlFor="isActiveCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Publish Active on Storefront Homepage
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
                    <span>Save & Update Live</span>
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
