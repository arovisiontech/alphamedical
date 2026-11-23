'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Store,
  Globe,
  ShoppingCart,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Package,
  CreditCard,
  RefreshCw,
  ExternalLink,
  Sliders,
  Sparkles,
} from 'lucide-react'
import { useGeoLocation } from '@/src/context/GeoLocationContext'
import { getStoredCartCount } from '@/src/lib/dataStore'
import TopBar from '@/src/components/public/TopBar'
import PublicFooter from '@/src/components/public/PublicFooter'

export default function StorePreviewPortalPage() {
  const router = useRouter()
  const { isUsaStore, countryCode, setManualCountry } = useGeoLocation()
  const [cartCount, setCartCount] = useState(0)
  const [justActivated, setJustActivated] = useState<string | null>(null)

  useEffect(() => {
    setCartCount(getStoredCartCount())
    const handleCart = () => setCartCount(getStoredCartCount())
    window.addEventListener('alpha_cart_updated', handleCart)
    return () => window.removeEventListener('alpha_cart_updated', handleCart)
  }, [])

  const handleActivateUsa = () => {
    setManualCountry('US')
    setJustActivated('usa')
    setTimeout(() => setJustActivated(null), 3000)
  }

  const handleActivateGlobal = () => {
    setManualCountry('PK')
    setJustActivated('global')
    setTimeout(() => setJustActivated(null), 3000)
  }

  const handleResetAuto = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('alpha_user_country_override')
        sessionStorage.removeItem('alpha_user_country_override')
        window.location.reload()
      } catch (e) {}
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <TopBar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
        {/* HEADER HERO */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-red-100 text-[#96161B] px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
            <Sliders className="w-3.5 h-3.5" />
            <span>Private Store Testing Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Alpha Medical USA Store Control & Testing Link
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Bina kisi VPN lagaye live <strong>USA E-Commerce Store</strong> ko test karein. 
            Neeche diye gaye buttons se kisi bhi waqt Store ya Inquiry mode switch karein.
          </p>
        </div>

        {/* NOTIFICATION FEEDBACK */}
        {justActivated && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between animate-fade-in shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs sm:text-sm font-bold">
                {justActivated === 'usa'
                  ? 'USA Store Mode successfully activate ho chuka hai! Ab bina VPN ke Add to Cart aur Checkout test karein.'
                  : 'International B2B Inquiry Mode activate ho chuka hai.'}
              </div>
            </div>
            <button
              onClick={() => router.push('/')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-3.5 py-2 rounded-xl transition-all shrink-0 cursor-pointer"
            >
              Go To Homepage &rarr;
            </button>
          </div>
        )}

        {/* CURRENT STATUS CARD */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  isUsaStore ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-[#96161B]'
                }`}
              >
                {isUsaStore ? <Store className="w-6 h-6" /> : <Globe className="w-6 h-6" />}
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Current Active State
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>{isUsaStore ? '🇺🇸 USA Online Store (Active)' : '🌐 International B2B Inquiry (Active)'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase ${
                  isUsaStore
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                {isUsaStore ? 'VPN Bypassed • Store Active' : 'RFQ Mode Active'}
              </span>
            </div>
          </div>

          {/* STATUS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <span className="text-slate-400 font-semibold block mb-1">Simulated IP:</span>
              <span className="font-extrabold text-slate-900 text-sm">{countryCode} (USA Override)</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <span className="text-slate-400 font-semibold block mb-1">Add to Cart:</span>
              <span className={`font-extrabold text-sm ${isUsaStore ? 'text-emerald-600' : 'text-slate-400'}`}>
                {isUsaStore ? 'Enabled' : 'Disabled (Quote)'}
              </span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <span className="text-slate-400 font-semibold block mb-1">Online Checkout:</span>
              <span className={`font-extrabold text-sm ${isUsaStore ? 'text-emerald-600' : 'text-slate-400'}`}>
                {isUsaStore ? 'Enabled (Stripe)' : 'Inquiry RFQ'}
              </span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <span className="text-slate-400 font-semibold block mb-1">Cart Items:</span>
              <span className="font-extrabold text-slate-900 text-sm font-mono">{cartCount} items</span>
            </div>
          </div>

          {/* ACTION BUTTONS (DIRECT LAUNCH) */}
          <div className="pt-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Direct Store Testing Links:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href="/?store=usa"
                className="flex items-center justify-center gap-2 bg-[#96161B] hover:bg-[#7d1216] text-white py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm tracking-wide uppercase transition-all shadow-md shadow-red-950/20 active:scale-95 group text-center"
              >
                <Store className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Open Store Homepage</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/products?store=usa"
                className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm tracking-wide uppercase transition-all shadow-md active:scale-95 group text-center"
              >
                <Package className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Test Products Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/checkout?store=usa"
                className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm tracking-wide uppercase transition-all shadow-md active:scale-95 group text-center"
              >
                <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Open Checkout Directly</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* MODE SWITCHER CARDS */}
        <div className="space-y-4">
          <div className="text-xs font-black uppercase text-slate-400 tracking-wider">
            Quick Toggle Options:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* OPTION 1: ACTIVATE USA STORE */}
            <div
              onClick={handleActivateUsa}
              className={`p-6 rounded-3xl border-2 transition-all cursor-pointer space-y-4 relative bg-white hover:border-[#96161B] ${
                isUsaStore ? 'border-[#96161B] ring-2 ring-red-100 shadow-md' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-[#96161B] flex items-center justify-center font-bold">
                  🇺🇸
                </div>
                {isUsaStore && (
                  <span className="bg-[#96161B] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Currently Selected
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Activate USA Store Mode (No VPN)
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Aapke browser me USA Store activate ho jayega. Products par <strong>Add to Cart</strong> button,
                  cart modal aur <strong>Stripe Checkout</strong> show hoga.
                </p>
              </div>
              <button
                type="button"
                className="w-full bg-[#96161B] hover:bg-[#7d1216] text-white py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                {isUsaStore ? 'Already Active' : 'Switch To USA Store'}
              </button>
            </div>

            {/* OPTION 2: ACTIVATE GLOBAL INQUIRY */}
            <div
              onClick={handleActivateGlobal}
              className={`p-6 rounded-3xl border-2 transition-all cursor-pointer space-y-4 relative bg-white hover:border-slate-400 ${
                !isUsaStore ? 'border-slate-900 ring-2 ring-slate-100 shadow-md' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                  🌐
                </div>
                {!isUsaStore && (
                  <span className="bg-slate-900 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Currently Selected
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Activate International Inquiry Mode
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Check karein ke international (non-USA) visitors ko website kesi nazar aati hai:
                  <strong> Request B2B Quote</strong> modal aur RFQ inquiry forms.
                </p>
              </div>
              <button
                type="button"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                {!isUsaStore ? 'Already Active' : 'Switch To Inquiry Mode'}
              </button>
            </div>
          </div>

          {/* RESET TO AUTO */}
          <div className="text-center pt-2">
            <button
              onClick={handleResetAuto}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset & Revert to Auto-IP Detection</span>
            </button>
          </div>
        </div>

        {/* SECURITY & PRIVACY NOTE */}
        <div className="bg-slate-100/80 rounded-2xl p-5 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-slate-800">Private Testing Notice:</span>
            <p>
              Yeh testing link sirf aapke is browser session me store mode toggle karta hai.
              Bahir ke public visitors (Pakistan, UK, UAE, etc.) ke liye automatic IP rule apply rahega aur unhe
              sirf B2B Quotation website hi nazar aayegi jab tak woh USA se browse na kar rahe hon.
            </p>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
