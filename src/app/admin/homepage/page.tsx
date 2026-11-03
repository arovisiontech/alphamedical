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
} from 'lucide-react'
import {
  getStoredDiscountProducts,
  saveStoredDiscountProducts,
  getStoredBanners,
  saveStoredBanners,
  getStoredFaqBulkInquiry,
  saveStoredFaqBulkInquiry,
  getStoredProcessOrder,
  saveStoredProcessOrder,
  getStoredVideoWhyChoose,
  saveStoredVideoWhyChoose,
  getStoredCompliancesPromo,
  saveStoredCompliancesPromo,
} from '@/src/lib/dataStore'
import {
  DiscountProductsSectionData,
  DiscountProductItem,
  FaqBulkInquiryData,
  ProcessOrderSectionData,
  VideoWhyChooseData,
  CompliancesPromoData,
} from '@/src/types/section'
import { BannerItem } from '@/src/types/banner'

export default function AdminHomePageCMS() {
  const [activeTab, setActiveTab] = useState<'discount' | 'banners' | 'process' | 'faq' | 'video'>('discount')
  const [discountData, setDiscountData] = useState<DiscountProductsSectionData>(getStoredDiscountProducts())
  const [banners, setBanners] = useState<BannerItem[]>(getStoredBanners())
  const [faqData, setFaqData] = useState<FaqBulkInquiryData>(getStoredFaqBulkInquiry())
  const [processData, setProcessData] = useState<ProcessOrderSectionData>(getStoredProcessOrder())
  const [videoData, setVideoData] = useState<VideoWhyChooseData>(getStoredVideoWhyChoose())
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const loadData = () => {
    setDiscountData(getStoredDiscountProducts())
    setBanners(getStoredBanners())
    setFaqData(getStoredFaqBulkInquiry())
    setProcessData(getStoredProcessOrder())
    setVideoData(getStoredVideoWhyChoose())
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
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Save Discount Section
  const handleSaveDiscount = (e: React.FormEvent) => {
    e.preventDefault()
    saveStoredDiscountProducts(discountData)
    showToast('Discount Products Section saved! Changes are live on Homepage.')
  }

  // Update discount item
  const handleUpdateDiscountItem = (id: string, field: keyof DiscountProductItem, val: any) => {
    setDiscountData((prev) => ({
      ...prev,
      products: (prev.products || []).map((it) => (it.id === id ? { ...it, [field]: val } : it)),
    }))
  }

  // Save Video / Why Choose
  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault()
    saveStoredVideoWhyChoose(videoData)
    showToast('Video & Why Choose Section saved successfully!')
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
              Edit all texts, titles, badges, discount products, banners, and media on your main live homepage.
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

        {/* TOAST MESSAGE */}
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
            onClick={() => setActiveTab('discount')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'discount'
                ? 'bg-[#96161B] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Discount Products Section (Screenshot 3)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('banners')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'banners'
                ? 'bg-[#96161B] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Hero Slider Banners</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('process')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'process'
                ? 'bg-[#96161B] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Order Process Steps</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'video'
                ? 'bg-[#96161B] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Why Choose & Video</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('faq')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'faq'
                ? 'bg-[#96161B] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>FAQ & Bulk Inquiries</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: DISCOUNT PRODUCTS SECTION (EXACT MATCH FOR SCREENSHOT 3)
        ========================================================================= */}
        {activeTab === 'discount' && (
          <form onSubmit={handleSaveDiscount} className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Edit Discount Products Section
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
            </div>
          </form>
        )}

        {/* =========================================================================
            TAB 2: HERO SLIDER BANNERS
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

        {/* =========================================================================
            TAB 3: ORDER PROCESS STEPS
        ========================================================================= */}
        {activeTab === 'process' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-slate-900">Order Process (How to Buy) Steps</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Edit the 4-step medical supplies ordering guide displayed on the homepage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {processData.steps.map((st, i) => (
                <div key={st.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <span className="w-7 h-7 rounded-full bg-[#96161B] text-white font-black text-xs flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div className="font-bold text-xs text-slate-900">{st.title}</div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{st.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: VIDEO & WHY CHOOSE
        ========================================================================= */}
        {activeTab === 'video' && (
          <form onSubmit={handleSaveVideo} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">Why Choose ALPHA Video Section</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update YouTube / MP4 video link and highlight points on the homepage.
                </p>
              </div>
              <button
                type="submit"
                className="bg-[#96161B] text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Section</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Section Main Heading</label>
                <input
                  type="text"
                  value={videoData.section_title || ''}
                  onChange={(e) => setVideoData({ ...videoData, section_title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Video URL (YouTube embed or MP4)</label>
                <input
                  type="text"
                  value={videoData.video_url}
                  onChange={(e) => setVideoData({ ...videoData, video_url: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>
            </div>
          </form>
        )}

      </div>
    </AdminShell>
  )
}

