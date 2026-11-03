'use client'

import React, { useState, useEffect } from 'react'
import AdminShell from '@/src/components/admin/AdminShell'
import Link from 'next/link'
import Image from 'next/image'
import {
  Sparkles,
  Tag,
  Video,
  Globe,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  Save,
  ArrowRight,
  Layers,
  ShoppingBag,
  ExternalLink,
  Edit3,
  Play,
  Award,
  Truck,
  Plus,
  Trash2,
  FileText,
  Users,
  ChevronDown,
  LayoutGrid,
} from 'lucide-react'
import {
  getStoredDiscountProducts,
  saveStoredDiscountProducts,
  getStoredBanners,
  getStoredFaqBulkInquiry,
  saveStoredFaqBulkInquiry,
  getStoredProcessOrder,
  saveStoredProcessOrder,
  getStoredVideoWhyChoose,
  saveStoredVideoWhyChoose,
  getStoredCompliancesPromo,
  saveStoredCompliancesPromo,
  getStoredWorldExport,
  saveStoredWorldExport,
  getStoredCategoriesHeader,
  saveStoredCategoriesHeader,
  getStoredCategories,
  saveStoredCategories,
} from '@/src/lib/dataStore'
import {
  DiscountProductsSectionData,
  DiscountProductItem,
  FaqBulkInquiryData,
  ProcessOrderSectionData,
  VideoWhyChooseData,
  CompliancesPromoData,
  WorldExportData,
  CategoriesCollectionHeaderData,
} from '@/src/types/section'
import { CategoryItem } from '@/src/types/category'
import { BannerItem } from '@/src/types/banner'

