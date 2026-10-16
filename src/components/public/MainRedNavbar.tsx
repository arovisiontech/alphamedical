'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Search,
  FileText,
  Phone,
  Mail,
  ShieldCheck,
  Flame,
  ArrowRight,
  Sparkles,
  Building,
  Home,
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  hasDropdown?: boolean
  isBadge?: boolean
  columns?: {
    title: string
    items: string[]
  }[]
}

export default function MainRedNavbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  const [mobileSearchQuery, setMobileSearchQuery] = useState('')

  // Listen to external triggers from HeaderNav
  useEffect(() => {
    const handleOpenMenu = () => setIsMobileDrawerOpen(true)
    window.addEventListener('alpha_open_mobile_menu', handleOpenMenu)
    return () => window.removeEventListener('alpha_open_mobile_menu', handleOpenMenu)
  }, [])

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileDrawerOpen])

  const toggleAccordion = (name: string) => {
    setOpenAccordion(openAccordion === name ? null : name)
  }

  const navItems: NavItem[] = [
    { name: 'Home', href: '/' },
    {
      name: 'Surgical Instruments',
      href: '/products?cat=surgical-instruments',
      hasDropdown: true,
      columns: [
        {
          title: 'Dental & Oral Surgery',
          items: ['Bone Rongeurs', 'Dissecting Scissors', 'Extraction Forceps', 'Surgical Needle Holders', 'Cheek Retractors'],
        },
        {
          title: 'Bone Surgery',
          items: ['Bone Forceps', 'Elevators', 'Surgical Scissors', 'Surgical Needle Holders', 'Cheek Retractors'],
        },
        {
          title: 'Periodontics',
          items: ['Bone Rongeurs', 'Elevators', 'Surgical Scissors', 'Surgical Needle Holders', 'Cheek Retractors'],
        },
      ],
    },
    {
      name: 'Medical Supplies',
      href: '/products?cat=medical-supplies',
      hasDropdown: true,
      columns: [
        {
          title: 'Disposables',
          items: ['Sterile Gloves', 'IV Cannulas', 'Syringes & Needles', 'Gauze Swabs'],
        },
        {
          title: 'Diagnostics',
          items: ['Stethoscopes', 'Sphygmomanometers', 'Pulse Oximeters', 'Thermometers'],
        },
      ],
    },
    {
      name: 'PPE',
      href: '/products?cat=ppe',
      hasDropdown: true,
      columns: [
        {
          title: 'Protective Gear',
          items: ['N95 & Surgical Masks', 'Sterile Isolation Gowns', 'Protective Face Shields', 'Latex & Nitrile Gloves'],
        },
      ],
    },
    {
      name: 'Equipment',
      href: '/products?cat=medical-equipment',
      hasDropdown: true,
      columns: [
        {
          title: 'Critical Care & OR',
          items: ['ICU Turbine Ventilators', 'Multiparameter Monitors', 'Emergency Defibrillators', 'Electric ICU Beds'],
        },
      ],
    },
    {
      name: 'Brands',
      href: '/brands',
      hasDropdown: true,
      columns: [
        {
          title: 'Certified Manufacturers',
          items: ['ALPHA Surgical Systems', 'German Steel Craft', 'MedEquip Pro', 'SurgiPrecision USA'],
        },
      ],
    },
    { name: 'Sale', href: '/products?sale=true' },
    {
      name: 'Resources',
      href: '/production',
      hasDropdown: true,
      columns: [
        {
          title: 'Manufacturing & About',
          items: ['Our Production Process', 'Facility & Quality Standards', 'About Us Overview'],
        },
        {
          title: 'Catalogues & Guides',
          items: ['2026 Master PDF Catalogues', 'Surgical Instrument Specs', 'Hospital Equipment Guides'],
        },
        {
          title: 'Support & Inquiries',
          items: ['Help & FAQs', 'B2B Wholesale Inquiries', 'Global Export Support'],
        },
      ],
    },
    { name: 'Contact Us', href: '/contact' },
  ]

  const getDropdownItemHref = (parentName: string, itemTitle: string) => {
    if (parentName === 'Resources') {
      if (itemTitle.includes('Production')) return '/production'
      if (itemTitle.includes('Facility') || itemTitle.includes('About')) return '/about'
      if (itemTitle.includes('Catalogue') || itemTitle.includes('Specs') || itemTitle.includes('Guides')) return '/catalogues'
      if (itemTitle.includes('FAQ') || itemTitle.includes('Help')) return '/faq'
      if (itemTitle.includes('B2B') || itemTitle.includes('Inquir')) return '/contact'
      if (itemTitle.includes('Export')) return '/about#export'
      return '/production'
    }
    return `/products?query=${encodeURIComponent(itemTitle)}`
  }

  return (
    <>
      {/* =========================================================
          DESKTOP NAVBAR (MATCHING SCREENSHOT 1)
      ========================================================= */}
      <nav className="hidden lg:block bg-[#96161B] text-white sticky top-0 z-40 shadow-sm border-t border-red-800/40 font-sans">
        <div className="max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto px-4 sm:px-8 flex items-center justify-center relative">
          <div className="flex items-center justify-center gap-6 lg:gap-8 xl:gap-10 2xl:gap-14 text-[13px] sm:text-sm 2xl:text-[15px] font-semibold">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1.5 py-3.5 text-white hover:text-white/80 transition-colors whitespace-nowrap cursor-pointer"
                >
                  {item.name === 'Home' && <Home className="w-3.5 h-3.5 text-white/90 shrink-0" />}
                  <span>{item.name}</span>
                  {item.hasDropdown && <ChevronDown className="w-3.5 h-3.5 text-white/90 shrink-0" />}
                </Link>

                {/* MEGA MENU DROPDOWN */}
                {item.hasDropdown && activeDropdown === item.name && (
                  <div
                    className={`absolute top-full w-[650px] 2xl:w-[720px] bg-white text-slate-900 shadow-2xl border border-slate-200 rounded-2xl p-6 z-50 animate-fade-in grid grid-cols-3 gap-6 ${
                      item.name === 'Surgical Instruments'
                        ? 'left-0'
                        : item.name === 'Brands' || item.name === 'Equipment' || item.name === 'Resources'
                        ? 'right-0'
                        : 'left-1/2 -translate-x-1/2'
                    }`}
                  >
                    {item.columns?.map((col, idx) => (
                      <div key={idx} className="space-y-3">
                        <h4 className="font-extrabold text-xs text-[#96161B] uppercase tracking-wider border-b border-red-100 pb-1.5">
                          {col.title}
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
                          {col.items.map((sub, sIdx) => (
                            <li key={sIdx}>
                              <Link
                                href={getDropdownItemHref(item.name, sub)}
                                className="hover:text-[#96161B] hover:underline block py-0.5"
                              >
                                • {sub}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* =========================================================
          MOBILE & TABLET STICKY BAR (< lg SCREENS)
      ========================================================= */}
      <nav className="lg:hidden bg-[#96161B] text-white sticky top-0 z-40 shadow-md border-t border-red-800/40">
        <div className="px-3 py-2 flex items-center justify-between gap-2">
          {/* HAMBURGER TRIGGER BUTTON */}
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="flex items-center gap-2 bg-black/25 hover:bg-black/35 text-white px-3 py-2 rounded-xl text-xs font-black tracking-wide uppercase shrink-0 transition-colors cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-4 h-4 text-white" />
            <span>Categories</span>
          </button>

          {/* HORIZONTALLY SCROLLABLE QUICK CATEGORY CHIPS */}
          <div
            className="flex-1 flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <Link
              href="/"
              className="whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-[11px] font-bold text-white shrink-0 transition-colors flex items-center gap-1"
            >
              <Home className="w-3 h-3 text-white" />
              <span>Home</span>
            </Link>
            <Link
              href="/products?cat=surgical-instruments"
              className="whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-bold text-white shrink-0 transition-colors"
            >
              Surgical
            </Link>
            <Link
              href="/products?cat=medical-supplies"
              className="whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-bold text-white shrink-0 transition-colors"
            >
              Supplies
            </Link>
            <Link
              href="/products?cat=ppe"
              className="whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-bold text-white shrink-0 transition-colors"
            >
              PPE
            </Link>
            <Link
              href="/products?cat=medical-equipment"
              className="whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-bold text-white shrink-0 transition-colors"
            >
              Equipment
            </Link>
            <Link
              href="/products?sale=true"
              className="whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-yellow-400 text-slate-950 text-[11px] font-black shrink-0 shadow-sm flex items-center gap-1"
            >
              <Flame className="w-3 h-3 text-red-700" />
              <span>Sale</span>
            </Link>
            <Link
              href="/catalogues"
              className="whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-bold text-white shrink-0 transition-colors"
            >
              Catalogues
            </Link>
          </div>
        </div>
      </nav>

      {/* =========================================================
          SLIDE-OUT MOBILE NAVIGATION DRAWER
      ========================================================= */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-fade-in">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Drawer Panel (Left to Right) */}
          <div className="relative w-full max-w-[340px] sm:max-w-[380px] bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden">
            {/* Drawer Header */}
            <div className="bg-[#B92025] text-white p-4 flex items-center justify-between border-b border-[#96161B]">
              <div className="flex items-center gap-2">
                <div className="relative w-7 h-7 shrink-0">
                  <Image src="/logo5.svg" alt="Alpha Medical" fill className="object-contain brightness-0 invert" />
                </div>
                <div>
                  <span className="font-black text-sm block leading-none tracking-tight">ALPHA MEDICAL</span>
                  <span className="text-[9px] text-red-200 uppercase tracking-widest block font-bold">Wholesale Supplies</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Search Inside Drawer */}
            <div className="p-3.5 bg-slate-50 border-b border-slate-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (mobileSearchQuery.trim()) {
                    window.location.href = `/products?query=${encodeURIComponent(mobileSearchQuery)}`
                  }
                }}
                className="flex items-center bg-white border border-slate-300 rounded-xl overflow-hidden shadow-inner focus-within:border-[#B92025]"
              >
                <input
                  type="text"
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  placeholder="Search instruments, tools..."
                  className="flex-1 px-3 py-2 text-xs text-slate-800 outline-none"
                />
                <button
                  type="submit"
                  className="p-2 bg-[#B92025] text-white hover:bg-[#96161B] transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Scrollable Navigation Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 py-1">
                CATEGORIES & DISCIPLINES
              </div>

              {navItems.map((item) => {
                if (item.hasDropdown) {
                  const isOpen = openAccordion === item.name
                  return (
                    <div key={item.name} className="border-b border-slate-100 last:border-0">
                      <button
                        type="button"
                        onClick={() => toggleAccordion(item.name)}
                        className="w-full flex items-center justify-between py-2.5 px-2 text-xs font-extrabold text-slate-800 hover:text-[#B92025] hover:bg-red-50/50 rounded-lg transition-colors text-left"
                      >
                        <span>{item.name}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-[#B92025]' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="pl-3 pr-2 py-2 space-y-3 bg-slate-50/70 rounded-xl mb-2 text-xs">
                          {item.columns?.map((col, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className="font-bold text-[11px] text-[#B92025] uppercase tracking-wide">
                                {col.title}
                              </div>
                              <ul className="space-y-1 pl-1 text-[11px] text-slate-600 font-medium">
                                {col.items.map((sub, sIdx) => (
                                  <li key={sIdx}>
                                    <Link
                                      href={getDropdownItemHref(item.name, sub)}
                                      onClick={() => setIsMobileDrawerOpen(false)}
                                      className="block py-1 hover:text-[#B92025] transition-colors"
                                    >
                                      • {sub}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                          <div className="pt-1">
                            <Link
                              href={item.href}
                              onClick={() => setIsMobileDrawerOpen(false)}
                              className="text-[11px] font-bold text-[#B92025] hover:underline inline-flex items-center gap-1"
                            >
                              <span>View All {item.name}</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className={`flex items-center justify-between py-2.5 px-2 text-xs font-extrabold rounded-lg transition-colors ${
                      item.isBadge
                        ? 'text-[#B92025] bg-red-50 hover:bg-red-100 font-black'
                        : 'text-slate-800 hover:text-[#B92025] hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {item.name === 'Home' && <Home className="w-4 h-4 text-[#B92025]" />}
                      {item.isBadge && <Flame className="w-4 h-4 text-[#B92025]" />}
                      <span>{item.name}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                )
              })}

              {/* Additional Company Links */}
              <div className="pt-4 border-t border-slate-200">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 py-1">
                  COMPANY & RESOURCES
                </div>
                <div className="space-y-1 text-xs font-bold text-slate-700">
                  <Link
                    href="/production"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-slate-50 hover:text-[#B92025]"
                  >
                    <Sparkles className="w-4 h-4 text-[#B92025]" />
                    <span>Our Production Process</span>
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-slate-50 hover:text-[#B92025]"
                  >
                    <Building className="w-4 h-4 text-[#B92025]" />
                    <span>About Us Overview</span>
                  </Link>
                  <Link
                    href="/catalogues"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-slate-50 hover:text-[#B92025]"
                  >
                    <FileText className="w-4 h-4 text-[#B92025]" />
                    <span>2026 Product Catalogues (PDF)</span>
                  </Link>
                  <Link
                    href="/faq"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-slate-50 hover:text-[#B92025]"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#B92025]" />
                    <span>Help & FAQs</span>
                  </Link>
                  <Link
                    href="/dealer-locator"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-slate-50 hover:text-[#B92025]"
                  >
                    <span>Dealer Locator</span>
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="flex items-center gap-2 px-2 py-2 rounded-lg bg-red-50/60 text-[#B92025] font-extrabold hover:bg-red-100"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#B92025]" />
                    <span>Admin Panel Portal</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Drawer Contact Footer */}
            <div className="p-4 bg-slate-900 text-white space-y-2 text-xs border-t border-slate-800">
              <a
                href="tel:+15615289764"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#B92025]" />
                <span>Call: +1 (561) 528 9764</span>
              </a>
              <a
                href="tel:+18644232826"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#B92025]" />
                <span>Call: +1 (864) 423 2826</span>
              </a>
              <a
                href="mailto:Sohail@alpha-medicalsupplies.com"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#B92025]" />
                <span>Sohail@alpha-medicalsupplies.com</span>
              </a>
              <a
                href="mailto:Aftab@alpha-medicalsupplies.com"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#B92025]" />
                <span>Aftab@alpha-medicalsupplies.com</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
