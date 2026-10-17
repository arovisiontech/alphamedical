'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  ShoppingCart,
  Check,
  Filter,
  RotateCcw,
  Minus,
  Plus,
  FileText,
  Search,
  Sparkles,
  ArrowUpDown,
  ArrowRight,
} from 'lucide-react'
import {
  getStoredProducts,
  getStoredCategories,
  INITIAL_PRODUCTS_SEED,
  INITIAL_CATEGORIES_SEED,
} from '@/src/lib/dataStore'
import { ProductItem } from '@/src/types/product'
import { CategoryItem } from '@/src/types/category'
import { useGeoLocation } from '@/src/context/GeoLocationContext'

interface ShopCatalogWithFiltersProps {
  onAddToCart?: (prod: ProductItem, qty: number) => void
  initialCategory?: string
}

function ShopCatalogContent({
  onAddToCart,
  initialCategory,
}: ShopCatalogWithFiltersProps) {
  const { isUsaStore, openInquiryModal } = useGeoLocation()
  const searchParams = useSearchParams()

  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS_SEED)
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES_SEED)

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<number>(500)
  const [inStockOnly, setInStockOnly] = useState<boolean>(false)
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'title'>('featured')

  // Card Interactive states
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [addedState, setAddedState] = useState<Record<string, boolean>>({})

  const loadData = () => {
    const prods = getStoredProducts().filter((p) => p.is_published !== false)
    const cats = getStoredCategories().filter((c) => c.is_published !== false)
    setProducts(prods)
    setCategories(cats)
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

  // Sync URL search params and initialCategory with active filter state
  useEffect(() => {
    const cat = searchParams.get('cat')
    const query = searchParams.get('query')
    const sale = searchParams.get('sale')

    if (query) {
      setSearchQuery(query)
      setSelectedCategory('All')
    }

    if (cat) {
      const match = categories.find(
        (c) => c.slug === cat || c.id === cat || c.name.toLowerCase() === cat.toLowerCase()
      )
      if (match) {
        setSelectedCategory(match.id)
      } else {
        setSelectedCategory(cat)
      }
    } else if (sale === 'true') {
      setSelectedCategory('sale')
    } else if (initialCategory) {
      const match = categories.find(
        (c) =>
          c.slug === initialCategory ||
          c.id === initialCategory ||
          c.name.toLowerCase() === initialCategory.toLowerCase()
      )
      if (match) {
        setSelectedCategory(match.id)
      } else {
        setSelectedCategory(initialCategory)
      }
    }
  }, [searchParams, categories, initialCategory])

  // Filtered & Sorted products calculation
  const filteredProducts = products
    .filter((p) => {
      // Category match
      let matchesCat = true
      if (selectedCategory === 'sale') {
        matchesCat = Boolean(
          p.badge?.toLowerCase().includes('sale') ||
            (p.original_price != null && p.price != null && p.original_price > p.price)
        )
      } else if (selectedCategory !== 'All') {
        const catClean = selectedCategory.toLowerCase().trim()
        const selectedCatObj = categories.find(
          (c) => c.id === selectedCategory || c.slug === selectedCategory
        )

        const childCatIds = selectedCatObj
          ? categories.filter((c) => c.parent_id === selectedCatObj.id).map((c) => c.id)
          : []

        matchesCat =
          p.category_id === selectedCategory ||
          Boolean(p.category_id && childCatIds.includes(p.category_id)) ||
          p.category_name?.toLowerCase().includes(catClean) ||
          (selectedCatObj &&
            p.specifications?.Subcategory?.toLowerCase() === selectedCatObj.name.toLowerCase()) ||
          p.slug.includes(catClean)
      }

      // Robust Search Query match: match title, sku, short_desc, full_desc, features, specs, and individual terms
      const q = searchQuery.toLowerCase().trim()
      let matchesSearch = true
      if (q) {
        const searchableText = [
          p.title,
          p.sku,
          p.category_name,
          p.short_description,
          p.full_description,
          ...(p.features || []),
          ...Object.entries(p.specifications || {}).flat(),
        ]
          .join(' ')
          .toLowerCase()

        // Extract clean words (remove punctuation like '&' so 'N95 & Surgical Masks' matches 'N95' and 'Surgical')
        const cleanWords = q
          .replace(/[^a-z0-9\s]/g, ' ')
          .split(/\s+/)
          .filter((w) => w.length > 1 && !['and', 'the', 'for', 'with'].includes(w))

        matchesSearch =
          searchableText.includes(q) ||
          (cleanWords.length > 0 && cleanWords.every((word) => searchableText.includes(word))) ||
          (cleanWords.length > 0 &&
            cleanWords.some((word) => searchableText.includes(word) && word.length >= 4))
      }

      // Price match
      const price = p.price ?? 55.95
      const matchesPrice = price <= maxPrice

      // Stock match
      const inStock = p.in_stock !== false
      const matchesStock = !inStockOnly || inStock

      return matchesCat && matchesSearch && matchesPrice && matchesStock
    })
    .sort((a, b) => {
      const priceA = a.price ?? 55.95
      const priceB = b.price ?? 55.95
      if (sortBy === 'price_low') return priceA - priceB
      if (sortBy === 'price_high') return priceB - priceA
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      return (b.sort_order || 0) - (a.sort_order || 0)
    })

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

  const activeCategoryObject = categories.find((c) => c.id === selectedCategory)

  return (
    <div className="w-full max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-10 sm:py-14 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 2xl:gap-10">
        
        {/* =========================================================
            LEFT SIDEBAR FILTERS (MATCHING SCREENSHOT & SVG DESIGN)
        ========================================================= */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-5 sm:p-6 2xl:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6 sticky top-24">
            
            {/* FILTER HEADER */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-black text-sm 2xl:text-base uppercase text-slate-900 tracking-wider flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#96161B]" />
                <span>Product Filters</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All')
                  setSearchQuery('')
                  setMaxPrice(500)
                  setInStockOnly(false)
                }}
                className="text-[11px] 2xl:text-xs font-bold text-[#96161B] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            </div>

            {/* LIVE SEARCH INPUT */}
            <div className="space-y-1.5">
              <label className="block text-[11px] 2xl:text-xs font-bold uppercase text-slate-700 tracking-wider">
                Keyword Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Rongeurs, Scissors..."
                  className="w-full pl-9 pr-3 py-2 2xl:py-2.5 rounded-xl border border-slate-300 text-xs 2xl:text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B]"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* PRICE RANGE SLIDER */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between text-xs 2xl:text-sm font-bold">
                <span className="uppercase text-slate-700">Max Price:</span>
                <span className="text-[#96161B] font-extrabold">${maxPrice} USD</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#96161B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] 2xl:text-[11px] font-bold text-slate-400">
                <span>$10</span>
                <span>$250</span>
                <span>$500+</span>
              </div>
            </div>

            {/* AVAILABILITY */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <label className="block text-[11px] 2xl:text-xs font-bold uppercase text-slate-700 tracking-wider">
                Availability
              </label>
              <label className="flex items-center gap-2 text-xs 2xl:text-sm font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 accent-[#96161B] rounded cursor-pointer"
                />
                <span>In Stock Ready to Ship ({products.filter((p) => p.in_stock).length})</span>
              </label>
            </div>

            {/* DYNAMIC CATEGORIES LIST */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <label className="block text-[11px] 2xl:text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">
                Procedure Divisions
              </label>
              <div className="space-y-1 text-xs 2xl:text-sm">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All')}
                  className={`w-full text-left py-2 px-3 rounded-xl font-bold transition-colors cursor-pointer flex items-center justify-between ${
                    selectedCategory === 'All'
                      ? 'bg-[#96161B] text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>All Divisions</span>
                  <span className={`text-[10px] ${selectedCategory === 'All' ? 'text-white/80' : 'text-slate-400'}`}>
                    ({products.length})
                  </span>
                </button>

                {categories.map((c) => {
                  const isSelected = selectedCategory === c.id || selectedCategory === c.name || selectedCategory === c.slug
                  const childIds = categories.filter((ch) => ch.parent_id === c.id).map((ch) => ch.id)
                  const count = products.filter((p) => {
                    if (p.category_id === c.id || (p.category_id && childIds.includes(p.category_id))) return true
                    if (p.specifications?.Subcategory?.toLowerCase() === c.name.toLowerCase()) return true
                    return false
                  }).length

                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(c.id)
                        setSearchQuery('')
                      }}
                      className={`w-full text-left py-2 px-3 rounded-xl font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#96161B] text-white font-bold shadow-sm'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate pr-2">{c.name}</span>
                      <span className={`text-[10px] shrink-0 ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                        ({count})
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

          </div>
        </div>

        {/* =========================================================
            RIGHT PRODUCTS GRID (MATCHING IMAGE 399 EXACT DESIGN)
        ========================================================= */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* TOP BAR: RESULTS COUNT & SORTING DROPDOWN */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs 2xl:text-sm font-bold text-slate-700">
            <div className="flex items-center gap-2">
              <span>Showing</span>
              <span className="text-[#96161B] font-extrabold text-sm 2xl:text-base">
                {filteredProducts.length}
              </span>
              <span>Instruments in</span>
              <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md font-extrabold">
                {activeCategoryObject ? activeCategoryObject.name : selectedCategory === 'All' ? 'All Divisions' : selectedCategory}
              </span>
            </div>

            {/* SORTING SELECT */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-[#96161B] cursor-pointer"
              >
                <option value="featured">Best Sellers / Featured</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="title">Alphabetical (A - Z)</option>
              </select>
            </div>
          </div>

          {/* PRODUCT CARDS GRID */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-red-50 text-[#96161B] rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900">No Instruments Found</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                We couldn&apos;t find any instruments matching your active filter criteria. Try adjusting your
                keyword search or price range.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All')
                  setSearchQuery('')
                  setMaxPrice(500)
                }}
                className="bg-[#96161B] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow cursor-pointer hover:bg-[#7d1216]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 4xl:grid-cols-5 gap-6 2xl:gap-8">
              {filteredProducts.map((prod) => {
                const qty = quantities[prod.id] || 1
                const isAdded = addedState[prod.id]
                const price = prod.price ?? 55.95
                const originalPrice = prod.original_price ?? 64.95
                const badge = prod.badge || 'Sale'
                const inStock = prod.in_stock !== false
                const imageSrc = prod.featured_image || '/images/products/image-399.png'

                return (
                  <div
                    key={prod.id}
                    className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(150,22,27,0.14)] hover:border-[#96161B]/30 hover-card-3d transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* TOP BADGE (RED PILL) */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-[#96161B] text-white text-[11px] sm:text-xs font-bold px-3 py-1 rounded-md shadow-sm shimmer-effect">
                        {badge}
                      </span>
                    </div>

                    {/* PRODUCT IMAGE (CLICKABLE LINK TO VIEW LARGE PAGE) */}
                    <Link
                      href={`/products/${prod.slug || prod.id}`}
                      className="block relative aspect-[4/3] w-full my-2 flex items-center justify-center bg-slate-50/50 rounded-xl overflow-hidden cursor-pointer"
                    >
                      <Image
                        src={imageSrc}
                        alt={prod.title}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </Link>

                    {/* PRODUCT CONTENT */}
                    <div className="space-y-3 pt-2 flex-1 flex flex-col justify-between">
                      <div>
                        {/* TITLE (CLICKABLE LINK TO VIEW LARGE PAGE) */}
                        <Link
                          href={`/products/${prod.slug || prod.id}`}
                          className="font-extrabold text-slate-900 text-xs sm:text-sm 2xl:text-base uppercase tracking-tight line-clamp-2 leading-snug group-hover:text-[#96161B] transition-colors block cursor-pointer"
                        >
                          {prod.title}
                        </Link>

                        {/* SKU */}
                        <div className="text-[11px] sm:text-xs font-semibold text-slate-400 mt-1">
                          SKU:{prod.sku || '1001'}
                        </div>

                        {/* PRICE ROW */}
                        <div className="flex items-baseline gap-2.5 mt-2">
                          {originalPrice && originalPrice > price && (
                            <span className="text-slate-900 font-bold text-sm sm:text-base line-through">
                              ${originalPrice.toFixed(2)}
                            </span>
                          )}
                          <span className="text-[#96161B] font-extrabold text-base sm:text-lg 2xl:text-xl">
                            ${price.toFixed(2)}
                          </span>
                        </div>

                        {/* IN STOCK STATUS */}
                        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-emerald-600 mt-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                          <span>{inStock ? 'In Stock' : 'Out of Stock'}</span>
                        </div>
                      </div>

                      {/* VIEW LARGE BUTTON */}
                      <div className="pt-1">
                        <Link
                          href={`/products/${prod.slug || prod.id}`}
                          className="w-full bg-slate-50 hover:bg-[#96161B] text-slate-700 hover:text-white border border-slate-200 py-1.5 px-3 rounded-xl font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>View Large Details</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>

                      {/* BOTTOM ACTION BAR: DUAL-MODE USA STORE VS INTERNATIONAL INQUIRY */}
                      <div className="pt-2 border-t border-slate-100">
                        {isUsaStore ? (
                          /* USA STORE VIEW: QUANTITY SELECTOR + ADD TO CART */
                          <div className="flex items-center gap-2">
                            {/* Quantity Pill */}
                            <div className="flex items-center justify-between border border-slate-300 rounded-xl px-2 py-1.5 w-20 sm:w-24 shrink-0 bg-white">
                              <button
                                type="button"
                                onClick={() => handleQtyChange(prod.id, -1)}
                                className="text-slate-600 hover:text-slate-900 p-0.5 rounded transition-colors disabled:opacity-30 cursor-pointer"
                                disabled={qty <= 1}
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
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
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Add To Cart Button */}
                            <button
                              type="button"
                              onClick={() => handleCartClick(prod)}
                              disabled={!inStock}
                              className={`flex-1 py-2 px-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                                isAdded
                                  ? 'bg-emerald-600 text-white shadow-md'
                                  : !inStock
                                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                  : 'bg-[#96161B] hover:bg-[#7d1216] text-white shadow-md active:scale-95 glow-btn-red shimmer-effect'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Added</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingCart className="w-3.5 h-3.5" />
                                  <span>Add To Cart</span>
                                </>
                              )}
                            </button>
                          </div>
                        ) : (
                          /* INTERNATIONAL B2B QUOTE BUTTON */
                          <button
                            type="button"
                            onClick={() => openInquiryModal(prod)}
                            className="w-full py-2.5 px-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 bg-[#96161B] hover:bg-[#7d1216] text-white shadow-md shadow-red-950/20 active:scale-95 glow-btn-red shimmer-effect transition-all cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Request B2B Quote</span>
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                )
              })}
            </div>
          )}

        </div>

      </div>
    </div>
  )
}

export default function ShopCatalogWithFilters(props: ShopCatalogWithFiltersProps) {
  return (
    <React.Suspense
      fallback={
        <div className="w-full max-w-7xl mx-auto py-20 text-center">
          <div className="w-10 h-10 border-4 border-[#96161B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-500">Loading instruments catalog...</p>
        </div>
      }
    >
      <ShopCatalogContent {...props} />
    </React.Suspense>
  )
}

