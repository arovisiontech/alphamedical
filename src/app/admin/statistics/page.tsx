'use client'

import React, { useState, useEffect } from 'react'
import AdminShell from '@/src/components/admin/AdminShell'
import {
  Package,
  TrendingUp,
  DollarSign,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Filter,
  Download,
  Search,
  ArrowUpDown,
  ShoppingBag,
} from 'lucide-react'
import { getStoredProducts } from '@/src/lib/dataStore'

interface MonthlyRow {
  month: string
  discounts: number
  products: number
  shipping: number
  tax: number
  grandTotal: number
}

interface OrderItemRecord {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  productCount: number
  itemsDescription: string
  dateTime: string
  month: string
  year: number
  status: 'Dispatched' | 'Delivered' | 'Failed' | 'Processing'
  subtotal: number
  shipping: number
  total: number
}

const INITIAL_ORDERS_DATA: OrderItemRecord[] = [
  {
    id: 'ORD-98421',
    customerName: 'St. Jude Children’s Research Hospital',
    customerEmail: 'procurement@stjude.org',
    customerPhone: '+1 (901) 595-3300',
    productCount: 14,
    itemsDescription: 'Mayo-Hegar Needle Holders, Iris Scissors 11.5cm, Adson Tissue Forceps',
    dateTime: '2026-11-02 14:32:10',
    month: 'November',
    year: 2026,
    status: 'Dispatched',
    subtotal: 1450.00,
    shipping: 45.00,
    total: 1495.00,
  },
  {
    id: 'ORD-98390',
    customerName: 'Dr. Tariq Mahmood (City Hospital ICU)',
    customerEmail: 'dr.tariq@cityhospital.com',
    customerPhone: '+92 321 8899770',
    productCount: 8,
    itemsDescription: 'Bone Rongeurs Single Action, Crile Hemostatic Forceps Curved',
    dateTime: '2026-11-01 10:15:45',
    month: 'November',
    year: 2026,
    status: 'Delivered',
    subtotal: 780.00,
    shipping: 30.00,
    total: 810.00,
  },
  {
    id: 'ORD-97812',
    customerName: 'Northwest Medical Supply Group',
    customerEmail: 'orders@northwestmed.com',
    customerPhone: '+1 (206) 555-0199',
    productCount: 25,
    itemsDescription: 'Metzenbaum Scissors Tungsten Carbide, Weitlaner Retractor 3x4',
    dateTime: '2026-10-28 17:40:02',
    month: 'October',
    year: 2026,
    status: 'Delivered',
    subtotal: 2850.00,
    shipping: 65.00,
    total: 2915.00,
  },
  {
    id: 'ORD-97455',
    customerName: 'Global Clinic Solutions LLC',
    customerEmail: 'support@globalclinics.co',
    customerPhone: '+1 (415) 555-2671',
    productCount: 5,
    itemsDescription: 'Operating Scissors Straight Sharp/Blunt 14.5cm',
    dateTime: '2026-10-22 09:20:18',
    month: 'October',
    year: 2026,
    status: 'Failed',
    subtotal: 320.00,
    shipping: 25.00,
    total: 345.00,
  },
  {
    id: 'ORD-96901',
    customerName: 'Valley Health Regional Surgical Care',
    customerEmail: 'logistics@valleyhealth.org',
    customerPhone: '+1 (540) 536-8000',
    productCount: 32,
    itemsDescription: 'Scalpel Handles #3 & #4, Sponge Forceps Straight 25cm',
    dateTime: '2026-09-19 16:05:30',
    month: 'September',
    year: 2026,
    status: 'Dispatched',
    subtotal: 3950.00,
    shipping: 85.00,
    total: 4035.00,
  },
  {
    id: 'ORD-96540',
    customerName: 'Khyber Medical College Teaching Hospital',
    customerEmail: 'surgery@kmc.edu.pk',
    customerPhone: '+92 91 9216216',
    productCount: 18,
    itemsDescription: 'Micro Needle Holders Titanium, Castroviejo Caliper',
    dateTime: '2026-09-12 11:48:52',
    month: 'September',
    year: 2026,
    status: 'Delivered',
    subtotal: 1980.00,
    shipping: 40.00,
    total: 2020.00,
  },
]

