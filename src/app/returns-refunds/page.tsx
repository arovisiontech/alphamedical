import React from 'react'
import HeaderNav from '@/src/components/public/HeaderNav'
import MainRedNavbar from '@/src/components/public/MainRedNavbar'
import TopBar from '@/src/components/public/TopBar'
import PublicFooter from '@/src/components/public/PublicFooter'
import { RotateCcw, CheckCircle2, ShieldAlert } from 'lucide-react'

export const metadata = {
  title: 'Returns & Cancellation Policy - Alpha Wholesale Medical Supplies LLC',
  description: 'Our 30-day hassle-free return and exchange policy for medical equipment.',
}

export default function ReturnsRefundsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TopBar />
      <HeaderNav />
      <MainRedNavbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-[#96161B] uppercase tracking-wider">
              Customer Assurance
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
              Returns & Cancellation Policy
            </h1>
            <p className="text-slate-500 text-sm sm:text-base">
              Transparent, straightforward returns for complete peace of mind.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-sm text-slate-600 leading-relaxed">
            <div className="flex items-center gap-3 text-slate-900 font-extrabold text-lg">
              <RotateCcw className="w-6 h-6 text-[#96161B]" />
              <span>30-Day Hassle-Free Returns</span>
            </div>
            <p>
              We want you to be 100% satisfied with every surgical instrument and medical device purchased from Alpha Wholesale Medical Supplies LLC. If you receive an item that does not meet your clinic&apos;s standards, you may return it within 30 days of receipt.
            </p>

            <h3 className="font-bold text-slate-900 text-base">Eligibility Conditions</h3>
            <ul className="space-y-2 list-disc pl-5 font-medium">
              <li>Instruments must be in their original, unsterilized, and unused condition.</li>
              <li>Must include original product packaging and barcodes.</li>
              <li>Custom engraved or bespoke instruments are non-returnable unless defective.</li>
            </ul>

            <h3 className="font-bold text-slate-900 text-base">How to Initiate a Return</h3>
            <p>
              Contact our dedicated customer support desk at <a href="mailto:info@durablehs.com" className="text-[#96161B] font-bold underline">info@durablehs.com</a> or call (+92) 52 3563200 with your invoice number to receive a Return Merchandise Authorization (RMA) label.
            </p>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
