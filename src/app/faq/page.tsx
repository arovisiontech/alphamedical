'use client'

import React, { useState } from 'react'
import HeaderNav from '@/src/components/public/HeaderNav'
import MainRedNavbar from '@/src/components/public/MainRedNavbar'
import TopBar from '@/src/components/public/TopBar'
import PublicFooter from '@/src/components/public/PublicFooter'
import { ChevronDown, HelpCircle } from 'lucide-react'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      q: 'Are your surgical instruments manufactured from genuine German stainless steel?',
      a: 'Yes, all our surgical instruments are forged from premium German medical-grade stainless steel (DIN 1.4021 / AISI 420 standards) ensuring superior tensile strength, rust resistance, and edge retention.',
    },
    {
      q: 'Do you offer bulk wholesale pricing for hospitals and medical distributors?',
      a: 'Absolutely. We specialize in B2B supply contracts for hospitals, surgery centers, universities, and regional healthcare distributors with tailored tiered discounts and dedicated account managers.',
    },
    {
      q: 'What quality certifications accompany your equipment?',
      a: 'Our products conform strictly to ISO 13485:2016 Medical Devices Quality Management System standards, CE mark directives, and FDA registration requirements.',
    },
    {
      q: 'How fast is international shipping and customs clearance?',
      a: 'Orders within the United States ship via expedited air courier (1-3 business days). International consignments are shipped with full export documentation, certificates of conformance, and trackable air freight (3-7 business days).',
    },
    {
      q: 'What is your warranty and return policy on surgical instruments?',
      a: 'We offer a 100% satisfaction guarantee with 30-day return capability and a comprehensive limited lifetime warranty against manufacturing and material defects.',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TopBar />
      <HeaderNav />
      <MainRedNavbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-[#96161B] uppercase tracking-wider">
              Help Center
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
              Frequently Asked Questions (FAQ)
            </h1>
            <p className="text-slate-500 text-sm sm:text-base">
              Find answers regarding certifications, wholesale ordering, worldwide shipping, and warranties.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx
              return (
                <div
                  key={faq.q}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-extrabold text-slate-900 text-sm sm:text-base cursor-pointer hover:text-[#96161B] transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-[#96161B] shrink-0" />
                      <span>{faq.q}</span>
                    </span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 font-medium pl-12">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
