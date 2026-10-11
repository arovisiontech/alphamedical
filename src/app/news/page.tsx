import React from 'react'
import HeaderNav from '@/src/components/public/HeaderNav'
import MainRedNavbar from '@/src/components/public/MainRedNavbar'
import TopBar from '@/src/components/public/TopBar'
import PublicFooter from '@/src/components/public/PublicFooter'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Company News - Alpha Wholesale Medical Supplies LLC',
  description: 'Latest updates and announcements from Alpha Wholesale Medical Supplies LLC.',
}

export default function NewsPage() {
  const newsItems = [
    {
      title: 'Alpha Expands German Stainless Steel Surgical Tool Line for 2026',
      date: 'October 2026',
      summary: 'New line of self-retaining retractors, micro forceps, and tungsten carbide scissors now available for hospitals worldwide.',
    },
    {
      title: 'ISO 13485:2016 Recertification Completed Successfully',
      date: 'September 2026',
      summary: 'Alpha Wholesale Medical Supplies LLC maintains top compliance standards across manufacturing and logistics facilities.',
    },
    {
      title: 'Global Export Operations Expand to 15 New Healthcare Hubs',
      date: 'August 2026',
      summary: 'Delivering clinical-grade instruments directly to hospitals, clinics, and surgical centers in Europe, Asia, and Africa.',
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
              Press & Media
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
              Latest Company News & Announcements
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsItems.map((n) => (
              <div key={n.title} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-[#96161B]" />
                    <span>{n.date}</span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base leading-snug">{n.title}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{n.summary}</p>
                </div>
                <Link href="/contact" className="text-xs font-bold text-[#96161B] inline-flex items-center gap-1 hover:underline">
                  <span>Read details</span>
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
