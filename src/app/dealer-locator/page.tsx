import React from 'react'
import HeaderNav from '@/src/components/public/HeaderNav'
import MainRedNavbar from '@/src/components/public/MainRedNavbar'
import TopBar from '@/src/components/public/TopBar'
import PublicFooter from '@/src/components/public/PublicFooter'
import { MapPin, Phone, Mail, Building2 } from 'lucide-react'

export const metadata = {
  title: 'Authorized Dealer Locator - Alpha Wholesale Medical Supplies LLC',
  description: 'Locate authorized Alpha Medical distributors and logistics hubs worldwide.',
}

export default function DealerLocatorPage() {
  const hubs = [
    {
      city: 'North America HQ',
      address: '129 Fleetwood Drive, Easley, SC 29640, USA',
      phone: '+1 (800) 555-ALPHA',
      email: 'usa@alphamedical.com',
      coverage: 'United States & Canada',
    },
    {
      city: 'European Distribution Center',
      address: 'Industriestraße 45, 78532 Tuttlingen, Germany',
      phone: '+49 7461 98765',
      email: 'eu@alphamedical.com',
      coverage: 'European Union & UK',
    },
    {
      city: 'Middle East & Asia Regional Hub',
      address: 'Industrial Estate, Sialkot 51310, Pakistan',
      phone: '(+92) 52 3563200',
      email: 'export@alphamedical.com',
      coverage: 'Asia, Middle East & Africa',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TopBar />
      <HeaderNav />
      <MainRedNavbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-[#96161B] uppercase tracking-wider">
              Global Network
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
              Authorized Dealers & Distribution Centers
            </h1>
            <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
              Find our certified logistics centers and partner distribution facilities near your medical center.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hubs.map((hub) => (
              <div key={hub.city} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 text-[#96161B] flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">{hub.city}</h3>
                  <span className="text-xs font-semibold text-[#96161B]">{hub.coverage}</span>
                </div>
                <div className="space-y-2 text-xs text-slate-600 font-medium">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{hub.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{hub.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{hub.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
