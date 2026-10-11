'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Phone,
  Mail,
  Search,
  FileText,
  ShieldCheck,
  ShoppingBag,
  User,
  ChevronDown,
  Menu,
  X,
  Sparkles,
} from 'lucide-react'
import AlphaLogo from './AlphaLogo'
import { getStoredCategories } from '@/src/lib/dataStore'
import { CategoryItem } from '@/src/types/category'

interface PublicHeaderProps {
  onOpenSearch?: () => void
  onOpenQuote?: () => void
  quoteCount?: number
}

export default function PublicHeader({ onOpenSearch, onOpenQuote, quoteCount = 0 }: PublicHeaderProps) {
  const pathname = usePathname()
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)

  useEffect(() => {
    setCategories(getStoredCategories().filter(c => c.is_published))
  }, [])

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'Catalogues', href: '/catalogues' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
      {/* TOP ANNOUNCEMENT & CONTACT BAR (BLACK / CHARCOAL) */}
      <div className="bg-slate-950 text-white text-xs py-2 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-6">
            <a href="tel:+923001234567" className="flex items-center gap-1.5 hover:text-red-400 transition-colors">
              <Phone className="w-3.5 h-3.5 text-[#B92025]" />
              <span className="font-semibold text-slate-200">+92 300 1234567</span>
            </a>
            <a href="mailto:info@alphamedical.com" className="hidden sm:flex items-center gap-1.5 hover:text-red-400 transition-colors">
              <Mail className="w-3.5 h-3.5 text-[#B92025]" />
              <span className="text-slate-300">info@alphamedical.com</span>
            </a>
            <div className="hidden md:flex items-center gap-1.5 text-slate-400 border-l border-slate-800 pl-4">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>ISO 13485 & CE Certified Medical Supplies</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <span className="hidden lg:inline text-slate-400">Nationwide Express Delivery</span>
            <Link
              href="/admin/login"
              className="flex items-center gap-1.5 bg-[#B92025] hover:bg-[#96161B] text-white font-semibold px-2.5 py-1 rounded transition-colors text-[11px]"
            >
              <User className="w-3 h-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* MAIN LOGO & SEARCH BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* LOGO */}
        <AlphaLogo />

        {/* SEARCH BAR (DESKTOP) */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-full px-4 py-2 text-sm text-slate-500 transition-all group shadow-inner"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-[#B92025] group-hover:scale-110 transition-transform" />
              <span className="text-xs">Search surgical tools, medical equipment...</span>
            </div>
            <kbd className="hidden lg:inline-block bg-white text-slate-400 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-200">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* HEADER ACTIONS */}
        <div className="flex items-center gap-3">
          {/* SEARCH FOR MOBILE */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 text-slate-700 hover:text-[#B92025] rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* REQUEST QUOTE / CART BUTTON */}
          <button
            onClick={onOpenQuote}
            className="relative flex items-center gap-2 bg-[#B92025] hover:bg-[#96161B] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md group"
          >
            <ShoppingBag className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Quotation Basket</span>
            {quoteCount > 0 && (
              <span className="w-5 h-5 bg-black text-white text-[11px] font-bold rounded-full flex items-center justify-center border border-white">
                {quoteCount}
              </span>
            )}
          </button>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-800 hover:text-[#B92025] rounded-lg hover:bg-slate-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MAROON RED MAIN NAVIGATION BAR (MATCHING SCREENSHOT) */}
      <nav className="hidden lg:block bg-[#B92025] text-white px-4 sm:px-8 border-t border-[#96161B]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {/* CATEGORIES MEGA DROPDOWN */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsCategoryDropdownOpen(true)}
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="flex items-center gap-2 bg-black/20 hover:bg-black/30 text-white px-4 py-3 font-bold text-xs tracking-wider uppercase transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>All Categories</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isCategoryDropdownOpen && (
                <div
                  onMouseLeave={() => setIsCategoryDropdownOpen(false)}
                  className="absolute top-full left-0 w-72 bg-white text-slate-900 rounded-b-xl shadow-2xl border border-slate-200 py-2 z-50 animate-fade-in"
                >
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      className="block px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-red-50 hover:text-[#B92025] transition-colors border-b border-slate-100 last:border-0"
                    >
                      <div className="font-bold">{cat.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal truncate">{cat.description}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* NAV LINKS */}
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'bg-black/30 text-white border-b-2 border-white'
                      : 'text-white hover:bg-black/20'
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-white py-2">
            <FileText className="w-3.5 h-3.5 text-yellow-300" />
            <Link href="/catalogues" className="hover:underline">
              2026 Product Catalogues (PDF)
            </Link>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 text-white py-4 px-6 space-y-3 animate-fade-in border-t border-slate-800">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-slate-200 hover:text-red-400"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
