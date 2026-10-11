'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react'
import { ProductItem } from '@/src/types/product'

interface CartQuoteModalProps {
  isOpen: boolean
  onClose: () => void
  quoteItems: ProductItem[]
  onRemoveItem: (id: string) => void
  onClearAll: () => void
}

export default function CartQuoteModal({
  isOpen,
  onClose,
  quoteItems,
  onRemoveItem,
  onClearAll,
}: CartQuoteModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-fade-in flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl border-l border-slate-200">
        {/* HEADER */}
        <div className="p-4 sm:p-6 bg-[#B92025] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-white" />
            <h3 className="font-bold text-base">Quotation Basket ({quoteItems.length})</h3>
          </div>
          <button onClick={onClose} className="text-slate-200 hover:text-white p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* ITEMS LIST */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {quoteItems.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-3">
              <ShoppingBag className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">Your Quotation Basket is Empty</p>
              <p className="text-xs max-w-xs mx-auto">
                Browse our certified products and click &quot;Add to Quote&quot; to build your official quotation list.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
                <span>Selected Items for Official Quote</span>
                <button
                  onClick={onClearAll}
                  className="text-red-600 hover:underline font-semibold"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-3">
                {quoteItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200"
                  >
                    <div className="relative w-14 h-14 bg-white rounded-xl overflow-hidden shrink-0 border border-slate-200">
                      <Image
                        src={item.featured_image || '/images/extracted/image_7.png'}
                        alt={item.title}
                        fill
                        className="object-contain p-1"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold text-[#B92025] uppercase tracking-wider">
                        SKU: {item.sku || 'N/A'}
                      </div>
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {item.category_name}
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        {quoteItems.length > 0 && (
          <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Official pricing & specs will be dispatched within 24h.</span>
            </div>

            <Link
              href={`/contact?items=${encodeURIComponent(quoteItems.map((i) => i.title).join(', '))}`}
              onClick={onClose}
              className="w-full bg-[#B92025] hover:bg-[#96161B] text-white font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <span>Proceed to Submit Quotation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
