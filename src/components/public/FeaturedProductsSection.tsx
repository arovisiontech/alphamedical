'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ShoppingCart,
  Check,
  Award,
  Sparkles,
  Minus,
  Plus,
  ArrowRight,
  ChevronRight,
  FileText,
} from 'lucide-react'
import { getStoredProducts, INITIAL_PRODUCTS_SEED } from '@/src/lib/dataStore'
import { ProductItem } from '@/src/types/product'
import { useGeoLocation } from '@/src/context/GeoLocationContext'

interface FeaturedProductsSectionProps {
  onAddToCart?: (prod: ProductItem, qty: number) => void
}

export default function FeaturedProductsSection({
  onAddToCart,
}: FeaturedProductsSectionProps) {
  const { isUsaStore, openInquiryModal } = useGeoLocation()
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS_SEED)
  const [activeTab, setActiveTab] = useState<'best_sellers' | 'new_arrivals'>('new_arrivals')
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [addedState, setAddedState] = useState<Record<string, boolean>>({})

  const loadData = () => {
    const all = getStoredProducts()
    setProducts(all)
  }

  useEffect(() => {
    loadData()

    const handleUpdate = () => {
      loadData()
    }

    window.addEventListener('alpha_content_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)

    return () => {
      window.removeEventListener('alpha_content_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  // Filter products based on active tab
  const displayedProducts = products
    .filter((p) => p.is_published !== false)
    .filter((p) => {
      if (activeTab === 'best_sellers') {
        return p.is_best_seller || p.is_featured
      }
      if (activeTab === 'new_arrivals') {
        return p.is_new_arrival || p.badge === 'New' || p.is_featured
      }
      return true
    })

  // If filtered list is empty, fallback to first 4 products
  const finalProducts =
    displayedProducts.length > 0 ? displayedProducts.slice(0, 8) : products.slice(0, 4)

  const handleQtyChange = (id: string, delta: number) => {
    const current = quantities[id] || 1
    const next = Math.max(1, current + delta)
    setQuantities((prev) => ({ ...prev, [id]: next }))
  }

  const handleCartClick = (prod: ProductItem) => {
    const qty = quantities[prod.id] || 1
    if (onAddToCart) {
      onAddToCart(prod, qty)
    }
    setAddedState((prev) => ({ ...prev, [prod.id]: true }))
    setTimeout(() => {
      setAddedState((prev) => ({ ...prev, [prod.id]: false }))
    }, 1800)
  }

  return (
    <section className="py-12 sm:py-16 2xl:py-24 3xl:py-32 bg-[#fafbfc] border-b border-slate-200/80">
      <div className="w-full max-w-7xl 2xl:max-w-[1850px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 3xl:px-20">
        
        {/* HEADER MATCHING IMAGE 399 SCREENSHOT */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-12">
          {/* Left Title */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-[2.5px] bg-[#96161B] rounded-full inline-block" />
              <span className="text-xs sm:text-sm 2xl:text-base font-bold text-[#96161B] tracking-wider uppercase">
                Explore Our Range
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl 3xl:text-6xl font-black tracking-tight text-slate-900 uppercase">
              FEATURED <span className="text-[#96161B]">PRODUCTS</span>
            </h2>
          </div>

          {/* Right Toggle Tabs (Best Sellers vs New Arrivals) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Best Sellers Tab Button */}
            <button
              id="tab-best-sellers-btn"
              onClick={() => setActiveTab('best_sellers')}
              className={`relative px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm 2xl:text-base font-bold flex items-center gap-2.5 transition-all duration-200 cursor-pointer ${
                activeTab === 'best_sellers'
                  ? 'bg-[#96161B] text-white shadow-lg shadow-red-950/20 ring-2 ring-[#96161B]'
                  : 'bg-white text-slate-800 border border-slate-200 shadow-sm hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Award
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  activeTab === 'best_sellers' ? 'text-white' : 'text-[#96161B]'
                }`}
              />
              <span>Best Sellers</span>
              {activeTab === 'best_sellers' && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#96161B]" />
              )}
            </button>

            {/* New Arrivals Tab Button (Red pill with arrow downward indicator in image 399) */}
            <button
              id="tab-new-arrivals-btn"
              onClick={() => setActiveTab('new_arrivals')}
              className={`relative px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm 2xl:text-base font-bold flex items-center gap-2.5 transition-all duration-200 cursor-pointer ${
                activeTab === 'new_arrivals'
                  ? 'bg-[#96161B] text-white shadow-lg shadow-red-950/20 ring-2 ring-[#96161B]'
                  : 'bg-white text-slate-800 border border-slate-200 shadow-sm hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Sparkles
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  activeTab === 'new_arrivals' ? 'text-white' : 'text-[#96161B]'
                }`}
              />
              <span>New Arrivals</span>
              {activeTab === 'new_arrivals' && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#96161B]" />
              )}
            </button>
          </div>
        </div>

        {/* PRODUCT CARDS GRID (100% MATCHING SCREENSHOT IMAGE 399) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 3xl:grid-cols-4 4xl:grid-cols-6 gap-6 sm:gap-6 2xl:gap-8 3xl:gap-10">
          {finalProducts.map((prod) => {
            const qty = quantities[prod.id] || 1
            const isAdded = addedState[prod.id]
            const price = prod.price ?? 55.95
            const originalPrice = prod.original_price ?? 64.95
            const badge = prod.badge || (prod.is_new_arrival ? 'New' : 'New')
            const imageSrc = prod.featured_image || '/images/products/image-399.png'
            const inStock = prod.in_stock !== false

            return (
              <div
                key={prod.id}
                className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(150,22,27,0.14)] hover:border-[#96161B]/30 hover-card-3d transition-all duration-300 p-5 sm:p-6 2xl:p-8 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Top Badge (Deep Red Pill with "New") */}
                <div className="flex items-center justify-between mb-2">
                  {badge ? (
                    <span className="bg-[#96161B] text-white text-[11px] sm:text-xs font-bold px-3 py-1 rounded-md shadow-sm shimmer-effect">
                      {badge}
                    </span>
                  ) : (
                    <span />
                  )}
                </div>

                {/* Main Product Image Container */}
                <div className="relative aspect-[4/3] w-full my-2 flex items-center justify-center">
                  <Image
                    src={imageSrc}
                    alt={prod.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-500 ease-out"
                    priority={false}
                  />
                </div>

                {/* Content & Details */}
                <div className="space-y-3 pt-3">
                  {/* Title */}
                  <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm 2xl:text-base uppercase tracking-tight line-clamp-2 leading-snug group-hover:text-[#96161B] transition-colors">
                    {prod.title}
                  </h3>

                  {/* SKU */}
                  <div className="text-[11px] sm:text-xs font-semibold text-slate-400">
                    SKU:{prod.sku || '1001'}
                  </div>

                  {/* Price Row: Crossed Original + Bold Red Sale */}
                  <div className="flex items-baseline gap-2.5">
                    {originalPrice && originalPrice > price && (
                      <span className="text-slate-900 font-bold text-base sm:text-lg 2xl:text-xl line-through">
                        ${originalPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="text-[#96161B] font-extrabold text-lg sm:text-xl 2xl:text-2xl">
                      ${price.toFixed(2)}
                    </span>
                  </div>

                  {/* In Stock Indicator */}
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    <span>{inStock ? 'In Stock' : 'Pre-Order / Out of Stock'}</span>
                  </div>

                  {/* Bottom Action Bar: USA Store (Cart + Qty) vs International (B2B Quote Request) */}
                  <div className="pt-2">
                    {isUsaStore ? (
                      <div className="flex items-center gap-2 sm:gap-3">
                        {/* Quantity Pill */}
                        <div className="flex items-center justify-between border border-slate-300 rounded-xl px-2 py-1.5 sm:py-2 w-24 sm:w-28 shrink-0 bg-white">
                          <button
                            type="button"
                            onClick={() => handleQtyChange(prod.id, -1)}
                            className="text-slate-600 hover:text-slate-900 p-0.5 rounded transition-colors disabled:opacity-30 cursor-pointer"
                            disabled={qty <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          <span className="font-bold text-xs sm:text-sm text-slate-900 select-none">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQtyChange(prod.id, 1)}
                            className="text-slate-600 hover:text-slate-900 p-0.5 rounded transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>

                        {/* Add To Cart Button */}
                        <button
                          type="button"
                          onClick={() => handleCartClick(prod)}
                          className={`flex-1 py-2 sm:py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm 2xl:text-base flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                            isAdded
                              ? 'bg-emerald-600 text-white shadow-md'
                              : 'bg-[#96161B] hover:bg-[#7d1216] text-white shadow-md shadow-red-950/20 active:scale-95 glow-btn-red shimmer-effect'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <div className="relative">
                                <ShoppingCart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                                <span className="absolute -top-1.5 -right-2 bg-white text-[#96161B] text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                                  0
                                </span>
                              </div>
                              <span>Add To Cart</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      /* International Inquiry Button */
                      <button
                        type="button"
                        onClick={() => openInquiryModal(prod)}
                        className="w-full py-2.5 sm:py-3 px-3 rounded-xl font-extrabold text-xs sm:text-sm 2xl:text-base flex items-center justify-center gap-2 bg-[#96161B] hover:bg-[#7d1216] text-white shadow-md shadow-red-950/20 active:scale-95 glow-btn-red shimmer-effect transition-all cursor-pointer"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Request B2B Quote</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* View All Bar on 64-inch / Ultra-wide displays */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white border border-slate-300 text-slate-800 hover:text-[#96161B] hover:border-[#96161B] font-bold text-xs sm:text-sm 2xl:text-base transition-all shadow-sm hover:shadow-md"
          >
            <span>Explore Complete Surgical & Medical Catalogue</span>
            <ArrowRight className="w-4 h-4 text-[#96161B]" />
          </Link>
        </div>

      </div>
    </section>
  )
}
