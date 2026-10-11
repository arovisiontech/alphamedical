'use client'

import React, { useState } from 'react'
import TopBar from '@/src/components/public/TopBar'
import HeaderNav from '@/src/components/public/HeaderNav'
import MainRedNavbar from '@/src/components/public/MainRedNavbar'
import HeroBanner from '@/src/components/public/HeroBanner'
import CategoriesCollection from '@/src/components/public/CategoriesCollection'
import TrustFeaturesSection from '@/src/components/public/TrustFeaturesSection'
import VideoWhyChooseSection from '@/src/components/public/VideoWhyChooseSection'
import FeaturedProductsSection from '@/src/components/public/FeaturedProductsSection'
import GlobalExportSection from '@/src/components/public/GlobalExportSection'
import CompliancesPromoSection from '@/src/components/public/CompliancesPromoSection'
import OrderProcessSection from '@/src/components/public/OrderProcessSection'
import PartnerCalloutBanner from '@/src/components/public/PartnerCalloutBanner'
import EntSurgeryBanner from '@/src/components/public/EntSurgeryBanner'
import DownloadableCataloguesSection from '@/src/components/public/DownloadableCataloguesSection'
import ContactForm from '@/src/components/public/ContactForm'
import PublicFooter from '@/src/components/public/PublicFooter'
import PublicSearchModal from '@/src/components/public/PublicSearchModal'
import CartQuoteModal from '@/src/components/public/CartQuoteModal'
import { ProductItem } from '@/src/types/product'

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<ProductItem[]>([])

  const handleAddToCart = (prod: ProductItem, qty: number) => {
    if (!cartItems.some((i) => i.id === prod.id)) {
      setCartItems((prev) => [...prev, prod])
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <TopBar />

      {/* 2. HEADER WITH LOGO 5 & SEARCH BAR */}
      <HeaderNav
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartItems.length}
      />

      {/* 3. MAIN MAROON RED NAVBAR WITH MEGA MENUS */}
      <MainRedNavbar />

      {/* 4. HERO BANNER (KERRISON RONGEUR INSTRUMENTS) */}
      <HeroBanner />

      {/* 5. CATEGORIES COLLECTION (CURVED MAROON HEADERS) */}
      <CategoriesCollection />

      {/* 6. TRUST / VALUE BADGES (PREMIUM QUALITY, FAST SHIPPING, SUPPORT, TRUSTED BY PROFESSIONALS) */}
      <TrustFeaturesSection />

      {/* 7. VIDEO & WHY CHOOSE SECTION (MATCHING SCREENSHOT 1 TOP) */}
      <VideoWhyChooseSection />

      {/* 8. BEST SELLERS / FEATURED PRODUCTS (MATCHING IMAGE 399) */}
      <FeaturedProductsSection onAddToCart={handleAddToCart} />

      {/* 9. TRUSTED WORLDWIDE FACTORY EXPORT SECTION (MATCHING SCREENSHOT 1 BOTTOM) */}
      <GlobalExportSection />

      {/* 10. GLOBAL COMPLIANCES & ACTION PROMO CARDS */}
      <CompliancesPromoSection />

      {/* 11. HOW ALPHA PROCESSES YOUR ORDER (MATCHING SCREENSHOT 1) */}
      <OrderProcessSection />

      {/* 7. PARTNER CALLOUT BANNER */}
      <PartnerCalloutBanner />

      {/* 8. ENT SURGERY PROMO BANNER */}
      <EntSurgeryBanner />

      {/* 9. DOWNLOADABLE CATALOGUES */}
      <DownloadableCataloguesSection />

      {/* 10. CONTACT / QUOTATION DESK */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <ContactForm />
        </div>
      </section>

      {/* 11. FOOTER */}
      <PublicFooter />

      {/* MODALS */}
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
