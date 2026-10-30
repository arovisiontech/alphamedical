'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  X,
  Trash2,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  CreditCard,
  Building,
  CheckCircle2,
  Lock,
} from 'lucide-react'
import { ProductItem } from '@/src/types/product'
import { useGeoLocation } from '@/src/context/GeoLocationContext'
import SafeProductImage from '@/src/components/public/SafeProductImage'

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
  const { isUsaStore, settings, openInquiryModal } = useGeoLocation()
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart')
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'usa_bank' | 'card'>('paypal')
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  if (!isOpen) return null

  // Calculate cart total
  const subtotal = quoteItems.reduce((acc, item) => acc + (item.price || 55.95), 0)
  const shipping = subtotal > 150 ? 0 : 15.0
  const total = subtotal + shipping

  const handleStartCheckout = () => {
    onClose()
    if (typeof window !== 'undefined') {
      window.location.href = '/checkout'
    }
  }

  const handleProcessOrder = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    const generated = `ALPHA-US-${Math.floor(100000 + Math.random() * 900000)}`
    setOrderNumber(generated)

    setTimeout(() => {
      setIsProcessing(false)
      setCheckoutStep('success')
      onClearAll()
    }, 1200)
  }

  const handleInternationalInquiry = () => {
    onClose()
    const itemNames = quoteItems.map((i) => i.title).join(', ')
    openInquiryModal({
      title: `Multi-Item Quotation (${quoteItems.length} Products): ${itemNames}`,
      sku: 'BULK-RFQ',
    })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-fade-in flex justify-end font-sans">
      <div className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl border-l border-slate-200">
        {/* HEADER */}
        <div className="p-4 sm:p-5 bg-[#96161B] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-white" />
            <div>
              <div className="text-[10px] uppercase font-bold text-red-200 tracking-wider">
                {isUsaStore ? '🇺🇸 USA Online Store' : '🌐 International B2B'}
              </div>
              <h3 className="font-extrabold text-base leading-tight">
                {isUsaStore ? `Shopping Cart (${quoteItems.length})` : `Quotation Basket (${quoteItems.length})`}
              </h3>
            </div>
          </div>
          <button
            onClick={() => {
              setCheckoutStep('cart')
              onClose()
            }}
            className="text-slate-200 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ITEMS LIST & VIEWS */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {checkoutStep === 'success' ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-black text-slate-900">Order Placed Successfully!</h4>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                Thank you for your purchase. Your USA order reference is{' '}
                <span className="font-bold text-[#96161B]">{orderNumber}</span>. Tracking details and
                commercial invoice have been dispatched to your email.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setCheckoutStep('cart')
                    onClose()
                  }}
                  className="bg-[#96161B] hover:bg-[#7d1216] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : checkoutStep === 'checkout' ? (
            /* USA CHECKOUT FORM */
            <form onSubmit={handleProcessOrder} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Payment Method
                </span>
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="text-xs text-red-600 hover:underline font-semibold"
                >
                  ← Back to Cart
                </button>
              </div>

              {/* PAYMENT SELECTOR */}
              <div className="space-y-2">
                {/* PAYPAL */}
                {settings.paypal_enabled && (
                  <label
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'paypal'
                        ? 'border-[#96161B] bg-red-50/50 ring-1 ring-[#96161B]'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === 'paypal'}
                        onChange={() => setPaymentMethod('paypal')}
                        className="text-[#96161B]"
                      />
                      <div>
                        <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                          <span>PayPal & Pay in 4</span>
                          <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.2 rounded">
                            PayPal
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Instant checkout with your PayPal balance or bank
                        </div>
                      </div>
                    </div>
                  </label>
                )}

                {/* USA BANK ACH */}
                {settings.usa_bank_enabled && settings.ach_direct_debit_enabled && (
                  <label
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'usa_bank'
                        ? 'border-[#96161B] bg-red-50/50 ring-1 ring-[#96161B]'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === 'usa_bank'}
                        onChange={() => setPaymentMethod('usa_bank')}
                        className="text-[#96161B]"
                      />
                      <div>
                        <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-700" />
                          <span>USA Bank Direct Transfer (ACH)</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Chase, Bank of America, Wells Fargo & US credit unions
                        </div>
                      </div>
                    </div>
                  </label>
                )}

                {/* CREDIT CARD */}
                <label
                  className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#96161B] bg-red-50/50 ring-1 ring-[#96161B]'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="pay"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="text-[#96161B]"
                    />
                    <div>
                      <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-slate-700" />
                        <span>Credit / Debit Card (USA)</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Visa, Mastercard, Amex, Discover
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              {/* QUICK USA SHIPPING ADDRESS */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  USA Delivery Details
                </div>
                <input
                  type="text"
                  required
                  placeholder="Facility / Hospital Name"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-[#96161B]"
                />
                <input
                  type="text"
                  required
                  placeholder="Street Address, Suite / Unit"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-[#96161B]"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="City, State (e.g. Houston, TX)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-[#96161B]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Zip Code"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-[#96161B]"
                  />
                </div>
              </div>

              {/* ORDER TOTAL BREAKDOWN */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>USA Medical Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-1 border-t border-slate-200">
                  <span>Total Due</span>
                  <span className="text-[#96161B]">${total.toFixed(2)} USD</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#96161B] hover:bg-[#7d1216] disabled:opacity-50 text-white font-black py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-950/20 active:scale-95 transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>{isProcessing ? 'Processing Securely...' : `Pay $${total.toFixed(2)} USD`}</span>
              </button>
            </form>
          ) : quoteItems.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-3">
              <ShoppingBag className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">Your Basket is Empty</p>
              <p className="text-xs max-w-xs mx-auto">
                {isUsaStore
                  ? 'Browse products and click "Add To Cart" to purchase online.'
                  : 'Browse certified products and add them to your inquiry basket for an official quotation.'}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
                <span>
                  {isUsaStore ? 'Products in USA Store Cart' : 'Selected Items for Export Quote'}
                </span>
                <button onClick={onClearAll} className="text-red-600 hover:underline font-semibold">
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
                      <SafeProductImage
                        src={item.featured_image || '/images/products/image-399.png'}
                        alt={item.title}
                        fill
                        className="object-contain p-1"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold text-[#96161B] uppercase tracking-wider">
                        SKU: {item.sku || 'N/A'}
                      </div>
                      <div className="text-xs font-bold text-slate-900 truncate">{item.title}</div>
                      <div className="text-[11px] font-bold text-slate-700">
                        ${(item.price || 55.95).toFixed(2)} USD
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
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
        {quoteItems.length > 0 && checkoutStep === 'cart' && (
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 space-y-3">
            {isUsaStore ? (
              /* USA STORE FOOTER: TOTAL + CHECKOUT BUTTON */
              <>
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Cart Subtotal</span>
                  <span className="text-base text-[#96161B] font-black">${subtotal.toFixed(2)} USD</span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>USA Orders: PayPal, Credit Card & USA Bank ACH Supported.</span>
                </div>

                <button
                  type="button"
                  onClick={handleStartCheckout}
                  className="w-full bg-[#96161B] hover:bg-[#7d1216] text-white font-extrabold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/20 active:scale-95 cursor-pointer glow-btn-red shimmer-effect"
                >
                  <Lock className="w-4 h-4" />
                  <span>Proceed to USA Checkout (${subtotal.toFixed(2)})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              /* INTERNATIONAL INQUIRY FOOTER */
              <>
                <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>
                    International B2B Order: Official CIF/FOB quote dispatched within 24h.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleInternationalInquiry}
                  className="w-full bg-[#96161B] hover:bg-[#7d1216] text-white font-extrabold py-3.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer glow-btn-red shimmer-effect"
                >
                  <span>Submit Official Quotation Request</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
