'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, ShoppingCart, ChevronDown, Menu } from 'lucide-react'
import { getStoredCategories } from '@/src/lib/dataStore'
import { CategoryItem } from '@/src/types/category'

interface HeaderNavProps {
  onOpenSearch?: () => void
  onOpenCart?: () => void
  cartCount?: number
}

export default function HeaderNav({ onOpenSearch, onOpenCart, cartCount = 0 }: HeaderNavProps) {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState<CategoryItem[]>([])

  useEffect(() => {
    const loadCats = () => {
      const stored = getStoredCategories()
      const main = stored.filter((c) => (!c.parent_id || c.level === 0) && c.is_published !== false)
      setCategories(main.length > 0 ? main : stored)
    }
    loadCats()

    window.addEventListener('alpha_content_updated', loadCats)
    window.addEventListener('storage', loadCats)
    return () => {
      window.removeEventListener('alpha_content_updated', loadCats)
      window.removeEventListener('storage', loadCats)
    }
  }, [])

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const q = searchQuery.trim()
    if (q) {
      const catParam =
        selectedCategory && selectedCategory !== 'All Categories'
          ? `&cat=${encodeURIComponent(selectedCategory)}`
          : ''
      router.push(`/products?query=${encodeURIComponent(q)}${catParam}`)
    } else if (onOpenSearch) {
      onOpenSearch()
    } else {
      router.push('/products')
    }
  }

  const handleOpenMobileMenu = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('alpha_open_mobile_menu'))
    }
  }

  return (
    <div className="bg-white border-b border-slate-200 py-2.5 sm:py-3 md:py-4 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto">
        
        {/* =========================================================
            MOBILE LAYOUT (< md SCREENS)
        ========================================================= */}
        <div className="flex md:hidden flex-col gap-2.5">
          {/* Top Row: [Menu Button] [Centered Logo] [Cart Button] */}
          <div className="flex items-center justify-between gap-3">
            {/* Hamburger Button */}
            <button
              type="button"
              onClick={handleOpenMobileMenu}
              className="p-2 -ml-1 text-slate-800 hover:text-[#B92025] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center justify-center">
              <Image
                src="/logo5.svg"
                alt="ALPHA Wholesale Medical Supplies LLC"
                width={190}
                height={48}
                priority
                className="h-9 sm:h-11 w-auto object-contain"
              />
            </Link>

            {/* Cart Button */}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative p-2 -mr-1 text-slate-800 hover:text-[#B92025] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-6 h-6 text-[#B92025]" />
              {cartCount > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 bg-[#B92025] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Bottom Row: Search Bar */}
          <div className="w-full">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white shadow-sm focus-within:border-[#B92025] transition-colors"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools, medical supplies..."
                className="flex-1 px-3 py-2 text-xs font-normal text-slate-800 outline-none placeholder:text-slate-400 bg-transparent min-w-0"
              />

              <div className="relative border-l border-slate-200 bg-transparent hidden sm:block">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-transparent pl-2.5 pr-6 py-2 text-xs font-normal text-slate-600 outline-none cursor-pointer"
                >
                  <option value="All Categories">All</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-[#B92025] absolute right-2 top-3 pointer-events-none" />
              </div>

              <button
                type="submit"
                className="bg-[#B92025] hover:bg-[#96161B] text-white px-3.5 py-2.5 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* =========================================================
            DESKTOP LAYOUT (>= md SCREENS)
        ========================================================= */}
        <div className="hidden md:flex items-center justify-between gap-6">
          {/* LEFT: SEARCH BAR WITH CATEGORY SELECTOR */}
          <div className="w-auto flex-1 max-w-md">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white shadow-sm focus-within:border-[#B92025] transition-colors"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-[#B92025] absolute right-2 top-3 pointer-events-none" />
              </div>

              <button
                type="submit"
                className="bg-[#B92025] hover:bg-[#96161B] text-white px-3.5 py-2.5 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* CENTER: ALPHA WHOLESALE MEDICAL SUPPLIES LLC LOGO */}
          <div className="flex justify-center shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo5.svg"
                alt="ALPHA Wholesale Medical Supplies LLC"
                width={260}
                height={65}
                priority
                className="h-12 md:h-14 lg:h-16 w-auto object-contain"
              />
            </Link>
          </div>

          {/* RIGHT: CART (ADMIN BUTTON REMOVED AS REQUESTED) */}
          <div className="flex items-center justify-end gap-5 flex-1 max-w-md">
            <button
              type="button"
              onClick={onOpenCart}
              className="flex items-center gap-2 text-slate-800 hover:text-[#B92025] transition-colors group cursor-pointer"
              title="View Cart / Quote List"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-[#B92025] group-hover:scale-105 transition-transform" />
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
    </div>
  )
}
