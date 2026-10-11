'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Mail,
  MapPin,
  Phone,
  ChevronRight,
  Shield,
  Scissors,
  Award,
  Globe,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
} from 'lucide-react'

export default function PublicFooter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setTimeout(() => setSubscribed(false), 4000)
      setEmail('')
    }
  }

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer className="relative bg-[#f8fafc] text-slate-800 pt-20 pb-10 border-t border-slate-200/90 font-sans">
      <div className="w-full max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 3xl:px-20">
        
        {/* 1. FLOATING NEWSLETTER CARD (MATCHING SCREENSHOT 2 TOP) */}
        <div className="relative -mt-32 sm:-mt-36 mb-16 z-20">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-6 sm:p-8 2xl:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left: Icon & Text */}
            <div className="flex items-center gap-5 sm:gap-6 w-full lg:w-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 2xl:w-24 2xl:h-24 rounded-full bg-[#fdecef] border border-red-100 flex items-center justify-center shrink-0 shadow-sm">
                <div className="w-8 h-8 sm:w-10 sm:h-10 text-[#96161B] flex items-center justify-center">
                  <Mail className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
              </div>
              <div>
                <div className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  NEWSLETTER
                </div>
                <h3 className="text-2xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
                  Stay inspired<span className="text-[#96161B]">.</span>
                </h3>
                <p className="text-xs sm:text-sm 2xl:text-base text-slate-500 font-medium max-w-xl mt-1 leading-relaxed">
                  Receive exclusive tips, trends, and promotions for professionals—directly from Alpha Medical Supplies in your inbox.
                </p>
              </div>
            </div>

            {/* Right: Email Input Form */}
            <div className="w-full lg:w-auto lg:min-w-[420px] 2xl:min-w-[480px]">
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex items-center gap-2 bg-[#f8fafc] border border-slate-300 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-[#96161B] focus-within:border-[#96161B] transition-all">
                  <div className="pl-3 text-slate-400">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 bg-transparent px-2 py-2 text-xs sm:text-sm text-slate-900 font-medium outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#96161B] hover:bg-[#7d1216] text-white flex items-center justify-center shadow-md shadow-red-950/20 active:scale-95 transition-all cursor-pointer shrink-0"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400 pl-1">
                  <span className="text-[#96161B]">🛡️</span>
                  <span>No spam. Unsubscribe anytime.</span>
                </div>
                {subscribed && (
                  <div className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 pl-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Thank you for subscribing! Check your inbox soon.</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* 2. MAIN 4-COLUMN FOOTER LINKS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-12 2xl:gap-16 pb-14 border-b border-slate-200">
          
          {/* COL 1: LOGO & CONTACT INFO (LG: 4 COLS) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative w-10 h-10 shrink-0">
                <Image src="/logo5.svg" alt="Alpha Medical" fill className="object-contain" />
              </div>
              <div>
                <span className="text-xl 2xl:text-2xl font-black text-[#96161B] tracking-tight block leading-none">
                  ALPHA
                </span>
                <span className="text-[9px] 2xl:text-[10px] font-bold text-slate-600 tracking-wider uppercase block mt-0.5">
                  WHOLESALE MEDICAL SUPPLIES LLC
                </span>
              </div>
            </Link>

            {/* Address */}
            <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-600 font-medium">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#96161B] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">
                    OUR LOCATIONS
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    129 Fleetwood Drive Easley SC 29640 USA
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#96161B] shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-700">Phone: (+92) 52 3563200</div>
                  <div className="text-slate-500">Phone: (+92) 52 3553777 | (+92) 523252500</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#96161B] shrink-0" />
                <div className="text-slate-700">
                  Email: <a href="mailto:Info@Durablehs.com" className="hover:text-[#96161B] font-semibold">Info@Durablehs.com</a>
                </div>
              </div>
            </div>

            {/* Social Icons (Red outlined rounded pills) */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:border-[#96161B] text-slate-600 hover:text-[#96161B] flex items-center justify-center transition-all shadow-sm"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:border-[#96161B] text-slate-600 hover:text-[#96161B] flex items-center justify-center transition-all shadow-sm"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:border-[#96161B] text-slate-600 hover:text-[#96161B] flex items-center justify-center transition-all shadow-sm"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:border-[#96161B] text-slate-600 hover:text-[#96161B] flex items-center justify-center transition-all shadow-sm"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:border-[#96161B] text-slate-600 hover:text-[#96161B] flex items-center justify-center transition-all shadow-sm"
                aria-label="Pinterest"
              >
                <span className="font-serif font-black text-xs">P</span>
              </a>
            </div>
          </div>

          {/* COL 2: COMPANY (LG: 2.5 COLS) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900">
              COMPANY
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-slate-600">
              {[
                { name: 'Home', href: '/' },
                { name: 'About Us', href: '/about' },
                { name: 'Career', href: '/careers' },
                { name: 'News', href: '/news' },
                { name: 'Blogs', href: '/blogs' },
                { name: 'FAQ', href: '/faq' },
                { name: 'Contact Us', href: '/contact' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center justify-between group hover:text-[#96161B] transition-colors py-0.5"
                  >
                    <span>{item.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#96161B] transition-colors" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 3: CATEGORIES (LG: 3 COLS) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900">
              CATEGORIES
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-slate-600">
              {[
                { name: 'Surgical Instruments', href: '/categories/surgical-instruments' },
                { name: 'Dental Instruments', href: '/categories/dental-instruments' },
                { name: 'Cardiovascular', href: '/categories/cardiovascular' },
                { name: 'ENT (Ear, Nose Throat)', href: '/categories/ent-surgery' },
                { name: 'Medical Supplies', href: '/categories/medical-equipment' },
                { name: 'Equipment', href: '/categories/medical-equipment' },
                { name: 'Brands', href: '/brands' },
                { name: 'Resources', href: '/resources' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center justify-between group hover:text-[#96161B] transition-colors py-0.5"
                  >
                    <span>{item.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#96161B] transition-colors" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 4: SERVICE & HELP (LG: 2.5 COLS) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900">
              SERVICE & HELP
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-slate-600">
              {[
                { name: 'Dealer Locator', href: '/dealer-locator' },
                { name: 'Shipping & Deliver', href: '/shipping-delivery' },
                { name: 'Returns & Cancellation Policy', href: '/returns-refunds' },
                { name: 'Contact Form', href: '/contact' },
                { name: 'Privacy Policy', href: '/privacy-policy' },
                { name: 'Terms of Service', href: '/terms-of-service' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center justify-between group hover:text-[#96161B] transition-colors py-0.5"
                  >
                    <span>{item.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#96161B] transition-colors" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* 3. FOUR FEATURE PILLS (MATCHING SCREENSHOT 2) */}
        <div className="py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-b border-slate-200">
          {/* Pill 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-full bg-[#fdecef] border border-red-100 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-[#96161B]" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black text-slate-900 uppercase">
                PREMIUM QUALITY
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Built to the highest standards
              </div>
            </div>
          </div>

          {/* Pill 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-full bg-[#fdecef] border border-red-100 flex items-center justify-center shrink-0">
              <Scissors className="w-5 h-5 text-[#96161B]" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black text-slate-900 uppercase">
                PRECISION & PERFORMANCE
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Engineered for excellence in every detail
              </div>
            </div>
          </div>

          {/* Pill 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-full bg-[#fdecef] border border-red-100 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-[#96161B]" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black text-slate-900 uppercase">
                TRUSTED BY PROFESSIONALS
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Chosen by experts worldwide
              </div>
            </div>
          </div>

          {/* Pill 4 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-full bg-[#fdecef] border border-red-100 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5 text-[#96161B]" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black text-slate-900 uppercase">
                GLOBAL PRESENCE
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Serving professionals in 70+ countries
              </div>
            </div>
          </div>
        </div>

        {/* 4. PAYMENT METHODS ROW (MATCHING SCREENSHOT 2) */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200">
          <div className="text-xs font-black uppercase tracking-wider text-slate-700">
            WE ACCEPT
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {[
              { name: 'VISA', bg: 'bg-[#1434cb] text-white font-black italic' },
              { name: 'Mastercard', bg: 'bg-[#eb001b] text-white font-extrabold' },
              { name: 'AMEX', bg: 'bg-[#006fcf] text-white font-black' },
              { name: 'PayPal', bg: 'bg-[#003087] text-white font-bold' },
              { name: 'Apple Pay', bg: 'bg-black text-white font-semibold' },
              { name: 'G Pay', bg: 'bg-white text-slate-700 border border-slate-300 font-semibold' },
              { name: 'DISCOVER', bg: 'bg-[#ff6000] text-white font-black' },
              { name: 'Diners Club', bg: 'bg-[#004a97] text-white font-bold' },
              { name: 'Klarna.', bg: 'bg-[#ffb3c7] text-slate-900 font-black' },
              { name: 'stripe', bg: 'bg-[#635bff] text-white font-bold' },
              { name: 'UnionPay', bg: 'bg-[#007b84] text-white font-black' },
            ].map((card) => (
              <span
                key={card.name}
                className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs shadow-sm select-none ${card.bg}`}
              >
                {card.name}
              </span>
            ))}
          </div>
        </div>

        {/* 5. BOTTOM COPYRIGHT & LEGAL (MATCHING SCREENSHOT 2) */}
        <div className="pt-6 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div>
            © 2026, Alpha Wholesale Medical Supplies LLC. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span>Design & Implementation: Magency</span>
            <span>•</span>
            <Link href="/privacy-policy" className="hover:text-[#96161B] transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms-of-service" className="hover:text-[#96161B] transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link href="/legal-notice" className="hover:text-[#96161B] transition-colors">Legal Notice</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-[#96161B] transition-colors">Contact Information</Link>
            <span>•</span>
            <Link href="/shipping-delivery" className="hover:text-[#96161B] transition-colors">Shipping & Delivery</Link>
          </div>

          <div>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-[#96161B] text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Back to top</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  )
}
