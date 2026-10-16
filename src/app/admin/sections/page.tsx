'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import AdminShell from '@/src/components/admin/AdminShell'
import {
  Video,
  Globe,
  Award,
  Save,
  CheckCircle2,
  RefreshCw,
  Plus,
  Trash2,
  Play,
  Bell,
  ArrowRight,
  ListOrdered,
  Layers,
  Sparkles,
  Tag,
  ShoppingCart,
  HelpCircle,
} from 'lucide-react'
import {
  getStoredVideoWhyChoose,
  saveStoredVideoWhyChoose,
  getStoredWorldExport,
  saveStoredWorldExport,
  getStoredCompliancesPromo,
  saveStoredCompliancesPromo,
  getStoredProcessOrder,
  saveStoredProcessOrder,
  getStoredDiscountProducts,
  saveStoredDiscountProducts,
  getStoredFaqBulkInquiry,
  saveStoredFaqBulkInquiry,
} from '@/src/lib/dataStore'
import {
  VideoWhyChooseData,
  WorldExportData,
  CompliancesPromoData,
  ComplianceBadgeItem,
  ProcessOrderSectionData,
  ProcessOrderStep,
  DiscountProductsSectionData,
  DiscountProductItem,
  FaqBulkInquiryData,
  FaqItem,
} from '@/src/types/section'

