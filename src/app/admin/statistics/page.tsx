'use client'

import React, { useState, useEffect } from 'react'
import AdminShell from '@/src/components/admin/AdminShell'
import Image from 'next/image'
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
  Eye,
  Star,
  X,
  MapPin,
  User,
  Mail,
  Phone,
  Layers,
  ShieldCheck,
  Building,
  ZoomIn,
  Trash2,
  Plus,
} from 'lucide-react'
import { getStoredProducts, getStoredReviews, INITIAL_REVIEWS_SEED, StoreReviewItem } from '@/src/lib/dataStore'
import SafeProductImage from '@/src/components/public/SafeProductImage'

interface MonthlyRow {
  month: string
  discounts: number
  products: number
  shipping: number
  tax: number
  grandTotal: number
}

export interface OrderItemDetail {
  id: string
  title: string
  sku: string
  size?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  image: string
}

export interface OrderItemRecord {
  id: string
  orderRef?: string
  customerName: string
  customerCompany?: string
  customerEmail: string
  customerPhone: string
  customerAddress?: string
  customerCity?: string
  customerState?: string
  customerZip?: string
  customerCountry?: string
  paymentMethod?: string
  paymentStatus?: string
  productCount: number
  itemsDescription: string
  items: OrderItemDetail[]
  dateTime: string
  month: string
  year: number
  status: 'Dispatched' | 'Delivered' | 'Failed' | 'Processing' | 'Cancelled'
  cancelReason?: string
  cancelledAt?: string
  subtotal: number
  shipping: number
  tax?: number
  total: number
  stripePaymentIntentId?: string
  stripeRefundId?: string
  refundStatus?: string
  rating?: number
  reviewComment?: string
}