// Exact screenshot 4 tables
const ROWS_2024: MonthlyRow[] = [
  { month: 'December', discounts: 0.0, products: 356500.0, shipping: 900.0, tax: 0.0, grandTotal: 357400.0 },
  { month: 'November', discounts: 0.0, products: 88500.0, shipping: 300.0, tax: 0.0, grandTotal: 88800.0 },
  { month: 'October', discounts: 0.0, products: 22000.0, shipping: 0.0, tax: 0.0, grandTotal: 22000.0 },
  { month: 'September', discounts: 0.0, products: 216200.0, shipping: 300.0, tax: 0.0, grandTotal: 216500.0 },
  { month: 'August', discounts: 0.0, products: 268200.0, shipping: 900.0, tax: 0.0, grandTotal: 269100.0 },
  { month: 'June', discounts: 0.0, products: 8000.0, shipping: 0.0, tax: 0.0, grandTotal: 8000.0 },
  { month: 'May', discounts: 0.0, products: 3200.0, shipping: 0.0, tax: 0.0, grandTotal: 3200.0 },
  { month: 'April', discounts: 0.0, products: 126500.0, shipping: 300.0, tax: 0.0, grandTotal: 126800.0 },
  { month: 'January', discounts: 0.0, products: 6500.0, shipping: 0.0, tax: 0.0, grandTotal: 6500.0 },
]

const ROWS_2023: MonthlyRow[] = [
  { month: 'July', discounts: 0.0, products: 48000.0, shipping: 0.0, tax: 0.0, grandTotal: 48000.0 },
  { month: 'May', discounts: 0.0, products: 40000.0, shipping: 0.0, tax: 0.0, grandTotal: 4000.0 },
  { month: 'April', discounts: 0.0, products: 63000.0, shipping: 0.0, tax: 0.0, grandTotal: 63000.0 },
]