export default function AdminSectionsPage() {
  const [activeTab, setActiveTab] = useState<'faq' | 'discount' | 'process' | 'compliances' | 'video' | 'world'>('faq')
  const [faqData, setFaqData] = useState<FaqBulkInquiryData>(getStoredFaqBulkInquiry())
  const [discountData, setDiscountData] = useState<DiscountProductsSectionData>(getStoredDiscountProducts())
  const [processData, setProcessData] = useState<ProcessOrderSectionData>(getStoredProcessOrder())
  const [compliancesData, setCompliancesData] = useState<CompliancesPromoData>(getStoredCompliancesPromo())
  const [videoData, setVideoData] = useState<VideoWhyChooseData>(getStoredVideoWhyChoose())
  const [worldData, setWorldData] = useState<WorldExportData>(getStoredWorldExport())
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const loadData = () => {
    setFaqData(getStoredFaqBulkInquiry())
    setDiscountData(getStoredDiscountProducts())
    setProcessData(getStoredProcessOrder())
    setCompliancesData(getStoredCompliancesPromo())
    setVideoData(getStoredVideoWhyChoose())
    setWorldData(getStoredWorldExport())
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

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault()
    saveStoredFaqBulkInquiry(faqData)
    showToast('FAQ & Bulk Inquiry Section saved! Changes are live & saved across page reload.')
  }

  const handleAddFaq = () => {
    const newFaq: FaqItem = {
      id: `faq-${Date.now()}`,
      question: 'New Frequently Asked Question?',
      answer: 'Detailed response explaining medical supply policies, specs, or ordering processes.',
    }
    setFaqData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, newFaq],
    }))
  }

  const handleRemoveFaq = (id: string) => {
    setFaqData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((f) => f.id !== id),
    }))
  }

  const handleUpdateFaq = (id: string, field: 'question' | 'answer', value: string) => {
    setFaqData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
    }))
  }

  const handleSaveDiscount = (e: React.FormEvent) => {
    e.preventDefault()
    saveStoredDiscountProducts(discountData)
    showToast('Discount Products Section saved! Changes are live & saved across page reload.')
  }

  const handleAddDiscountProduct = () => {
    const newId = `disc-${Date.now()}`
    const newProd: DiscountProductItem = {
      id: newId,
      title: 'ORTHO WEITLANER RETRACTOR SHARP',
      sku: '1001',
      original_price: 64.95,
      price: 55.95,
      badge: 'Sale',
      in_stock: true,
      featured_image: '/images/products/image-399.png',
      slug: `ortho-weitlaner-retractor-sharp-${Date.now()}`,
      sort_order: discountData.products.length + 1,
    }
    setDiscountData((prev) => ({
      ...prev,
      products: [...prev.products, newProd],
    }))
  }

  const handleRemoveDiscountProduct = (id: string) => {
    setDiscountData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id),
    }))
  }

  const handleUpdateDiscountProduct = (
    id: string,
    field: keyof DiscountProductItem,
    value: any
  ) => {
    setDiscountData((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    }))
  }

  const handleSaveProcess = (e: React.FormEvent) => {
    e.preventDefault()
    saveStoredProcessOrder(processData)
    showToast('Order Process Workflow saved! Changes are live & saved across page reload.')
  }

  const handleSaveCompliances = (e: React.FormEvent) => {
    e.preventDefault()
    saveStoredCompliancesPromo(compliancesData)
    showToast('Global Compliances & Promo Cards Section saved! Changes are live & saved across page reload.')
  }

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault()
    saveStoredVideoWhyChoose(videoData)
    showToast('Video & Why Choose Section saved! Changes are live & saved across page reload.')
  }

  const handleSaveWorld = (e: React.FormEvent) => {
    e.preventDefault()
    saveStoredWorldExport(worldData)
    showToast('World Export Destinations Section saved! Changes are live & saved across page reload.')
  }

  // Process Steps helpers
  const handleAddProcessStep = () => {
    const nextNum = String(processData.steps.length + 1).padStart(2, '0')
    const newStep: ProcessOrderStep = {
      id: `step-${Date.now()}`,
      step_number: nextNum,
      title: 'New Process Milestone',
      description: 'Enter detailed milestone verification and customer update process.',
      icon_name: 'clipboard-search',
    }
    setProcessData((prev) => ({
      ...prev,
      steps: [...prev.steps, newStep],
    }))
  }

  const handleRemoveProcessStep = (id: string) => {
    setProcessData((prev) => ({
      ...prev,
      steps: prev.steps.filter((s) => s.id !== id),
    }))
  }

  // Compliances helper functions
  const handleAddCompliance = () => {
    const newItem: ComplianceBadgeItem = {
      id: `comp-${Date.now()}`,
      type: 'iso',
      code: '13485 : 2016',
      label: 'ISO 13485:2016',
    }
    setCompliancesData((prev) => ({
      ...prev,
      compliances: [...prev.compliances, newItem],
    }))
  }

  const handleRemoveCompliance = (id: string) => {
    setCompliancesData((prev) => ({
      ...prev,
      compliances: prev.compliances.filter((c) => c.id !== id),
    }))
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
              <span>Interactive Homepage Sections (Screenshots 1 & 2)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Homepage Sections & Process Workflow Manager
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              100% dynamic management for 7-Step Order Process Workflow, Compliances, Promo Cards, Video, and Global Export sections. All edits persist permanently on refresh (F5).
            </p>
          </div>
          <button
            onClick={() => {
              loadData()
              showToast('Refreshed data from storage!')
            }}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all self-start md:self-auto cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'faq'
                ? 'bg-[#96161B] text-white shadow-md shadow-red-950/20'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>FAQ & Bulk Inquiry Showcase</span>
          </button>

          <button
            onClick={() => setActiveTab('discount')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'discount'
                ? 'bg-[#96161B] text-white shadow-md shadow-red-950/20'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Discount Products Showcase</span>
          </button>

          <button
            onClick={() => setActiveTab('process')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'process'
                ? 'bg-[#96161B] text-white shadow-md shadow-red-950/20'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>7-Step Order Process Workflow</span>
          </button>

          <button
            onClick={() => setActiveTab('compliances')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'compliances'
                ? 'bg-[#96161B] text-white shadow-md shadow-red-950/20'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Global Compliances & Promo Cards</span>
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'video'
                ? 'bg-[#96161B] text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Video & Why Choose Section</span>
          </button>

          <button
            onClick={() => setActiveTab('world')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'world'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>World Export Globe Section</span>
          </button>
        </div>

        {/* =========================================================
            TAB -1: FAQ & BULK INQUIRY LUXURY SECTION (MATCHING SCREENSHOT 1)
        ========================================================= */}
        {activeTab === 'faq' && (
          <form onSubmit={handleSaveFaq} className="space-y-6 sm:space-y-8">
            
            {/* LIVE PREVIEW BOX (MATCHING SCREENSHOT 1) */}
            <div className="bg-[#0b0304] text-white p-6 sm:p-8 rounded-3xl border border-red-950/60 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-red-950/60 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-black text-white uppercase tracking-wider">
                    Storefront Live Preview (Interactive Layout)
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-400">Updates in real-time as you type</span>
              </div>

              {/* Exact Screenshot 1 Preview 2-Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 bg-[#140608]/70 rounded-2xl border border-red-950/40">
                {/* Left Card Preview: FAQ */}
                <div className="bg-[#18080b] rounded-2xl p-6 border border-red-950/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/80 tracking-widest uppercase">
                          <span className="w-4 h-[1.5px] bg-white inline-block" />
                          <span>{faqData.faq_subtitle}</span>
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase">{faqData.faq_title}</h3>
                      </div>
                      <div className="text-[8px] font-bold text-slate-400 uppercase text-right leading-tight">
                        {faqData.faq_tag}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-4">{faqData.faq_description}</p>

                    <div className="space-y-2">
                      {faqData.faqs.slice(0, 3).map((f, i) => (
                        <div
                          key={f.id || i}
                          className={`p-3 rounded-xl text-xs border ${
                            i === 0
                              ? 'bg-[#220d11] border-red-900/80 text-white'
                              : 'bg-[#19090c] border-red-950/40 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-4 h-4 rounded-full bg-[#96161B] text-white flex items-center justify-center text-[10px] font-bold">
                                ?
                              </span>
                              <span className="font-bold text-[11px]">{f.question}</span>
                            </div>
                            <span>{i === 0 ? '▲' : '▼'}</span>
                          </div>
                          {i === 0 && (
                            <div className="text-[10px] text-slate-300 pt-2 pl-6 border-t border-red-950/40 mt-2">
                              {f.answer}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Card Preview: Bulk Inquiry */}
                <div className="bg-[#18080b] rounded-2xl p-6 border border-red-950/60 relative overflow-hidden flex flex-col justify-between">
                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300 tracking-widest uppercase">
                          <span className="w-4 h-[1.5px] bg-[#96161B] inline-block" />
                          <span>{faqData.inquiry_subtitle}</span>
                        </div>
                        <h3 className="text-2xl font-black">
                          <span className="text-white">{faqData.inquiry_title_p1} </span>
                          <span className="text-[#96161B]">{faqData.inquiry_title_p2}</span>
                        </h3>
                      </div>
                      <div className="text-[8px] font-bold text-slate-400 uppercase text-right leading-tight">
                        PRECISION • SAFETY<br />RELIABILITY • WORLDWIDE
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-300 mb-4 max-w-xs">{faqData.inquiry_description}</p>
                    <div className="inline-flex items-center gap-1.5 bg-[#96161B] text-white text-xs font-bold px-4 py-2 rounded-full mb-6">
                      <span>{faqData.inquiry_button_text}</span>
                      <span>→</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-red-950/50">
                      {faqData.inquiry_badges.map((b) => (
                        <div key={b.id} className="text-center">
                          <div className="text-[9px] font-bold text-slate-300 uppercase">{b.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* LEFT CARD SETTINGS: FAQ */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#96161B]" />
                  <span>Left Card: FAQ Questions List ({faqData.faqs.length})</span>
                </h3>
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#96161B] hover:bg-[#801317] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Question</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Small Subtitle
                  </label>
                  <input
                    type="text"
                    value={faqData.faq_subtitle}
                    onChange={(e) => setFaqData({ ...faqData, faq_subtitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Main Title
                  </label>
                  <input
                    type="text"
                    value={faqData.faq_title}
                    onChange={(e) => setFaqData({ ...faqData, faq_title: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Description Text
                  </label>
                  <input
                    type="text"
                    value={faqData.faq_description}
                    onChange={(e) => setFaqData({ ...faqData, faq_description: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Top-Right Note Tag
                  </label>
                  <input
                    type="text"
                    value={faqData.faq_tag}
                    onChange={(e) => setFaqData({ ...faqData, faq_tag: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              {/* FAQ Items */}
              <div className="space-y-4 pt-2">
                {faqData.faqs.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#96161B] text-white font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-800 uppercase">Question {idx + 1}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFaq(item.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Question</label>
                        <input
                          type="text"
                          value={item.question}
                          onChange={(e) => handleUpdateFaq(item.id, 'question', e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Answer</label>
                        <textarea
                          rows={2}
                          value={item.answer}
                          onChange={(e) => handleUpdateFaq(item.id, 'answer', e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT CARD SETTINGS: BULK INQUIRY */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#96161B]" />
                <span>Right Card: Bulk Inquiry & Business Solutions</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Small Subtitle
                  </label>
                  <input
                    type="text"
                    value={faqData.inquiry_subtitle}
                    onChange={(e) => setFaqData({ ...faqData, inquiry_subtitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Title Part 1 (White)
                  </label>
                  <input
                    type="text"
                    value={faqData.inquiry_title_p1}
                    onChange={(e) => setFaqData({ ...faqData, inquiry_title_p1: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Title Part 2 (Red)
                  </label>
                  <input
                    type="text"
                    value={faqData.inquiry_title_p2}
                    onChange={(e) => setFaqData({ ...faqData, inquiry_title_p2: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold text-[#96161B]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Description Text
                  </label>
                  <input
                    type="text"
                    value={faqData.inquiry_description}
                    onChange={(e) => setFaqData({ ...faqData, inquiry_description: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={faqData.inquiry_button_text}
                    onChange={(e) => setFaqData({ ...faqData, inquiry_button_text: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Button Link URL
                  </label>
                  <input
                    type="text"
                    value={faqData.inquiry_button_url}
                    onChange={(e) => setFaqData({ ...faqData, inquiry_button_url: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Background Image URL
                  </label>
                  <input
                    type="text"
                    value={faqData.inquiry_image}
                    onChange={(e) => setFaqData({ ...faqData, inquiry_image: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Bottom Quote
                  </label>
                  <input
                    type="text"
                    value={faqData.bottom_quote}
                    onChange={(e) => setFaqData({ ...faqData, bottom_quote: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Bottom Tagline
                  </label>
                  <input
                    type="text"
                    value={faqData.bottom_tag}
                    onChange={(e) => setFaqData({ ...faqData, bottom_tag: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* STICKY SAVE ACTIONS */}
            <div className="sticky bottom-6 z-40 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-xl flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">
                Changes persist permanently in storage across page reload (F5).
              </span>
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#96161B] hover:bg-[#7d1216] text-white px-8 py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider cursor-pointer shadow-lg shadow-red-950/20 active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save FAQ & Bulk Inquiry Section</span>
              </button>
            </div>
          </form>
        )}

        {/* =========================================================
            TAB 0: DISCOUNT PRODUCTS SHOWCASE (MATCHING SCREENSHOT 1)
        ========================================================= */}
        {activeTab === 'discount' && (
          <form onSubmit={handleSaveDiscount} className="space-y-6 sm:space-y-8">
            
            {/* LIVE PREVIEW BOX (MATCHING SCREENSHOT 1) */}
            <div className="bg-gradient-to-br from-slate-50 to-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Storefront Live Preview (Interactive Layout)
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-400">Updates in real-time as you type</span>
              </div>

              {/* Exact Screenshot 1 Preview Card Grid */}
              <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-inner overflow-hidden">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-7 h-[2px] bg-[#96161B] rounded-full inline-block" />
                      <span className="text-xs font-bold text-[#96161B] uppercase tracking-wider">
                        {discountData.subtitle}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase">
                      <span>{discountData.title_line1} </span>
                      <span className="text-[#96161B]">{discountData.title_line2}</span>
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#64748b] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                      ‹
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#96161B] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                      ›
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {discountData.products.slice(0, 4).map((p, idx) => (
                    <div
                      key={p.id || idx}
                      className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <span className="bg-[#96161B] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                          {p.badge || 'Sale'}
                        </span>
                        <div className="relative w-full h-32 my-2 flex items-center justify-center bg-slate-50/50 rounded-xl">
                          <Image
                            src={p.featured_image || '/images/products/image-399.png'}
                            alt={p.title}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                        <h4 className="text-xs font-extrabold text-slate-900 uppercase leading-snug line-clamp-2 min-h-[32px] mb-1">
                          {p.title}
                        </h4>
                        <div className="text-[10px] font-semibold text-slate-400 mb-1">
                          SKU:{p.sku}
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                          {p.original_price && (
                            <span className="text-xs font-bold text-slate-900 line-through">
                              ${p.original_price.toFixed(2)}
                            </span>
                          )}
                          <span className="text-sm font-black text-[#96161B]">
                            ${p.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 mb-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{p.in_stock ? 'In Stock' : 'Out of Stock'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                        <div className="border border-slate-200 rounded px-1.5 py-0.5 text-[11px] font-bold text-slate-700 bg-white">
                          - 1 +
                        </div>
                        <div className="flex-1 bg-[#96161B] text-white rounded py-1 px-2 text-[10px] font-bold flex items-center justify-center gap-1">
                          <ShoppingCart className="w-3 h-3" />
                          <span>Add To Cart</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION HEADINGS FORM */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#96161B]" />
                <span>Section Header Text & Badges</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Small Subtitle
                  </label>
                  <input
                    type="text"
                    value={discountData.subtitle}
                    onChange={(e) =>
                      setDiscountData({ ...discountData, subtitle: e.target.value })
                    }
                    className="w-full px-4 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#96161B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Main Title Word 1 (Black)
                  </label>
                  <input
                    type="text"
                    value={discountData.title_line1}
                    onChange={(e) =>
                      setDiscountData({ ...discountData, title_line1: e.target.value })
                    }
                    className="w-full px-4 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#96161B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Main Title Word 2 (Red)
                  </label>
                  <input
                    type="text"
                    value={discountData.title_line2}
                    onChange={(e) =>
                      setDiscountData({ ...discountData, title_line2: e.target.value })
                    }
                    className="w-full px-4 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#96161B] text-[#96161B] font-bold"
                  />
                </div>
              </div>
            </div>

            {/* DYNAMIC PRODUCTS MANAGER */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-[#96161B]" />
                  <span>Discount Products List ({discountData.products.length})</span>
                </h3>
                <button
                  type="button"
                  onClick={handleAddDiscountProduct}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#96161B] hover:bg-[#801317] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Product</span>
                </button>
              </div>

              <div className="space-y-4">
                {discountData.products.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-5 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-4 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-800 text-white font-black text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-black text-slate-900 uppercase">
                          {item.title}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDiscountProduct(item.id)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Product Title
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) =>
                            handleUpdateDiscountProduct(item.id, 'title', e.target.value)
                          }
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          SKU Code
                        </label>
                        <input
                          type="text"
                          value={item.sku}
                          onChange={(e) =>
                            handleUpdateDiscountProduct(item.id, 'sku', e.target.value)
                          }
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Original Price ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.original_price}
                          onChange={(e) =>
                            handleUpdateDiscountProduct(
                              item.id,
                              'original_price',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Discount / Sale Price ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.price}
                          onChange={(e) =>
                            handleUpdateDiscountProduct(
                              item.id,
                              'price',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-bold text-[#96161B]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Badge Label
                        </label>
                        <input
                          type="text"
                          value={item.badge}
                          onChange={(e) =>
                            handleUpdateDiscountProduct(item.id, 'badge', e.target.value)
                          }
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Image Path
                        </label>
                        <input
                          type="text"
                          value={item.featured_image}
                          onChange={(e) =>
                            handleUpdateDiscountProduct(item.id, 'featured_image', e.target.value)
                          }
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-5">
                        <input
                          type="checkbox"
                          id={`in-stock-${item.id}`}
                          checked={item.in_stock}
                          onChange={(e) =>
                            handleUpdateDiscountProduct(item.id, 'in_stock', e.target.checked)
                          }
                          className="w-4 h-4 text-[#96161B] rounded focus:ring-[#96161B] cursor-pointer"
                        />
                        <label
                          htmlFor={`in-stock-${item.id}`}
                          className="text-xs font-bold text-slate-700 uppercase cursor-pointer"
                        >
                          In Stock
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* STICKY SAVE ACTIONS */}
            <div className="sticky bottom-6 z-40 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-xl flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">
                Changes persist permanently in storage across page reload (F5).
              </span>
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#96161B] hover:bg-[#7d1216] text-white px-8 py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider cursor-pointer shadow-lg shadow-red-950/20 active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Discount Products Section</span>
              </button>
            </div>
          </form>
        )}

        {/* =========================================================
            TAB 1: 7-STEP ORDER PROCESS WORKFLOW FORM (MATCHING SCREENSHOT 1)
        ========================================================= */}
        {activeTab === 'process' && (
          <form onSubmit={handleSaveProcess} className="space-y-6 sm:space-y-8">
            
            {/* LIVE PREVIEW BOX */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
              <div className="text-xs font-bold text-[#96161B] uppercase tracking-wider mb-2">
                Live Storefront Section Preview
              </div>
              <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 space-y-6">
                <div className="text-center max-w-xl mx-auto space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {processData.subtitle}
                  </div>
                  <div className="text-xl sm:text-2xl font-black">
                    <span className="text-slate-900">{processData.title_line1} </span>
                    <span className="text-[#96161B]">{processData.title_line2}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{processData.tagline}</div>
                </div>

                {/* Steps Mini Preview */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  {processData.steps.map((st) => (
                    <div key={st.id} className="bg-white p-3 rounded-xl border border-slate-200 text-center space-y-1">
                      <div className="w-6 h-6 rounded-full bg-[#96161B] text-white text-[10px] font-black mx-auto flex items-center justify-center">
                        {st.step_number}
                      </div>
                      <div className="text-[11px] font-extrabold text-slate-900 line-clamp-1">{st.title}</div>
                      <div className="text-[9px] text-slate-500 line-clamp-2">{st.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION HEADINGS FORM */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
                1. Order Process Header & Taglines
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Top Subtitle</label>
                  <input
                    type="text"
                    value={processData.subtitle}
                    onChange={(e) => setProcessData({ ...processData, subtitle: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs border border-slate-300 rounded-xl outline-none focus:border-[#96161B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title Line 1</label>
                  <input
                    type="text"
                    value={processData.title_line1}
                    onChange={(e) => setProcessData({ ...processData, title_line1: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs border border-slate-300 rounded-xl outline-none focus:border-[#96161B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title Line 2 (Red Accent)</label>
                  <input
                    type="text"
                    value={processData.title_line2}
                    onChange={(e) => setProcessData({ ...processData, title_line2: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs border border-slate-300 rounded-xl outline-none focus:border-[#96161B] text-[#96161B] font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tagline Bar</label>
                  <input
                    type="text"
                    value={processData.tagline}
                    onChange={(e) => setProcessData({ ...processData, tagline: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs border border-slate-300 rounded-xl outline-none focus:border-[#96161B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Left Side Tag</label>
                  <input
                    type="text"
                    value={processData.left_tag}
                    onChange={(e) => setProcessData({ ...processData, left_tag: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs border border-slate-300 rounded-xl outline-none focus:border-[#96161B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Right Side Tag</label>
                  <input
                    type="text"
                    value={processData.right_tag}
                    onChange={(e) => setProcessData({ ...processData, right_tag: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs border border-slate-300 rounded-xl outline-none focus:border-[#96161B]"
                  />
                </div>
              </div>
            </div>

            {/* 7 STEPS EDITOR */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-lg font-black text-slate-900">
                  2. Timeline Steps ({processData.steps.length} Steps)
                </h2>
                <button
                  type="button"
                  onClick={handleAddProcessStep}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#96161B] text-white text-xs font-bold rounded-xl hover:bg-[#7d1216] transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Step</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {processData.steps.map((st, idx) => (
                  <div key={st.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 relative group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#96161B] text-white text-xs font-bold flex items-center justify-center">
                          {st.step_number}
                        </span>
                        <span className="text-xs font-black text-slate-700 uppercase">Step #{idx + 1}</span>
                      </div>
                      {processData.steps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveProcessStep(st.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Number</label>
                        <input
                          type="text"
                          value={st.step_number}
                          onChange={(e) => {
                            const updated = [...processData.steps]
                            updated[idx].step_number = e.target.value
                            setProcessData({ ...processData, steps: updated })
                          }}
                          className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Title</label>
                        <input
                          type="text"
                          value={st.title}
                          onChange={(e) => {
                            const updated = [...processData.steps]
                            updated[idx].title = e.target.value
                            setProcessData({ ...processData, steps: updated })
                          }}
                          className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Description</label>
                      <textarea
                        rows={3}
                        value={st.description}
                        onChange={(e) => {
                          const updated = [...processData.steps]
                          updated[idx].description = e.target.value
                          setProcessData({ ...processData, steps: updated })
                        }}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BOTTOM BAR EDITOR */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
                3. Bottom Bar Quote & Partner CTA
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Bottom Quote Tagline</label>
                  <input
                    type="text"
                    value={processData.bottom_quote}
                    onChange={(e) => setProcessData({ ...processData, bottom_quote: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Button Text</label>
                  <input
                    type="text"
                    value={processData.cta_button_text}
                    onChange={(e) => setProcessData({ ...processData, cta_button_text: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs border border-slate-300 rounded-xl font-bold text-[#96161B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Button URL</label>
                  <input
                    type="text"
                    value={processData.cta_button_url}
                    onChange={(e) => setProcessData({ ...processData, cta_button_url: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* SAVE BUTTON BAR */}
            <div className="sticky bottom-6 z-40 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-xl flex items-center justify-between">
              <div className="text-xs text-slate-500 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>All changes persist permanently across page refreshes (F5).</span>
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#96161B] hover:bg-[#7d1216] text-white px-8 py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-red-950/20 active:scale-95 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Order Process Workflow</span>
              </button>
            </div>
          </form>
        )}

        {/* =========================================================
            TAB 2: COMPLIANCES & ACTION PROMO CARDS FORM (MATCHING SCREENSHOT 1)
        ========================================================= */}
        {activeTab === 'compliances' && (
          <form onSubmit={handleSaveCompliances} className="space-y-6 sm:space-y-8">
            
            {/* LIVE PREVIEW BOX */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
              <div className="text-xs font-bold text-[#96161B] uppercase tracking-wider mb-2">
                Live Storefront Section Preview
              </div>
              <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 space-y-6">
                {/* Header Preview */}
                <div className="text-center max-w-xl mx-auto space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    — {compliancesData.compliance_badge} —
                  </div>
                  <div className="text-xl sm:text-2xl font-black">
                    <span className="text-slate-900">{compliancesData.compliance_title_line1} </span>
                    <span className="text-[#96161B]">{compliancesData.compliance_title_line2}</span>
                  </div>
                  <div className="text-xs text-slate-500 truncate">{compliancesData.compliance_description}</div>
                </div>

                {/* Cards Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Card Preview */}
                  <div className="relative rounded-2xl overflow-hidden p-6 bg-slate-950 text-white min-h-[160px] flex flex-col justify-end">
                    <Image
                      src={compliancesData.left_card.bg_image || '/images/custom-tools-surgical.jpg'}
                      alt="preview"
                      fill
                      className="object-cover opacity-40"
                    />
                    <div className="relative z-10 space-y-1">
                      <div className="text-[10px] text-slate-300 font-bold uppercase">{compliancesData.left_card.badge_text}</div>
                      <div className="font-extrabold text-base">
                        {compliancesData.left_card.title} <span className="text-[#B92025]">{compliancesData.left_card.highlight_title}</span>
                      </div>
                      <div className="text-[11px] text-slate-300 line-clamp-1">{compliancesData.left_card.description}</div>
                      <div className="pt-2">
                        <span className="inline-block px-3 py-1 bg-[#B92025] text-white text-[10px] font-bold rounded-full">
                          {compliancesData.left_card.button_text} →
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Card Preview */}
                  <div className="relative rounded-2xl overflow-hidden p-6 bg-gradient-to-br from-[#B92025] to-[#800000] text-white min-h-[160px] flex flex-col justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white text-[#B92025] flex items-center justify-center">
                        <Bell className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="space-y-1 my-2">
                      <div className="font-extrabold text-base">
                        {compliancesData.right_card.title_line1} {compliancesData.right_card.title_line2}
                      </div>
                      <div className="text-[11px] text-red-100 line-clamp-1">{compliancesData.right_card.description}</div>
                    </div>
                    <div>
                      <span className="inline-block px-3 py-1 border border-white text-white text-[10px] font-bold rounded-full">
                        {compliancesData.right_card.button_text} →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PART A: COMPLIANCES EDITING */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
                1. Our Compliances Header & Badges
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={compliancesData.compliance_badge}
                    onChange={(e) => setCompliancesData({ ...compliancesData, compliance_badge: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs border border-slate-300 rounded-xl outline-none focus:border-[#96161B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title Line 1 (Navy/Black)</label>
                  <input
                    type="text"
                    value={compliancesData.compliance_title_line1}
                    onChange={(e) => setCompliancesData({ ...compliancesData, compliance_title_line1: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs border border-slate-300 rounded-xl outline-none focus:border-[#96161B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title Line 2 (Red Accent)</label>
                  <input
                    type="text"
                    value={compliancesData.compliance_title_line2}
                    onChange={(e) => setCompliancesData({ ...compliancesData, compliance_title_line2: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs border border-slate-300 rounded-xl outline-none focus:border-[#96161B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description Paragraph</label>
                <textarea
                  rows={2}
                  value={compliancesData.compliance_description}
                  onChange={(e) => setCompliancesData({ ...compliancesData, compliance_description: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs border border-slate-300 rounded-xl outline-none focus:border-[#96161B]"
                />
              </div>

              {/* Compliance Badges List */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-slate-800">Compliance Badges (ISO / FDA)</h3>
                  <button
                    type="button"
                    onClick={handleAddCompliance}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#96161B] text-white text-xs font-bold rounded-xl hover:bg-[#7d1216] transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Badge</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {compliancesData.compliances.map((badge, idx) => (
                    <div key={badge.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-500 uppercase">Badge #{idx + 1}</span>
                        {compliancesData.compliances.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveCompliance(badge.id)}
                            className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Type</label>
                          <select
                            value={badge.type}
                            onChange={(e) => {
                              const updated = [...compliancesData.compliances]
                              updated[idx].type = e.target.value as 'iso' | 'fda'
                              setCompliancesData({ ...compliancesData, compliances: updated })
                            }}
                            className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                          >
                            <option value="iso">ISO Emblem</option>
                            <option value="fda">FDA Emblem</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Code/Standard</label>
                          <input
                            type="text"
                            value={badge.code}
                            onChange={(e) => {
                              const updated = [...compliancesData.compliances]
                              updated[idx].code = e.target.value
                              setCompliancesData({ ...compliancesData, compliances: updated })
                            }}
                            className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">Title Label</label>
                        <input
                          type="text"
                          value={badge.label}
                          onChange={(e) => {
                            const updated = [...compliancesData.compliances]
                            updated[idx].label = e.target.value
                            setCompliancesData({ ...compliancesData, compliances: updated })
                          }}
                          className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PART B: TWO PROMO CARDS EDITING */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Left Card Editor */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
                <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-2">
                  2. Left Card: Customized Tools Promo
                </h2>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={compliancesData.left_card.badge_text}
                    onChange={(e) =>
                      setCompliancesData({
                        ...compliancesData,
                        left_card: { ...compliancesData.left_card, badge_text: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Title</label>
                    <input
                      type="text"
                      value={compliancesData.left_card.title}
                      onChange={(e) =>
                        setCompliancesData({
                          ...compliancesData,
                          left_card: { ...compliancesData.left_card, title: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Red Highlight Title</label>
                    <input
                      type="text"
                      value={compliancesData.left_card.highlight_title}
                      onChange={(e) =>
                        setCompliancesData({
                          ...compliancesData,
                          left_card: { ...compliancesData.left_card, highlight_title: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl text-[#96161B] font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={compliancesData.left_card.description}
                    onChange={(e) =>
                      setCompliancesData({
                        ...compliancesData,
                        left_card: { ...compliancesData.left_card, description: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Button Text</label>
                    <input
                      type="text"
                      value={compliancesData.left_card.button_text}
                      onChange={(e) =>
                        setCompliancesData({
                          ...compliancesData,
                          left_card: { ...compliancesData.left_card, button_text: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Button URL</label>
                    <input
                      type="text"
                      value={compliancesData.left_card.button_url}
                      onChange={(e) =>
                        setCompliancesData({
                          ...compliancesData,
                          left_card: { ...compliancesData.left_card, button_url: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Background Image URL</label>
                  <input
                    type="text"
                    value={compliancesData.left_card.bg_image}
                    onChange={(e) =>
                      setCompliancesData({
                        ...compliancesData,
                        left_card: { ...compliancesData.left_card, bg_image: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Right Card Editor */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
                <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-2">
                  3. Right Card: Upcoming Activities Promo
                </h2>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Heading Line 1</label>
                    <input
                      type="text"
                      value={compliancesData.right_card.title_line1}
                      onChange={(e) =>
                        setCompliancesData({
                          ...compliancesData,
                          right_card: { ...compliancesData.right_card, title_line1: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Heading Line 2</label>
                    <input
                      type="text"
                      value={compliancesData.right_card.title_line2}
                      onChange={(e) =>
                        setCompliancesData({
                          ...compliancesData,
                          right_card: { ...compliancesData.right_card, title_line2: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={compliancesData.right_card.description}
                    onChange={(e) =>
                      setCompliancesData({
                        ...compliancesData,
                        right_card: { ...compliancesData.right_card, description: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Button Text</label>
                    <input
                      type="text"
                      value={compliancesData.right_card.button_text}
                      onChange={(e) =>
                        setCompliancesData({
                          ...compliancesData,
                          right_card: { ...compliancesData.right_card, button_text: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Button URL</label>
                    <input
                      type="text"
                      value={compliancesData.right_card.button_url}
                      onChange={(e) =>
                        setCompliancesData({
                          ...compliancesData,
                          right_card: { ...compliancesData.right_card, button_url: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SAVE BUTTON BAR */}
            <div className="sticky bottom-6 z-40 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-xl flex items-center justify-between">
              <div className="text-xs text-slate-500 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>All changes persist permanently across page refreshes (F5).</span>
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#96161B] hover:bg-[#7d1216] text-white px-8 py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-red-950/20 active:scale-95 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Compliances & Promo Section</span>
              </button>
            </div>
          </form>
        )}

        {/* =========================================================
            TAB 3: VIDEO & WHY CHOOSE FORM
        ========================================================= */}
        {activeTab === 'video' && (
          <form onSubmit={handleSaveVideo} className="space-y-6 sm:space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
              <div className="text-xs font-bold text-[#96161B] uppercase tracking-wider mb-2">
                Live Storefront Card Preview
              </div>
              <div className="border border-slate-200 rounded-2xl p-4 sm:p-6 bg-slate-50/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow">
                    <Image
                      src={videoData.poster_image || '/images/surgical-video-poster.jpg'}
                      alt="Preview"
                      fill
                      className="object-cover brightness-75"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center pl-0.5 shadow-xl">
                        <Play className="w-5 h-5 fill-slate-900 text-slate-900" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="font-extrabold text-sm">{videoData.video_title}</div>
                      <div className="text-[10px] text-slate-300">{videoData.video_subtitle}</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-black text-xl text-slate-900">{videoData.section_title}</div>
                    <div className="text-xs text-slate-500 mt-1">{videoData.section_subtitle}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
                Video Box Settings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Video Box Title</label>
                  <input
                    type="text"
                    value={videoData.video_title}
                    onChange={(e) => setVideoData({ ...videoData, video_title: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Video Subtitle</label>
                  <input
                    type="text"
                    value={videoData.video_subtitle}
                    onChange={(e) => setVideoData({ ...videoData, video_subtitle: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-6 z-40 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-xl flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">Changes are saved live across page reload.</span>
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#96161B] hover:bg-[#7d1216] text-white px-8 py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Video Section</span>
              </button>
            </div>
          </form>
        )}

        {/* =========================================================
            TAB 4: WORLD EXPORT FORM
        ========================================================= */}
        {activeTab === 'world' && (
          <form onSubmit={handleSaveWorld} className="space-y-6 sm:space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
                World Export Globe Settings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Heading Line 1</label>
                  <input
                    type="text"
                    value={worldData.heading_line1}
                    onChange={(e) => setWorldData({ ...worldData, heading_line1: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Heading Line 2 (Red)</label>
                  <input
                    type="text"
                    value={worldData.heading_line2}
                    onChange={(e) => setWorldData({ ...worldData, heading_line2: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs border border-slate-300 rounded-xl font-bold text-[#96161B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Heading Line 3 (Red)</label>
                  <input
                    type="text"
                    value={worldData.heading_line3}
                    onChange={(e) => setWorldData({ ...worldData, heading_line3: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs border border-slate-300 rounded-xl font-bold text-[#96161B]"
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-6 z-40 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-xl flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">Changes are saved live across page reload.</span>
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#96161B] hover:bg-[#7d1216] text-white px-8 py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save World Export Section</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </AdminShell>
  )
}
