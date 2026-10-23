'use client'

import React, { useState } from 'react'
import TopBar from '@/src/components/public/TopBar'
import HeaderNav from '@/src/components/public/HeaderNav'
import MainRedNavbar from '@/src/components/public/MainRedNavbar'
import EntSurgeryBanner from '@/src/components/public/EntSurgeryBanner'
import ShopCatalogWithFilters from '@/src/components/public/ShopCatalogWithFilters'
import PublicFooter from '@/src/components/public/PublicFooter'
import PublicSearchModal from '@/src/components/public/PublicSearchModal'
import CartQuoteModal from '@/src/components/public/CartQuoteModal'
import { AlphaProduct } from '@/src/data/alphaData'
import { ProductItem } from '@/src/types/product'

export default function ProductsPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<ProductItem[]>([])

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
      <main className="flex-1 pb-12 sm:pb-16">
        <ShopCatalogWithFilters onAddToCart={handleAddToCart} />
      </main>
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
