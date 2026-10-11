import React from 'react'
import HeaderNav from '@/src/components/public/HeaderNav'
import MainRedNavbar from '@/src/components/public/MainRedNavbar'
import TopBar from '@/src/components/public/TopBar'
import PublicFooter from '@/src/components/public/PublicFooter'
import Link from 'next/link'
import { FileText, Download, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'Clinical Resources & Downloads - Alpha Wholesale Medical Supplies LLC',
  description: 'Download PDF catalogues, cleaning & sterilization guides, and technical specifications.',
}

export default function ResourcesPage() {
  const resources = [
    {
      title: 'Complete 2026 Master Surgical Instrument Catalogue',
      size: '28.4 MB (PDF)',
      href: '/catalogues',
    },
    {
      title: 'ICU & Critical Care Equipment Technical Specifications',
      size: '14.2 MB (PDF)',
      href: '/catalogues',
    },
    {
      title: 'Autoclave & Ultrasonic Cleaning Protocol Guidelines',
      size: '3.8 MB (PDF)',
      href: '/catalogues',
    },
    {
      title: 'ISO 13485:2016 & CE Mark Quality Certificate Copies',
      size: '5.1 MB (PDF)',
      href: '/catalogues',
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
              Documentation & Guides
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
              Clinical Resources & Downloads
            </h1>
            <p className="text-slate-500 text-sm sm:text-base">
              Access product manuals, PDF catalogues, and compliance documentation.
            </p>
          </div>

          <div className="space-y-4">
            {resources.map((res) => (
              <div
                key={res.title}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4 hover:border-[#96161B]/40 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#96161B] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">{res.title}</h3>
                    <span className="text-xs text-slate-400 font-semibold">{res.size}</span>
                  </div>
                </div>
                <Link
                  href={res.href}
                  className="px-4 py-2 rounded-xl bg-[#96161B] hover:bg-[#7d1216] text-white text-xs font-bold flex items-center gap-1.5 shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
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
