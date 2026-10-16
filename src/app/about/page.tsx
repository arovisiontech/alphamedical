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
  Award,
  Globe2,
  Headphones,
  Microscope,
  Scissors,
  Eye,
  Target,
  Sparkles,
  ArrowRight,
  Mail,
  MessageSquare,
  Building2,
  Factory,
  Compass,
  Check,
  Flame,
  Lightbulb,
  HeartHandshake,
  Users,
  Clock,
} from 'lucide-react'

export default function AboutPage() {
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
          <span className="text-[#B92025] font-bold">About Us</span>
        </div>
      </div>

      {/* =========================================================
          3. HERO SECTION (MATCHING SLICE 1 OF SVG)
      ========================================================= */}
      <section className="bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-8 border-b border-slate-100">
        <div className="max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#B92025] text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span>SINCE 1999</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black text-slate-900 leading-[1.15] tracking-tight">
              Precision. Instruments. <br />
              <span className="text-[#B92025]">Trusted Worldwide.</span>
            </h1>

            <div className="space-y-4 text-xs sm:text-sm 2xl:text-base text-slate-600 leading-relaxed font-medium">
              <p>
                <strong className="text-slate-900 font-extrabold">Alpha Wholesale Medical Supplies</strong> Is
                A Trusted Global Partner For Healthcare Brands Seeking Reliable, High-Quality Surgical
                Manufacturing Solutions. With Over 53 Years Of Heritage, We Operate From Our Modern Facility In
                Sialkot, Where We Design And Manufacture A Wide Range Of General Surgical, Dental
                Instruments, Ophthalmic, Medical Hollowwares, Hospital Furniture, And Single Use Instruments,
                As Well As Sterile Procedure Packs And Custom Medical Kits.
              </p>
              <p>
                Our Commitment To Excellence Is Supported By ISO 13485-Certified Processes And Compliance With
                ISO, MDR-Ready And FDA Requirements, Ensuring Every Product Meets The Highest Standards Of
                Safety And Performance. Offering More Than 20,000 Precision-Made Products, We Deliver Tailored
                OEM And Private Label Solutions That Help Hospitals, Distributors, And Healthcare Brands Grow
                With Confidence.
              </p>
            </div>
          </div>

          {/* Right Image Column (Using factory 2.svg) */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[640px] 2xl:max-w-[780px] 3xl:max-w-[920px]">
              <div className="relative aspect-[16/10] w-full rounded-3xl lg:rounded-[36px] overflow-hidden shadow-2xl border-2 border-slate-100 bg-slate-50">
                <Image
                  src="/images/about/factory-2.svg"
                  alt="Alpha Medical Manufacturing Facility"
                  fill
                  priority
                  className="object-contain object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          4. ADVANCED MANUFACTURING & 4 STAT CARDS (SLICES 1 & 2)
      ========================================================= */}
      <section className="bg-white py-14 sm:py-20 px-4 sm:px-8 border-b border-slate-100">
        <div className="max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto space-y-12 sm:space-y-16">
          {/* Header Row */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] sm:text-xs font-black text-[#B92025] tracking-widest uppercase">
                  Our Expertise
                </span>
                <span className="h-0.5 w-12 bg-[#B92025]"></span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-black text-slate-800 tracking-wider">
                <span>QUALITY</span>
                <span className="text-[#B92025]">/</span>
                <span>COMFORT</span>
                <span className="text-[#B92025]">/</span>
                <span className="text-[#B92025]">INNOVATION</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-5">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black text-slate-900 leading-tight">
                  Advanced Manufacturing <br />
                  <span className="text-[#B92025]">Global Reach.</span>
                </h2>
              </div>
              <div className="lg:col-span-7 space-y-3 text-xs sm:text-sm 2xl:text-base text-slate-600 leading-relaxed font-medium">
                <p>
                  We Help Medical Professionals And Businesses Source Reliable Surgical Instruments With A Focus
                  On Precision, Practical Performance, And Responsive Service.
                </p>
                <p>
                  From Standard Surgical Instruments To Specialist Ranges And Customized OEM Projects, Our Team
                  Works Closely With Customers To Understand Their Requirements And Deliver Solutions That Meet
                  Their Expectations.
                </p>
              </div>
            </div>
          </div>

          {/* 4 Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: 10,000+ Instrument Options */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 flex items-center justify-center text-[#B92025]">
                <Scissors className="w-8 h-8 text-[#B92025]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900">10,000+</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Instrument Options</p>
                <div className="w-12 h-0.5 bg-[#B92025] pt-0.5"></div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium pt-1">
                A Comprehensive Range Of Instruments For Multiple Surgical Specialties.
              </p>
            </div>

            {/* Card 2: OEM & Private Label */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 flex items-center justify-center text-[#B92025]">
                <Microscope className="w-8 h-8 text-[#B92025]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900">OEM &amp; Private Label</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Custom Solutions</p>
                <div className="w-12 h-0.5 bg-[#B92025] pt-0.5"></div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium pt-1">
                Customized Instruments, Branding, Packaging, And Product Solutions For Your Business.
              </p>
            </div>

            {/* Card 3: Worldwide Delivery */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 flex items-center justify-center text-[#B92025]">
                <Globe2 className="w-8 h-8 text-[#B92025]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900">Worldwide Delivery</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Global Reach</p>
                <div className="w-12 h-0.5 bg-[#B92025] pt-0.5"></div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium pt-1">
                Reliable Export And Delivery Support For Customers Across International Markets.
              </p>
            </div>

            {/* Card 4: Dedicated Support */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 flex items-center justify-center text-[#B92025]">
                <Headphones className="w-8 h-8 text-[#B92025]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900">Dedicated Support</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Care</p>
                <div className="w-12 h-0.5 bg-[#B92025] pt-0.5"></div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium pt-1">
                Responsive Assistance From Product Selection And Quotation To Order Completion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          5. HISTORY & HERITAGE TIMELINE (MATCHING SLICE 2 OF SVG)
      ========================================================= */}
      <section className="bg-[#F8FAFC] py-16 sm:py-24 px-4 sm:px-8 border-b border-slate-200/80 overflow-hidden">
        <div className="max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto space-y-12">
          {/* Timeline Pill */}
          <div className="flex justify-start">
            <span className="inline-flex items-center gap-2 bg-white text-[#B92025] border border-red-200 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#B92025]"></span>
              <span>HISTORY</span>
            </span>
          </div>

          {/* Timeline Container */}
          <div className="relative pt-6">
            {/* Center horizontal timeline bar on desktop */}
            <div className="hidden lg:block absolute top-[280px] inset-x-0 h-0.5 bg-slate-300"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-8 items-start relative z-10">
              {/* Milestone 1: 1970 */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="space-y-1 max-w-xs">
                  <span className="text-sm font-black text-[#B92025] tracking-widest">1970</span>
                  <h3 className="text-xl font-black text-slate-900 tracking-wider uppercase">
                    FOUNDATION
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Technimen Agha (Pvt). Ltd. Was Established In 1970 As Technimen Corporation.
                  </p>
                </div>

                {/* Timeline Diamond Marker */}
                <div className="w-4 h-4 rotate-45 bg-[#B92025] border-2 border-white shadow my-2"></div>

                {/* Facility Image using Rectangle 892.svg */}
                <div className="relative w-44 sm:w-52 aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-xl bg-slate-100">
                  <Image
                    src="/images/about/Rectangle-892.svg"
                    alt="1970 Foundation Facility"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Milestone 2: 1976 (Image above text on desktop) */}
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Facility Image above */}
                <div className="relative w-44 sm:w-52 aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-xl bg-slate-100">
                  <Image
                    src="/images/about/Rectangle-892.svg"
                    alt="1976 German Joint Facility"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Timeline Diamond Marker */}
                <div className="w-4 h-4 rotate-45 bg-[#B92025] border-2 border-white shadow my-2"></div>

                <div className="space-y-1 max-w-xs">
                  <span className="text-sm font-black text-[#B92025] tracking-widest">1976</span>
                  <h3 className="text-xl font-black text-slate-900 tracking-wider uppercase">
                    GERMAN JOINT
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Pak German Joint Venture With Gebrüder Martin GmbH &amp; Co.KG, Technimen Corporation
                    Changed To Technimen Gema (Pvt) Ltd
                  </p>
                </div>
              </div>

              {/* Milestone 3: 1992 */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="space-y-1 max-w-xs">
                  <span className="text-sm font-black text-[#B92025] tracking-widest">1992</span>
                  <h3 className="text-xl font-black text-slate-900 tracking-wider uppercase">
                    JOIN PARTNERSHIP
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Local Partnership Ended To One Partner, Bilal Haider Agha With 40% And Gebrüder Martin
                    GmbH &amp; Co.KG 60%
                  </p>
                </div>

                {/* Timeline Diamond Marker */}
                <div className="w-4 h-4 rotate-45 bg-[#B92025] border-2 border-white shadow my-2"></div>

                {/* Facility Image */}
                <div className="relative w-44 sm:w-52 aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-xl bg-slate-100">
                  <Image
                    src="/images/about/Rectangle-892.svg"
                    alt="1992 Partnership Facility"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          6. MISSION & VISION SECTION (MATCHING SLICE 3 OF SVG)
      ========================================================= */}
      <section className="bg-white py-16 sm:py-24 px-4 sm:px-8 border-b border-slate-100">
        <div className="max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto space-y-12 sm:space-y-16">
          {/* Section Header */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Committed To <span className="text-[#B92025]">Better Healthcare</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-wider">
              Innovating Today For A Healthier Tomorrow
            </p>
          </div>

          {/* Mission & Vision Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* OUR MISSION CARD */}
            <div className="rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-red-50/20">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#B92025] text-white flex items-center justify-center shadow-md">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-[#B92025]">
                    OUR Mission
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
                  Advancing Healthcare Together
                </h3>

                <div className="w-16 h-1 bg-[#B92025] rounded-full"></div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium pt-2">
                  We Are Dedicated To Manufacturing High-Quality Surgical Instruments That Empower
                  Healthcare Professionals And Improve Lives Worldwide.
                </p>
              </div>

              {/* Bottom Tagline */}
              <div className="pt-6 border-t border-slate-200/80 flex items-center gap-3 text-xs font-black text-slate-700 tracking-wider">
                <span>QUALITY</span>
                <span className="text-[#B92025]">•</span>
                <span>PEOPLE</span>
                <span className="text-[#B92025]">•</span>
                <span className="text-[#B92025]">INNOVATION</span>
              </div>
            </div>

            {/* OUR VISION CARD */}
            <div className="rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-sm flex flex-col justify-between space-y-6 bg-white">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#B92025] text-white flex items-center justify-center shadow-md">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-[#B92025]">
                    OUR Vision
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
                  Aiming To Be The Global Choice In Single-Use Instruments
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  Our Vision Is To Become A Global Leader In Manufacturing Single-Use Surgical Instruments,
                  Recognized For Our Innovation, Reliability, And Dedication To Advancing Healthcare
                  Worldwide. We Strive To Set New Standards That Improve Patient Safety And Make Quality Care
                  More Accessible.
                </p>
              </div>

              {/* 8 Feature Badges in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                  <div className="w-6 h-6 rounded-full bg-red-50 text-[#B92025] flex items-center justify-center shrink-0">
                    <Globe2 className="w-3.5 h-3.5" />
                  </div>
                  <span>Global Leadership Goal</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                  <div className="w-6 h-6 rounded-full bg-red-50 text-[#B92025] flex items-center justify-center shrink-0">
                    <Lightbulb className="w-3.5 h-3.5" />
                  </div>
                  <span>Innovation In Design</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                  <div className="w-6 h-6 rounded-full bg-red-50 text-[#B92025] flex items-center justify-center shrink-0">
                    <Scissors className="w-3.5 h-3.5" />
                  </div>
                  <span>Reliable, Single-Use Tools</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                  <div className="w-6 h-6 rounded-full bg-red-50 text-[#B92025] flex items-center justify-center shrink-0">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <span>Commitment To Quality</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                  <div className="w-6 h-6 rounded-full bg-red-50 text-[#B92025] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span>Focus On Patient Safety</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                  <div className="w-6 h-6 rounded-full bg-red-50 text-[#B92025] flex items-center justify-center shrink-0">
                    <HeartHandshake className="w-3.5 h-3.5" />
                  </div>
                  <span>Supporting Healthcare Growth</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                  <div className="w-6 h-6 rounded-full bg-red-50 text-[#B92025] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>Setting New Standards</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                  <div className="w-6 h-6 rounded-full bg-red-50 text-[#B92025] flex items-center justify-center shrink-0">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <span>Accessible Care Solutions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          7. WHY ALPHA MEDICAL (SOLID RED SECTION - SLICE 4 OF SVG)
      ========================================================= */}
      <section className="bg-[#96161B] text-white py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-xs font-black text-white/90 tracking-widest uppercase">
                WHY Alpha Medical Wholesale Supplies
              </span>
              <span className="h-0.5 w-12 bg-white/60"></span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.15] tracking-tight">
              A Global Supply Partner <br />
              With A Manufacturing <br />
              Mindset.
            </h2>

            <div className="space-y-4 text-xs sm:text-sm 2xl:text-base text-white/90 leading-relaxed font-medium max-w-xl">
              <p>
                Alpha Medical Wholesale Supplies Combines Product Expertise, Hands-On Manufacturing
                Capabilities, And International Customer Support To Make Sourcing Surgical Instruments Simpler
                For Professional Buyers.
              </p>
              <p>
                Whether You Need Standard Instruments, Customized Products, OEM Manufacturing, Or
                Private-Label Solutions, We Work With You From Initial Enquiry Through Delivery.
              </p>
            </div>
          </div>

          {/* Right Column: 4 Capability Boxes with Divider Lines */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 border-t sm:border-t-0 sm:border-l border-white/20 sm:pl-8 pt-8 sm:pt-0">
            {/* Box 1: Quality Focus */}
            <div className="space-y-2 border-b sm:border-b-0 border-white/20 pb-6 sm:pb-0">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-white" />
                <h3 className="font-black text-base text-white">Quality Focus</h3>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                Careful Material Selection, Controlled Production, Finishing, And Inspection Processes Guide
                Our Work.
              </p>
            </div>

            {/* Box 2: Custom Solutions */}
            <div className="space-y-2 border-b sm:border-b-0 border-white/20 pb-6 sm:pb-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-white" />
                <h3 className="font-black text-base text-white">Custom Solutions</h3>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                Share Your Product Specifications, Branding, Packaging, And Other Requirements With Our Team.
              </p>
            </div>

            {/* Box 3: Worldwide Reach */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe2 className="w-6 h-6 text-white" />
                <h3 className="font-black text-base text-white">Worldwide Reach</h3>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                We Support International Customers With Export Coordination And Delivery Solutions Across Global
                Markets.
              </p>
            </div>

            {/* Box 4: Clear Support */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Headphones className="w-6 h-6 text-white" />
                <h3 className="font-black text-base text-white">Clear Support</h3>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                Our Team Provides Assistance Before, During, And After Your Order To Help Keep Your Sourcing
                Process Straightforward.
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
