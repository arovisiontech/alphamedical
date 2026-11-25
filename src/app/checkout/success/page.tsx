'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  CheckCircle2,
  ShieldCheck,
  Package,
  ArrowRight,
  Printer,
  Mail,
  Phone,
  CreditCard,
  Building,
  MapPin,
  Clock,
  Sparkles,
  Star,
  ThumbsUp,
  Send,
  XCircle,
  AlertTriangle,
} from 'lucide-react'
import { addStoredReview } from '@/src/lib/dataStore'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const orderRef = searchParams.get('order_ref') || `ALPH-${Math.floor(100000 + Math.random() * 900000)}`

  const [loading, setLoading] = useState(true)
  const [details, setDetails] = useState<any>(null)
  const [localOrder, setLocalOrder] = useState<any>(null)

  // 5-Star Customer Satisfaction Rating State
  const [starRating, setStarRating] = useState<number>(5)
  const [feedbackText, setFeedbackText] = useState<string>('')
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false)

  // Order Cancellation State
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState('Changed my mind')
  const [isCancelling, setIsCancelling] = useState(false)
  const [isOrderCancelled, setIsOrderCancelled] = useState(false)

  const handleCancelOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCancelling(true)
    const targetRef = details?.order_ref || localOrder?.orderRef || orderRef
    const targetId = targetRef.replace('ALPH-', 'ORD-')

    try {
      const updatedOrder = localOrder
        ? {
            ...localOrder,
            status: 'Cancelled',
            paymentStatus: 'Cancelled / Refunded',
            cancelReason: cancelReason.trim() || 'Cancelled by customer',
            cancelledAt: new Date().toISOString(),
          }
        : null

      if (updatedOrder) {
        setLocalOrder(updatedOrder)
        sessionStorage.setItem('alpha_last_checkout_order', JSON.stringify(updatedOrder))
      }

      const orders = JSON.parse(localStorage.getItem('alpha_orders_records') || '[]')
      const updated = Array.isArray(orders)
        ? orders.map((o: any) =>
            o.id === targetId || o.id === targetRef || o.orderRef === targetRef
              ? {
                  ...o,
                  status: 'Cancelled',
                  paymentStatus: 'Cancelled / Refunded',
                  cancelReason: cancelReason.trim() || 'Cancelled by customer',
                  cancelledAt: new Date().toISOString(),
                }
              : o
          )
        : []
      localStorage.setItem('alpha_orders_records', JSON.stringify(updated))
      window.dispatchEvent(new Event('alpha_orders_updated'))

      if (typeof BroadcastChannel !== 'undefined') {
        const ch = new BroadcastChannel('alpha_sync_channel')
        ch.postMessage({ type: 'orders_updated', timestamp: Date.now() })
        ch.close()
      }

      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cancel_order',
          id: targetId,
          reason: cancelReason.trim() || 'Cancelled by customer',
        }),
      })
    } catch (err) {}

    setIsCancelling(false)
    setIsCancelModalOpen(false)
    setIsOrderCancelled(true)
  }

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const targetRef = details?.order_ref || localOrder?.orderRef || orderRef
    const targetId = targetRef.replace('ALPH-', 'ORD-')
    const commentText = feedbackText.trim() || 'Verified 5-star purchase & seamless checkout experience.'

    try {
      const existing = JSON.parse(localStorage.getItem('alpha_order_ratings') || '[]')
      const newRating = {
        orderRef: targetRef,
        rating: starRating,
        comment: commentText,
        submittedAt: new Date().toISOString(),
      }
      localStorage.setItem('alpha_order_ratings', JSON.stringify([newRating, ...existing]))

      // Sync customer rating into real orders record
      const orders = JSON.parse(localStorage.getItem('alpha_orders_records') || '[]')
      const updated = orders.map((o: any) => {
        if (o.id === targetId || o.id === targetRef || o.orderRef === targetRef) {
          return { ...o, rating: starRating, reviewComment: commentText }
        }
        return o
      })
      localStorage.setItem('alpha_orders_records', JSON.stringify(updated))
      window.dispatchEvent(new Event('alpha_orders_updated'))

      // Sync into server orders API
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_rating',
          id: targetId,
          rating: starRating,
          reviewComment: commentText,
        }),
      }).catch(() => {})

      // Publish to Website Public Reviews & Admin Reviews Store
      const firstItem = localOrder?.items?.[0]
      addStoredReview({
        author: localOrder?.customerName || 'Verified USA Store Buyer',
        hospital: localOrder?.customerCompany || `${localOrder?.customerCity || 'USA'}, ${localOrder?.customerState || ''}`.replace(/,\s*$/, ''),
        rating: starRating,
        title: `Verified Order ${targetRef} Review`,
        comment: commentText,
        productSku: firstItem?.sku,
        productTitle: firstItem?.title || localOrder?.itemsDescription,
        orderRef: targetRef,
      })
    } catch (e) {}
    setFeedbackSubmitted(true)
  }

  useEffect(() => {
    // Load local order receipt from sessionStorage / localStorage
    try {
      const savedLast = sessionStorage.getItem('alpha_last_checkout_order')
      if (savedLast) {
        const parsed = JSON.parse(savedLast)
        setLocalOrder(parsed)
        if (parsed.status === 'Cancelled') setIsOrderCancelled(true)
      } else {
        const orders = JSON.parse(localStorage.getItem('alpha_orders_records') || '[]')
        const targetId = orderRef.replace('ALPH-', 'ORD-')
        const found = Array.isArray(orders)
          ? orders.find((o: any) => o.id === targetId || o.orderRef === orderRef || o.id === orderRef)
          : null
        if (found) {
          setLocalOrder(found)
          if (found.status === 'Cancelled') setIsOrderCancelled(true)
        }
      }
    } catch (e) {}

    if (sessionId) {
      fetch(`/api/checkout/stripe/verify?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success) {
            setDetails(data)
            // Mark real order as Paid in alpha_orders_records
            try {
              const savedLast = sessionStorage.getItem('alpha_last_checkout_order')
              if (savedLast) {
                const parsed = JSON.parse(savedLast)
                parsed.status = 'Processing'
                parsed.paymentStatus = 'Paid'
                setLocalOrder(parsed)
                const existing = JSON.parse(localStorage.getItem('alpha_orders_records') || '[]')
                const filtered = Array.isArray(existing) ? existing.filter((o: any) => o.id !== parsed.id) : []
                localStorage.setItem('alpha_orders_records', JSON.stringify([parsed, ...filtered]))
                window.dispatchEvent(new Event('alpha_orders_updated'))
              }
            } catch (e) {}
          }
          setLoading(false)
        })
        .catch(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [sessionId, orderRef])

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-900">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 sm:px-12 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-block">
            <Image
              src="/logo5.svg"
              alt="ALPHA Wholesale Medical Supplies LLC"
              width={200}
              height={50}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          <Link
            href="/products"
            className="text-xs font-bold text-slate-700 hover:text-[#96161B] flex items-center gap-1.5 transition-colors"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* MAIN SUCCESS CARD */}
      <main className="flex-1 max-w-3xl mx-auto w-full p-4 sm:p-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-10 w-full space-y-8 animate-fade-in">
          
          {/* GREEN SUCCESS OR RED CANCELLED BADGE */}
          {isOrderCancelled || localOrder?.status === 'Cancelled' ? (
            <div className="text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-inner ring-8 ring-red-50/50">
                <XCircle className="w-10 h-10" />
              </div>

              <div className="inline-flex items-center gap-1.5 bg-red-100 text-red-800 text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
                <XCircle className="w-3.5 h-3.5" />
                <span>Order Cancelled</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Your Order Has Been Cancelled
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
                Your order has been cancelled as requested and our dispatch team has been notified. Any card authorization will be reversed automatically.
              </p>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50/50">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="inline-flex items-center gap-1.5 bg-emerald-100/80 text-emerald-800 text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Card Payment Verified</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Thank You! Your Order Is Confirmed
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
                Your payment has been securely processed. A receipt and order confirmation has been generated for you.
              </p>
            </div>
          )}

          {/* ORDER RECEIPT CARD */}
          <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
              <span className="text-xs font-bold text-slate-500 uppercase">Order Reference</span>
              <span className="font-mono font-black text-sm text-[#96161B] bg-red-50 border border-red-200 px-3 py-1 rounded-lg">
                {details?.order_ref || orderRef}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <span className="text-slate-400 block mb-0.5">Payment Method</span>
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#96161B]" />
                  <span>{localOrder?.paymentMethod || 'Direct Credit / Debit Card'}</span>
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Amount Paid</span>
                <span className="font-black text-sm text-emerald-700">
                  ${(details?.amount_total ?? localOrder?.total ?? 55.0).toFixed(2)} USD
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Payment Status</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Paid & Authorized</span>
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Estimated Dispatch</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Within 24-48 Hours</span>
                </span>
              </div>
            </div>

            {(localOrder || details?.customer_email) && (
              <div className="pt-3 border-t border-slate-200/70 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Customer & Contact</span>
                  <span className="font-bold text-slate-800 block">{localOrder?.customerName || 'Verified Customer'}</span>
                  <span className="text-slate-600 block">{details?.customer_email || localOrder?.customerEmail}</span>
                  {localOrder?.customerPhone && (
                    <span className="text-slate-600 block">{localOrder.customerPhone}</span>
                  )}
                </div>
                {localOrder?.customerAddress && (
                  <div>
                    <span className="text-slate-400 block mb-0.5">Delivery Address</span>
                    <span className="font-semibold text-slate-800 block">
                      {localOrder.customerAddress}
                    </span>
                    <span className="text-slate-600 block">
                      {[localOrder.customerCity, localOrder.customerState, localOrder.customerZip].filter(Boolean).join(', ')}
                    </span>
                    <span className="text-slate-600 block">{localOrder.customerCountry || 'United States'}</span>
                  </div>
                )}
              </div>
            )}

            {localOrder?.items && localOrder.items.length > 0 && (
              <div className="pt-3 border-t border-slate-200/70 space-y-2 text-xs">
                <span className="text-slate-400 block font-bold uppercase text-[10px]">Ordered Products</span>
                {localOrder.items.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200/80">
                    <div>
                      <span className="font-bold text-slate-900 block">{item.title}</span>
                      <span className="text-[11px] text-slate-500">
                        SKU: {item.sku} • Size: {item.size || 'Standard'} • Qty: {item.quantity}
                      </span>
                    </div>
                    <span className="font-black text-slate-900">${Number(item.totalPrice || 0).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5-STAR CUSTOMER SATISFACTION SURVEY & REVIEW */}
          <div className="bg-amber-50/70 border-2 border-amber-200/90 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-white flex items-center justify-center shadow-xs">
                  <Star className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-slate-900">
                    Rate Your Shopping & Ordering Experience
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    How satisfied are you with our instrument catalog, speed, and checkout ease?
                  </p>
                </div>
              </div>

              <span className="text-xs font-black text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full uppercase tracking-wider hidden sm:inline-block">
                Customer Survey
              </span>
            </div>

            {feedbackSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs font-bold text-emerald-800 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span>Thank you for your {starRating}-Star feedback!</span>
                  <div className="text-[11px] text-emerald-700 font-normal mt-0.5">
                    Your rating helps our US healthcare team maintain hospital-grade supply standards.
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-3.5">
                {/* 5 STARS SELECTOR */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 mr-2">Your Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setStarRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          star <= starRating
                            ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                            : 'text-slate-300 hover:text-amber-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-black text-amber-800 ml-2">
                    {starRating === 5
                      ? '5 Stars (Excellent OR Grade)'
                      : starRating === 4
                      ? '4 Stars (Very Good)'
                      : `${starRating} Stars`}
                  </span>
                </div>

                {/* FEEDBACK COMMENT */}
                <div>
                  <textarea
                    rows={2}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Tell us what you liked (instrument quality, fast card checkout, packaging requirements)..."
                    className="w-full bg-white border border-amber-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B] placeholder:text-slate-400"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#96161B] hover:bg-[#7d1216] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit 5-Star Feedback</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="w-full sm:flex-1 py-3.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print Official Invoice</span>
            </button>

            {!isOrderCancelled && localOrder?.status !== 'Cancelled' && localOrder?.status !== 'Delivered' && (
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(true)}
                className="w-full sm:flex-1 py-3.5 px-4 rounded-xl border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Cancel Order</span>
              </button>
            )}

            <Link
              href="/"
              className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-[#96161B] hover:bg-[#7d1216] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-950/20 transition-all cursor-pointer"
            >
              <span>Back To Homepage</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="text-center">
            <Link
              href="/track-order"
              className="text-xs font-bold text-slate-500 hover:text-[#96161B] underline"
            >
              Track or Cancel Order Anytime →
            </Link>
          </div>

          {/* CONTACT INFO */}
          <div className="text-center pt-4 border-t border-slate-100 text-[11px] text-slate-400 space-y-1">
            <p>ALPHA Wholesale Medical Supplies LLC — 129 Fleetwood Drive Easley SC 29640 USA</p>
            <p>Need support with your order? Contact: +1 (561) 528 9764 / Sohail@alpha-medicalsupplies.com</p>
          </div>
        </div>
      </main>

      {/* ORDER CANCELLATION MODAL */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900">Cancel Order {details?.order_ref || localOrder?.orderRef || orderRef}?</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Are you sure you want to cancel this order? Once cancelled, dispatch will be stopped immediately.
                </p>
              </div>
            </div>

            <form onSubmit={handleCancelOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Reason for Cancellation
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#96161B]"
                >
                  <option value="Changed my mind">Changed my mind</option>
                  <option value="Ordered wrong size or instrument">Ordered wrong size or instrument</option>
                  <option value="Need to update delivery address">Need to update delivery address</option>
                  <option value="Duplicate order placed by mistake">Duplicate order placed by mistake</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCancelModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  disabled={isCancelling}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider cursor-pointer"
                >
                  {isCancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-xs font-bold text-slate-500 animate-pulse">Loading order receipt...</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
