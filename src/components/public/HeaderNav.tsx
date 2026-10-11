'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ShoppingCart, ChevronDown, User } from 'lucide-react'
import { ALPHA_CATEGORIES } from '@/src/data/alphaData'

interface HeaderNavProps {
  onOpenSearch?: () => void
  onOpenCart?: () => void
  cartCount?: number
}

export default function HeaderNav({ onOpenSearch, onOpenCart, cartCount = 0 }: HeaderNavProps) {
  const [selectedCategory, setSelectedCategory] = useState('All Categories')

  return (
    <div className="bg-white border-b border-slate-200 py-3 sm:py-4 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* LEFT: SEARCH BAR WITH CATEGORY SELECTOR (MATCHING SCREENSHOT 3) */}
        <div className="w-full md:w-auto md:flex-1 md:max-w-md order-2 md:order-1">
          <div className="flex items-center border border-slate-300 rounded-md overflow-hidden bg-white shadow-sm focus-within:border-[#B92025] transition-colors">
            <input
              type="text"
              onClick={onOpenSearch}
              placeholder="Search Instruments, supplies, brands..."
              className="flex-1 px-3.5 py-2 text-xs font-normal text-slate-800 outline-none placeholder:text-slate-400 bg-transparent min-w-0"
            />

            <div className="relative border-l border-slate-200 bg-transparent">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-transparent pl-2.5 pr-6 py-2 text-xs font-normal text-slate-600 outline-none cursor-pointer"
              >
                <option value="All Categories">All Categories</option>
                {ALPHA_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-[#B92025] absolute right-2 top-3 pointer-events-none" />
            </div>

            <button
              onClick={onOpenSearch}
              className="bg-[#B92025] hover:bg-[#96161B] text-white px-3.5 py-2.5 transition-colors flex items-center justify-center shrink-0"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CENTER: ALPHA WHOLESALE MEDICAL SUPPLIES LLC LOGO (MATCHING SCREENSHOT 3) */}
        <div className="order-1 md:order-2 flex justify-center shrink-0">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo5.svg"
              alt="ALPHA Wholesale Medical Supplies LLC"
              width={260}
              height={65}
              priority
              className="h-12 sm:h-14 md:h-16 w-auto object-contain"
            />
          </Link>
        </div>

        {/* RIGHT: CART (MATCHING SCREENSHOT 3) */}
        <div className="order-3 flex items-center justify-end gap-4 md:w-auto md:flex-1 md:max-w-md">
          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#B92025] px-2.5 py-1.5 rounded-md hover:bg-slate-50 transition-colors"
            title="Admin Portal"
          >
            <User className="w-3.5 h-3.5 text-[#B92025]" />
            <span>Admin</span>
          </Link>

          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 text-slate-800 hover:text-[#B92025] transition-colors group cursor-pointer"
            title="View Cart / Quote List"
          >
            <div className="relative">
              {/* Red wireframe cart icon */}
              <ShoppingCart className="w-6 h-6 text-[#B92025] group-hover:scale-105 transition-transform" />
              {/* Badge with count */}
              <span className="absolute -top-1.5 -right-2 bg-[#B92025] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </div>
            <span className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-[#B92025]">
              Cart
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

