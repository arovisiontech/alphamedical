import React from 'react'
import HeaderNav from '@/src/components/public/HeaderNav'
import MainRedNavbar from '@/src/components/public/MainRedNavbar'
import TopBar from '@/src/components/public/TopBar'
import PublicFooter from '@/src/components/public/PublicFooter'

export const metadata = {
  title: 'Legal Notice - Alpha Wholesale Medical Supplies LLC',
  description: 'Official corporate and legal disclosure information.',
}

export default function LegalNoticePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TopBar />
      <HeaderNav />
      <MainRedNavbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Legal Notice & Disclosure</h1>
            <p className="text-xs text-slate-400 font-semibold">Corporate Information</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5 text-sm text-slate-600 leading-relaxed font-medium">
            <h3 className="font-bold text-slate-900 text-base">Corporate Identification</h3>
            <p>
              Alpha Wholesale Medical Supplies LLC<br />
              129 Fleetwood Drive, Easley, SC 29640, USA<br />
              Registration Jurisdiction: South Carolina, United States
            </p>

            <h3 className="font-bold text-slate-900 text-base">Regulatory Compliance</h3>
            <p>
              Alpha Wholesale Medical Supplies LLC is registered with the United States Food and Drug Administration (FDA) and certified under ISO 13485:2016 for Medical Device Quality Management.
            </p>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
