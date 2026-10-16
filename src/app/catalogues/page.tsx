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
  FileText,
  Download,
  Eye,
  CheckCircle2,
  ShieldCheck,
  Tag,
  Layers,
  ArrowRight,
  X,
  BookOpen,
  Search,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react'

export default function CataloguesPage() {
  const [catalogues, setCatalogues] = useState<CatalogueItem[]>(INITIAL_CATALOGUES_SEED)
  const [activeCategory, setActiveCategory] = useState<string>('ALL')
  const [selectedCatalog, setSelectedCatalog] = useState<CatalogueItem | null>(null)
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
            TAGLINE / TITLE (MATCHING SLICE 1 OF SVG)
        ========================================================= */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black text-slate-900 tracking-tight uppercase">
            BUILT TO PERFORM. MADE TO LAST.
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto font-medium">
            Browse and download official product catalogues, technical drawings, and sterile processing guidelines.
          </p>
        </div>

        {/* =========================================================
            4 FEATURE VALUE CARDS (MATCHING SLICE 1 OF SVG)
        ========================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Product Catalogs */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[#B92025] shrink-0">
                  <FileText className="w-6 h-6 text-[#B92025]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                    Product Catalogs
                  </h3>
                  <div className="w-10 h-0.5 bg-[#0A2540] mt-1"></div>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium pt-1">
                Explore Our Comprehensive Range Of Surgical Instruments Designed For Precision And
                Professional Use.
              </p>
            </div>
            <a
              href="#catalog-list"
              className="inline-flex items-center gap-1.5 text-xs font-black text-[#B92025] hover:underline uppercase tracking-wider pt-2 cursor-pointer"
            >
              <span>View Catalogs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2: Quality Standards */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[#B92025] shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-[#B92025]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                    Quality Standards
                  </h3>
                  <div className="w-10 h-0.5 bg-[#0A2540] mt-1"></div>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium pt-1">
                Manufactured to DIN and ISO/ASTM Standards with strict quality control to ensure
                reliability and safety.
              </p>
            </div>
            <a
              href="#catalog-list"
              className="inline-flex items-center gap-1.5 text-xs font-black text-[#B92025] hover:underline uppercase tracking-wider pt-2 cursor-pointer"
            >
              <span>View Catalogs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 3: OEM / Private Label */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[#B92025] shrink-0">
                  <Tag className="w-6 h-6 text-[#B92025]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                    OEM / Private Label
                  </h3>
                  <div className="w-10 h-0.5 bg-[#0A2540] mt-1"></div>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium pt-1">
                Custom Manufacturing, Private Label Branding And Sterile Kitting Solutions Tailored To
                Your Business Needs.
              </p>
            </div>
            <a
              href="#catalog-list"
              className="inline-flex items-center gap-1.5 text-xs font-black text-[#B92025] hover:underline uppercase tracking-wider pt-2 cursor-pointer"
            >
              <span>View Catalogs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 4: Materials & Sterilization */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[#B92025] shrink-0">
                  <Layers className="w-6 h-6 text-[#B92025]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                    Materials & Sterilization
                  </h3>
                  <div className="w-10 h-0.5 bg-[#0A2540] mt-1"></div>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium pt-1">
                Premium German & Japanese Stainless Steel With Options For Reusable, Single-Use And EO
                Sterilized Configurations.
              </p>
            </div>
            <a
              href="#catalog-list"
              className="inline-flex items-center gap-1.5 text-xs font-black text-[#B92025] hover:underline uppercase tracking-wider pt-2 cursor-pointer"
            >
              <span>View Catalogs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* =========================================================
            FILTER TABS & BAR (MATCHING SLICE 1 BOTTOM / SLICE 2 TOP)
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
                        <button
                          type="button"
                          onClick={() => setSelectedCatalog(cat)}
                          className="inline-flex items-center gap-2 bg-[#B92025] hover:bg-[#96161B] text-white text-xs sm:text-sm font-extrabold px-5 py-2.5 rounded-full shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Catalog</span>
                        </button>

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

      {/* =========================================================
          INTERACTIVE PDF / CATALOG PREVIEW MODAL
      ========================================================= */}
      {selectedCatalog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-4xl 2xl:max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-[#B92025] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-white" />
                <div>
                  <h3 className="font-black text-sm sm:text-base leading-tight">
                    {selectedCatalog.title}
                  </h3>
                  <span className="text-[10px] text-red-200 uppercase tracking-widest font-bold">
                    Official 2026 Master Catalogue Preview
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCatalog(null)}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Embedded PDF Viewer */}
            <div className="flex-1 overflow-hidden bg-slate-100 flex flex-col">
              <iframe
                src={`${selectedCatalog.pdf_url || '/catalogues/Artery-Forceps-Section4.pdf'}#toolbar=1`}
                className="w-full flex-1 border-0 min-h-[500px]"
                title={selectedCatalog.title}
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
              <div className="text-slate-500">
                <span>{selectedCatalog.pages || 48} Pages</span> •{' '}
                <span>{selectedCatalog.file_size || '2.8 MB'}</span> •{' '}
                <span className="text-emerald-600 font-bold">ISO 13485:2016 Certified</span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={selectedCatalog.pdf_url || '/catalogues/Artery-Forceps-Section4.pdf'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Full Tab</span>
                </a>
                <a
                  href={selectedCatalog.pdf_url || '/catalogues/Artery-Forceps-Section4.pdf'}
                  download={`ALPHA-${selectedCatalog.title.replace(/\s+/g, '-')}-Catalogue.pdf`}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#B92025] hover:bg-[#96161B] text-white font-bold shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

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
