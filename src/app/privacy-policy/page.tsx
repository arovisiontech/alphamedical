import React from 'react'
import HeaderNav from '@/src/components/public/HeaderNav'
import MainRedNavbar from '@/src/components/public/MainRedNavbar'
import TopBar from '@/src/components/public/TopBar'
import PublicFooter from '@/src/components/public/PublicFooter'

export const metadata = {
  title: 'Privacy Policy - Alpha Wholesale Medical Supplies LLC',
  description: 'Our privacy policy and data protection commitments.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TopBar />
      <HeaderNav />
      <MainRedNavbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Privacy Policy</h1>
            <p className="text-xs text-slate-400 font-semibold">Last Updated: October 2026</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5 text-sm text-slate-600 leading-relaxed font-medium">
            <h3 className="font-bold text-slate-900 text-base">1. Information We Collect</h3>
            <p>
              We collect information you provide directly to us when requesting quotations, purchasing medical supplies, creating accounts, or submitting inquiries. This may include organization name, email address, phone number, shipping address, and medical license numbers where required.
            </p>

            <h3 className="font-bold text-slate-900 text-base">2. How We Use Your Information</h3>
            <p>
              Your data is utilized solely for processing orders, fulfilling shipment logistics, delivering technical support, and providing safety advisories regarding medical supplies. We never sell your personal or healthcare facility data to third parties.
            </p>

            <h3 className="font-bold text-slate-900 text-base">3. Data Security</h3>
            <p>
              We enforce industry standard 256-bit SSL encryption across all digital interactions and adhere to strict data protection standards to safeguard your transactions and account integrity.
            </p>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
