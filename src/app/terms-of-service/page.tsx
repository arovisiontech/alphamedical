import React from 'react'
import HeaderNav from '@/src/components/public/HeaderNav'
import MainRedNavbar from '@/src/components/public/MainRedNavbar'
import TopBar from '@/src/components/public/TopBar'
import PublicFooter from '@/src/components/public/PublicFooter'

export const metadata = {
  title: 'Terms of Service - Alpha Wholesale Medical Supplies LLC',
  description: 'Terms and conditions governing use of Alpha Medical platform and commercial purchases.',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TopBar />
      <HeaderNav />
      <MainRedNavbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Terms of Service</h1>
            <p className="text-xs text-slate-400 font-semibold">Effective Date: October 2026</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5 text-sm text-slate-600 leading-relaxed font-medium">
            <h3 className="font-bold text-slate-900 text-base">1. Acceptance of Terms</h3>
            <p>
              By accessing and using this website, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use our services.
            </p>

            <h3 className="font-bold text-slate-900 text-base">2. Medical Device Ordering</h3>
            <p>
              Certain regulated surgical instruments and clinical diagnostic devices are intended strictly for licensed medical professionals, clinics, accredited healthcare centers, and authorized distributors.
            </p>

            <h3 className="font-bold text-slate-900 text-base">3. Intellectual Property</h3>
            <p>
              All trademarks, product images, diagrams, catalogue downloads, and proprietary designs displayed are the intellectual property of Alpha Wholesale Medical Supplies LLC.
            </p>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
