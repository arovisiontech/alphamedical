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
  ChevronDown,
  ChevronRight,
  Flame,
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

  // Accordion state: ONLY ONE main category dropdown open at a time ("aik sub catagories open kryn to bki sub catagories vgyra close honi chiya")
  const [openMainCategory, setOpenMainCategory] = useState<string | null>('cat-surg-inst')
  const [openSubCategory, setOpenSubCategory] = useState<string | null>(null)

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

  // Sync URL search params and initialCategory with active filter state & auto-expand accordion
  useEffect(() => {
    const cat = searchParams.get('cat')
    const query = searchParams.get('query')
    const sale = searchParams.get('sale')

    if (query) {
      setSearchQuery(query)
      const qClean = query.toLowerCase().trim()
      const matchCat = categories.find(
        (c) =>
          c.name.toLowerCase() === qClean ||
          c.slug === qClean ||
          c.id === qClean
      )
      if (matchCat) {
        setSelectedCategory(matchCat.id)
        if (matchCat.level === 2 && matchCat.parent_id) {
          const parent = categories.find((c) => c.id === matchCat.parent_id)
          if (parent?.parent_id) {
            setOpenMainCategory(parent.parent_id)
            setOpenSubCategory(parent.id)
          } else if (parent) {
            setOpenMainCategory(parent.id)
            setOpenSubCategory(matchCat.id)
          }
        } else if (matchCat.parent_id) {
          setOpenMainCategory(matchCat.parent_id)
          setOpenSubCategory(matchCat.id)
        } else {
          setOpenMainCategory(matchCat.id)
        }
      } else {
        setSelectedCategory('All')
      }
    }

    if (cat) {
      const match = categories.find(
        (c) => c.slug === cat || c.id === cat || c.name.toLowerCase() === cat.toLowerCase()
      )
      if (match) {
        setSelectedCategory(match.id)
        if (match.level === 2 && match.parent_id) {
          const parent = categories.find((c) => c.id === match.parent_id)
          if (parent?.parent_id) {
            setOpenMainCategory(parent.parent_id)
            setOpenSubCategory(parent.id)
          } else if (parent) {
            setOpenMainCategory(parent.id)
            setOpenSubCategory(match.id)
          }
        } else if (match.parent_id) {
          const parent = categories.find((c) => c.id === match.parent_id)
          if (parent?.parent_id) {
            setOpenMainCategory(parent.parent_id)
            setOpenSubCategory(parent.id)
          } else {
            setOpenMainCategory(match.parent_id)
            setOpenSubCategory(match.id)
          }
        } else {
          setOpenMainCategory(match.id)
        }
      } else {
        setSelectedCategory(cat)
      }
    } else if (sale === 'true') {
      setSelectedCategory('sale')
      setOpenMainCategory('sale')
    } else if (initialCategory) {
      const match = categories.find(
        (c) =>
          c.slug === initialCategory ||
          c.id === initialCategory ||
          c.name.toLowerCase() === initialCategory.toLowerCase()
      )
      if (match) {
        setSelectedCategory(match.id)
        if (match.parent_id) {
          setOpenMainCategory(match.parent_id)
        } else {
          setOpenMainCategory(match.id)
        }
      } else {
        setSelectedCategory(initialCategory)
      }
    }
  }, [searchParams, categories, initialCategory])

  // Helper to toggle main category accordion (closing any other open category!)
  const toggleMainCategory = (catId: string) => {
    setOpenMainCategory((prev) => (prev === catId ? null : catId))
    setOpenSubCategory(null)
  }

  // Helper to toggle subcategory accordion (closing any other open subcategory!)
  const toggleSubCategory = (subId: string) => {
    setOpenSubCategory((prev) => (prev === subId ? null : subId))
  }

  // Robust product count helper for category trees & sub-subcategories
  const getCategoryCount = (catId: string): number => {
    if (catId === 'All') return products.length
    if (catId === 'sale') {
      return products.filter(
        (p) => p.badge?.toLowerCase() === 'sale' || p.id === 'prod-sale-special-1'
      ).length
    }

    const catObj = categories.find((c) => c.id === catId || c.slug === catId)
    if (!catObj) return 0

    // Collect all descendant ids recursively
    const getDescendants = (parentId: string): string[] => {
      const direct = categories.filter((c) => c.parent_id === parentId).map((c) => c.id)
      const sub = direct.flatMap((d) => getDescendants(d))
      return [...direct, ...sub]
    }

    const descendantIds = getDescendants(catObj.id)
    const allIds = [catObj.id, ...descendantIds]
    const nameLower = catObj.name.toLowerCase()

    // Level 2 sub-subcategory matching
    if (catObj.level === 2 && catObj.parent_id) {
      const parentObj = categories.find((c) => c.id === catObj.parent_id)
      const cleanWords = nameLower
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 2 && !['and', 'the', 'for'].includes(w))

      return products.filter((p) => {
        // Must belong to parent division
        const inParent =
          p.subcategory_id === catObj.parent_id ||
          p.category_id === catObj.parent_id ||
          (parentObj &&
            (p.subcategory_name?.toLowerCase() === parentObj.name.toLowerCase() ||
             p.category_name?.toLowerCase() === parentObj.name.toLowerCase() ||
             p.specifications?.Subcategory?.toLowerCase() === parentObj.name.toLowerCase()))

        if (!inParent) return false

        if (
          p.sub_subcategory_id === catObj.id ||
          p.sub_subcategory_name?.toLowerCase() === nameLower ||
          p.specifications?.Group?.toLowerCase() === nameLower
        ) {
          return true
        }

        const prodText = [
          p.title,
          p.short_description,
          p.full_description,
          p.sku,
          ...(p.features || []),
          ...Object.entries(p.specifications || {}).flat(),
        ]
          .join(' ')
          .toLowerCase()

        if (prodText.includes(nameLower)) return true
        const singularName = nameLower.endsWith('s') ? nameLower.slice(0, -1) : nameLower
        if (prodText.includes(singularName)) return true

        return cleanWords.some((w) => {
          const sing = w.endsWith('s') ? w.slice(0, -1) : w
          return prodText.includes(sing)
        })
      }).length
    }

    // Level 0 (Main) or Level 1 (Subcategory)
    return products.filter((p) => {
      if (p.category_id && allIds.includes(p.category_id)) return true
      if (p.subcategory_id && allIds.includes(p.subcategory_id)) return true
      if (p.category_name?.toLowerCase() === nameLower) return true
      if (p.subcategory_name?.toLowerCase() === nameLower) return true
      if (p.specifications?.Subcategory?.toLowerCase() === nameLower) return true
      return false
    }).length
  }

  // Filtered & Sorted products calculation
  const filteredProducts = products
    .filter((p) => {
      // Category match
      let matchesCat = true
      if (selectedCategory === 'sale') {
        matchesCat = Boolean(
          p.badge?.toLowerCase() === 'sale' || p.id === 'prod-sale-special-1'
        )
      } else if (selectedCategory !== 'All') {
        const catClean = selectedCategory.toLowerCase().trim()
        const selectedCatObj = categories.find(
          (c) => c.id === selectedCategory || c.slug === selectedCategory
        )

        if (selectedCatObj?.level === 2 && selectedCatObj.parent_id) {
          // Level 2 item matching
          const parentObj = categories.find((c) => c.id === selectedCatObj.parent_id)
          const inParent =
            p.subcategory_id === selectedCatObj.parent_id ||
            p.category_id === selectedCatObj.parent_id ||
            (parentObj &&
              (p.subcategory_name?.toLowerCase() === parentObj.name.toLowerCase() ||
               p.category_name?.toLowerCase() === parentObj.name.toLowerCase() ||
               p.specifications?.Subcategory?.toLowerCase() === parentObj.name.toLowerCase()))

          const nameLower = selectedCatObj.name.toLowerCase()
          const cleanWords = nameLower
            .replace(/[^a-z0-9\s]/g, ' ')
            .split(/\s+/)
            .filter((w) => w.length > 2 && !['and', 'the', 'for'].includes(w))

          const prodText = [
            p.title,
            p.short_description,
            p.full_description,
            p.sku,
            ...(p.features || []),
            ...Object.entries(p.specifications || {}).flat(),
          ]
            .join(' ')
            .toLowerCase()

          const matchesItem =
            p.sub_subcategory_id === selectedCatObj.id ||
            p.sub_subcategory_name?.toLowerCase() === nameLower ||
            p.specifications?.Group?.toLowerCase() === nameLower ||
            prodText.includes(nameLower) ||
            prodText.includes(nameLower.endsWith('s') ? nameLower.slice(0, -1) : nameLower) ||
            cleanWords.some((w) => prodText.includes(w.endsWith('s') ? w.slice(0, -1) : w))

          matchesCat = Boolean(inParent && matchesItem)
        } else {
          // Level 0 or Level 1 matching
          const getDescendants = (parentId: string): string[] => {
            const direct = categories.filter((c) => c.parent_id === parentId).map((c) => c.id)
            const sub = direct.flatMap((d) => getDescendants(d))
            return [...direct, ...sub]
          }

          const childCatIds = selectedCatObj ? getDescendants(selectedCatObj.id) : []
          const allTargetIds = selectedCatObj ? [selectedCatObj.id, ...childCatIds] : [selectedCategory]

          matchesCat =
            (p.category_id && allTargetIds.includes(p.category_id)) ||
            (p.subcategory_id && allTargetIds.includes(p.subcategory_id)) ||
            p.category_name?.toLowerCase().includes(catClean) ||
            p.subcategory_name?.toLowerCase().includes(catClean) ||
            (selectedCatObj &&
              (p.specifications?.Subcategory?.toLowerCase() === selectedCatObj.name.toLowerCase() ||
               p.subcategory_name?.toLowerCase() === selectedCatObj.name.toLowerCase() ||
               p.category_name?.toLowerCase() === selectedCatObj.name.toLowerCase())) ||
            p.slug.includes(catClean)
        }
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

            {/* DYNAMIC HIERARCHICAL CATEGORIES ACCORDION */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] 2xl:text-xs font-bold uppercase text-slate-700 tracking-wider">
                  Procedure Divisions
                </label>
                <span className="text-[10px] text-slate-400 font-semibold">
                  Click to Expand
                </span>
              </div>

              <div className="space-y-1 text-xs 2xl:text-sm">
                {/* 1. ALL DIVISIONS (RESETS FILTER) */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All')
                    setSearchQuery('')
                  }}
                  className={`w-full text-left py-2 px-3 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-between ${
                    selectedCategory === 'All'
                      ? 'bg-[#96161B] text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm">🌐</span>
                    <span>All Divisions</span>
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      selectedCategory === 'All'
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {products.length}
                  </span>
                </button>

                {/* 2. DYNAMIC MAIN CATEGORIES WITH SINGLE-OPEN ACCORDION */}
                {categories
                  .filter((c) => !c.parent_id && c.is_published !== false)
                  .map((mainCat) => {
                    const isMainSelected =
                      selectedCategory === mainCat.id ||
                      selectedCategory === mainCat.name ||
                      selectedCategory === mainCat.slug
                    const isOpen = openMainCategory === mainCat.id
                    const totalMainCount = getCategoryCount(mainCat.id)
                    const subCategories = categories.filter(
                      (sub) => sub.parent_id === mainCat.id && sub.is_published !== false
                    )

                    return (
                      <div key={mainCat.id} className="space-y-1">
                        {/* MAIN CATEGORY ROW */}
                        <div
                          className={`w-full rounded-xl transition-all flex items-center justify-between px-2.5 py-1.5 cursor-pointer ${
                            isMainSelected
                              ? 'bg-[#96161B] text-white font-bold shadow-sm'
                              : isOpen
                              ? 'bg-slate-100 text-slate-900 font-bold border border-slate-200/80'
                              : 'text-slate-700 hover:bg-slate-100 font-semibold'
                          }`}
                        >
                          {/* Clicking the title selects this main category and keeps its dropdown open */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCategory(mainCat.id)
                              setSearchQuery('')
                              setOpenMainCategory(mainCat.id)
                              setOpenSubCategory(null)
                            }}
                            className="flex items-center gap-2 flex-1 text-left truncate cursor-pointer py-1"
                          >
                            <span className="text-sm shrink-0">
                              {mainCat.icon || '📦'}
                            </span>
                            <span className="truncate">{mainCat.name}</span>
                          </button>

                          {/* Right side: count badge + chevron toggle */}
                          <div className="flex items-center gap-1 shrink-0 ml-1">
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                isMainSelected
                                  ? 'bg-white/20 text-white'
                                  : 'bg-slate-200/70 text-slate-600'
                              }`}
                            >
                              {totalMainCount}
                            </span>
                            {subCategories.length > 0 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleMainCategory(mainCat.id)
                                }}
                                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                                  isMainSelected
                                    ? 'hover:bg-white/20 text-white'
                                    : 'hover:bg-slate-200 text-slate-500'
                                }`}
                                title={isOpen ? 'Collapse subcategories' : 'Expand subcategories'}
                              >
                                {isOpen ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* SUB-CATEGORIES ACCORDION PANEL (Only open when selected/toggled, closes when others open) */}
                        {isOpen && subCategories.length > 0 && (
                          <div className="pl-3 pr-1 py-1.5 ml-3 my-1 space-y-1 border-l-2 border-red-300 bg-red-50/20 rounded-r-xl transition-all">
                            {subCategories.map((sub) => {
                              const isSubDirectlySelected =
                                selectedCategory === sub.id ||
                                selectedCategory === sub.name ||
                                selectedCategory === sub.slug
                              const subCount = getCategoryCount(sub.id)
                              const subChildren = categories.filter(
                                (c) => c.parent_id === sub.id && c.is_published !== false
                              )
                              const hasSelectedChild = subChildren.some(
                                (c) =>
                                  selectedCategory === c.id ||
                                  selectedCategory === c.slug ||
                                  selectedCategory.toLowerCase() === c.name.toLowerCase()
                              )
                              const isSubOpen = openSubCategory === sub.id

                              return (
                                <div key={sub.id} className="space-y-1">
                                  <div className="flex items-center justify-between gap-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedCategory(sub.id)
                                        setSearchQuery('')
                                        if (subChildren.length > 0) {
                                          setOpenSubCategory((prev) =>
                                            prev === sub.id && isSubDirectlySelected ? null : sub.id
                                          )
                                        }
                                      }}
                                      className={`flex-1 text-left py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                                        isSubDirectlySelected
                                          ? 'bg-[#96161B] text-white font-bold shadow-xs'
                                          : hasSelectedChild
                                          ? 'bg-red-50 text-[#96161B] font-bold border border-red-200'
                                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/70'
                                      }`}
                                    >
                                      <span className="flex items-center gap-1.5 truncate">
                                        <span
                                          className={`text-[10px] ${
                                            isSubDirectlySelected
                                              ? 'text-white/80'
                                              : hasSelectedChild
                                              ? 'text-[#96161B]'
                                              : 'text-slate-400'
                                          }`}
                                        >
                                          ↳
                                        </span>
                                        <span className="truncate">{sub.name}</span>
                                      </span>
                                      <span
                                        className={`text-[10px] shrink-0 ml-1.5 ${
                                          isSubDirectlySelected
                                            ? 'text-white/80'
                                            : hasSelectedChild
                                            ? 'text-[#96161B]'
                                            : 'text-slate-400'
                                        }`}
                                      >
                                        ({subCount})
                                      </span>
                                    </button>

                                    {subChildren.length > 0 && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setOpenSubCategory((prev) => (prev === sub.id ? null : sub.id))
                                        }}
                                        className={`p-1 rounded-md transition-colors cursor-pointer ${
                                          isSubDirectlySelected
                                            ? 'hover:bg-white/20 text-white'
                                            : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
                                        }`}
                                        title={isSubOpen ? 'Collapse subcategories' : 'Expand subcategories'}
                                      >
                                        {isSubOpen ? (
                                          <ChevronDown className="w-3.5 h-3.5" />
                                        ) : (
                                          <ChevronRight className="w-3.5 h-3.5" />
                                        )}
                                      </button>
                                    )}
                                  </div>

                                  {/* NESTED SUB-SUBCATEGORIES (LEVEL 2) IF ANY */}
                                  {subChildren.length > 0 && isSubOpen && (
                                    <div className="pl-3 py-1 ml-2 space-y-1 border-l-2 border-red-200 bg-white/60 rounded-r-lg">
                                      {subChildren.map((subChild) => {
                                        const isChildSelected =
                                          selectedCategory === subChild.id ||
                                          selectedCategory === subChild.slug ||
                                          selectedCategory.toLowerCase() === subChild.name.toLowerCase()
                                        const childCount = getCategoryCount(subChild.id)
                                        return (
                                          <button
                                            key={subChild.id}
                                            type="button"
                                            onClick={() => {
                                              setSelectedCategory(subChild.id)
                                              setSearchQuery('')
                                            }}
                                            className={`w-full text-left py-1.5 px-2 rounded-md text-[11px] font-medium transition-all flex items-center justify-between cursor-pointer ${
                                              isChildSelected
                                                ? 'bg-[#96161B] text-white font-bold shadow-xs'
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                            }`}
                                          >
                                            <span className="truncate flex items-center gap-1.5">
                                              <span className={isChildSelected ? 'text-white' : 'text-slate-400'}>
                                                •
                                              </span>
                                              <span>{subChild.name}</span>
                                            </span>
                                            <span
                                              className={`text-[9px] shrink-0 ml-1 ${
                                                isChildSelected
                                                  ? 'text-white/80'
                                                  : 'text-slate-400'
                                              }`}
                                            >
                                              ({childCount})
                                            </span>
                                          </button>
                                        )
                                      })}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}

                {/* 3. SALE & CLEARANCE CATEGORY ACCORDION */}
                {(() => {
                  const isSaleSelected = selectedCategory === 'sale'
                  const isSaleOpen = openMainCategory === 'sale'
                  const saleCount = getCategoryCount('sale')

                  return (
                    <div className="space-y-1">
                      <div
                        className={`w-full rounded-xl transition-all flex items-center justify-between px-2.5 py-1.5 cursor-pointer ${
                          isSaleSelected
                            ? 'bg-[#96161B] text-white font-bold shadow-sm'
                            : isSaleOpen
                            ? 'bg-amber-50 text-amber-950 font-bold border border-amber-200/80'
                            : 'text-slate-700 hover:bg-slate-100 font-semibold'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategory('sale')
                            setSearchQuery('')
                            setOpenMainCategory('sale')
                            setOpenSubCategory(null)
                          }}
                          className="flex items-center gap-2 flex-1 text-left truncate cursor-pointer py-1"
                        >
                          <span className="text-sm shrink-0">🔥</span>
                          <span className="truncate">Sale & Clearance</span>
                        </button>

                        <div className="flex items-center gap-1 shrink-0 ml-1">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                              isSaleSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {saleCount}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleMainCategory('sale')
                            }}
                            className={`p-1 rounded-lg transition-colors cursor-pointer ${
                              isSaleSelected
                                ? 'hover:bg-white/20 text-white'
                                : 'hover:bg-slate-200 text-slate-500'
                            }`}
                            title={isSaleOpen ? 'Collapse sale deals' : 'Expand sale deals'}
                          >
                            {isSaleOpen ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* SUB-MENU FOR SALE */}
                      {isSaleOpen && (
                        <div className="pl-3 pr-1 py-1.5 ml-3 my-1 space-y-1 border-l-2 border-amber-300 bg-amber-50/30 rounded-r-xl transition-all">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCategory('sale')
                              setSearchQuery('')
                            }}
                            className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                              selectedCategory === 'sale'
                                ? 'bg-[#96161B] text-white font-bold shadow-xs'
                                : 'text-slate-700 hover:text-slate-900 hover:bg-amber-100/50'
                            }`}
                          >
                            <span className="flex items-center gap-1.5 truncate">
                              <span className="text-[10px] text-amber-600">↳</span>
                              <span className="truncate">All Discounted Clearance</span>
                            </span>
                            <span
                              className={`text-[10px] shrink-0 ml-1.5 ${
                                selectedCategory === 'sale' ? 'text-white/80' : 'text-slate-400'
                              }`}
                            >
                              ({saleCount})
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })()}
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

