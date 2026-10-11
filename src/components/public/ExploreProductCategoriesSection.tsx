'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Layers, Sparkles } from 'lucide-react'
import { getStoredCategories } from '@/src/lib/dataStore'
import { CategoryItem } from '@/src/types/category'

export default function ExploreProductCategoriesSection() {
  const [categories, setCategories] = useState<CategoryItem[]>([])

  useEffect(() => {
    setCategories(getStoredCategories().filter((c) => c.is_published))
  }, [])

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B92025] uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Certified Healthcare Divisions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Explore Product Categories
            </h2>
          </div>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#B92025] hover:text-[#96161B] uppercase tracking-wider group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* CATEGORIES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                {cat.image_url ? (
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                    <Layers className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                <div className="absolute top-3 right-3 bg-[#B92025] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                  {cat.product_count || 5}+ Products
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#B92025] transition-colors mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-4">
                    {cat.description || 'Certified medical products and hospital supplies.'}
                  </p>
                </div>

                <div className="flex items-center text-xs font-semibold text-[#B92025] group-hover:translate-x-1 transition-transform pt-2 border-t border-slate-100">
                  <span>Explore Division</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
