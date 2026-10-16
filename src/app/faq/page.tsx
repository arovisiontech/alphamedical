'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import TopBar from '@/src/components/public/TopBar'
import HeaderNav from '@/src/components/public/HeaderNav'
import MainRedNavbar from '@/src/components/public/MainRedNavbar'
import PublicFooter from '@/src/components/public/PublicFooter'
import PublicSearchModal from '@/src/components/public/PublicSearchModal'
import CartQuoteModal from '@/src/components/public/CartQuoteModal'
import {
  Search,
  Plus,
  Minus,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  X,
} from 'lucide-react'
import { ProductItem } from '@/src/types/product'
import initialFaqsSeed from '@/src/data/faqs.json'

interface FaqItem {
  id: string
  category: string
  question: string
  answer: string
}

const CATEGORIES = [
  'All',
  'Quality & Certifications',
  'OEM & Custom Manufacturing',
  'Orders & Shipping',
  'Warranty & Sterilization',
  'General & Payments',
]

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqsSeed as FaqItem[])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [openFaqIds, setOpenFaqIds] = useState<Record<string, boolean>>({
    'faq-1': true,
    'faq-2': true,
  })

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isQuoteOpen, setIsQuoteOpen] = useState(false)
  const [quoteItems, setQuoteItems] = useState<ProductItem[]>([])

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false)

  // Fetch latest dynamic FAQs from API
  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await fetch('/api/faqs', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            setFaqs(data)
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic FAQs:', err)
      }
    }
    loadFaqs()

    const handleUpdate = () => loadFaqs()
    window.addEventListener('alpha_faqs_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('alpha_faqs_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  // Filtered FAQs based on category pill & search query
  const filteredFaqs = useMemo(() => {
    return faqs.filter((item) => {
      const matchCat =
        selectedCategory === 'All' ||
        item.category?.toLowerCase() === selectedCategory.toLowerCase()

      const q = searchQuery.toLowerCase().trim()
      const matchSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q)

      return matchCat && matchSearch
    })
  }, [faqs, selectedCategory, searchQuery])

  // Split into 2 columns (left & right)
  const leftColumnFaqs = useMemo(() => {
    return filteredFaqs.filter((_, idx) => idx % 2 === 0)
  }, [filteredFaqs])

  const rightColumnFaqs = useMemo(() => {
    return filteredFaqs.filter((_, idx) => idx % 2 !== 0)
  }, [filteredFaqs])

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail) return
    setNewsletterSubmitted(true)
    setTimeout(() => {
      setNewsletterEmail('')
      setNewsletterSubmitted(false)
    }, 4000)
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans text-slate-800">
      {/* 1. TOP BAR */}
      <TopBar />

      {/* 2. HEADER NAV */}
      <HeaderNav
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsQuoteOpen(true)}
        cartCount={quoteItems.length}
      />

      {/* 3. MAIN RED NAVBAR */}
      <MainRedNavbar />

      {/* 4. CHARCOAL BREADCRUMB STRIP (Matching screenshot) */}
      <div className="w-full bg-[#39424B] text-white py-3 border-b border-slate-700/60 select-none">
        <div className="w-full max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto px-4 sm:px-8 flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-white font-bold">FAQ&apos;s</span>
        </div>
      </div>

      {/* 5. MAIN CONTENT WRAPPER */}
      <main className="w-full flex-1 py-10 sm:py-14">
        <div className="w-full max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto px-4 sm:px-8 space-y-12 sm:space-y-16">
          
          {/* SEARCH & CATEGORY PILLS CARD (Top white floating card from screenshot) */}
          <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-6">
            {/* Search Input Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by topic, keyword (e.g. ISO, TC scissors, shipping, warranty)..."
                  className="w-full pl-12 pr-10 py-3.5 bg-slate-50/80 hover:bg-slate-50 focus:bg-white rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B92025]/30 focus:border-[#B92025] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills (Matching exact pills from screenshot) */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 pt-2">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#1E293B] text-white shadow-sm ring-2 ring-[#1E293B]/20'
                        : 'bg-[#F1F5F9] text-slate-700 hover:bg-slate-200/80 border border-slate-200/60'
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </section>

          {/* MAIN FAQ HEADER (Matching exact typography & red divider from screenshot) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm font-extrabold text-[#B92025] uppercase tracking-wider">
                FREQUENTLY ASKED QUESTIONS
              </span>
              <div className="w-12 h-[2px] bg-[#B92025]" />
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-slate-900 leading-[1.15]">
              Helpful Answers About Our Production And Delivery.
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-3xl leading-relaxed">
              Can&apos;t Find The Answer You Need? Email{' '}
              <a href="mailto:info@alpha-medicalsupplies.com" className="text-[#B92025] font-bold hover:underline">
                Alphamed.Com
              </a>{' '}
              And Our Team Will Be Happy To Help.
            </p>
          </div>

          {/* 2-COLUMN ACCORDION GRID (Matching exact cards & red + / - from screenshot) */}
          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No matching questions found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try clearing your search query or choosing another topic from the category pills above.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('All')
                }}
                className="px-5 py-2.5 bg-[#B92025] text-white rounded-lg text-xs font-bold hover:bg-[#96161B] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 items-start">
              {/* LEFT COLUMN */}
              <div className="space-y-4">
                {leftColumnFaqs.map((faq) => {
                  const isOpen = Boolean(openFaqIds[faq.id])
                  return (
                    <div
                      key={faq.id}
                      className="bg-white rounded-xl border border-slate-200 shadow-sm transition-all duration-200 hover:border-slate-300 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full px-5 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 cursor-pointer group"
                      >
                        <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#B92025] transition-colors leading-snug">
                          {faq.question}
                        </span>
                        <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[#B92025] group-hover:scale-110 transition-transform">
                          {isOpen ? <Minus className="w-4 h-4 stroke-[2.5]" /> : <Plus className="w-4 h-4 stroke-[2.5]" />}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="px-5 sm:px-6 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 font-normal">
                          <p>{faq.answer}</p>
                          <div className="mt-3 flex items-center gap-2">
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              {faq.category}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-4">
                {rightColumnFaqs.map((faq) => {
                  const isOpen = Boolean(openFaqIds[faq.id])
                  return (
                    <div
                      key={faq.id}
                      className="bg-white rounded-xl border border-slate-200 shadow-sm transition-all duration-200 hover:border-slate-300 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full px-5 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 cursor-pointer group"
                      >
                        <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#B92025] transition-colors leading-snug">
                          {faq.question}
                        </span>
                        <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[#B92025] group-hover:scale-110 transition-transform">
                          {isOpen ? <Minus className="w-4 h-4 stroke-[2.5]" /> : <Plus className="w-4 h-4 stroke-[2.5]" />}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="px-5 sm:px-6 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 font-normal">
                          <p>{faq.answer}</p>
                          <div className="mt-3 flex items-center gap-2">
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              {faq.category}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* NEED HELP FINDING THE RIGHT INSTRUMENTS? (Matching exact red-accented callout card from screenshot) */}
          <section className="relative bg-[#FAFAFA] rounded-r-2xl border border-slate-200/90 border-l-4 border-l-[#B92025] p-6 sm:p-10 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-2 max-w-2xl">
              <span className="text-[11px] sm:text-xs font-black text-slate-800 tracking-wider uppercase">
                LET&apos;S START A CONVERSATION
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight text-slate-900 leading-tight">
                Need Help Finding The <span className="text-[#B92025]">Right Instruments?</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Tell Us Your Product Requirements, Quantity And Destination. Our Team Will Guide You To The Right Next Step.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href="mailto:info@alpha-medicalsupplies.com?subject=Wholesale%20Inquiry%20-%20Instruments%20Assistance"
                className="px-6 sm:px-7 py-3 rounded-md bg-[#96161B] hover:bg-[#7D1216] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                Email Sale
              </a>
              <a
                href="https://wa.me/1123456789?text=Hello%20Alpha%20Medical%20Supplies%20Team,%20I%20need%20help%20with%20an%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 sm:px-7 py-3 rounded-md bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-[#B92025] hover:text-[#B92025] text-xs sm:text-sm font-bold shadow-sm transition-all duration-200 cursor-pointer"
              >
                WhatsApp
              </a>
            </div>
          </section>

          {/* STAY INSPIRED NEWSLETTER (Matching exact newsletter card from screenshot) */}
          <section className="bg-[#F8F9FA] rounded-2xl border border-slate-200/90 p-6 sm:p-10 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left mail icon & title */}
              <div className="lg:col-span-6 flex items-start sm:items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-[#B92025]" />
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    NEWSLETTER
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    Stay <span className="text-[#B92025]">inspired.</span>
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Receive exclusive tips, trends, and promotions for professionals—directly from Alpha Medical Supplies in your inbox.
                  </p>
                </div>
              </div>

              {/* Right input & subscribe */}
              <div className="lg:col-span-6 space-y-2">
                <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B92025]/30 focus:border-[#B92025]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#B92025] hover:bg-[#96161B] text-white rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow transition-colors cursor-pointer shrink-0"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pl-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>No spam. Unsubscribe anytime.</span>
                  {newsletterSubmitted && (
                    <span className="ml-2 font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Thank you for subscribing!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* 6. PUBLIC FOOTER */}
      <PublicFooter />

      {/* 7. MODALS */}
      <PublicSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartQuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        quoteItems={quoteItems}
        onRemoveItem={(id) => setQuoteItems((prev) => prev.filter((item) => item.id !== id))}
        onClearAll={() => setQuoteItems([])}
      />
    </div>
  )
}
