'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import TopBar from '@/src/components/public/TopBar'
import HeaderNav from '@/src/components/public/HeaderNav'
import MainRedNavbar from '@/src/components/public/MainRedNavbar'
import PublicFooter from '@/src/components/public/PublicFooter'
import PublicSearchModal from '@/src/components/public/PublicSearchModal'
import CartQuoteModal from '@/src/components/public/CartQuoteModal'
import { ProductItem } from '@/src/types/product'
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Mail,
  MessageSquare,
  Factory,
  ChevronRight,
  ExternalLink,
  Phone,
  Layers,
  Sparkles,
} from 'lucide-react'

export default function ProductionPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isQuoteOpen, setIsQuoteOpen] = useState(false)
  const [quoteItems, setQuoteItems] = useState<ProductItem[]>([])

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-800 antialiased selection:bg-[#B92025] selection:text-white">
      {/* 1. TOP HEADER & NAVIGATION */}
      <TopBar />
      <HeaderNav
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsQuoteOpen(true)}
        cartCount={quoteItems.length}
      />
      <MainRedNavbar />

      {/* 2. BREADCRUMB */}
      <div className="bg-[#6B6E70]/10 border-b border-slate-200 py-3 px-4 sm:px-8">
        <div className="max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto flex items-center gap-2 text-xs font-semibold text-slate-600">
          <Link href="/" className="hover:text-[#B92025] transition-colors">
            Home
          </Link>
          <span className="text-slate-400">/</span>
          <Link href="/about" className="hover:text-[#B92025] transition-colors">
            About Us
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-[#B92025] font-bold">Our Production Process</span>
        </div>
      </div>

      {/* =========================================================
          3. HERO BANNER (MATCHING SLICE 1 OF SVG)
      ========================================================= */}
      <section className="bg-[#B92025] text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-8 overflow-hidden relative">
        <div className="max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-white text-[#B92025] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
              <span className="w-2 h-2 rounded-full bg-[#B92025] animate-pulse"></span>
              <span>ALPHA WHOLESALE MEDICAL SUPPLIES • OUR PRODUCTION</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl 2xl:text-6xl font-black text-white leading-tight tracking-tight">
              Precision Begins <br className="hidden sm:inline" />
              Long Before Delivery.
            </h1>

            <p className="text-white/90 text-sm sm:text-base 2xl:text-lg leading-relaxed max-w-xl font-medium">
              At Alpha Wholesale Medical Supplies, Every Surgical Instrument Follows A Disciplined
              Production Journey—From Carefully Selected Materials To Final Inspection, Packaging And
              Export.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#process-steps"
                className="inline-flex items-center gap-2 bg-white text-[#B92025] hover:bg-slate-100 font-extrabold text-xs sm:text-sm px-6 py-3 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Explore 6-Step Process</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/catalogues"
                className="inline-flex items-center gap-2 bg-black/20 hover:bg-black/30 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full border border-white/30 backdrop-blur-sm transition-colors"
              >
                <span>Download Master PDF</span>
              </Link>
            </div>
          </div>

          {/* Right Image Column with Custom Facade & Overlaid Red Badge */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[620px] 2xl:max-w-[760px] 3xl:max-w-[900px]">
              {/* Building Facade Graphic */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-3xl lg:rounded-[36px] overflow-hidden border-2 border-white/30 shadow-2xl bg-white/10">
                <Image
                  src="/images/production/extracted_image0_4151_1524.png"
                  alt="Alpha Medical Manufacturing Facility"
                  fill
                  priority
                  className="object-cover object-center"
                />
              </div>

              {/* Overlaid Red Badge (Matching Screenshot) */}
              <div className="absolute -bottom-6 -left-3 sm:-bottom-8 sm:-left-6 bg-[#96161B] text-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-red-400/40 max-w-[280px] sm:max-w-[340px] 2xl:max-w-[380px] space-y-2 z-10 animate-fade-in">
                <h3 className="font-black text-xs sm:text-sm 2xl:text-base uppercase tracking-wider leading-snug text-white">
                  CRAFTED FOR SURGICAL PROFESSIONALS WORLDWIDE.
                </h3>
                <p className="text-[11px] sm:text-xs text-red-100 leading-relaxed">
                  High-Grade Materials, Skilled Technicians And Detailed Quality Checks Guide Every
                  Stage Of Production.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          4. VALUE PROPOSITION & STANDARDS (SLICES 1 BOTTOM & 2 TOP)
      ========================================================= */}
      <section className="bg-white py-14 sm:py-20 px-4 sm:px-8 border-b border-slate-100">
        <div className="max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto space-y-12 sm:space-y-16">
          {/* Header Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] sm:text-xs font-black text-[#B92025] tracking-widest uppercase">
                  HIGH-QUALITY SOLUTIONS
                </span>
                <span className="h-0.5 w-12 bg-[#B92025]"></span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black text-slate-900 leading-tight">
                Built For Accuracy, Reliability And Long-Term Performance.
              </h2>
            </div>

            <div className="lg:col-span-6 lg:border-l-2 lg:border-slate-200 lg:pl-8">
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                Our Production Halls Bring Together Experienced Professionals, Carefully Selected
                Manufacturing Materials And Controlled Processes To Create Surgical Instruments For
                Demanding Clinical Environments. Every Order Is Handled With Attention To
                Craftsmanship, Functional Performance And Secure Delivery Preparation.
              </p>
            </div>
          </div>

          {/* 4 Feature Badges in a Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pt-4">
            {/* Feature 1 */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-red-200 transition-colors">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-red-100 relative">
                <Image
                  src="/images/production/preimum 1.svg"
                  alt="Quality-Focused Production"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                  Quality-Focused Production
                </h4>
                <p className="text-xs text-[#B92025] font-semibold mt-0.5">Consistent Standards</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-red-200 transition-colors">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-red-100 relative">
                <Image
                  src="/images/production/Worker-icon 2.svg"
                  alt="Skilled Manufacturing Teams"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                  Skilled Manufacturing Teams
                </h4>
                <p className="text-xs text-[#B92025] font-semibold mt-0.5">Experienced Professionals</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-red-200 transition-colors">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-red-100 relative">
                <Image
                  src="/images/production/Finishing-Polishing-icon 1.svg"
                  alt="Precision Finishing"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                  Precision Finishing
                </h4>
                <p className="text-xs text-[#B92025] font-semibold mt-0.5">Superior Detail</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-red-200 transition-colors">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-red-100 relative">
                <Image
                  src="/images/production/global-icon 2.svg"
                  alt="Worldwide Export Support"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                  Worldwide Export Support
                </h4>
                <p className="text-xs text-[#B92025] font-semibold mt-0.5">Global Reach</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          5. 6-STEP PRODUCTION PROCESS (MATCHING SLICE 2 OF SVG)
      ========================================================= */}
      <section id="process-steps" className="bg-[#FAF8F5] py-16 sm:py-24 px-4 sm:px-8 border-b border-slate-200/80">
        <div className="max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto space-y-12 sm:space-y-16">
          {/* Section Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-xs font-black text-[#B92025] tracking-widest uppercase">
                FROM MATERIAL TO INSTRUMENT
              </span>
              <span className="h-0.5 w-12 bg-[#B92025]"></span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black text-slate-900 tracking-tight">
              A Production Process Designed Around Precision.
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base max-w-2xl font-medium">
              Each Stage Is Planned To Help Us Deliver Dependable Surgical Instruments With Consistent
              Fit, Finish And Function.
            </p>
          </div>

          {/* 6 Cards Grid (3 Columns x 2 Rows) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* CARD 01: Requirement Review */}
            <div className="bg-[#F6F2EC] rounded-2xl p-6 sm:p-8 border border-amber-100 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs text-slate-900 tracking-wider">01</span>
                    <span className="w-8 h-0.5 bg-[#B92025]"></span>
                  </div>
                  <div className="w-12 h-12 relative flex items-center justify-center">
                    <Image
                      src="/images/production/Requirement 1.png"
                      alt="Requirement Review"
                      width={44}
                      height={44}
                      className="object-contain"
                    />
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-[#B92025] pt-2">
                  Requirement Review
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  We Review Product Specifications, Quantities And Requirements Before Production Begins.
                </p>
              </div>
            </div>

            {/* CARD 02: Material Selection */}
            <div className="bg-[#F6F2EC] rounded-2xl p-6 sm:p-8 border border-amber-100 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs text-slate-900 tracking-wider">02</span>
                    <span className="w-8 h-0.5 bg-[#B92025]"></span>
                  </div>
                  <div className="w-12 h-12 relative flex items-center justify-center">
                    <svg className="w-10 h-10 text-[#B92025]" viewBox="0 0 48 48" fill="none">
                      <path d="M24 6L6 16L24 26L42 16L24 6Z" fill="#B92025" />
                      <path d="M6 22L24 32L42 22" stroke="#B92025" strokeWidth="3" strokeLinecap="round" />
                      <path d="M6 28L24 38L42 28" stroke="#B92025" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-[#B92025] pt-2">
                  Material Selection
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  High-Grade Stainless Steel And Titanium Are Selected For The Appropriate Instrument
                  Application.
                </p>
              </div>
            </div>

            {/* CARD 03: Forging & Shaping */}
            <div className="bg-[#F6F2EC] rounded-2xl p-6 sm:p-8 border border-amber-100 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs text-slate-900 tracking-wider">03</span>
                    <span className="w-8 h-0.5 bg-[#B92025]"></span>
                  </div>
                  <div className="w-12 h-12 relative flex items-center justify-center">
                    <Image
                      src="/images/production/Forging & Machining-icon 1.svg"
                      alt="Forging & Shaping"
                      width={44}
                      height={44}
                      className="object-contain"
                    />
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-[#B92025] pt-2">
                  Forging & Shaping
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  Components Are Formed And Shaped To Create A Strong Foundation For Each Instrument.
                </p>
              </div>
            </div>

            {/* CARD 04: CNC & Hand Finishing */}
            <div className="bg-[#F6F2EC] rounded-2xl p-6 sm:p-8 border border-amber-100 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs text-slate-900 tracking-wider">04</span>
                    <span className="w-8 h-0.5 bg-[#B92025]"></span>
                  </div>
                  <div className="w-12 h-12 relative flex items-center justify-center">
                    <Image
                      src="/images/production/Modern Manufacturing-icon 2.svg"
                      alt="CNC & Hand Finishing"
                      width={44}
                      height={44}
                      className="object-contain"
                    />
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-[#B92025] pt-2">
                  CNC & Hand Finishing
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  Guided Machining Is Paired With Detailed Grinding, Buffing And Polishing Work.
                </p>
              </div>
            </div>

            {/* CARD 05: Assembly & Calibration */}
            <div className="bg-[#F6F2EC] rounded-2xl p-6 sm:p-8 border border-amber-100 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs text-slate-900 tracking-wider">05</span>
                    <span className="w-8 h-0.5 bg-[#B92025]"></span>
                  </div>
                  <div className="w-12 h-12 relative flex items-center justify-center">
                    <svg className="w-10 h-10 text-[#B92025]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 11V24M24 7V24M30 11V24M36 17V26C36 33.732 29.732 40 22 40H20C14.477 40 10 35.523 10 30V22C10 20.343 11.343 19 13 19C14.657 19 16 20.343 16 22V24" />
                    </svg>
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-[#B92025] pt-2">
                  Assembly & Calibration
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  Hinges, Joints And Ratchets Are Set And Adjusted For Smooth, Dependable Operation.
                </p>
              </div>
            </div>

            {/* CARD 06: Inspection & Export */}
            <div className="bg-[#F6F2EC] rounded-2xl p-6 sm:p-8 border border-amber-100 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs text-slate-900 tracking-wider">06</span>
                    <span className="w-8 h-0.5 bg-[#B92025]"></span>
                  </div>
                  <div className="w-12 h-12 relative flex items-center justify-center">
                    <Image
                      src="/images/production/Packing & Sterilization-icon 1.svg"
                      alt="Inspection & Export"
                      width={44}
                      height={44}
                      className="object-contain"
                    />
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-[#B92025] pt-2">
                  Inspection & Export
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  Instruments Are Checked, Prepared For Packaging And Readied For Shipment Worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          6. FACTORY GALLERY (MATCHING SLICE 3 OF SVG)
      ========================================================= */}
      <section className="bg-white py-16 sm:py-24 px-4 sm:px-8 border-b border-slate-100">
        <div className="max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto space-y-12 sm:space-y-16">
          {/* Header Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] sm:text-xs font-black text-[#B92025] tracking-widest uppercase">
                  Our Production Process
                </span>
                <span className="h-0.5 w-12 bg-[#B92025]"></span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black text-slate-900 leading-tight">
                From Raw Materials To Precision-Crafted Instruments
              </h2>
            </div>

            <div className="lg:col-span-6 lg:border-l-2 lg:border-slate-200 lg:pl-8">
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                Every Step Is Carefully Managed By Our Skilled Team, Using Advanced Technology And
                Strict Quality Control To Deliver Reliable Surgical Instruments Worldwide.
              </p>
            </div>
          </div>

          {/* Photo Cards Grid */}
          <div className="space-y-6 sm:space-y-8">
            {/* ROW 1: 2 Large Cards (50% each) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Card 01: CNC Machining */}
              <div className="group rounded-2xl overflow-hidden border border-slate-200 bg-[#FAF8F5] shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                  <Image
                    src="/images/production/factory_cnc_machining.png"
                    alt="CNC Machining Facility"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 sm:p-7 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-extrabold text-sm text-[#B92025]">01</span>
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                      CNC Machining
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Precision machining of high-grade materials for consistent quality and accuracy.
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 group-hover:bg-[#B92025] group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Card 02: Forging */}
              <div className="group rounded-2xl overflow-hidden border border-slate-200 bg-[#FAF8F5] shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                  <Image
                    src="/images/production/factory_forging.png"
                    alt="Forging Techniques"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 sm:p-7 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-extrabold text-sm text-[#B92025]">02</span>
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                      Forging
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Shaping raw materials with advanced forging techniques for superior strength and
                      durability.
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 group-hover:bg-[#B92025] group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 2: 4 Smaller Cards (25% each on desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 03: Turning & Grinding */}
              <div className="group rounded-2xl overflow-hidden border border-slate-200 bg-[#FAF8F5] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    <Image
                      src="/images/production/factory_turning_grinding.png"
                      alt="Turning & Grinding"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 space-y-1">
                    <span className="font-extrabold text-xs text-[#B92025]">03</span>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                      Turning & Grinding
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Detailed grinding and finishing for smooth and precise surfaces.
                    </p>
                  </div>
                </div>
                <div className="p-5 pt-0 flex justify-end">
                  <span className="text-slate-400 group-hover:text-[#B92025] transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Card 04: QC Inspection */}
              <div className="group rounded-2xl overflow-hidden border border-slate-200 bg-[#FAF8F5] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    <Image
                      src="/images/production/factory_qc_inspection.png"
                      alt="QC Inspection"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 space-y-1">
                    <span className="font-extrabold text-xs text-[#B92025]">04</span>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                      QC Inspection
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Every instrument is carefully checked for accuracy, function and quality.
                    </p>
                  </div>
                </div>
                <div className="p-5 pt-0 flex justify-end">
                  <span className="text-slate-400 group-hover:text-[#B92025] transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Card 05: Laser Marking */}
              <div className="group rounded-2xl overflow-hidden border border-slate-200 bg-[#FAF8F5] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    <Image
                      src="/images/production/factory_laser_marking.png"
                      alt="Laser Marking"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 space-y-1">
                    <span className="font-extrabold text-xs text-[#B92025]">05</span>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                      Laser Marking
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Permanent and precise branding for traceability and authenticity.
                    </p>
                  </div>
                </div>
                <div className="p-5 pt-0 flex justify-end">
                  <span className="text-slate-400 group-hover:text-[#B92025] transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Card 06: Packaging */}
              <div className="group rounded-2xl overflow-hidden border border-slate-200 bg-[#FAF8F5] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    <Image
                      src="/images/production/factory_packaging.png"
                      alt="Packaging"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 space-y-1">
                    <span className="font-extrabold text-xs text-[#B92025]">06</span>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                      Packaging
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Secure and professional packaging for safe global delivery.
                    </p>
                  </div>
                </div>
                <div className="p-5 pt-0 flex justify-end">
                  <span className="text-slate-400 group-hover:text-[#B92025] transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          7. THE ALPHA MEDICAL STANDARD (MATCHING SLICE 4 OF SVG)
      ========================================================= */}
      <section className="bg-[#96161B] text-white py-16 sm:py-24 px-4 sm:px-8 relative overflow-hidden">
        <div className="max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto space-y-12">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-xs font-black text-white/90 tracking-widest uppercase">
                THE ALPHA MEDICAL STANDARD
              </span>
              <span className="h-0.5 w-12 bg-white/60"></span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black text-white leading-tight">
              Care At Every Stage Of The Manufacturing Journey.
            </h2>
          </div>

          {/* 4 Cards in a Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="border border-white/25 rounded-2xl p-6 sm:p-7 bg-white/5 backdrop-blur-sm space-y-4 hover:border-white/50 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white tracking-wider">01</span>
                <span className="w-8 h-0.5 bg-white/60"></span>
              </div>
              <h3 className="font-black text-sm sm:text-base tracking-wide uppercase text-white">
                FUNCTIONAL ACCURACY
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Fine Finishing Is Focused On Clean Surfaces, Balanced Handling And Practical
                Instrument Performance.
              </p>
            </div>

            {/* Card 2 */}
            <div className="border border-white/25 rounded-2xl p-6 sm:p-7 bg-white/5 backdrop-blur-sm space-y-4 hover:border-white/50 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white tracking-wider">02</span>
                <span className="w-8 h-0.5 bg-white/60"></span>
              </div>
              <h3 className="font-black text-sm sm:text-base tracking-wide uppercase text-white">
                MECHANICAL ALIGNMENT
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Moving Components Are Set And Checked To Support Smooth Opening, Closing And Controlled
                Tension.
              </p>
            </div>

            {/* Card 3 */}
            <div className="border border-white/25 rounded-2xl p-6 sm:p-7 bg-white/5 backdrop-blur-sm space-y-4 hover:border-white/50 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white tracking-wider">03</span>
                <span className="w-8 h-0.5 bg-white/60"></span>
              </div>
              <h3 className="font-black text-sm sm:text-base tracking-wide uppercase text-white">
                FINAL QUALITY CHECKS
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Each Instrument Is Reviewed Before Packing To Support A Consistent Finished Result.
              </p>
            </div>

            {/* Card 4 */}
            <div className="border border-white/25 rounded-2xl p-6 sm:p-7 bg-white/5 backdrop-blur-sm space-y-4 hover:border-white/50 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white tracking-wider">04</span>
                <span className="w-8 h-0.5 bg-white/60"></span>
              </div>
              <h3 className="font-black text-sm sm:text-base tracking-wide uppercase text-white">
                EXPORT-READY PACKING
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Orders Are Prepared For International Delivery With Attention To Documentation And
                Packaging Needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          8. CTA BOX (MATCHING SLICE 4 BOTTOM OF SVG)
      ========================================================= */}
      <section className="bg-white py-14 sm:py-20 px-4 sm:px-8">
        <div className="max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto">
          <div className="bg-[#F8FAFC] border border-slate-200 border-l-8 border-l-[#B92025] rounded-3xl p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <span className="text-[11px] sm:text-xs font-black tracking-widest uppercase text-slate-500">
                LET'S START A CONVERSATION
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
                Need Help Finding The <span className="text-[#B92025]">Right Instruments?</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Tell Us Your Product Requirements, Quantity And Destination. Our Team Will Guide You To
                The Right Next Step.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 shrink-0 w-full sm:w-auto">
              <Link
                href="/contact"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#B92025] hover:bg-[#96161B] text-white px-8 py-3.5 rounded-full font-bold text-xs sm:text-sm shadow-md transition-all transform hover:-translate-y-0.5"
              >
                <Mail className="w-4 h-4" />
                <span>Email Sale</span>
              </Link>
              <a
                href="https://wa.me/9252000000"
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#B92025] border-2 border-[#B92025] px-8 py-3.5 rounded-full font-bold text-xs sm:text-sm shadow-sm transition-all transform hover:-translate-y-0.5"
              >
                <MessageSquare className="w-4 h-4 text-[#B92025]" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 9. GLOBAL FOOTER */}
      <PublicFooter />

      {/* 10. MODALS */}
      <PublicSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartQuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        quoteItems={quoteItems}
        onRemoveItem={(id) => setQuoteItems((prev) => prev.filter((item) => item.id !== id))}
        onClearAll={() => setQuoteItems([])}
      />
    </div>
  )
}
