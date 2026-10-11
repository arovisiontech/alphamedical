'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import PublicHeader from '@/src/components/public/PublicHeader'
import PublicFooter from '@/src/components/public/PublicFooter'
import PublicSearchModal from '@/src/components/public/PublicSearchModal'
import CartQuoteModal from '@/src/components/public/CartQuoteModal'
import { getStoredCategories } from '@/src/lib/dataStore'
import { CategoryItem } from '@/src/types/category'
import { ProductItem } from '@/src/types/product'
import { Layers, ArrowRight, ShieldCheck } from 'lucide-react'

export default function CategoriesOverviewPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isQuoteOpen, setIsQuoteOpen] = useState(false)
  const [quoteItems, setQuoteItems] = useState<ProductItem[]>([])

  useEffect(() => {
    setCategories(getStoredCategories().filter((c) => c.is_published))
  }, [])

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
            <span>Product Divisions</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold">ALPHA Product Categories</h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Browse our specialized medical supply divisions and product lines.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 flex-1 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                <Image
                  src={cat.image_url || '/images/extracted/image_7.png'}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#18355E] group-hover:text-[#B92025] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="flex items-center text-xs font-semibold text-[#B92025] group-hover:translate-x-1 transition-transform pt-3 border-t border-slate-100">
                  <span>Explore Products</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
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