export default function AdminHomePageCMS() {
  const [activeTab, setActiveTab] = useState<
    'video' | 'categories' | 'discount' | 'export' | 'compliances' | 'process' | 'faq' | 'banners'
  >('video')

  // DATA STATES
  const [videoData, setVideoData] = useState<VideoWhyChooseData>(getStoredVideoWhyChoose())
  const [categoriesHeader, setCategoriesHeader] = useState<CategoriesCollectionHeaderData>(
    getStoredCategoriesHeader()
  )
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>(getStoredCategories())
  const [discountData, setDiscountData] = useState<DiscountProductsSectionData>(
    getStoredDiscountProducts()
  )
  const [exportData, setExportData] = useState<WorldExportData>(getStoredWorldExport())
  const [compliancesData, setCompliancesData] = useState<CompliancesPromoData>(
    getStoredCompliancesPromo()
  )
  const [processData, setProcessData] = useState<ProcessOrderSectionData>(getStoredProcessOrder())
  const [faqData, setFaqData] = useState<FaqBulkInquiryData>(getStoredFaqBulkInquiry())
  const [banners, setBanners] = useState<BannerItem[]>(getStoredBanners())

  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const loadAll = () => {
    setVideoData(getStoredVideoWhyChoose())
    setCategoriesHeader(getStoredCategoriesHeader())
    setCategoriesList(getStoredCategories())
    setDiscountData(getStoredDiscountProducts())
    setExportData(getStoredWorldExport())
    setCompliancesData(getStoredCompliancesPromo())
    setProcessData(getStoredProcessOrder())
    setFaqData(getStoredFaqBulkInquiry())
    setBanners(getStoredBanners())
  }

  useEffect(() => {
    loadAll()
    const handleUpdate = () => loadAll()
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

  // 1. SAVE VIDEO & WHY CHOOSE (SS 1)
  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault()
    saveStoredVideoWhyChoose(videoData)
    showToast('Why Choose & Video Section saved! Changes are live on Homepage.')
  }

  // 2. SAVE CATEGORIES COLLECTION (SS 2)
  const handleSaveCategories = (e: React.FormEvent) => {
    e.preventDefault()
    saveStoredCategoriesHeader(categoriesHeader)
    saveStoredCategories(categoriesList)
    showToast('Categories Collection section saved! Changes are live on Homepage.')
  }

  // 3. SAVE DISCOUNT PRODUCTS (SS 3)
  const handleSaveDiscount = (e: React.FormEvent) => {
    e.preventDefault()
    saveStoredDiscountProducts(discountData)
    showToast('Discount Products Section saved! Changes are live on Homepage.')
  }

  const handleUpdateDiscountItem = (id: string, field: keyof DiscountProductItem, val: any) => {
    setDiscountData((prev) => ({
      ...prev,
      products: (prev.products || []).map((it) => (it.id === id ? { ...it, [field]: val } : it)),
    }))
  }

  // 4. SAVE EXPORT DESTINATIONS
  const handleSaveExport = (e: React.FormEvent) => {
    e.preventDefault()
    saveStoredWorldExport(exportData)
    showToast('Export Destinations Section saved successfully!')
  }

  // 5. SAVE COMPLIANCES & PROMO
  const handleSaveCompliances = (e: React.FormEvent) => {
    e.preventDefault()
    saveStoredCompliancesPromo(compliancesData)
    showToast('Compliances & Health Care Promo Cards saved successfully!')
  }

  // 6. SAVE PROCESS ORDER (7 STEPS)
  const handleSaveProcess = (e: React.FormEvent) => {
    e.preventDefault()
    saveStoredProcessOrder(processData)
    showToast('Order Process (7 Steps) saved successfully!')
  }

  // 7. SAVE FAQ & BULK INQUIRY
  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault()
    saveStoredFaqBulkInquiry(faqData)
    showToast('FAQ & Bulk Inquiry Section saved successfully!')
  }

  return (
    <AdminShell>
      <div className="space-y-8 animate-fade-in font-sans">
        {/* HEADER BAR */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-red-50 text-[#96161B] text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Visual Home Page CMS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Home Page Sections Manager
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Edit all texts, video player, categories collection, discount items, global export stats, compliances, and order process steps.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Live Homepage</span>
            </Link>
          </div>
        </div>

        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg flex items-center gap-3 animate-fade-in text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* CMS NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'video'
                ? 'bg-[#96161B] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Why Choose & Video (SS 1)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-[#96161B] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Categories Collection (SS 2)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('discount')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'discount'
                ? 'bg-[#96161B] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Discount Products (SS 3)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'export'
                ? 'bg-[#96161B] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Export Destinations</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('compliances')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'compliances'
                ? 'bg-[#96161B] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Our Compliances & Health Care</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('process')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'process'
                ? 'bg-[#96161B] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Order Process (7 Steps)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('faq')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'faq'
                ? 'bg-[#96161B] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Support FAQ & Bulk Inquiry</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('banners')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'banners'
                ? 'bg-[#96161B] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Hero Banners</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: WHY CHOOSE & VIDEO (SCREENSHOT 1) WITH REAL VIDEO PLACEHOLDER
        ========================================================================= */}
        {activeTab === 'video' && (
          <form onSubmit={handleSaveVideo} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Why Choose ALPHA Video Section
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update YouTube / MP4 video link, poster image, and live video placeholder preview.
                </p>
              </div>
              <button
                type="submit"
                className="bg-[#96161B] hover:bg-[#7d1216] text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Section</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Section Main Heading
                </label>
                <input
                  type="text"
                  value={videoData.section_title || 'Why Choose ALPHA Medical Supplies?'}
                  onChange={(e) => setVideoData({ ...videoData, section_title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
                  placeholder="Why Choose ALPHA Medical Supplies?"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Section Subtitle
                </label>
                <input
                  type="text"
                  value={videoData.section_subtitle || ''}
                  onChange={(e) => setVideoData({ ...videoData, section_subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900"
                  placeholder="Trusted by professionals. Chosen for quality."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Video URL (YouTube embed or MP4 direct link)
                </label>
                <input
                  type="text"
                  value={videoData.video_url || ''}
                  onChange={(e) => setVideoData({ ...videoData, video_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-900"
                  placeholder="https://www.youtube.com/embed/dQw4w9WgXcQ"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Poster Image URL
                </label>
                <input
                  type="text"
                  value={videoData.poster_image || ''}
                  onChange={(e) => setVideoData({ ...videoData, poster_image: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900"
                  placeholder="/images/surgical-video-poster.jpg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Video Overlay Card Title
                </label>
                <input
                  type="text"
                  value={videoData.video_title || ''}
                  onChange={(e) => setVideoData({ ...videoData, video_title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900"
                  placeholder="Precision in Every Detail"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Video Overlay Subtitle
                </label>
                <input
                  type="text"
                  value={videoData.video_subtitle || ''}
                  onChange={(e) => setVideoData({ ...videoData, video_subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900"
                  placeholder="Watch how we maintain the highest standards from start to finish."
                />
              </div>
            </div>

            {/* LIVE VIDEO PLACEHOLDER & PLAYER PREVIEW (SCREENSHOT 1 RESOLUTION) */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 text-[#96161B] fill-[#96161B]" />
                  <span>Interactive Live Video Placeholder Preview</span>
                </span>
                <span className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-bold">
                  Matches Homepage Player
                </span>
              </div>

              <div className="aspect-[16/9] max-w-2xl mx-auto rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-800 shadow-xl relative group">
                {videoData.video_url && videoData.video_url.includes('youtube') ? (
                  <iframe
                    src={videoData.video_url}
                    title="Video Player Preview"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : videoData.video_url && videoData.video_url.endsWith('.mp4') ? (
                  <video
                    src={videoData.video_url}
                    poster={videoData.poster_image}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full relative flex items-center justify-center p-6 text-center">
                    {/* Background Poster fallback */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-950" />
                    
                    {/* Centered Play Button */}
                    <div className="relative z-10 space-y-3">
                      <div className="w-16 h-16 rounded-full bg-white/90 text-slate-950 flex items-center justify-center mx-auto shadow-2xl pl-1 hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 fill-[#96161B] text-[#96161B]" />
                      </div>
                      <h4 className="text-white font-extrabold text-base">
                        {videoData.video_title || 'Precision in Every Detail'}
                      </h4>
                      <p className="text-slate-400 text-xs max-w-md mx-auto">
                        {videoData.video_subtitle || 'Watch how we maintain the highest standards from start to finish.'}
                      </p>
                      <div className="inline-block px-3 py-1 bg-white/10 text-white rounded-full text-[11px] font-bold">
                        Video URL: {videoData.video_url || 'Enter video URL above'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 6 FEATURES EDITOR */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="font-bold text-sm text-slate-900">Why Choose Feature Points (6 Items)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {videoData.features.map((feat, idx) => (
                  <div key={feat.id || idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                    <span className="text-[10px] font-bold text-[#96161B] uppercase">Point #{idx + 1}</span>
                    <input
                      type="text"
                      value={feat.title}
                      onChange={(e) => {
                        const newF = [...videoData.features]
                        newF[idx] = { ...newF[idx], title: e.target.value }
                        setVideoData({ ...videoData, features: newF })
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={feat.description}
                      onChange={(e) => {
                        const newF = [...videoData.features]
                        newF[idx] = { ...newF[idx], description: e.target.value }
                        setVideoData({ ...videoData, features: newF })
                      }}
                      className="w-full px-2 py-1 rounded-lg border border-slate-300 text-[11px] text-slate-600"
                    />
                  </div>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* =========================================================================
            TAB 2: CATEGORIES COLLECTION (SCREENSHOT 2)
        ========================================================================= */}
        {activeTab === 'categories' && (
          <form onSubmit={handleSaveCategories} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Categories Collection Section (Screenshot 2)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Edit the header, subtitle, and featured cards for the Categories slider on the homepage.
                </p>
              </div>
              <button
                type="submit"
                className="bg-[#96161B] hover:bg-[#7d1216] text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Categories Section</span>
              </button>
            </div>

            {/* HEADER TEXTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Badge (Red Small Heading)
                </label>
                <input
                  type="text"
                  value={categoriesHeader.badge || ''}
                  onChange={(e) => setCategoriesHeader({ ...categoriesHeader, badge: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-[#96161B]"
                  placeholder="EXPLORE SURGICAL DISCIPLINES"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Main Section Title
                </label>
                <input
                  type="text"
                  value={categoriesHeader.title || ''}
                  onChange={(e) => setCategoriesHeader({ ...categoriesHeader, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-black text-slate-900"
                  placeholder="Categories Collection"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Section Description
                </label>
                <textarea
                  rows={2}
                  value={categoriesHeader.description || ''}
                  onChange={(e) => setCategoriesHeader({ ...categoriesHeader, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-700"
                  placeholder="Precision surgical instruments and specialty hospital equipment engineered for clinical excellence."
                />
              </div>
            </div>

            {/* PREVIEW OF TOP CATEGORY CARDS */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Featured Categories Cards</h3>
                  <p className="text-[11px] text-slate-500">
                    The top categories rendered in the horizontal slider.
                  </p>
                </div>
                <Link
                  href="/admin/categories"
                  className="text-xs font-bold text-[#96161B] hover:underline flex items-center gap-1"
                >
                  <span>Full Category Tree Editor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {categoriesList.slice(0, 8).map((cat, idx) => (
                  <div key={cat.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                    <span className="text-[10px] font-black text-[#96161B] uppercase">Card #{idx + 1}</span>
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white border border-slate-200 p-2 flex items-center justify-center relative">
                      <img
                        src={cat.image_url || '/images/categories/surgical-instruments.jpg'}
                        alt={cat.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Category Name</label>
                      <input
                        type="text"
                        value={cat.name}
                        onChange={(e) => {
                          const updated = [...categoriesList]
                          updated[idx] = { ...updated[idx], name: e.target.value }
                          setCategoriesList(updated)
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Image URL</label>
                      <input
                        type="text"
                        value={cat.image_url || ''}
                        onChange={(e) => {
                          const updated = [...categoriesList]
                          updated[idx] = { ...updated[idx], image_url: e.target.value }
                          setCategoriesList(updated)
                        }}
                        className="w-full px-2 py-1 rounded-lg border border-slate-300 text-[11px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* =========================================================================
            TAB 3: DISCOUNT PRODUCTS (SCREENSHOT 3)
        ========================================================================= */}
        {activeTab === 'discount' && (
          <form onSubmit={handleSaveDiscount} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Edit Discount Products Section (Screenshot 3)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Controls the slider showing ORTHO WEITLANER RETRACTORS and promotional sale products on the homepage.
                </p>
              </div>
              <button
                type="submit"
                className="bg-[#96161B] hover:bg-[#7d1216] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </button>
            </div>

            {/* SECTION HEADINGS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Top Small Heading (Badge)
                </label>
                <input
                  type="text"
                  value={discountData.subtitle || ''}
                  onChange={(e) => setDiscountData({ ...discountData, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                  placeholder="EXPLORE OUR RANGE"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Title Line 1
                  </label>
                  <input
                    type="text"
                    value={discountData.title_line1 || ''}
                    onChange={(e) => setDiscountData({ ...discountData, title_line1: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 font-bold"
                    placeholder="DISCOUNT"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Title Line 2
                  </label>
                  <input
                    type="text"
                    value={discountData.title_line2 || ''}
                    onChange={(e) => setDiscountData({ ...discountData, title_line2: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 font-bold"
                    placeholder="PRODUCTS"
                  />
                </div>
              </div>
            </div>

            {/* DISCOUNT PRODUCT ITEMS */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Featured Discount Slider Items</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(discountData.products || []).map((it, idx) => (
                  <div key={it.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-[#96161B]">Item #{idx + 1}</span>
                      <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        {it.badge || 'SALE'}
                      </span>
                    </div>

                    <div className="aspect-square bg-white rounded-xl border border-slate-200 p-2 flex items-center justify-center relative overflow-hidden">
                      <img
                        src={it.featured_image || '/images/products/image-399.png'}
                        alt={it.title}
                        className="object-contain w-full h-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Title</label>
                        <input
                          type="text"
                          value={it.title}
                          onChange={(e) => handleUpdateDiscountItem(it.id, 'title', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Price ($)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={it.price}
                            onChange={(e) => handleUpdateDiscountItem(it.id, 'price', parseFloat(e.target.value))}
                            className="w-full px-2 py-1 rounded-lg border border-slate-300 text-xs font-bold text-[#96161B]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Original ($)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={it.original_price}
                            onChange={(e) => handleUpdateDiscountItem(it.id, 'original_price', parseFloat(e.target.value))}
                            className="w-full px-2 py-1 rounded-lg border border-slate-300 text-xs line-through"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Image URL</label>
                        <input
                          type="text"
                          value={it.featured_image}
                          onChange={(e) => handleUpdateDiscountItem(it.id, 'featured_image', e.target.value)}
                          className="w-full px-2 py-1 rounded-lg border border-slate-300 text-[11px]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* =========================================================================
            TAB 4: EXPORT DESTINATIONS
        ========================================================================= */}
        {activeTab === 'export' && (
          <form onSubmit={handleSaveExport} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Export Destinations Section
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage worldwide export stats, qualified staff, total instruments, and country flags.
                </p>
              </div>
              <button
                type="submit"
                className="bg-[#96161B] hover:bg-[#7d1216] text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Export Section</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Top Badge</label>
                <input
                  type="text"
                  value={exportData.badge_text || ''}
                  onChange={(e) => setExportData({ ...exportData, badge_text: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-[#96161B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Heading Line 1</label>
                <input
                  type="text"
                  value={exportData.heading_line1 || ''}
                  onChange={(e) => setExportData({ ...exportData, heading_line1: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Heading Line 2 & 3</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={exportData.heading_line2 || ''}
                    onChange={(e) => setExportData({ ...exportData, heading_line2: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-[#96161B]"
                  />
                  <input
                    type="text"
                    value={exportData.heading_line3 || ''}
                    onChange={(e) => setExportData({ ...exportData, heading_line3: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-[#96161B]"
                  />
                </div>
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">Description Paragraph</label>
                <textarea
                  rows={2}
                  value={exportData.description || ''}
                  onChange={(e) => setExportData({ ...exportData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Staff Stat</label>
                <input
                  type="text"
                  value={exportData.staff_count || ''}
                  onChange={(e) => setExportData({ ...exportData, staff_count: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-[#96161B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Staff Label</label>
                <input
                  type="text"
                  value={exportData.staff_label || ''}
                  onChange={(e) => setExportData({ ...exportData, staff_label: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Instruments Stat</label>
                <input
                  type="text"
                  value={exportData.instruments_count || ''}
                  onChange={(e) => setExportData({ ...exportData, instruments_count: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-[#96161B]"
                />
              </div>
            </div>

            {/* DESTINATION FLAGS */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="font-bold text-sm text-slate-900">Export Country Destinations & Flags</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {exportData.destinations.map((dst, i) => (
                  <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
                    <span className="text-2xl">{dst.flag}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 truncate">{dst.country}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{dst.code}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* =========================================================================
            TAB 5: OUR COMPLIANCES & HEALTH CARE
        ========================================================================= */}
        {activeTab === 'compliances' && (
          <form onSubmit={handleSaveCompliances} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Our Compliances & Action Promo Cards
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update ISO/FDA certifications and the 2 promotional healthcare cards on the homepage.
                </p>
              </div>
              <button
                type="submit"
                className="bg-[#96161B] hover:bg-[#7d1216] text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Compliances Section</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Badge Text</label>
                <input
                  type="text"
                  value={compliancesData.compliance_badge || ''}
                  onChange={(e) => setCompliancesData({ ...compliancesData, compliance_badge: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-[#96161B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title Line 1</label>
                <input
                  type="text"
                  value={compliancesData.compliance_title_line1 || ''}
                  onChange={(e) => setCompliancesData({ ...compliancesData, compliance_title_line1: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title Line 2</label>
                <input
                  type="text"
                  value={compliancesData.compliance_title_line2 || ''}
                  onChange={(e) => setCompliancesData({ ...compliancesData, compliance_title_line2: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={compliancesData.compliance_description || ''}
                  onChange={(e) => setCompliancesData({ ...compliancesData, compliance_description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>

            {/* 2 PROMOTIONAL CARDS */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LEFT CARD */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <span className="text-[10px] font-black text-[#96161B] uppercase">Left Promo Card</span>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Card Badge</label>
                  <input
                    type="text"
                    value={compliancesData.left_card.badge_text}
                    onChange={(e) => setCompliancesData({
                      ...compliancesData,
                      left_card: { ...compliancesData.left_card, badge_text: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Headline</label>
                  <input
                    type="text"
                    value={compliancesData.left_card.title}
                    onChange={(e) => setCompliancesData({
                      ...compliancesData,
                      left_card: { ...compliancesData.left_card, title: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Highlight Title</label>
                  <input
                    type="text"
                    value={compliancesData.left_card.highlight_title}
                    onChange={(e) => setCompliancesData({
                      ...compliancesData,
                      left_card: { ...compliancesData.left_card, highlight_title: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-[#96161B]"
                  />
                </div>
              </div>

              {/* RIGHT CARD */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <span className="text-[10px] font-black text-[#96161B] uppercase">Right Promo Card</span>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Headline Line 1</label>
                  <input
                    type="text"
                    value={compliancesData.right_card.title_line1}
                    onChange={(e) => setCompliancesData({
                      ...compliancesData,
                      right_card: { ...compliancesData.right_card, title_line1: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Headline Line 2</label>
                  <input
                    type="text"
                    value={compliancesData.right_card.title_line2}
                    onChange={(e) => setCompliancesData({
                      ...compliancesData,
                      right_card: { ...compliancesData.right_card, title_line2: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Button Text</label>
                  <input
                    type="text"
                    value={compliancesData.right_card.button_text}
                    onChange={(e) => setCompliancesData({
                      ...compliancesData,
                      right_card: { ...compliancesData.right_card, button_text: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                  />
                </div>
              </div>
            </div>
          </form>
        )}

        {/* =========================================================================
            TAB 6: ORDER PROCESS (7 STEPS)
        ========================================================================= */}
        {activeTab === 'process' && (
          <form onSubmit={handleSaveProcess} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Order Process (7 Steps)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  HOW ALPHA WHOLESALE MEDICAL SUPPLIES Processes Your Order.
                </p>
              </div>
              <button
                type="submit"
                className="bg-[#96161B] hover:bg-[#7d1216] text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save 7 Steps</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Section Subtitle</label>
                <input
                  type="text"
                  value={processData.subtitle || ''}
                  onChange={(e) => setProcessData({ ...processData, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-[#96161B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={processData.tagline || ''}
                  onChange={(e) => setProcessData({ ...processData, tagline: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>
            </div>

            {/* 7 STEPS CARDS */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">All 7 Manufacturing & Delivery Steps</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {processData.steps.map((st, i) => (
                  <div key={st.id || i} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="w-8 h-8 rounded-full bg-[#96161B] text-white font-black text-xs flex items-center justify-center">
                        {st.step_number || `0${i + 1}`}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{st.id}</span>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Step Title</label>
                      <input
                        type="text"
                        value={st.title}
                        onChange={(e) => {
                          const newSteps = [...processData.steps]
                          newSteps[i] = { ...newSteps[i], title: e.target.value }
                          setProcessData({ ...processData, steps: newSteps })
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Description</label>
                      <textarea
                        rows={2}
                        value={st.description}
                        onChange={(e) => {
                          const newSteps = [...processData.steps]
                          newSteps[i] = { ...newSteps[i], description: e.target.value }
                          setProcessData({ ...processData, steps: newSteps })
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-[11px] text-slate-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* =========================================================================
            TAB 7: SUPPORT FAQ & BULK INQUIRY
        ========================================================================= */}
        {activeTab === 'faq' && (
          <form onSubmit={handleSaveFaq} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Support FAQ & Bulk Inquiry Section
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Edit questions, answers, and the luxury business solutions bulk inquiry banner.
                </p>
              </div>
              <button
                type="submit"
                className="bg-[#96161B] hover:bg-[#7d1216] text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save FAQ Section</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">FAQ Subtitle</label>
                <input
                  type="text"
                  value={faqData.faq_subtitle || ''}
                  onChange={(e) => setFaqData({ ...faqData, faq_subtitle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-[#96161B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">FAQ Main Title</label>
                <input
                  type="text"
                  value={faqData.faq_title || ''}
                  onChange={(e) => setFaqData({ ...faqData, faq_title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-black text-slate-900"
                />
              </div>
            </div>

            {/* 5 FAQS */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Frequently Asked Questions</h3>

              <div className="space-y-3">
                {faqData.faqs.map((f, idx) => (
                  <div key={f.id || idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#96161B] text-white text-xs font-black flex items-center justify-center">
                        ?
                      </span>
                      <input
                        type="text"
                        value={f.question}
                        onChange={(e) => {
                          const newF = [...faqData.faqs]
                          newF[idx] = { ...newF[idx], question: e.target.value }
                          setFaqData({ ...faqData, faqs: newF })
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={f.answer}
                      onChange={(e) => {
                        const newF = [...faqData.faqs]
                        newF[idx] = { ...newF[idx], answer: e.target.value }
                        setFaqData({ ...faqData, faqs: newF })
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-700"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* BULK INQUIRY BANNER */}
            <div className="pt-4 border-t border-slate-100 bg-red-50/50 p-5 rounded-2xl border border-red-100 space-y-3">
              <span className="text-[10px] font-black text-[#96161B] uppercase">Business Solutions Banner</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase">Banner Subtitle</label>
                  <input
                    type="text"
                    value={faqData.inquiry_subtitle}
                    onChange={(e) => setFaqData({ ...faqData, inquiry_subtitle: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase">Description</label>
                  <input
                    type="text"
                    value={faqData.inquiry_description}
                    onChange={(e) => setFaqData({ ...faqData, inquiry_description: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase">Button Text</label>
                  <input
                    type="text"
                    value={faqData.inquiry_button_text}
                    onChange={(e) => setFaqData({ ...faqData, inquiry_button_text: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                  />
                </div>
              </div>
            </div>
          </form>
        )}

        {/* =========================================================================
            TAB 8: HERO SLIDER BANNERS
        ========================================================================= */}
        {activeTab === 'banners' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">Hero Banners Manager</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage the main full-width slide banners displayed at the top of the homepage.
                </p>
              </div>
              <Link
                href="/admin/content"
                className="bg-[#96161B] hover:bg-[#7d1216] text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Full Banner Studio</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banners.map((b) => (
                <div key={b.id} className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-[#96161B] uppercase">{b.title}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">{b.subtitle}</p>
                  <div className="aspect-[16/9] rounded-xl bg-white border border-slate-200 overflow-hidden relative">
                    <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
