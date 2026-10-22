'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import TopBar from '@/src/components/public/TopBar'
import HeaderNav from '@/src/components/public/HeaderNav'
import MainRedNavbar from '@/src/components/public/MainRedNavbar'
import PublicFooter from '@/src/components/public/PublicFooter'
import PublicSearchModal from '@/src/components/public/PublicSearchModal'
import CartQuoteModal from '@/src/components/public/CartQuoteModal'
import { ProductItem } from '@/src/types/product'
import { CatalogueItem } from '@/src/types/catalogue'
import { getStoredCatalogues, INITIAL_CATALOGUES_SEED } from '@/src/lib/dataStore'
import {
  Download,
  Eye,
  ShieldCheck,
  BookOpen,
  Search,
  SlidersHorizontal,
} from 'lucide-react'

export default function CataloguesPage() {
  const [catalogues, setCatalogues] = useState<CatalogueItem[]>(INITIAL_CATALOGUES_SEED)
  const [activeCategory, setActiveCategory] = useState<string>('ALL')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isQuoteOpen, setIsQuoteOpen] = useState(false)
  const [quoteItems, setQuoteItems] = useState<ProductItem[]>([])

  const loadCatalogues = () => {
    const data = getStoredCatalogues()
    setCatalogues(data.filter((c) => c.is_published !== false))
  }

  useEffect(() => {
    loadCatalogues()
    window.addEventListener('alpha_content_updated', loadCatalogues)
    window.addEventListener('storage', loadCatalogues)
    return () => {
      window.removeEventListener('alpha_content_updated', loadCatalogues)
      window.removeEventListener('storage', loadCatalogues)
    }
  }, [])

  const categories = [
    'ALL',
    'GENERAL SURGERY',
    'DENTAL',
    'PLASTIC SURGERY',
    'ENT INSTRUMENTS',
    'COMPANY PROFILE',
  ]

  const filteredCatalogues =
    activeCategory === 'ALL'
      ? catalogues
      : catalogues.filter(
          (c) =>
            c.category?.toUpperCase() === activeCategory ||
            c.title?.toUpperCase().includes(activeCategory)
        )

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-800 antialiased selection:bg-[#B92025] selection:text-white">
      {/* 1. TOP HEADER & NAVIGATION */}
      <TopBar />
      <HeaderNav
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsQuoteOpen(true)}
        cartCount={quoteItems.length}
      />
      <MainRedNavbar />

      {/* 2. BREADCRUMB */}
      <div className="bg-[#6B6E70]/10 border-b border-slate-200 py-3 px-4 sm:px-8">
        <div className="max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto flex items-center gap-2 text-xs font-semibold text-slate-600">
          <Link href="/" className="hover:text-[#B92025] transition-colors">
            Home
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-[#B92025] font-bold">Catalogue</span>
        </div>
      </div>

      {/* 3. MAIN CONTENT CONTAINER */}
      <div className="flex-1 max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-16 w-full">
        {/* =========================================================
            FILTER TABS & BAR (CATALOG LIST)
        ========================================================= */}
        <div id="catalog-list" className="space-y-6 pt-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-4">
            {/* Left Title with Red Icon */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#B92025] text-white flex items-center justify-center shadow-sm">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-3">
                <span className="font-black text-sm sm:text-base tracking-wider uppercase text-slate-900">
                  PRODUCT CATALOG
                </span>
                <span className="h-0.5 w-12 bg-[#B92025] hidden sm:inline-block"></span>
              </div>
            </div>

            {/* Filter Tabs with Red Slashes */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-600">
              {categories.map((cat, idx) => {
                const isActive = activeCategory === cat
                return (
                  <React.Fragment key={cat}>
                    {idx > 0 && <span className="text-[#B92025] font-black px-1">/</span>}
                    <button
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`uppercase tracking-wider transition-all px-2.5 py-1 rounded-lg cursor-pointer ${
                        isActive
                          ? 'text-[#B92025] bg-red-50 border-b-2 border-[#B92025] font-black shadow-sm'
                          : 'hover:text-[#B92025] hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  </React.Fragment>
                )
              })}
            </div>
          </div>

          {/* =========================================================
              CATALOG CARDS GRID (MATCHING SLICES 2 & 3 OF SVG)
          ========================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredCatalogues.map((cat, index) => {
              const catalogNumber = cat.catalog_number || `CATALOG ${String(index + 1).padStart(2, '0')}`
              const pdfUrl = cat.pdf_url || '/catalogues/Artery-Forceps-Section4.pdf'

              return (
                <div
                  key={cat.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 p-6 sm:p-8 flex flex-col md:flex-row gap-6 lg:gap-8 items-stretch group"
                >
                  {/* Left: Printed Brochure Mockup Cover */}
                  <div className="relative w-full md:w-[210px] 2xl:w-[240px] shrink-0 aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 shadow-md flex items-center justify-center group-hover:shadow-lg transition-shadow">
                    <Image
                      src={cat.cover_image || '/images/categories/image_376.png'}
                      alt={cat.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Top Overlay Badge */}
                    <div className="absolute top-3 left-3 bg-[#B92025] text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow">
                      2026 EDITION
                    </div>

                    {/* Bottom Metadata Chip */}
                    <div className="absolute bottom-3 inset-x-3 bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1.5 rounded-lg flex items-center justify-between">
                      <span>{cat.pages || 48} Pages</span>
                      <span>{cat.file_size || '2.8 MB'}</span>
                    </div>
                  </div>

                  {/* Right: Content & Action Buttons */}
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {/* Catalog Pill Badge */}
                      <span className="inline-block bg-slate-100 text-slate-800 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                        {catalogNumber}
                      </span>

                      {/* Title */}
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-[#B92025] transition-colors leading-tight">
                        {cat.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                        {cat.description ||
                          'We Provide High-Quality Hospital Furniture Designed To Support Healthcare Professionals While Creating Safe, Comfortable, And Efficient Environments For Patients. Our Products Combine Durable Materials, Practical Functionality, Modern Design, And Reliable Performance.'}
                      </p>
                    </div>

                    {/* Divider & Action Buttons */}
                    <div className="space-y-4 pt-2 border-t border-slate-100">
                      <div className="flex flex-wrap items-center gap-3">
                        {/* View Catalog Button */}
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-[#B92025] hover:bg-[#96161B] text-white text-xs sm:text-sm font-extrabold px-5 py-2.5 rounded-full shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Catalog</span>
                        </a>

                        {/* Download PDF Button */}
                        <a
                          href={pdfUrl}
                          download={`ALPHA-${cat.title.replace(/\s+/g, '-')}-Catalogue.pdf`}
                          className="inline-flex items-center gap-2 bg-white hover:bg-slate-900 text-slate-900 hover:text-white border-2 border-slate-900 text-xs sm:text-sm font-extrabold px-5 py-2 rounded-full transition-all shadow-sm"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download PDF</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredCatalogues.length === 0 && (
            <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
              <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="font-extrabold text-base text-slate-800">No Catalogues in this Category</h3>
              <p className="text-xs text-slate-500">Please choose another category tab above to view available brochures.</p>
              <button
                type="button"
                onClick={() => setActiveCategory('ALL')}
                className="inline-block bg-[#B92025] text-white text-xs font-bold px-4 py-2 rounded-full mt-2"
              >
                View All Catalogues
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. GLOBAL FOOTER */}
      <PublicFooter />

      {/* 5. MODALS */}
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
