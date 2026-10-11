'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ALPHA_PRODUCTS, ALPHA_CATEGORIES, AlphaProduct } from '@/src/data/alphaData'
import { ShoppingCart, Check, Filter, RotateCcw } from 'lucide-react'

interface ShopCatalogWithFiltersProps {
  onAddToCart?: (prod: AlphaProduct, qty: number) => void
}

export default function ShopCatalogWithFilters({ onAddToCart }: ShopCatalogWithFiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [maxPrice, setMaxPrice] = useState<number>(900)
  const [inStockOnly, setInStockOnly] = useState<boolean>(false)
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [addedState, setAddedState] = useState<Record<string, boolean>>({})

  const filteredProducts = ALPHA_PRODUCTS.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory
    const matchesPrice = p.price <= maxPrice
    const matchesStock = !inStockOnly || p.inStock
    return matchesCat && matchesPrice && matchesStock
  })

  const handleQtyChange = (id: string, delta: number) => {
    const current = quantities[id] || 1
    const next = Math.max(1, current + delta)
    setQuantities((prev) => ({ ...prev, [id]: next }))
  }

  const handleCartClick = (prod: AlphaProduct) => {
    const qty = quantities[prod.id] || 1
    if (onAddToCart) {
      onAddToCart(prod, qty)
    }
    setAddedState((prev) => ({ ...prev, [prod.id]: true }))
    setTimeout(() => {
      setAddedState((prev) => ({ ...prev, [prod.id]: false }))
    }, 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT SIDEBAR FILTERS (EXACT MATCH TO REFERENCE DESIGN) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-black text-sm uppercase text-slate-900 tracking-wider flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#B92025]" />
                <span>Filters</span>
              </h3>
              <button
                onClick={() => {
                  setSelectedCategory('All')
                  setMaxPrice(900)
                  setInStockOnly(false)
                }}
                className="text-[11px] font-bold text-[#B92025] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            </div>

            {/* PRICE RANGE SLIDER */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-slate-700">
                Price Range: <span className="text-[#B92025] font-extrabold">${maxPrice}</span>
              </label>
              <input
                type="range"
                min="20"
                max="900"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#B92025] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>$20</span>
                <span>$900+</span>
              </div>
            </div>

            {/* AVAILABILITY */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <label className="block text-xs font-bold uppercase text-slate-700">
                Availability
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 accent-[#B92025] rounded"
                />
                <span>In Stock Only ({ALPHA_PRODUCTS.filter(p => p.inStock).length})</span>
              </label>
            </div>

            {/* CATEGORIES TREE */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                Categories
              </label>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`w-full text-left py-1.5 px-2.5 rounded-lg font-bold transition-colors ${
                    selectedCategory === 'All'
                      ? 'bg-[#B92025] text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  All Categories
                </button>
                {ALPHA_CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.name)}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg font-semibold transition-colors flex items-center justify-between ${
                      selectedCategory === c.name
                        ? 'bg-[#B92025] text-white font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate">{c.name}</span>
                    <span className="text-[10px] opacity-75">({c.productCount})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PRODUCT GRID */}
        <div className="lg:col-span-9 space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
            <div>
              Showing <span className="text-[#B92025]">{filteredProducts.length}</span> Products
            </div>
            <div className="text-slate-400">
              Division: <span className="text-slate-900 font-bold">{selectedCategory}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => {
              const qty = quantities[prod.id] || 1
              const isAdded = addedState[prod.id]

              return (
                <div
                  key={prod.id}
                  className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] w-full bg-slate-50 p-4 border-b border-slate-100">
                    <Image
                      src={prod.image}
                      alt={prod.title}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                    />
                    {prod.badge && (
                      <span className="absolute top-3 left-3 bg-[#B92025] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase">
                        {prod.badge}
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="text-[10px] font-bold text-[#B92025] uppercase tracking-wider mb-1">
                        {prod.sku}
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-xs group-hover:text-[#B92025] transition-colors leading-snug line-clamp-2">
                        {prod.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-slate-400 line-through">
                          ${prod.originalPrice.toFixed(2)}
                        </span>
                        <span className="text-sm font-black text-[#B92025]">
                          ${prod.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-50 text-xs font-bold">
                        <button
                          onClick={() => handleQtyChange(prod.id, -1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-200"
                        >
                          -
                        </button>
                        <span className="px-2 py-1 text-slate-900">{qty}</span>
                        <button
                          onClick={() => handleQtyChange(prod.id, 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-200"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleCartClick(prod)}
                        className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all shadow flex items-center justify-center gap-1.5 ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#B92025] hover:bg-[#96161B] text-white'
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
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
