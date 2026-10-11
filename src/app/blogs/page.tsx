import React from 'react'
import HeaderNav from '@/src/components/public/HeaderNav'
import MainRedNavbar from '@/src/components/public/MainRedNavbar'
import TopBar from '@/src/components/public/TopBar'
import PublicFooter from '@/src/components/public/PublicFooter'
import Link from 'next/link'
import { BookOpen, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Clinical Blog & Insights - Alpha Wholesale Medical Supplies LLC',
  description: 'Educational articles and clinical guides for surgical instruments and hospital equipment.',
}

export default function BlogsPage() {
  const blogs = [
    {
      title: 'Care & Autoclave Maintenance of German Stainless Steel Instruments',
      category: 'Sterilization & Care',
      snippet: 'Best practices for ultrasonic cleaning, lubrication, and steam sterilization to extend instrument lifespan.',
    },
    {
      title: 'Choosing the Right Retractors for Orthopedic Procedures',
      category: 'Surgical Guidance',
      snippet: 'Comparing self-retaining Weitlaner, Beckman-Adson, and Gelpi retractors for precision surgical access.',
    },
    {
      title: 'How ICU Equipment Modernization Enhances Critical Patient Outcomes',
      category: 'Hospital Technology',
      snippet: 'Review of advanced multiparameter patient monitors and closed-loop turbine ventilators in ICU wards.',
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
              Educational Hub
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
              Clinical Insights & Medical Blogs
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((b) => (
              <div key={b.title} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="bg-red-50 text-[#96161B] text-[10px] font-bold px-2.5 py-1 rounded-md">
                    {b.category}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base leading-snug pt-2">{b.title}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{b.snippet}</p>
                </div>
                <Link href="/catalogues" className="text-xs font-bold text-[#96161B] inline-flex items-center gap-1 hover:underline">
                  <span>Explore catalogue</span>
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
