'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, X, ShieldCheck, ArrowRight } from 'lucide-react'
import { getStoredProducts, getStoredCategories } from '@/src/lib/dataStore'
import { ProductItem } from '@/src/types/product'
import { CategoryItem } from '@/src/types/category'

interface PublicSearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PublicSearchModal({ isOpen, onClose }: PublicSearchModalProps) {
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<ProductItem[]>([])
  const [categories, setCategories] = useState<CategoryItem[]>([])

  useEffect(() => {
    if (isOpen) {
      setProducts(getStoredProducts().filter((p) => p.is_published))
      setCategories(getStoredCategories().filter((c) => c.is_published))
    }
  }, [isOpen])

  if (!isOpen) return null

  const searchResults = query.trim() === ''
    ? []
    : products.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          (p.sku && p.sku.toLowerCase().includes(query.toLowerCase())) ||
          (p.category_name && p.category_name.toLowerCase().includes(query.toLowerCase())) ||
          (p.short_description && p.short_description.toLowerCase().includes(query.toLowerCase()))
      )

  const matchedCategories = query.trim() === ''
    ? []
    : categories.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 overflow-hidden space-y-4">
        {/* INPUT HEADER */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
          <Search className="w-5 h-5 text-[#B92025]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ALPHA medical equipment, surgical instruments..."
            className="flex-1 bg-transparent text-sm text-slate-900 font-medium outline-none placeholder:text-slate-400"
          />
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* RESULTS AREA */}
        <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-1">
          {query.trim() === '' ? (
            <div className="text-center py-8 text-slate-400 text-xs space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-300" />
              <p>Type any keyword like &quot;Monitor&quot;, &quot;Scissors&quot;, &quot;Bed&quot;, or &quot;Ventilator&quot;...</p>
            </div>
          ) : (
            <>
              {matchedCategories.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Categories ({matchedCategories.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {matchedCategories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/categories/${cat.slug}`}
                        onClick={onClose}
                        className="bg-red-50 hover:bg-[#B92025] hover:text-white text-[#B92025] text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors border border-red-100"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Products ({searchResults.length})
                </div>

                {searchResults.length === 0 ? (
                  <div className="text-slate-500 text-xs py-4 text-center">
                    No medical supplies found matching &quot;{query}&quot;.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {searchResults.map((prod) => (
                      <Link
                        key={prod.id}
                        href={`/contact?product=${encodeURIComponent(prod.title)}`}
                        onClick={onClose}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors group"
                      >
                        <div className="relative w-12 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                          <Image
                            src={prod.featured_image || '/images/extracted/image_7.png'}
                            alt={prod.title}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-bold text-[#B92025] uppercase tracking-wider">
                            {prod.category_name} {prod.sku ? `• ${prod.sku}` : ''}
                          </div>
                          <div className="text-xs font-bold text-[#18355E] group-hover:text-[#B92025] truncate">
                            {prod.title}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#B92025] shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
