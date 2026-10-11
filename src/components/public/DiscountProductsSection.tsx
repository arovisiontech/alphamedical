'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  ShoppingCart,
  Minus,
  Plus,
  Check,
} from 'lucide-react'
import {
  getStoredDiscountProducts,
  INITIAL_DISCOUNT_PRODUCTS_SEED,
} from '@/src/lib/dataStore'
import {
  DiscountProductItem,
  DiscountProductsSectionData,
} from '@/src/types/section'
import { ProductItem } from '@/src/types/product'

interface DiscountProductsSectionProps {
  onAddToCart?: (prod: ProductItem, qty: number) => void
}

export default function DiscountProductsSection({
  onAddToCart,
}: DiscountProductsSectionProps) {
  const [data, setData] = useState<DiscountProductsSectionData>(
    INITIAL_DISCOUNT_PRODUCTS_SEED
  )
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [addedState, setAddedState] = useState<Record<string, boolean>>({})
  const sliderRef = useRef<HTMLDivElement>(null)

  const loadData = () => {
    const stored = getStoredDiscountProducts()
    setData(stored)
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

  const handleQtyChange = (id: string, delta: number) => {
    const current = quantities[id] || 1
    const next = Math.max(1, current + delta)
    setQuantities((prev) => ({ ...prev, [id]: next }))
  }

  const handleCartClick = (item: DiscountProductItem) => {
    const qty = quantities[item.id] || 1
    if (onAddToCart) {
      // Convert to ProductItem format for cart/drawer
      const cartProduct: ProductItem = {
        id: item.id,
        title: item.title,
        slug: item.slug,
        sku: item.sku,
        price: item.price,
        original_price: item.original_price,
        featured_image: item.featured_image,
        category_id: null,
        short_description: 'Self-retaining orthopedic retractor with sharp prongs.',
        full_description: null,
        features: [],
        specifications: {},
        catalogue_pdf: null,
        is_featured: true,
        is_published: true,
        seo_title: item.title,
        seo_description: null,
        sort_order: item.sort_order,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        in_stock: item.in_stock,
        badge: item.badge,
      }
      onAddToCart(cartProduct, qty)
    }

    setAddedState((prev) => ({ ...prev, [item.id]: true }))
    setTimeout(() => {
      setAddedState((prev) => ({ ...prev, [item.id]: false }))
    }, 1800)
  }

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -340, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 340, behavior: 'smooth' })
    }
  }

  return (
    <section className="py-14 sm:py-20 2xl:py-28 3xl:py-36 bg-white overflow-hidden border-b border-slate-100 font-sans">
      <div className="w-full max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 3xl:px-20">
        
        {/* =========================================================
            SECTION HEADER (MATCHING SCREENSHOT 1)
        ========================================================= */}
        <div className="flex items-center justify-between gap-4 mb-8 sm:mb-12">
          {/* Left Title */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-[2.5px] bg-[#96161B] rounded-full inline-block" />
              <span className="text-xs sm:text-sm 2xl:text-base font-bold text-[#96161B] tracking-wider uppercase">
                {data.subtitle}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight text-slate-900 uppercase">
              <span>{data.title_line1} </span>
              <span className="text-[#96161B]">{data.title_line2}</span>
            </h2>
          </div>

          {/* Right Navigation Arrow Buttons (Matching Screenshot 1) */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Prev Arrow (Grey Circle) */}
            <button
              type="button"
              id="discount-slider-prev-btn"
              onClick={scrollLeft}
              aria-label="Previous products"
              className="w-10 h-10 sm:w-11 sm:h-11 2xl:w-13 2xl:h-13 rounded-full bg-[#64748b] hover:bg-[#475569] text-white flex items-center justify-center transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Next Arrow (Red Circle) */}
            <button
              type="button"
              id="discount-slider-next-btn"
              onClick={scrollRight}
              aria-label="Next products"
              className="w-10 h-10 sm:w-11 sm:h-11 2xl:w-13 2xl:h-13 rounded-full bg-[#96161B] hover:bg-[#7e1216] text-white flex items-center justify-center transition-all duration-200 shadow-md active:scale-95 cursor-pointer ring-2 ring-red-100"
            >
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* =========================================================
            PRODUCT SLIDER / CAROUSEL TRACK (MATCHING SCREENSHOT 1)
        ========================================================= */}
        <div
          ref={sliderRef}
          className="flex gap-5 sm:gap-6 2xl:gap-8 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory scroll-smooth scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {data.products.map((item, idx) => {
            const currentQty = quantities[item.id] || 1
            const isAdded = addedState[item.id] || false

            return (
              <div
                key={item.id || idx}
                className="w-[270px] sm:w-[295px] md:w-[310px] 2xl:w-[350px] 3xl:w-[410px] shrink-0 snap-start bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(150,22,27,0.14)] hover:border-red-200 hover-card-3d transition-all duration-300 p-5 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Row: Sale Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-[#96161B] text-white text-[11px] 2xl:text-xs font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-sm shimmer-effect">
                      {item.badge || 'Sale'}
                    </span>
                  </div>

                  {/* Centered Product Image */}
                  <div className="relative w-full h-44 sm:h-48 2xl:h-56 my-3 flex items-center justify-center p-2 bg-slate-50/50 rounded-xl group-hover:bg-slate-50 transition-colors">
                    <Image
                      src={item.featured_image || '/images/products/image-399.png'}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 400px"
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Title */}
                  <h3 className="text-xs sm:text-sm 2xl:text-base font-extrabold text-slate-900 uppercase leading-snug line-clamp-2 min-h-[38px] group-hover:text-[#96161B] transition-colors mb-1">
                    {item.title}
                  </h3>

                  {/* SKU */}
                  <div className="text-[11px] 2xl:text-xs font-semibold text-slate-400 mb-2">
                    SKU:{item.sku}
                  </div>

                  {/* Price Row: Strikethrough Original + Red Sale Price */}
                  <div className="flex items-baseline gap-2 mb-2">
                    {item.original_price && (
                      <span className="text-sm sm:text-base 2xl:text-lg font-bold text-slate-900 line-through">
                        ${item.original_price.toFixed(2)}
                      </span>
                    )}
                    <span className="text-base sm:text-lg 2xl:text-xl font-black text-[#96161B]">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center gap-1.5 mb-4">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.in_stock ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    />
                    <span
                      className={`text-[11px] 2xl:text-xs font-semibold ${
                        item.in_stock ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    >
                      {item.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* Bottom Action Row: Quantity Selector + Add To Cart Button */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  {/* Quantity Selector: [ - 1 + ] */}
                  <div className="flex items-center justify-between border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 bg-white shrink-0 min-w-[76px] sm:min-w-[84px]">
                    <button
                      type="button"
                      onClick={() => handleQtyChange(item.id, -1)}
                      aria-label="Decrease quantity"
                      className="text-slate-400 hover:text-slate-800 p-0.5 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-1 text-xs 2xl:text-sm font-bold">
                      {currentQty}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQtyChange(item.id, 1)}
                      aria-label="Increase quantity"
                      className="text-slate-400 hover:text-slate-800 p-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Add To Cart Red Pill Button with Cart Icon */}
                  <button
                    type="button"
                    onClick={() => handleCartClick(item)}
                    disabled={!item.in_stock}
                    className={`flex-1 py-2 px-2.5 sm:px-3 rounded-lg text-xs 2xl:text-sm font-bold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-sm active:scale-95 ${
                      isAdded
                        ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                        : !item.in_stock
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-[#96161B] hover:bg-[#7e1216] text-white hover:shadow-md glow-btn-red shimmer-effect'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <div className="relative">
                          <ShoppingCart className="w-3.5 h-3.5 2xl:w-4 2xl:h-4" />
                          <span className="w-1.5 h-1.5 bg-white rounded-full absolute -top-0.5 -right-0.5" />
                        </div>
                        <span className="whitespace-nowrap">Add To Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
