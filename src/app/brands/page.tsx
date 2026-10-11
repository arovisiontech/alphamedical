import React from 'react'
import HeaderNav from '@/src/components/public/HeaderNav'
import MainRedNavbar from '@/src/components/public/MainRedNavbar'
import TopBar from '@/src/components/public/TopBar'
import PublicFooter from '@/src/components/public/PublicFooter'
import Link from 'next/link'
import { ShieldCheck, Award, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Our Brands & Product Lines - Alpha Wholesale Medical Supplies LLC',
  description: 'Certified medical and surgical instrument brands by Alpha Medical Supplies.',
}

export default function BrandsPage() {
  const brands = [
    {
      name: 'ALPHA Surgical Precision™',
      desc: 'German & Japanese DIN grade stainless steel forceps, scissors, retractors, and titanium microsurgery sets.',
    },
    {
      name: 'ALPHA Pro-Care Critical™',
      desc: 'Multiparameter patient monitors, ICU turbine ventilators, syringe pumps, and defibrillators.',
    },
    {
      name: 'ALPHA Med-Ward Furnishings™',
      desc: 'Heavy-duty electric ICU hospital beds, MAYO instrument trolleys, and hydraulic patient stretchers.',
    },
    {
      name: 'ALPHA Sterile Single-Use™',
      desc: 'Latex powder-free surgical gloves, disposable procedure trays, and sterile surgical drape packs.',
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
              Product Divisions
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
              Alpha Medical Brands & Divisions
            </h1>
            <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
              Our specialized product lines tailored for hospital operating rooms, critical care units, and outpatient clinics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {brands.map((b) => (
              <div key={b.name} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#96161B]" />
                    <h3 className="font-extrabold text-slate-900 text-lg">{b.name}</h3>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{b.desc}</p>
                </div>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#96161B] hover:underline pt-2"
                >
                  <span>View products</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
