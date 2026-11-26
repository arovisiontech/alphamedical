'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Search,
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react'
import TopBar from '@/src/components/public/TopBar'
import HeaderNav from '@/src/components/public/HeaderNav'
import MainRedNavbar from '@/src/components/public/MainRedNavbar'
import PublicFooter from '@/src/components/public/PublicFooter'

export default function TrackOrderPage() {
  const [orderInput, setOrderInput] = useState('')
  const [ordersList, setOrdersList] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState('Changed my mind')
  const [isCancelling, setIsCancelling] = useState(false)
  const [isConfirmingProceed, setIsConfirmingProceed] = useState(false)

  useEffect(() => {
    const loadOrders = async () => {
      let local: any[] = []
      try {
        const raw = localStorage.getItem('alpha_orders_records')
        if (raw) {
          const parsed = JSON.parse(raw)
          if (Array.isArray(parsed)) local = parsed
        }
      } catch (e) {}

      try {
        const res = await fetch('/api/orders?t=' + Date.now(), { cache: 'no-store' })
        const serverOrders = await res.json()
        if (Array.isArray(serverOrders) && serverOrders.length > 0) {
          const map = new Map<string, any>()
          serverOrders.forEach((o: any) => o && o.id && map.set(o.id, o))
          local.forEach((o: any) => o && o.id && !map.has(o.id) && map.set(o.id, o))
          local = Array.from(map.values())
        }
      } catch (e) {}

      setOrdersList(local)
      const params = new URLSearchParams(window.location.search)
      const refParam = (params.get('ref') || '').trim().toUpperCase()
      if (refParam) {
        setOrderInput(refParam)
        const altRef = refParam.replace('ALPH-', 'ORD-')
        const matched = local.find(
          (o) =>
            o.id?.toUpperCase() === refParam ||
            o.id?.toUpperCase() === altRef ||
            o.orderRef?.toUpperCase() === refParam
        )
        if (matched) {
          setSelectedOrder(matched)
          return
        }
      }
      if (local.length > 0 && !selectedOrder) {
        setSelectedOrder(local[0])
      }
    }

    loadOrders()
  }, [])

  const handleConfirmProceed = async () => {
    if (!selectedOrder) return
    setIsConfirmingProceed(true)
    const targetId = selectedOrder.id
    const updatedOrder = {
      ...selectedOrder,
      customerDecision: 'Proceed Confirmed by Customer',
      confirmedProceedAt: new Date().toISOString(),
    }
    try {
      setSelectedOrder(updatedOrder)
      const nextList = ordersList.map((o) => (o.id === targetId ? updatedOrder : o))
      setOrdersList(nextList)
      localStorage.setItem('alpha_orders_records', JSON.stringify(nextList))
      window.dispatchEvent(new Event('alpha_orders_updated'))
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'confirm_proceed', id: targetId }),
      })
    } catch (e) {}
    setIsConfirmingProceed(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchError(null)
    const q = orderInput.trim().toUpperCase()
    if (!q) return

    const alt = q.replace('ALPH-', 'ORD-')
    const found = ordersList.find(
      (o) =>
        o.id?.toUpperCase() === q ||
        o.id?.toUpperCase() === alt ||
        o.orderRef?.toUpperCase() === q
    )

    if (found) {
      setSelectedOrder(found)
    } else {
      setSelectedOrder(null)
      setSearchError(`No order found with reference "${orderInput.trim()}". Please check your Order ID (e.g. ALPH-123456).`)
    }
  }

  const handleConfirmCancel = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrder) return
    setIsCancelling(true)

    const targetId = selectedOrder.id
    const updatedOrder = {
      ...selectedOrder,
      status: 'Cancelled',
      paymentStatus: 'Cancelled / Refunded',
      cancelReason: cancelReason.trim() || 'Cancelled by customer',
      cancelledAt: new Date().toISOString(),
    }

    try {
      setSelectedOrder(updatedOrder)
      const nextList = ordersList.map((o) => (o.id === targetId ? updatedOrder : o))
      setOrdersList(nextList)
      localStorage.setItem('alpha_orders_records', JSON.stringify(nextList))
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
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-900">
      <TopBar />
      <HeaderNav />
      <MainRedNavbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Track or Cancel Your Order
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Enter your Order Reference (e.g. ALPH-123456) to check status or cancel before dispatch.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#96161B] hover:underline shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Shop</span>
          </Link>
        </div>

        {/* SEARCH BAR */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={orderInput}
              onChange={(e) => setOrderInput(e.target.value)}
              placeholder="Enter Order Reference (e.g. ALPH-123456 or ORD-123456)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm outline-none focus:border-[#96161B] focus:bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="bg-[#96161B] hover:bg-[#7d1216] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider cursor-pointer shrink-0"
          >
            Find Order
          </button>
        </form>

        {searchError && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-xs font-bold">
            {searchError}
          </div>
        )}

        {/* SELECTED ORDER DETAILS */}
        {selectedOrder && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase block">
                  Order Reference
                </span>
                <span className="font-mono font-black text-lg text-[#96161B]">
                  {selectedOrder.orderRef || selectedOrder.id}
                </span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  Placed on {selectedOrder.dateTime}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase ${
                    selectedOrder.status === 'Cancelled'
                      ? 'bg-red-100 text-red-800'
                      : selectedOrder.status === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedOrder.status === 'Dispatched'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {selectedOrder.status === 'Cancelled' && <XCircle className="w-3.5 h-3.5" />}
                  {selectedOrder.status === 'Delivered' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {selectedOrder.status === 'Dispatched' && <Truck className="w-3.5 h-3.5" />}
                  {selectedOrder.status === 'Processing' && <Clock className="w-3.5 h-3.5" />}
                  <span>{selectedOrder.status}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-400 block mb-0.5">Customer & Contact</span>
                <span className="font-bold text-slate-900 block">{selectedOrder.customerName}</span>
                <span className="text-slate-600 block">{selectedOrder.customerEmail}</span>
                <span className="text-slate-600 block">{selectedOrder.customerPhone}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Delivery Address</span>
                <span className="font-semibold text-slate-800 block">
                  {selectedOrder.customerAddress}
                </span>
                <span className="text-slate-600 block">
                  {[selectedOrder.customerCity, selectedOrder.customerState, selectedOrder.customerZip].filter(Boolean).join(', ')}
                </span>
                <span className="text-slate-600 block">{selectedOrder.customerCountry}</span>
              </div>
            </div>

            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div className="space-y-2 text-xs">
                <span className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-[#96161B]" />
                  <span>Ordered Items</span>
                </span>
                {selectedOrder.items.map((it: any) => (
                  <div
                    key={it.id}
                    className="flex items-center justify-between bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{it.title}</span>
                      <span className="text-[11px] text-slate-500">
                        SKU: {it.sku} • Size: {it.size || 'Standard'} • Qty: {it.quantity}
                      </span>
                    </div>
                    <span className="font-black text-slate-900">
                      ${Number(it.totalPrice || 0).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
              <div className="text-sm font-black text-slate-900">
                Total Paid:{' '}
                <span className="text-[#96161B] text-lg">
                  ${Number(selectedOrder.total || 0).toFixed(2)} USD
                </span>
              </div>

              {selectedOrder.status !== 'Cancelled' && selectedOrder.status !== 'Delivered' ? (
                <div className="flex flex-wrap items-center gap-2.5">
                  {selectedOrder.customerDecision !== 'Proceed Confirmed by Customer' ? (
                    <button
                      type="button"
                      disabled={isConfirmingProceed}
                      onClick={handleConfirmProceed}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isConfirmingProceed ? 'Confirming...' : 'Confirm & Proceed Order'}</span>
                    </button>
                  ) : (
                    <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-2 rounded-xl font-bold text-xs inline-flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Proceed Confirmed</span>
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsCancelModalOpen(true)}
                    className="bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Cancel This Order</span>
                  </button>
                </div>
              ) : selectedOrder.status === 'Cancelled' ? (
                <span className="text-xs font-bold text-red-600">
                  Cancelled ({selectedOrder.cancelReason || 'Cancelled by customer'})
                </span>
              ) : null}
            </div>
          </div>
        )}
      </main>

      {isCancelModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900">
                  Cancel Order {selectedOrder.orderRef || selectedOrder.id}?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Are you sure you want to cancel this order? Dispatch will be stopped immediately.
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmCancel} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Cancellation Reason
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

              <div className="flex items-center gap-3">
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

      <PublicFooter />
    </div>
  )
}
