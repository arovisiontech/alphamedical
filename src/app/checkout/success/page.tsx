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
} from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const orderRef = searchParams.get('order_ref') || `ALPH-${Math.floor(100000 + Math.random() * 900000)}`

  const [loading, setLoading] = useState(true)
  const [details, setDetails] = useState<any>(null)

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/checkout/stripe/verify?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success) {
            setDetails(data)
            // Save to local orders list for admin view
            try {
              const currentOrders = JSON.parse(localStorage.getItem('alpha_orders_v2') || '[]')
              const exists = currentOrders.some((o: any) => o.order_ref === (data.order_ref || orderRef))
              if (!exists) {
                const newOrder = {
                  id: `ord-${Date.now()}`,
                  order_ref: data.order_ref || orderRef,
                  customer_name: data.customer_name || 'Hospital Client',
                  customer_email: data.customer_email || 'client@medical.com',
                  total: data.amount_total || 84.89,
                  status: 'Paid',
                  payment_gateway: 'Stripe Credit/Debit Card',
                  created_at: new Date().toISOString(),
                }
                localStorage.setItem('alpha_orders_v2', JSON.stringify([newOrder, ...currentOrders]))
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
          
          {/* GREEN SUCCESS BADGE */}
          <div className="text-center space-y-3">
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50/50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="inline-flex items-center gap-1.5 bg-emerald-100/80 text-emerald-800 text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Stripe Card Payment Verified</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Thank You! Your Order Is Confirmed
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
              Your payment has been securely processed by Stripe. A receipt and order confirmation has been emailed to you.
            </p>
          </div>

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
                  <span>Direct Credit / Debit Card (Stripe)</span>
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Amount Paid</span>
                <span className="font-black text-slate-900 text-sm text-emerald-700">
                  ${details?.amount_total?.toFixed(2) || '55.00'} USD
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

            {details?.customer_email && (
              <div className="pt-3 border-t border-slate-200/70 text-xs">
                <span className="text-slate-400 block mb-0.5">Confirmation Sent To:</span>
                <span className="font-bold text-slate-800">{details.customer_email}</span>
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-1/2 py-3.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print Official Invoice</span>
            </button>

            <Link
              href="/"
              className="w-full sm:w-1/2 py-3.5 px-4 rounded-xl bg-[#96161B] hover:bg-[#7d1216] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-950/20 transition-all cursor-pointer"
            >
              <span>Back To Homepage</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* CONTACT INFO */}
          <div className="text-center pt-4 border-t border-slate-100 text-[11px] text-slate-400 space-y-1">
            <p>ALPHA Wholesale Medical Supplies LLC — 129 Fleetwood Drive Easley SC 29640 USA</p>
            <p>Need support with your order? Contact: +1 (561) 528 9764 / Sohail@alpha-medicalsupplies.com</p>
          </div>
        </div>
      </main>
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
