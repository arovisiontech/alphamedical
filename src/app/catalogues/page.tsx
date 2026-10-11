'use client'

import React, { useState } from 'react'
import PublicHeader from '@/src/components/public/PublicHeader'
import PublicFooter from '@/src/components/public/PublicFooter'
import DownloadableCataloguesSection from '@/src/components/public/DownloadableCataloguesSection'
import PublicSearchModal from '@/src/components/public/PublicSearchModal'
import CartQuoteModal from '@/src/components/public/CartQuoteModal'
import { ProductItem } from '@/src/types/product'
import { ShieldCheck } from 'lucide-react'

export default function CataloguesPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isQuoteOpen, setIsQuoteOpen] = useState(false)
  const [quoteItems, setQuoteItems] = useState<ProductItem[]>([])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PublicHeader
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenQuote={() => setIsQuoteOpen(true)}
        quoteCount={quoteItems.length}
      />

      <div className="bg-[#18355E] text-white py-12 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-[#B92025] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>2026 Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold">ALPHA Product Catalogues</h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Download complete PDF brochures for medical equipment, surgical tools, and hospital furniture.
          </p>
        </div>
      </div>

      <div className="flex-1">
        <DownloadableCataloguesSection />
      </div>

      <PublicFooter />

      <PublicSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartQuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        quoteItems={quoteItems}
        onRemoveItem={(id) => setQuoteItems((prev) => prev.filter((i) => i.id !== id))}
        onClearAll={() => setQuoteItems([])}
      />
    </div>
  )
}
