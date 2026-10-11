'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FileText, Download, ArrowRight } from 'lucide-react'
import { getStoredCatalogues } from '@/src/lib/dataStore'
import { CatalogueItem } from '@/src/types/catalogue'

export default function DownloadableCataloguesSection() {
  const [catalogues, setCatalogues] = useState<CatalogueItem[]>([])

  useEffect(() => {
    setCatalogues(getStoredCatalogues().filter((c) => c.is_published))
  }, [])

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B92025] uppercase tracking-widest mb-1.5">
              <FileText className="w-4 h-4 text-[#B92025]" />
              <span>Official 2026 Product Documentation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Downloadable Product Catalogues
            </h2>
          </div>
          <Link
            href="/catalogues"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#B92025] hover:text-[#96161B] uppercase tracking-wider group"
          >
            <span>View All Catalogues</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {catalogues.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                <Image
                  src={cat.cover_image || '/images/extracted/image_1.png'}
                  alt={cat.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#B92025] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow">
                  PDF Catalogue
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#B92025] transition-colors leading-snug">
                    {cat.title}
                  </h3>
                  <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <a
                  href={cat.pdf_url}
                  download
                  className="flex items-center justify-center gap-2 bg-[#B92025] hover:bg-[#96161B] text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF (Full Range)</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
