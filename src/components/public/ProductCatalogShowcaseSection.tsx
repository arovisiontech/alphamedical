'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check, ShieldCheck, ShoppingBag, Eye, ArrowRight, FileText } from 'lucide-react'
import { getStoredProducts, getStoredCategories } from '@/src/lib/dataStore'
import { ProductItem } from '@/src/types/product'
import { CategoryItem } from '@/src/types/category'
import SafeProductImage from '@/src/components/public/SafeProductImage'

interface ProductCatalogShowcaseSectionProps {
  onAddToQuote?: (product: ProductItem) => void
}

export default function ProductCatalogShowcaseSection({ onAddToQuote }: ProductCatalogShowcaseSectionProps) {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [selectedCatId, setSelectedCatId] = useState<string>('all')
  const [selectedProductForModal, setSelectedProductForModal] = useState<ProductItem | null>(null)
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setProducts(getStoredProducts().filter((p) => p.is_published))
    setCategories(getStoredCategories().filter((c) => c.is_published))
  }, [])

  const filteredProducts = selectedCatId === 'all'
    ? products
    : products.filter((p) => p.category_id === selectedCatId)

  const handleQuoteClick = (product: ProductItem) => {
    if (onAddToQuote) {
      onAddToQuote(product)
    }
    setAddedIds((prev) => ({ ...prev, [product.id]: true }))
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }))
    }, 2000)
  }

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* SECTION TITLE */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-red-50 text-[#B92025] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-red-100">
            <ShieldCheck className="w-4 h-4 text-[#B92025]" />
            <span>Featured Product Catalog</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Premium Medical & Surgical Catalog
          </h2>
          <p className="text-slate-500 text-sm">
            Discover our high-demand healthcare products manufactured under strict ISO 13485 quality controls.
          </p>
        </div>

        {/* CATEGORY FILTER PILLS */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          <button
            onClick={() => setSelectedCatId('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCatId === 'all'
                ? 'bg-[#B92025] text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Products ({products.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCatId(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCatId === cat.id
                  ? 'bg-[#B92025] text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* IMAGE HEADER */}
              <div className="relative aspect-[4/3] w-full bg-slate-50 overflow-hidden p-4">
                <SafeProductImage
                  src={prod.featured_image || '/images/extracted/image_7.png'}
                  alt={prod.title}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* BADGES */}
                <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                  {prod.is_featured && (
                    <span className="bg-[#B92025] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow">
                      Featured
                    </span>
                  )}
                  <span className="bg-slate-900 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow">
                    ISO Certified
                  </span>
                </div>

                {/* QUICK VIEW TRIGGER */}
                <button
                  onClick={() => setSelectedProductForModal(prod)}
                  className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-slate-800 p-2.5 rounded-xl shadow-lg border border-slate-200 transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                  title="Quick View Details"
                >
                  <Eye className="w-4 h-4 text-[#B92025]" />
                </button>
              </div>

              {/* PRODUCT INFO */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-[11px] font-bold text-[#B92025] uppercase tracking-wider mb-1">
                    {prod.category_name || 'Medical Supply'} {prod.sku ? `• ${prod.sku}` : ''}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#B92025] transition-colors leading-snug">
                    {prod.title}
                  </h3>
                  <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                    {prod.short_description}
                  </p>
                </div>

                {/* ACTION BUTTONS */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => handleQuoteClick(prod)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all shadow ${
                      addedIds[prod.id]
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#B92025] hover:bg-[#96161B] text-white'
                    }`}
                  >
                    {addedIds[prod.id] ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Quote!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-white" />
                        <span>Add to Quote</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedProductForModal(prod)}
                    className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-[#B92025] hover:bg-slate-50 transition-colors"
                    title="View Full Specs"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* VIEW ALL FOOTER CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-[#B92025] hover:bg-[#96161B] text-white px-8 py-3.5 rounded-xl text-sm font-bold shadow-lg transition-all"
          >
            <span>View Complete Product Line</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* QUICK VIEW MODAL */}
      {selectedProductForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-slate-200">
            <button
              onClick={() => setSelectedProductForModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-xl font-bold w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="relative aspect-square bg-slate-50 rounded-2xl overflow-hidden p-4 border border-slate-100">
                <SafeProductImage
                  src={selectedProductForModal.featured_image || '/images/extracted/image_7.png'}
                  alt={selectedProductForModal.title}
                  fill
                  className="object-contain p-2"
                />
              </div>

              <div className="space-y-4">
                <div className="text-xs font-bold text-[#B92025] uppercase tracking-wider">
                  {selectedProductForModal.category_name} • SKU: {selectedProductForModal.sku}
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {selectedProductForModal.title}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {selectedProductForModal.full_description || selectedProductForModal.short_description}
                </p>

                {selectedProductForModal.features && selectedProductForModal.features.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <div className="text-xs font-bold text-slate-800">Key Features:</div>
                    {selectedProductForModal.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-4 flex items-center gap-3">
                  <button
                    onClick={() => {
                      handleQuoteClick(selectedProductForModal)
                      setSelectedProductForModal(null)
                    }}
                    className="flex-1 bg-[#B92025] hover:bg-[#96161B] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Request Quotation</span>
                  </button>
                  <Link
                    href={`/contact?product=${encodeURIComponent(selectedProductForModal.title)}`}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl text-xs transition-colors"
                  >
                    Direct Inquiry
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
