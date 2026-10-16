'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import TopBar from '@/src/components/public/TopBar'
import HeaderNav from '@/src/components/public/HeaderNav'
import MainRedNavbar from '@/src/components/public/MainRedNavbar'
import EntSurgeryBanner from '@/src/components/public/EntSurgeryBanner'
import PublicFooter from '@/src/components/public/PublicFooter'
import PublicSearchModal from '@/src/components/public/PublicSearchModal'
import CartQuoteModal from '@/src/components/public/CartQuoteModal'
import { getStoredCategories } from '@/src/lib/dataStore'
import { CategoryItem } from '@/src/types/category'
import { ProductItem } from '@/src/types/product'
import { ArrowRight, Layers } from 'lucide-react'

export default function CategoriesOverviewPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<ProductItem[]>([])

  useEffect(() => {
    setCategories(getStoredCategories().filter((c) => c.is_published))

    const handleUpdate = () => {
      setCategories(getStoredCategories().filter((c) => c.is_published))
    }
    window.addEventListener('alpha_content_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)

    return () => {
      window.removeEventListener('alpha_content_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <TopBar />
      <HeaderNav
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartItems.length}
      />
      <MainRedNavbar />
      <EntSurgeryBanner
        customTitle="ALPHA SURGICAL & MEDICAL DIVISIONS"
        customSubtitle="Explore German stainless steel procedure sets, orthopedic bone instruments, titanium precision gear, and neuro instrumentation."
      />

      <div className="w-full max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto px-4 sm:px-8 py-12 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 2xl:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?cat=${cat.slug}`}
              className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-red-200 hover-card-3d transition-all duration-300 group flex flex-col justify-between p-5 sm:p-6"
            >
              <div className="relative aspect-[4/3] w-full bg-slate-50 rounded-2xl overflow-hidden p-3 mb-4">
                <Image
                  src={cat.card_image || cat.image_url || '/images/categories/image_376.png'}
                  alt={cat.name}
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                />
                {cat.icon && (
                  <span className="absolute top-3 left-3 bg-[#96161B] text-white text-xs font-bold w-7 h-7 rounded-lg flex items-center justify-center shadow">
                    {cat.icon}
                  </span>
                )}
              </div>

              <div className="space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm 2xl:text-base font-extrabold text-slate-900 uppercase group-hover:text-[#96161B] transition-colors leading-snug">
                    {cat.name}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-[#96161B] pt-3 border-t border-slate-100">
                  <span>Explore Instruments ({cat.product_count || 42})</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <PublicFooter />

      <PublicSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartQuoteModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        quoteItems={cartItems}
        onRemoveItem={(id) => setCartItems((prev) => prev.filter((i) => i.id !== id))}
        onClearAll={() => setCartItems([])}
      />
    </div>
  )
}
