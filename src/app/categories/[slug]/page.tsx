'use client'

import React, { useState, useEffect, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import PublicHeader from '@/src/components/public/PublicHeader'
import PublicFooter from '@/src/components/public/PublicFooter'
import PublicSearchModal from '@/src/components/public/PublicSearchModal'
import CartQuoteModal from '@/src/components/public/CartQuoteModal'
import { getStoredCategories, getStoredProducts } from '@/src/lib/dataStore'
import { CategoryItem } from '@/src/types/category'
import { ProductItem } from '@/src/types/product'
import { ShieldCheck, ShoppingBag, Check, ArrowLeft } from 'lucide-react'

export default function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const [category, setCategory] = useState<CategoryItem | null>(null)
  const [products, setProducts] = useState<ProductItem[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isQuoteOpen, setIsQuoteOpen] = useState(false)
  const [quoteItems, setQuoteItems] = useState<ProductItem[]>([])
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const cats = getStoredCategories()
    const foundCat = cats.find((c) => c.slug === resolvedParams.slug) || cats[0]
    setCategory(foundCat)

    const allProds = getStoredProducts().filter((p) => p.is_published)
    if (foundCat) {
      setProducts(allProds.filter((p) => p.category_id === foundCat.id))
    } else {
      setProducts(allProds)
    }
  }, [resolvedParams.slug])

  const handleAddToQuote = (prod: ProductItem) => {
    if (!quoteItems.some((i) => i.id === prod.id)) {
      setQuoteItems((prev) => [...prev, prod])
    }
    setAddedIds((prev) => ({ ...prev, [prod.id]: true }))
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [prod.id]: false }))
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PublicHeader
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenQuote={() => setIsQuoteOpen(true)}
        quoteCount={quoteItems.length}
      />

      <div className="bg-[#18355E] text-white py-12 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-4">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Categories</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold">{category?.name || 'Category Division'}</h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
            {category?.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 flex-1 w-full space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#18355E]">
            Products in {category?.name} ({products.length})
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
            No products currently in this division.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div className="relative aspect-[4/3] w-full bg-slate-50 p-4 border-b border-slate-100">
                  <Image
                    src={prod.featured_image || '/images/extracted/image_7.png'}
                    alt={prod.title}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-[11px] font-bold text-[#B92025] uppercase tracking-wider mb-1">
                      SKU: {prod.sku || 'N/A'}
                    </div>
                    <h3 className="font-bold text-[#18355E] text-base group-hover:text-[#B92025] transition-colors leading-snug">
                      {prod.title}
                    </h3>
                    <p className="text-slate-500 text-xs mt-2 line-clamp-2">
                      {prod.short_description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => handleAddToQuote(prod)}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all shadow flex items-center justify-center gap-2 ${
                        addedIds[prod.id]
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#18355E] hover:bg-[#B92025] text-white'
                      }`}
                    >
                      {addedIds[prod.id] ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4 text-red-300" />
                          <span>Add to Quote</span>
                        </>
                      )}
                    </button>
                    <Link
                      href={`/contact?product=${encodeURIComponent(prod.title)}`}
                      className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-[#B92025] text-xs font-bold hover:bg-slate-50 transition-colors"
                    >
                      Inquire
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
