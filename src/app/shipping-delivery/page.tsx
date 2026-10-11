import React from 'react'
import HeaderNav from '@/src/components/public/HeaderNav'
import MainRedNavbar from '@/src/components/public/MainRedNavbar'
import TopBar from '@/src/components/public/TopBar'
import PublicFooter from '@/src/components/public/PublicFooter'
import { Truck, ShieldCheck, Clock, Globe } from 'lucide-react'

export const metadata = {
  title: 'Shipping & Delivery Policy - Alpha Wholesale Medical Supplies LLC',
  description: 'Worldwide shipping timelines, freight handling, and cold-chain/sterile transport protocols.',
}

export default function ShippingDeliveryPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TopBar />
      <HeaderNav />
      <MainRedNavbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-[#96161B] uppercase tracking-wider">
              Logistics & Delivery
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
              Shipping & Delivery Information
            </h1>
            <p className="text-slate-500 text-sm sm:text-base">
              Reliable, secure, and expedited delivery to healthcare institutions globally.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Domestic USA Shipping</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Standard orders ship within 24 hours. Transit time is 2-4 business days via FedEx / UPS. Overnight priority shipping is available upon checkout.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#96161B] flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">International Air Freight</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                We deliver to 70+ countries using DHL Express and chartered medical air cargo. Full export documentation and customs clearance assistance included.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Sterile & Secure Packaging</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                All delicate surgical instruments and optics are individually bubble-padded and sealed in shock-resistant protective cartons conforming to IATA regulations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Real-Time Tracking</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Once dispatched, tracking numbers and airway bills (AWB) are sent via automated email and SMS notification with milestone updates.
              </p>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
