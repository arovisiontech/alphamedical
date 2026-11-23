'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingCart, ShieldCheck, ArrowRight, Store, Sparkles, CheckCircle2 } from 'lucide-react'
import TopBar from '@/src/components/public/TopBar'
import HeaderNav from '@/src/components/public/HeaderNav'
import MainRedNavbar from '@/src/components/public/MainRedNavbar'
import ShopCatalogWithFilters from '@/src/components/public/ShopCatalogWithFilters'
import PublicFooter from '@/src/components/public/PublicFooter'
import PublicSearchModal from '@/src/components/public/PublicSearchModal'
import { ProductItem } from '@/src/types/product'
import { useGeoLocation } from '@/src/context/GeoLocationContext'
import { getStoredCartCount } from '@/src/lib/dataStore'

export default function DirectStorePage() {
  const router = useRouter()
  const { setManualCountry } = useGeoLocation()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  // Ensure USA Store mode is unconditionally active on this route
  useEffect(() => {
    setManualCountry('US')
    setCartCount(getStoredCartCount())
    const handleCart = () => setCartCount(getStoredCartCount())
    window.addEventListener('alpha_cart_updated', handleCart)
    return () => window.removeEventListener('alpha_cart_updated', handleCart)
  }, [setManualCountry])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans w-full max-w-[100vw] overflow-x-hidden">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <TopBar />

      {/* 2. PRIVATE ACCESS HERO STRIP */}
      <div className="bg-gradient-to-r from-[#96161B] via-[#7d1216] to-[#590d10] text-white py-3 px-4 sm:px-6 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 font-bold text-center sm:text-left">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>
              🇺🇸 <strong>Alpha Medical Online Store (Pakistan Testing Access):</strong> Live USD pricing, Add to Cart & Stripe Checkout enabled without VPN.
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/checkout"
              className="inline-flex items-center gap-1.5 bg-white text-[#96161B] hover:bg-red-50 font-black px-3.5 py-1.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Checkout ({cartCount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. HEADER WITH LIVE CART COUNTER */}
      <HeaderNav
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => router.push('/checkout')}
        cartCount={cartCount}
      />

      {/* 4. MAIN RED MEGA NAVBAR */}
      <MainRedNavbar />

      {/* 5. STORE CATALOG WITH COMPLETE PRODUCT FILTERS & ADD TO CART */}
      <main className="flex-1 pb-16">
        <ShopCatalogWithFilters />
      </main>

      {/* 6. FOOTER */}
      <PublicFooter />

      {/* 7. SEARCH MODAL */}
      <PublicSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  )
}