const INITIAL_ORDERS_DATA: OrderItemRecord[] = [
  {
    id: 'ORD-98421',
    customerName: 'St. Jude Children’s Research Hospital',
    customerEmail: 'procurement@stjude.org',
    customerPhone: '+1 (901) 595-3300',
    customerAddress: '262 Danny Thomas Pl, Memphis',
    customerCity: 'Memphis',
    customerState: 'Tennessee',
    customerZip: '38105',
    customerCountry: 'United States',
    productCount: 14,
    itemsDescription: 'Hartmann Dressing Forceps, Super Cut Scissors, Mayo-Hegar Needle Holders',
    items: [
      {
        id: 'item-1',
        title: 'Hartmann Dressing Forceps',
        sku: 'SKU-4500',
        size: '14.0cm Straight',
        quantity: 6,
        unitPrice: 49.50,
        totalPrice: 297.00,
        image: '/images/products/display-test-forceps.jpg',
      },
      {
        id: 'item-2',
        title: 'Super Cut Plastic Reconstructive Scissors',
        sku: 'SKU-2001',
        size: '15.5cm Curved',
        quantity: 5,
        unitPrice: 55.00,
        totalPrice: 275.00,
        image: '/images/products/image-399.png',
      },
      {
        id: 'item-3',
        title: 'Mayo-Hegar Needle Holders TC Inserts',
        sku: 'SKU-1001',
        size: '18.0cm Tungsten Carbide',
        quantity: 3,
        unitPrice: 58.00,
        totalPrice: 174.00,
        image: '/images/products/alpha-prod-1793959246422-feat.jpg',
      },
    ],
    dateTime: '2026-11-02 14:32:10',
    month: 'November',
    year: 2026,
    status: 'Dispatched',
    subtotal: 746.00,
    shipping: 15.00,
    total: 761.00,
    rating: 5,
    reviewComment: 'Instruments arrived in sterile sealed packaging. Perfect balance and finish.',
  },
  {
    id: 'ORD-98390',
    customerName: 'Dr. Johnathan Carter (Florida Surgical Center)',
    customerEmail: 'jcarter@flsurgcenter.org',
    customerPhone: '+1 (561) 528-9764',
    customerAddress: '129 Fleetwood Drive, Easley',
    customerCity: 'Easley',
    customerState: 'South Carolina',
    customerZip: '29640',
    customerCountry: 'United States',
    productCount: 8,
    itemsDescription: 'Super Cut Lister Bandage Scissors, Extracting Forceps German Stainless',
    items: [
      {
        id: 'item-4',
        title: 'Super Cut Lister Bandage Scissors',
        sku: 'SKU-2004',
        size: '18.0cm',
        quantity: 4,
        unitPrice: 48.00,
        totalPrice: 192.00,
        image: '/images/products/image-399.png',
      },
      {
        id: 'item-5',
        title: 'Extracting Forceps German Stainless',
        sku: 'SKU-2022',
        size: 'Standard Ergonomic',
        quantity: 4,
        unitPrice: 62.00,
        totalPrice: 248.00,
        image: '/images/products/display-test-forceps.jpg',
      },
    ],
    dateTime: '2026-11-01 10:15:45',
    month: 'November',
    year: 2026,
    status: 'Delivered',
    subtotal: 440.00,
    shipping: 15.00,
    total: 455.00,
    rating: 5,
    reviewComment: 'Flawless action, no glare under OR lamps. Our surgical techs loved them.',
  },
  {
    id: 'ORD-97812',
    customerName: 'Northwest Medical Supply Group',
    customerEmail: 'orders@northwestmed.com',
    customerPhone: '+1 (206) 555-0199',
    customerAddress: '420 5th Ave S, Seattle',
    customerCity: 'Seattle',
    customerState: 'Washington',
    customerZip: '98104',
    customerCountry: 'United States',
    productCount: 25,
    itemsDescription: 'Metzenbaum Scissors Tungsten Carbide, Super Cut Iris Scissors',
    items: [
      {
        id: 'item-6',
        title: 'Metzenbaum Scissors TC Blades',
        sku: 'SKU-2002',
        size: '14.5cm Straight',
        quantity: 15,
        unitPrice: 52.00,
        totalPrice: 780.00,
        image: '/images/products/image-399.png',
      },
      {
        id: 'item-7',
        title: 'Super Cut Iris Scissors Micro Point',
        sku: 'SKU-2003',
        size: '11.5cm Sharp/Sharp',
        quantity: 10,
        unitPrice: 44.00,
        totalPrice: 440.00,
        image: '/images/products/alpha-prod-1793960060273-feat.jpg',
      },
    ],
    dateTime: '2026-10-28 17:40:02',
    month: 'October',
    year: 2026,
    status: 'Delivered',
    subtotal: 1220.00,
    shipping: 0.00,
    total: 1220.00,
    rating: 5,
    reviewComment: 'Bulk delivery on schedule. Passed all hospital sterilization validations.',
  },
  {
    id: 'ORD-97455',
    customerName: 'Global Clinic Solutions LLC',
    customerEmail: 'support@globalclinics.co',
    customerPhone: '+1 (415) 555-2671',
    customerAddress: '100 Montgomery St, Suite 400',
    customerCity: 'San Francisco',
    customerState: 'California',
    customerZip: '94104',
    customerCountry: 'United States',
    productCount: 5,
    itemsDescription: 'Operating Scissors Straight Sharp/Blunt 14.5cm',
    items: [
      {
        id: 'item-8',
        title: 'Operating Scissors Straight Sharp/Blunt',
        sku: 'SKU-1005',
        size: '14.5cm',
        quantity: 5,
        unitPrice: 38.00,
        totalPrice: 190.00,
        image: '/images/products/image-399.png',
      },
    ],
    dateTime: '2026-10-22 09:20:18',
    month: 'October',
    year: 2026,
    status: 'Failed',
    subtotal: 190.00,
    shipping: 15.00,
    total: 205.00,
    rating: 3,
    reviewComment: 'Customer requested change of shipping address before dispatch.',
  },
  {
    id: 'ORD-96901',
    customerName: 'Valley Health Regional Surgical Care',
    customerEmail: 'logistics@valleyhealth.org',
    customerPhone: '+1 (540) 536-8000',
    customerAddress: '1840 Amherst St, Winchester',
    customerCity: 'Winchester',
    customerState: 'Virginia',
    customerZip: '22601',
    customerCountry: 'United States',
    productCount: 32,
    itemsDescription: 'Hartmann Dressing Forceps, Super Cut Freeman Kaye Scissors',
    items: [
      {
        id: 'item-9',
        title: 'Hartmann Dressing Forceps',
        sku: 'SKU-4500',
        size: '15.5cm',
        quantity: 20,
        unitPrice: 49.50,
        totalPrice: 990.00,
        image: '/images/products/display-test-forceps.jpg',
      },
      {
        id: 'item-10',
        title: 'Super Cut Freeman Kaye Scissors',
        sku: 'SKU-2005',
        size: '18.0cm Curved',
        quantity: 12,
        unitPrice: 56.00,
        totalPrice: 672.00,
        image: '/images/products/image-399.png',
      },
    ],
    dateTime: '2026-09-19 16:05:30',
    month: 'September',
    year: 2026,
    status: 'Dispatched',
    subtotal: 1662.00,
    shipping: 0.00,
    total: 1662.00,
    rating: 5,
    reviewComment: 'Repeat wholesale order for our surgical suites. 5/5 quality.',
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
  const [currency, setCurrency] = useState<'USD' | 'PKR'>('USD')
  const [orders, setOrders] = useState<OrderItemRecord[]>(INITIAL_ORDERS_DATA)
  const [reviews, setReviews] = useState<StoreReviewItem[]>(INITIAL_REVIEWS_SEED)
  const [selectedOrder, setSelectedOrder] = useState<OrderItemRecord | null>(null)
  const [zoomedImage, setZoomedImage] = useState<{ src: string; title: string; sku?: string; size?: string } | null>(null)
  const [statusFilter, setStatusFilter] = useState<'All' | 'Dispatched' | 'Delivered' | 'Failed' | 'Processing' | 'Cancelled'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [isCancellingOrder, setIsCancellingOrder] = useState(false)
  const [adminCancelMessage, setAdminCancelMessage] = useState<string | null>(null)

  useEffect(() => {
    // Sync live total products from store
    const prods = getStoredProducts()
    setTotalProducts(prods.length)
    setReviews(getStoredReviews())

    // Load custom orders from localStorage + merge with server /api/orders
    const syncOrders = () => {
      if (typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem('alpha_orders_records')
          if (saved) {
            const parsed = JSON.parse(saved)
            if (Array.isArray(parsed) && parsed.length > 0) {
              setOrders(parsed)
              return
            }
          }
          setOrders(INITIAL_ORDERS_DATA)
        } catch (e) {}
      }
    }

    const syncReviews = () => {
      setReviews(getStoredReviews())
    }

    syncOrders()

    fetch('/api/orders?t=' + Date.now(), { cache: 'no-store' })
      .then((res) => res.json())
      .then((serverOrders) => {
        if (Array.isArray(serverOrders) && serverOrders.length > 0) {
          try {
            const saved = localStorage.getItem('alpha_orders_records')
            const localList: OrderItemRecord[] = saved ? JSON.parse(saved) : []
            const map = new Map<string, OrderItemRecord>()
            serverOrders.forEach((o: OrderItemRecord) => o && o.id && map.set(o.id, o))
            localList.forEach((o: OrderItemRecord) => o && o.id && !map.has(o.id) && map.set(o.id, o))
            if (map.size === 0) {
              INITIAL_ORDERS_DATA.forEach((o) => map.set(o.id, o))
            }
            const merged = Array.from(map.values())
            setOrders(merged)
            localStorage.setItem('alpha_orders_records', JSON.stringify(merged))
          } catch (e) {}
        }
      })
      .catch(() => {})

    window.addEventListener('alpha_orders_updated', syncOrders)
    window.addEventListener('alpha_reviews_updated', syncReviews)
    window.addEventListener('storage', syncOrders)
    window.addEventListener('storage', syncReviews)
    return () => {
      window.removeEventListener('alpha_orders_updated', syncOrders)
      window.removeEventListener('alpha_reviews_updated', syncReviews)
      window.removeEventListener('storage', syncOrders)
      window.removeEventListener('storage', syncReviews)
    }
  }, [])

  const handleClearDemoOrders = () => {
    const realOnly = orders.filter(
      (o) => !o.id.startsWith('ORD-98') && !o.id.startsWith('ORD-97') && !o.id.startsWith('ORD-96')
    )
    setOrders(realOnly)
    if (typeof window !== 'undefined') {
      localStorage.setItem('alpha_orders_records', JSON.stringify(realOnly))
      window.dispatchEvent(new Event('alpha_orders_updated'))
    }
  }

  const handleAddLiveTestOrder = () => {
    const now = new Date()
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    const testId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`
    const testOrder: OrderItemRecord = {
      id: testId,
      customerName: 'Miami Surgical Specialty Hospital',
      customerEmail: 'procurement@miamisurg.org',
      customerPhone: '+1 (305) 555-8912',
      customerAddress: '1611 NW 12th Ave',
      customerCity: 'Miami',
      customerState: 'Florida',
      customerZip: '33136',
      customerCountry: 'United States',
      productCount: 3,
      itemsDescription: 'Super Cut Plastic Reconstructive Scissors, Hartmann Dressing Forceps',
      items: [
        {
          id: `item-${Date.now()}-1`,
          title: 'Super Cut Plastic Reconstructive Scissors',
          sku: 'SKU-2001',
          size: '15.5cm Curved',
          quantity: 2,
          unitPrice: 55.00,
          totalPrice: 110.00,
          image: '/images/products/image-399.png',
        },
        {
          id: `item-${Date.now()}-2`,
          title: 'Hartmann Dressing Forceps',
          sku: 'SKU-4500',
          size: '14.0cm Straight',
          quantity: 1,
          unitPrice: 49.50,
          totalPrice: 49.50,
          image: '/images/products/display-test-forceps.jpg',
        },
      ],
      dateTime: `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 8)}`,
      month: months[now.getMonth()],
      year: now.getFullYear(),
      status: 'Processing',
      subtotal: 159.50,
      shipping: 15.00,
      total: 174.50,
      rating: 5,
      reviewComment: 'Verified purchase from USA Store. Immediate delivery dispatch.',
    }

    const updated = [testOrder, ...orders.filter((o) => o.id !== testId)]
    setOrders(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('alpha_orders_records', JSON.stringify(updated))
      window.dispatchEvent(new Event('alpha_orders_updated'))
    }
  }

  const handleUpdateStatus = (id: string, newStatus: OrderItemRecord['status']) => {
    if (newStatus === 'Cancelled') {
      const target = orders.find((o) => o.id === id)
      if (target) {
        handleAdminCancelAndRefund(target)
        return
      }
    }
    const updated = orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    setOrders(updated)
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({ ...selectedOrder, status: newStatus })
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('alpha_orders_records', JSON.stringify(updated))
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', id, status: newStatus }),
      }).catch(() => {})
    }
  }

  const handleAdminCancelAndRefund = async (order: OrderItemRecord) => {
    setIsCancellingOrder(true)
    setAdminCancelMessage(null)
    try {
      const res = await fetch('/api/orders/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: order.id,
          orderRef: order.orderRef || order.id,
          reason: 'Cancelled by Admin from Orders Panel',
          order,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setAdminCancelMessage(data?.error || 'Failed to cancel/refund order on Stripe.')
        setIsCancellingOrder(false)
        return
      }
      const updatedOrder: OrderItemRecord = data?.order || {
        ...order,
        status: 'Cancelled',
        paymentStatus: 'Refunded / Cancelled',
        cancelReason: 'Cancelled by Admin from Orders Panel',
        cancelledAt: new Date().toISOString(),
      }
      const updated = orders.map((o) => (o.id === order.id ? updatedOrder : o))
      setOrders(updated)
      if (selectedOrder && selectedOrder.id === order.id) {
        setSelectedOrder(updatedOrder)
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('alpha_orders_records', JSON.stringify(updated))
        window.dispatchEvent(new Event('alpha_orders_updated'))
      }
      setAdminCancelMessage(
        data?.stripeRefundId
          ? `Order cancelled & refunded on Stripe (Refund ID: ${data.stripeRefundId}). Cancellation email sent to ${order.customerEmail}.`
          : `Order cancelled. Cancellation email sent to ${order.customerEmail}.`
      )
    } catch (err: any) {
      setAdminCancelMessage(err?.message || 'Network error while cancelling order.')
    } finally {
      setIsCancellingOrder(false)
    }
  }

  const formatCurrency = (val: number) => {
    if (currency === 'PKR') {
      const pkrVal = val * 278.0
      return `PKR. ${pkrVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
    return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
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
  const failedCount = orders.filter((o) => o.status === 'Failed' || o.status === 'Cancelled').length
  const cancelledCount = orders.filter((o) => o.status === 'Cancelled').length
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

            <button
              type="button"
              onClick={handleClearDemoOrders}
              className="bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 px-3 py-1.5 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Remove demo mock orders and show only real live orders"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Demo Orders</span>
            </button>

            <button
              type="button"
              onClick={handleAddLiveTestOrder}
              className="bg-slate-900 hover:bg-[#96161B] text-white px-3 py-1.5 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Create a live test order with authentic surgical instruments"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Test Order</span>
            </button>
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
                Total Revenue ($ USD)
              </span>
              <div className="text-xl sm:text-2xl font-black text-[#96161B]">
                {formatCurrency(orders.reduce((acc, o) => acc + o.total, 0))}
              </div>
              <span className="text-[10px] text-emerald-600 font-bold">100% In USD Currency</span>
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
                Inspect ordered products with exact images, size dimensions, quantities, and customer 5-star ratings.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* SEARCH */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search order ID, hospital, product..."
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
                <option value="Cancelled">Cancelled ({cancelledCount})</option>
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
                  <th className="py-3 px-4">Ordered Products & Sizes</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Total Amount</th>
                  <th className="py-3 px-4 text-center">Order Actions</th>
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
                  filteredOrders.map((ord) => {
                    const firstItem = ord.items && ord.items.length > 0 ? ord.items[0] : null

                    return (
                      <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                          {ord.id}
                        </td>

                        <td className="py-3.5 px-4 min-w-[180px]">
                          <div className="font-extrabold text-slate-900">{ord.customerName}</div>
                          <div className="text-[11px] text-slate-500">{ord.customerPhone}</div>
                          {ord.customerCity && (
                            <div className="text-[10px] text-slate-400">
                              {ord.customerCity}{ord.customerState ? `, ${ord.customerState}` : ''}
                            </div>
                          )}
                        </td>

                        {/* PRODUCT THUMBNAIL, TITLE, SIZE, QUANTITY */}
                        <td className="py-3.5 px-4 min-w-[260px] max-w-sm">
                          <div className="flex items-center gap-2.5">
                            <div
                              onClick={() =>
                                firstItem &&
                                setZoomedImage({
                                  src: firstItem.image,
                                  title: firstItem.title,
                                  sku: firstItem.sku,
                                  size: firstItem.size,
                                })
                              }
                              className="w-11 h-11 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 relative flex items-center justify-center shadow-2xs group cursor-zoom-in"
                              title="Click to Zoom Image"
                            >
                              {firstItem?.image ? (
                                <SafeProductImage
                                  src={firstItem.image}
                                  alt={firstItem.title}
                                  fill
                                  className="object-contain p-1 group-hover:scale-110 transition-transform duration-200"
                                />
                              ) : (
                                <Package className="w-5 h-5 text-slate-400" />
                              )}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                                <ZoomIn className="w-4 h-4" />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-slate-900 truncate text-xs flex items-center gap-1.5">
                                <span className="text-[#96161B] font-black">({ord.productCount}x)</span>
                                <span className="truncate">{firstItem?.title || ord.itemsDescription}</span>
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5 flex-wrap">
                                <span className="bg-slate-100 text-slate-700 font-bold px-1.5 py-0.5 rounded text-[10px]">
                                  Size: {firstItem?.size || 'Standard'}
                                </span>
                                <span className="font-mono text-slate-400 text-[10px]">
                                  {firstItem?.sku || 'SKU-4500'}
                                </span>
                                {ord.items && ord.items.length > 1 && (
                                  <span className="text-[#96161B] font-bold text-[10px]">
                                    +{ord.items.length - 1} more items
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{ord.dateTime}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 font-extrabold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider ${
                              ord.status === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.status === 'Dispatched'
                                ? 'bg-blue-100 text-blue-800'
                                : ord.status === 'Failed' || ord.status === 'Cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ord.status === 'Delivered' && <CheckCircle2 className="w-3 h-3" />}
                            {ord.status === 'Dispatched' && <Truck className="w-3 h-3" />}
                            {(ord.status === 'Failed' || ord.status === 'Cancelled') && <XCircle className="w-3 h-3" />}
                            {ord.status === 'Processing' && <Clock className="w-3 h-3" />}
                            <span>{ord.status}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right font-black text-slate-900 text-sm whitespace-nowrap">
                          ${ord.total.toFixed(2)}
                        </td>

                        {/* ORDER ACTION BUTTON: VIEW FULL DETAILS MODAL */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(ord)}
                            className="bg-slate-900 hover:bg-[#96161B] text-white px-3 py-1.5 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Details</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* =========================================================================
            SECTION 1B: LIVE WEBSITE 5-STAR REVIEWS & CUSTOMER FEEDBACK
        ========================================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span>Website Customer 5-Star Reviews ({reviews.length})</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Live customer ratings and comments submitted on the storefront, product pages, and checkout receipts.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black px-3 py-1.5 rounded-xl">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>
                Avg:{' '}
                {reviews.length > 0
                  ? (reviews.reduce((s, r) => s + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
                  : '5.0'}{' '}
                / 5.0
              </span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.slice(0, 6).map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= (rev.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">{rev.date}</span>
                </div>
                <div className="font-extrabold text-slate-900 line-clamp-1">{rev.title}</div>
                <p className="text-slate-600 italic line-clamp-3">&ldquo;{rev.comment}&rdquo;</p>
                <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-800 truncate">{rev.author}</span>
                  {rev.productTitle && (
                    <span className="text-[10px] font-semibold text-[#96161B] truncate max-w-[140px]">
                      {rev.productTitle}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            RICH VIEW ORDER DETAILS MODAL (WITH PRODUCTS, IMAGES, SIZES & 5-STAR REVIEWS)
        ========================================================================= */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 space-y-6 p-6 sm:p-8">
              
              {/* MODAL HEADER */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#96161B] flex items-center justify-center font-black">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-lg text-slate-900">
                        Order Details: {selectedOrder.id}
                      </h3>
                      <span className="bg-slate-100 text-slate-700 text-xs font-mono px-2 py-0.5 rounded">
                        {selectedOrder.dateTime}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">
                      Exact ordered products, sizes, quantities, and customer shipping dispatch
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 2 INFO CARDS: CUSTOMER & 5-STAR RATING */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Customer & Shipping Details */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                    <User className="w-3.5 h-3.5 text-[#96161B]" />
                    <span>Customer & Dispatch Information</span>
                  </div>
                  <div className="space-y-1 pt-0.5 text-slate-700">
                    <div><strong className="text-slate-900">Buyer:</strong> {selectedOrder.customerName}</div>
                    {selectedOrder.customerCompany && (
                      <div><strong className="text-slate-900">Company:</strong> {selectedOrder.customerCompany}</div>
                    )}
                    <div><strong className="text-slate-900">Email:</strong> {selectedOrder.customerEmail}</div>
                    <div><strong className="text-slate-900">Phone:</strong> {selectedOrder.customerPhone}</div>
                    <div>
                      <strong className="text-slate-900">Shipping Address:</strong>{' '}
                      {selectedOrder.customerAddress || '129 Fleetwood Drive'}, {selectedOrder.customerCity || 'Easley'}, {selectedOrder.customerState || 'South Carolina'} {selectedOrder.customerZip || '29640'}, {selectedOrder.customerCountry || 'United States'}
                    </div>
                    {selectedOrder.paymentMethod && (
                      <div>
                        <strong className="text-slate-900">Payment:</strong>{' '}
                        <span className="text-emerald-700 font-bold">
                          {selectedOrder.paymentStatus || 'Paid'} ({selectedOrder.paymentMethod})
                        </span>
                      </div>
                    )}
                    {selectedOrder.status === 'Cancelled' && (
                      <div>
                        <strong className="text-red-700">Cancellation Reason:</strong>{' '}
                        <span className="text-red-600 font-semibold">
                          {selectedOrder.cancelReason || 'Cancelled by customer'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. 5-Star Customer Satisfaction Rating */}
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2 text-xs">
                  <div className="font-extrabold text-amber-900 flex items-center justify-between border-b border-amber-200 pb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>Customer Satisfaction Rating</span>
                    </span>
                    <span className="bg-amber-100 text-amber-900 font-black px-2 py-0.5 rounded text-[10px]">
                      {selectedOrder.rating || 5}/5 Stars
                    </span>
                  </div>
                  <div className="flex items-center text-amber-400 gap-1 pt-1">
                    {[...Array(selectedOrder.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-1.5">
                      Verified Buyer Rating
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 italic leading-relaxed">
                    &ldquo;{selectedOrder.reviewComment || 'Ordered products arrived on schedule. High durability surgical steel with zero flaws.'}&rdquo;
                  </p>
                </div>
              </div>

              {/* ORDERED PRODUCTS BREAKDOWN TABLE */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-[#96161B]" />
                    <span>Ordered Products Breakdown ({selectedOrder.productCount} Items)</span>
                  </h4>
                  <span className="text-xs text-slate-400 font-semibold">
                    USA Store Catalog Fulfillment
                  </span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                        <th className="py-2.5 px-3">Product</th>
                        <th className="py-2.5 px-3">SKU</th>
                        <th className="py-2.5 px-3">Size / Spec</th>
                        <th className="py-2.5 px-3 text-center">Qty</th>
                        <th className="py-2.5 px-3 text-right">Unit Price</th>
                        <th className="py-2.5 px-3 text-right">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/60">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2.5">
                                <div
                                  onClick={() =>
                                    setZoomedImage({
                                      src: item.image,
                                      title: item.title,
                                      sku: item.sku,
                                      size: item.size,
                                    })
                                  }
                                  className="w-12 h-12 rounded-xl bg-white border border-slate-200 relative overflow-hidden shrink-0 group cursor-zoom-in shadow-2xs"
                                  title="Click to Zoom Image"
                                >
                                  <SafeProductImage
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-contain p-1 group-hover:scale-110 transition-transform duration-200"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                                    <ZoomIn className="w-4 h-4" />
                                  </div>
                                </div>
                                <div>
                                  <span className="font-extrabold text-slate-900 block">{item.title}</span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setZoomedImage({
                                        src: item.image,
                                        title: item.title,
                                        sku: item.sku,
                                        size: item.size,
                                      })
                                    }
                                    className="text-slate-400 hover:text-[#96161B] inline-flex items-center gap-1 text-[10px] font-semibold transition-colors mt-0.5 cursor-pointer"
                                  >
                                    <ZoomIn className="w-3 h-3" />
                                    <span>Zoom Photo</span>
                                  </button>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-slate-500">{item.sku}</td>
                            <td className="py-3 px-3">
                              <span className="bg-red-50 text-[#96161B] font-bold px-2 py-0.5 rounded text-[10px]">
                                {item.size || 'Standard'}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center font-black text-slate-900">{item.quantity}x</td>
                            <td className="py-3 px-3 text-right text-slate-600">${item.unitPrice.toFixed(2)}</td>
                            <td className="py-3 px-3 text-right font-black text-slate-900">
                              ${item.totalPrice.toFixed(2)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-4 px-3 text-center text-slate-500">
                            {selectedOrder.itemsDescription}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* TOTALS & DISPATCH STATUS CONTROLS */}
              {adminCancelMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-2.5 rounded-xl text-xs font-bold">
                  {adminCancelMessage}
                </div>
              )}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold text-slate-700">Update Order Status:</span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value as any)}
                    className="bg-white border-2 border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none cursor-pointer focus:border-[#96161B]"
                  >
                    <option value="Dispatched">Dispatched (In Transit)</option>
                    <option value="Delivered">Delivered (Completed)</option>
                    <option value="Cancelled">Cancelled / Refunded</option>
                    <option value="Failed">Failed / Returned</option>
                    <option value="Processing">Processing (Packaging)</option>
                  </select>

                  {selectedOrder.status !== 'Cancelled' && (
                    <button
                      type="button"
                      disabled={isCancellingOrder}
                      onClick={() => handleAdminCancelAndRefund(selectedOrder)}
                      className="bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-colors"
                    >
                      {isCancellingOrder ? 'Refunding...' : 'Cancel & Refund (Stripe)'}
                    </button>
                  )}
                </div>

                <div className="text-right space-y-1 text-xs">
                  <div className="text-slate-500">
                    Subtotal: <span className="font-bold text-slate-900">${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="text-slate-500">
                    Shipping Fee:{' '}
                    <span className="font-bold text-slate-900">
                      {selectedOrder.shipping === 0 ? 'Free Shipping' : `$${selectedOrder.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {typeof selectedOrder.tax === 'number' && selectedOrder.tax > 0 && (
                    <div className="text-slate-500">
                      Tax (Exclusive): <span className="font-bold text-slate-900">${selectedOrder.tax.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="text-base font-black text-[#96161B] pt-1 border-t border-slate-200">
                    Grand Total: ${selectedOrder.total.toFixed(2)} USD
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            HIGH RESOLUTION INSTRUMENT IMAGE ZOOM LIGHTBOX MODAL
        ========================================================================= */}
        {zoomedImage && (
          <div
            className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setZoomedImage(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#96161B] bg-red-50 px-2 py-0.5 rounded">
                    High-Resolution Zoom Preview
                  </span>
                  <h3 className="font-black text-base text-slate-900 mt-1">
                    {zoomedImage.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    {zoomedImage.sku && <span className="font-mono font-bold text-slate-600">{zoomedImage.sku}</span>}
                    {zoomedImage.size && (
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-bold">
                        Size: {zoomedImage.size}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setZoomedImage(null)}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative w-full h-80 sm:h-96 bg-[#fafafa] rounded-2xl border border-slate-100 overflow-hidden flex items-center justify-center p-4">
                <SafeProductImage
                  src={zoomedImage.src}
                  alt={zoomedImage.title}
                  fill
                  className="object-contain p-4"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Click outside or the close button to return</span>
                <button
                  type="button"
                  onClick={() => setZoomedImage(null)}
                  className="bg-slate-900 hover:bg-[#96161B] text-white px-4 py-2 rounded-xl font-bold transition-all cursor-pointer shadow-xs"
                >
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        )}

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
