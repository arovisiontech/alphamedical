'use client'

import React, { useState, useEffect, use } from 'react'
import TopBar from '@/src/components/public/TopBar'
import HeaderNav from '@/src/components/public/HeaderNav'
import MainRedNavbar from '@/src/components/public/MainRedNavbar'
import EntSurgeryBanner from '@/src/components/public/EntSurgeryBanner'
import ShopCatalogWithFilters from '@/src/components/public/ShopCatalogWithFilters'
import PublicFooter from '@/src/components/public/PublicFooter'
import PublicSearchModal from '@/src/components/public/PublicSearchModal'
import CartQuoteModal from '@/src/components/public/CartQuoteModal'
import { getStoredCategories } from '@/src/lib/dataStore'
import { CategoryItem } from '@/src/types/category'
import { ProductItem } from '@/src/types/product'

export default function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const [category, setCategory] = useState<CategoryItem | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<ProductItem[]>([])

  useEffect(() => {
    const cats = getStoredCategories()
    const found = cats.find((c) => c.slug === resolvedParams.slug || c.id === resolvedParams.slug) || cats[0]
    setCategory(found)
  }, [resolvedParams.slug])

  const handleAddToCart = (item: ProductItem, qty: number) => {
    if (!cartItems.some((i) => i.id === item.id)) {
      setCartItems((prev) => [...prev, item])
    }
  }

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
        customTitle={category?.name || 'SURGICAL INSTRUMENTS'}
        customSubtitle={category?.description || undefined}
      />
      <ShopCatalogWithFilters
        onAddToCart={handleAddToCart}
        initialCategory={resolvedParams.slug}
      />
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