export default function AdminStatisticsPage() {
  const [totalProducts, setTotalProducts] = useState(0)
  const [currency, setCurrency] = useState<'PKR' | 'USD'>('PKR')
  const [orders, setOrders] = useState<OrderItemRecord[]>(INITIAL_ORDERS_DATA)
  const [statusFilter, setStatusFilter] = useState<'All' | 'Dispatched' | 'Delivered' | 'Failed' | 'Processing'>('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Sync live total products from store
    const prods = getStoredProducts()
    setTotalProducts(prods.length)

    // Load custom orders if in storage
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('alpha_orders_records')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setOrders(parsed)
          }
        }
      } catch (e) {}
    }
  }, [])

  const handleUpdateStatus = (id: string, newStatus: OrderItemRecord['status']) => {
    const updated = orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    setOrders(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('alpha_orders_records', JSON.stringify(updated))
    }
  }

  const formatCurrency = (val: number) => {
    if (currency === 'USD') {
      const usdVal = val / 278.0
      return `$${usdVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
    return `PKR. ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter
    const matchesSearch =
      !searchQuery ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.itemsDescription.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const dispatchedCount = orders.filter((o) => o.status === 'Dispatched').length
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length
  const failedCount = orders.filter((o) => o.status === 'Failed').length
  const processingCount = orders.filter((o) => o.status === 'Processing').length

  return (
    <AdminShell>
      <div className="space-y-8 animate-fade-in font-sans">
        
        {/* HEADER BAR */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-red-50 text-[#96161B] text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Orders Dispatch & Sales Analytics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Orders & Monthly Dispatch Report
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Detailed tracking of dispatched, delivered, and failed orders with exact date, time, and financial records.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* CURRENCY TOGGLE */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
              <button
                type="button"
                onClick={() => setCurrency('PKR')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  currency === 'PKR' ? 'bg-[#96161B] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                PKR (₨)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  currency === 'USD' ? 'bg-[#96161B] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                USD ($)
              </button>
            </div>
          </div>
        </div>

        {/* 4 SUMMARY STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* 1. Total Products */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Products
              </span>
              <div className="text-3xl font-black text-slate-900">{totalProducts}</div>
              <span className="text-[10px] text-emerald-600 font-bold">Catalog Base Status</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Package className="w-5 h-5" />
            </div>
          </div>

          {/* 2. Dispatched Orders */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Dispatched Orders
              </span>
              <div className="text-3xl font-black text-blue-600">{dispatchedCount}</div>
              <span className="text-[10px] text-blue-600 font-bold">In transit to hospitals</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
          </div>

          {/* 3. Delivered Orders */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Delivered Orders
              </span>
              <div className="text-3xl font-black text-emerald-600">{deliveredCount}</div>
              <span className="text-[10px] text-emerald-600 font-bold">Successful Delivery</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          {/* 4. Failed Orders */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Failed / Cancelled
              </span>
              <div className="text-3xl font-black text-red-600">{failedCount}</div>
              <span className="text-[10px] text-red-500 font-bold">Returned or Failed</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xs">
              <XCircle className="w-5 h-5" />
            </div>
          </div>

          {/* 5. Total Recorded Revenue */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Revenue
              </span>
              <div className="text-xl sm:text-2xl font-black text-[#96161B]">
                {formatCurrency(1246900)}
              </div>
              <span className="text-[10px] text-slate-400 font-bold">Cumulative 2023-2026</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#96161B] text-white flex items-center justify-center shadow-xs">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 1: ORDERS DISPATCH STATUS TABLE (WITH DATE & TIME)
        ========================================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#96161B]" />
                <span>Live Orders Dispatch & Delivery Tracker</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitor live order statuses, dispatch times, dates, and client information.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* SEARCH */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search order ID, hospital..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-1 focus:ring-[#96161B]"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>

              {/* STATUS FILTER */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Dispatched">Dispatched ({dispatchedCount})</option>
                <option value="Delivered">Delivered ({deliveredCount})</option>
                <option value="Failed">Failed ({failedCount})</option>
                <option value="Processing">Processing ({processingCount})</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-bold uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Hospital / Buyer</th>
                  <th className="py-3 px-4">Dispatched Items</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Total Amount</th>
                  <th className="py-3 px-4 text-center">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-500 font-semibold">
                      No orders found matching the filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {ord.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900">{ord.customerName}</div>
                        <div className="text-[11px] text-slate-400">{ord.customerPhone}</div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate text-slate-600 font-medium" title={ord.itemsDescription}>
                        <span className="font-bold text-[#96161B] mr-1">({ord.productCount}x)</span>
                        {ord.itemsDescription}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{ord.dateTime}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 font-extrabold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider ${
                            ord.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'Dispatched'
                              ? 'bg-blue-100 text-blue-800'
                              : ord.status === 'Failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.status === 'Delivered' && <CheckCircle2 className="w-3 h-3" />}
                          {ord.status === 'Dispatched' && <Truck className="w-3 h-3" />}
                          {ord.status === 'Failed' && <XCircle className="w-3 h-3" />}
                          {ord.status === 'Processing' && <Clock className="w-3 h-3" />}
                          <span>{ord.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-slate-900 text-sm">
                        ${ord.total.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateStatus(ord.id, e.target.value as any)}
                          className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-800 outline-none cursor-pointer"
                        >
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Failed">Failed</option>
                          <option value="Processing">Processing</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* =========================================================================
            SECTION 2: EXACT SCREENSHOT 4 MONTHLY FINANCIAL BREAKDOWN TABLES
        ========================================================================= */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#96161B]" />
              <span>Monthly Sales, Coupons & Shipping Summary</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Exact financial archive by month and year matching official reporting system.
            </p>
          </div>

          {/* TABLE 1: MONTHS OF 2024 */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="bg-[#2B2B2B] text-white py-3.5 px-6 font-black text-sm flex items-center justify-between">
              <span>Months of 2024</span>
              <span className="text-xs text-slate-300 font-medium">9 Recorded Accounting Cycles</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#2B2B2B] text-white/90 border-t border-white/10 font-bold uppercase text-[11px]">
                    <th className="py-3 px-6">Months of 2024</th>
                    <th className="py-3 px-6">Coupon Discounts</th>
                    <th className="py-3 px-6">Products</th>
                    <th className="py-3 px-6">Shipping</th>
                    <th className="py-3 px-6">Tax</th>
                    <th className="py-3 px-6 text-right">Grand Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {ROWS_2024.map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-6 font-bold text-slate-900">{r.month}</td>
                      <td className="py-3.5 px-6 text-slate-600">{formatCurrency(r.discounts)}</td>
                      <td className="py-3.5 px-6 text-slate-700 font-semibold">{formatCurrency(r.products)}</td>
                      <td className="py-3.5 px-6 text-slate-600">{formatCurrency(r.shipping)}</td>
                      <td className="py-3.5 px-6 text-slate-600">{formatCurrency(r.tax)}</td>
                      <td className="py-3.5 px-6 text-right font-black text-slate-900">{formatCurrency(r.grandTotal)}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300">
                    <td className="py-3.5 px-6">Total 2024</td>
                    <td className="py-3.5 px-6">{formatCurrency(0)}</td>
                    <td className="py-3.5 px-6">{formatCurrency(1095900)}</td>
                    <td className="py-3.5 px-6">{formatCurrency(2700)}</td>
                    <td className="py-3.5 px-6">{formatCurrency(0)}</td>
                    <td className="py-3.5 px-6 text-right text-base text-[#96161B]">
                      {formatCurrency(1098600)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* TABLE 2: MONTHS OF 2023 */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="bg-[#2B2B2B] text-white py-3.5 px-6 font-black text-sm flex items-center justify-between">
              <span>Months of 2023</span>
              <span className="text-xs text-slate-300 font-medium">3 Recorded Accounting Cycles</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#2B2B2B] text-white/90 border-t border-white/10 font-bold uppercase text-[11px]">
                    <th className="py-3 px-6">Months of 2023</th>
                    <th className="py-3 px-6">Coupon Discounts</th>
                    <th className="py-3 px-6">Products</th>
                    <th className="py-3 px-6">Shipping</th>
                    <th className="py-3 px-6">Tax</th>
                    <th className="py-3 px-6 text-right">Grand Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {ROWS_2023.map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-6 font-bold text-slate-900">{r.month}</td>
                      <td className="py-3.5 px-6 text-slate-600">{formatCurrency(r.discounts)}</td>
                      <td className="py-3.5 px-6 text-slate-700 font-semibold">{formatCurrency(r.products)}</td>
                      <td className="py-3.5 px-6 text-slate-600">{formatCurrency(r.shipping)}</td>
                      <td className="py-3.5 px-6 text-slate-600">{formatCurrency(r.tax)}</td>
                      <td className="py-3.5 px-6 text-right font-black text-slate-900">{formatCurrency(r.grandTotal)}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300">
                    <td className="py-3.5 px-6">Total 2023</td>
                    <td className="py-3.5 px-6">{formatCurrency(0)}</td>
                    <td className="py-3.5 px-6">{formatCurrency(151000)}</td>
                    <td className="py-3.5 px-6">{formatCurrency(0)}</td>
                    <td className="py-3.5 px-6">{formatCurrency(0)}</td>
                    <td className="py-3.5 px-6 text-right text-base text-[#96161B]">
                      {formatCurrency(151000)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </AdminShell>
  )
}
