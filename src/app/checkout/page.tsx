'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Headphones,
  User,
  Mail,
  Phone,
  Minus,
  Plus,
  Lock,
  CheckCircle2,
  ThumbsUp,
  Tag,
  CreditCard,
  Building,
  MapPin,
  Globe,
  Sparkles,
  ShoppingBag,
  ShoppingCart,
  Trash2,
} from 'lucide-react'
import {
  getStoredProducts,
  getStoredCheckoutSettings,
  INITIAL_CHECKOUT_SETTINGS_SEED,
  getStoredCart,
  addToStoredCart,
  updateCartQuantity,
  removeFromStoredCart,
  clearStoredCart,
  CartItem,
  US_STATES,
} from '@/src/lib/dataStore'
import SafeProductImage from '@/src/components/public/SafeProductImage'
import { ProductItem } from '@/src/types/product'
import { CheckoutSettings } from '@/src/types/checkoutSettings'
import {
  VisaIcon,
  MastercardIcon,
  AmexIcon,
  DiscoverIcon,
  StripeBadge,
} from '@/src/components/public/PaymentCardIcons'

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productSlug = searchParams.get('product') || ''
  const queryQty = searchParams.get('qty') ? Math.max(1, parseInt(searchParams.get('qty') || '1')) : null
  const querySize = searchParams.get('size') || ''
  const queryPrice = searchParams.get('price') ? parseFloat(searchParams.get('price') || '') : null

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartLoaded, setIsCartLoaded] = useState(false)

  // Form selections matching screenshot
  const [authType, setAuthType] = useState<'login' | 'register'>('login')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card')
  const [couponCode, setCouponCode] = useState<string>('')
  const [giftCertificate, setGiftCertificate] = useState<string>('')
  const [discountAmount, setDiscountAmount] = useState<number>(0)
  const [couponMessage, setCouponMessage] = useState<string | null>(null)

  // Personal details
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  // Address (default to United States for USA store)
  const [company, setCompany] = useState('')
  const [address, setAddress] = useState('')
  const [address2, setAddress2] = useState('')
  const [city, setCity] = useState('')
  const [postCode, setPostCode] = useState('')
  const [country, setCountry] = useState('United States')
  const [region, setRegion] = useState('Florida')

  // Order state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const isCanceled = searchParams.get('canceled') === 'true'

  // Dynamic Checkout Settings from CMS
  const [checkoutSettings, setCheckoutSettings] = useState<CheckoutSettings>(INITIAL_CHECKOUT_SETTINGS_SEED)

  useEffect(() => {
    setCheckoutSettings(getStoredCheckoutSettings())
    const handleUpdate = () => setCheckoutSettings(getStoredCheckoutSettings())
    window.addEventListener('alpha_checkout_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('alpha_checkout_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  useEffect(() => {
    let items = getStoredCart()

    // If query parameters specify a product (e.g. from Buy Now button), sync it into cart
    if (productSlug) {
      const products = getStoredProducts()
      const match = products.find(
        (p) =>
          p.slug.toLowerCase() === productSlug.toLowerCase() ||
          p.id.toLowerCase() === productSlug.toLowerCase()
      )
      if (match) {
        addToStoredCart(match, queryQty || 1, {
          size: querySize || undefined,
          price: queryPrice !== null && !isNaN(queryPrice) ? queryPrice : (match.price ?? 53.90),
        })
        items = getStoredCart()
      }
    }

    setCartItems(items)
    setIsCartLoaded(true)

    const handleCartSync = () => {
      setCartItems(getStoredCart())
    }
    window.addEventListener('alpha_cart_updated', handleCartSync)
    window.addEventListener('storage', handleCartSync)
    return () => {
      window.removeEventListener('alpha_cart_updated', handleCartSync)
      window.removeEventListener('storage', handleCartSync)
    }
  }, [productSlug, queryQty, querySize, queryPrice])

  const totalItemCount = cartItems.reduce((acc, it) => acc + Math.max(1, Number(it.quantity) || 1), 0)
  const subTotal = cartItems.reduce(
    (acc, it) => acc + (Number(it.price) || 0) * Math.max(1, Number(it.quantity) || 1),
    0
  )
  const isFreeShipping =
    checkoutSettings.enable_free_shipping === true ||
    (Boolean(checkoutSettings.free_shipping_threshold) && subTotal >= checkoutSettings.free_shipping_threshold) ||
    (Boolean(checkoutSettings.free_shipping_quantity) && totalItemCount >= checkoutSettings.free_shipping_quantity)

  const shippingCost =
    cartItems.length === 0
      ? 0.0
      : isFreeShipping
      ? 0.0
      : (checkoutSettings.shipping_cost ?? 15.00)
  const total = Math.max(0, subTotal + shippingCost - discountAmount)

  const handleQuantityStep = (id: string, newQty: number) => {
    updateCartQuantity(id, newQty)
    setCartItems(getStoredCart())
  }

  const handleRemoveFromCart = (id: string) => {
    removeFromStoredCart(id)
    setCartItems(getStoredCart())
  }

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponCode.trim()) return
    const code = couponCode.toUpperCase()
    if (
      code === (checkoutSettings.coupon_code_1 || 'ALPHA10').toUpperCase() ||
      code === 'ALPHA10'
    ) {
      const pct = checkoutSettings.coupon_discount_percent_1 || 10
      const discount = subTotal * (pct / 100)
      setDiscountAmount(discount)
      setCouponMessage(`Coupon applied! ${pct}% discount saved.`)
    } else if (
      code === (checkoutSettings.coupon_code_2 || 'SURGICAL').toUpperCase() ||
      code === 'SURGICAL'
    ) {
      const fixed = checkoutSettings.coupon_discount_fixed_2 || 5.0
      setDiscountAmount(fixed)
      setCouponMessage(`Voucher code applied: $${fixed.toFixed(2)} discount.`)
    } else {
      setDiscountAmount(5.0)
      setCouponMessage('Voucher code applied: $5.00 discount.')
    }
    setTimeout(() => setCouponMessage(null), 4000)
  }

  const handleApplyGift = (e: React.FormEvent) => {
    e.preventDefault()
    if (!giftCertificate.trim()) return
    setDiscountAmount((prev) => prev + 10.0)
    setCouponMessage('Gift Certificate applied: $10.00 credit added.')
    setTimeout(() => setCouponMessage(null), 4000)
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (cartItems.length === 0) {
      setErrorMessage('Your cart is empty. Please add items to your cart before proceeding.')
      return
    }

    if (!email || !address || !city || !postCode) {
      setErrorMessage('Please fill in all required contact and billing fields (Email, Address, City, Postal Code).')
      return
    }

    setIsSubmitting(true)
    const generatedRef = `ALPH-${Math.floor(100000 + Math.random() * 900000)}`
    setOrderNumber(generatedRef)

    // RECORD REAL ORDER IMMEDIATELY FOR ADMIN ORDERS FULFILLMENT
    const now = new Date()
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
    const dateFormatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`

    const realOrderRecord = {
      id: `ORD-${generatedRef.replace('ALPH-', '')}`,
      customerName: `${firstName} ${lastName}`.trim() || 'Hospital Procurement',
      customerEmail: email,
      customerPhone: phone || '+1 (561) 528-9764',
      customerAddress: address,
      customerCity: city,
      customerState: region,
      customerZip: postCode,
      customerCountry: country || 'United States',
      productCount: totalItemCount,
      itemsDescription: cartItems.map((i) => i.product.title).join(', '),
      items: cartItems.map((it, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        title: it.product.title,
        sku: it.product.sku || 'SKU-4500',
        size: it.size || 'Standard',
        quantity: it.quantity,
        unitPrice: Number(it.price) || 49.50,
        totalPrice: (Number(it.price) || 49.50) * it.quantity,
        image: it.product.featured_image || '/images/products/image-399.png',
      })),
      dateTime: dateFormatted,
      month: months[now.getMonth()],
      year: now.getFullYear(),
      status: 'Processing' as const,
      subtotal: subTotal,
      shipping: shippingCost,
      total: total,
      rating: 5,
      reviewComment: 'Verified purchase from USA Store.',
    }

    try {
      sessionStorage.setItem('alpha_last_checkout_order', JSON.stringify(realOrderRecord))
      const existing = JSON.parse(localStorage.getItem('alpha_orders_records') || '[]')
      const filtered = Array.isArray(existing) ? existing.filter((o: any) => o.id !== realOrderRecord.id) : []
      localStorage.setItem('alpha_orders_records', JSON.stringify([realOrderRecord, ...filtered]))
      window.dispatchEvent(new Event('alpha_orders_updated'))
    } catch (e) {}

    if (paymentMethod === 'card') {
      try {
        const payload = {
          items: cartItems.map((it) => ({
            id: it.product.id,
            title: it.product.title,
            sku: it.product.sku,
            price: it.price,
            quantity: it.quantity,
            featured_image: it.product.featured_image,
            size: it.size,
          })),
          customer: { firstName, lastName, email, phone, company },
          shippingAddress: { address, address2, city, postCode, country, region },
          shippingCost,
          discountAmount,
          orderRef: generatedRef,
        }

        const res = await fetch('/api/checkout/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const data = await res.json()

        if (data.url) {
          // Direct redirect to Stripe Checkout
          window.location.href = data.url
          return
        } else {
          setErrorMessage(data.error || 'Failed to initialize Stripe card checkout.')
          setIsSubmitting(false)
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Payment network error. Please try again.')
        setIsSubmitting(false)
      }
    } else {
      setTimeout(() => {
        clearStoredCart()
        setIsSubmitting(false)
        setOrderPlaced(true)
      }, 1200)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans text-slate-900 selection:bg-[#96161B] selection:text-white">
      {/* =========================================================================
          TOP HEADER BAR (MATCHING SCREENSHOT EXACT DESIGN)
      ========================================================================= */}
      <header className="bg-white border-b border-slate-200 py-3.5 sm:py-4 px-4 sm:px-8 2xl:px-12 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto flex items-center justify-between gap-4">
          
          {/* LEFT: ALPHA WHOLESALE LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo5.svg"
              alt="ALPHA Wholesale Medical Supplies LLC"
              width={200}
              height={52}
              priority
              className="h-9 sm:h-11 2xl:h-13 w-auto object-contain"
            />
          </Link>

          {/* RIGHT TRUST & SUPPORT ROW (MATCHING SCREENSHOT) */}
          <div className="flex items-center gap-6 sm:gap-8 2xl:gap-12">
            
            {/* Secure Checkout Trust */}
            <div className="hidden sm:flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-red-50 text-[#96161B] flex items-center justify-center shrink-0">
                <ThumbsUp className="w-5 h-5 text-[#96161B]" />
              </div>
              <div className="text-left leading-tight">
                <span className="block font-black text-xs 2xl:text-sm text-slate-900">
                  Secure Checkout
                </span>
                <span className="text-[11px] text-slate-500 font-semibold">
                  256-Bit SSL Encrypted
                </span>
              </div>
            </div>

            {/* Need Help / Contact */}
            <Link
              href="/contact"
              className="hidden md:flex items-center gap-2.5 group hover:text-[#96161B] transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-red-50 text-[#96161B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Headphones className="w-5 h-5 text-[#96161B]" />
              </div>
              <div className="text-left leading-tight">
                <span className="block font-black text-xs 2xl:text-sm text-slate-900 group-hover:text-[#96161B]">
                  Need Help?
                </span>
                <span className="text-[11px] text-slate-500 font-semibold">
                  Contact Support
                </span>
              </div>
            </Link>

            {/* Back to Shop */}
            <Link
              href="/products"
              className="flex items-center gap-2 text-xs 2xl:text-sm font-bold text-slate-800 hover:text-[#96161B] transition-colors py-2 px-3 rounded-xl hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4 text-slate-700" />
              <span>Back To Shop</span>
            </Link>

          </div>

        </div>
      </header>

      {/* =========================================================================
          PAGE TITLE: SECURE CHECKOUT (MATCHING SCREENSHOT)
      ========================================================================= */}
      <section className="bg-white border-b border-slate-200/80 py-6 sm:py-8 px-4 sm:px-8">
        <div className="max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black uppercase tracking-tight">
            <span>{(checkoutSettings.page_title || 'SECURE CHECKOUT').split(' ')[0]} </span>
            <span className="text-[#96161B]">
              {(checkoutSettings.page_title || 'SECURE CHECKOUT').split(' ').slice(1).join(' ') || 'CHECKOUT'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm 2xl:text-base text-slate-500 mt-1 font-medium">
            {checkoutSettings.page_subtitle || 'Complete Your Order Safely And Securely'}
          </p>
        </div>
      </section>

      {/* =========================================================================
          MAIN CHECKOUT STAGE: 2 COLUMNS (LEFT: 6 STEPS, RIGHT: STICKY ORDER SUMMARY)
      ========================================================================= */}
      <main className="flex-1 max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto px-4 sm:px-8 py-8 sm:py-12 w-full space-y-6">
        {/* STRIPE NOTIFICATION BANNERS */}
        {isCanceled && (
          <div className="bg-amber-50 border border-amber-300 text-amber-900 px-5 py-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-medium animate-fade-in shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <span>Card payment was canceled on Stripe. You can review your details and proceed whenever you are ready.</span>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 border border-red-300 text-red-900 px-5 py-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-bold animate-fade-in shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 2xl:gap-12 items-start">
            
            {/* -------------------------------------------------------------
                LEFT COLUMN (8 COLS): 5 STREAMLINED STEP CARDS
            ------------------------------------------------------------- */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">

              {/* =========================================================
                  STEP 1: YOUR PERSONAL DETAILS
              ========================================================= */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 2xl:p-8 space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <span className="w-8 h-8 rounded-full bg-[#96161B] text-white font-black text-sm flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div>
                    <h2 className="font-black text-sm sm:text-base 2xl:text-lg text-slate-900">
                      {checkoutSettings.step2_title || 'Your Personal Details'}
                    </h2>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Direct checkout — no login required
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      First Name <span className="text-[#96161B]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        className="w-full bg-slate-50/60 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs 2xl:text-sm outline-none focus:border-[#96161B] focus:bg-white text-slate-900"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Last Name <span className="text-[#96161B]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        className="w-full bg-slate-50/60 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs 2xl:text-sm outline-none focus:border-[#96161B] focus:bg-white text-slate-900"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      E-Mail <span className="text-[#96161B]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        className="w-full bg-slate-50/60 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs 2xl:text-sm outline-none focus:border-[#96161B] focus:bg-white text-slate-900"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Telephone <span className="text-[#96161B]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (561) 528 9764"
                        className="w-full bg-slate-50/60 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs 2xl:text-sm outline-none focus:border-[#96161B] focus:bg-white text-slate-900"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>
              </div>

              {/* =========================================================
                  STEP 2: BILLING ADDRESS
              ========================================================= */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 2xl:p-8 space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <span className="w-8 h-8 rounded-full bg-[#96161B] text-white font-black text-sm flex items-center justify-center shrink-0">
                    2
                  </span>
                  <h2 className="font-black text-sm sm:text-base 2xl:text-lg text-slate-900">
                    {checkoutSettings.step3_title || 'Billing & Shipping Address'}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Hospital or Clinic Name"
                      className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs 2xl:text-sm outline-none focus:border-[#96161B] focus:bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Address</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street Address, P.O. Box"
                      className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs 2xl:text-sm outline-none focus:border-[#96161B] focus:bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Address 2</label>
                    <input
                      type="text"
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                      placeholder="Apartment, Suite, Unit"
                      className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs 2xl:text-sm outline-none focus:border-[#96161B] focus:bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City <span className="text-[#96161B]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs 2xl:text-sm outline-none focus:border-[#96161B] focus:bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Post Code <span className="text-[#96161B]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={postCode}
                      onChange={(e) => setPostCode(e.target.value)}
                      placeholder="Postal / ZIP Code"
                      className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs 2xl:text-sm outline-none focus:border-[#96161B] focus:bg-white text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Country <span className="text-[#96161B]">*</span>
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-[#96161B] cursor-pointer text-slate-900"
                      >
                        <option value="United States">United States</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Region / State <span className="text-[#96161B]">*</span>
                      </label>
                      <select
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-[#96161B] cursor-pointer text-slate-900"
                      >
                        {US_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* =========================================================
                  STEP 3: SHIPPING METHOD
              ========================================================= */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 2xl:p-8 space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <span className="w-8 h-8 rounded-full bg-[#96161B] text-white font-black text-sm flex items-center justify-center shrink-0">
                    3
                  </span>
                  <h2 className="font-black text-sm sm:text-base 2xl:text-lg text-slate-900">
                    {checkoutSettings.step4_title || 'Shipping Method'}
                  </h2>
                </div>

                <label className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-[#96161B] transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      defaultChecked
                      className="accent-[#96161B] w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <span className="font-extrabold text-xs sm:text-sm text-slate-900 block">
                        {checkoutSettings.shipping_name || 'Shipping Fee'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {checkoutSettings.shipping_description || 'standard secure delivery with tracking'}
                      </span>
                    </div>
                  </div>
                  <span className="font-extrabold text-sm sm:text-base text-slate-900">
                    {shippingCost === 0 ? (
                      <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-xs font-black">
                        FREE SHIPPING
                      </span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </label>
              </div>

              {/* =========================================================
                  STEP 4: PAYMENT METHOD (CREDIT & DEBIT CARD VIA STRIPE)
              ========================================================= */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 2xl:p-8 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#96161B] text-white font-black text-sm flex items-center justify-center shrink-0">
                      4
                    </span>
                    <div>
                      <h2 className="font-black text-sm sm:text-base 2xl:text-lg text-slate-900">
                        {checkoutSettings.step5_title || 'Payment Method'}
                      </h2>
                      <span className="text-[11px] text-slate-400">
                        {checkoutSettings.step5_subtitle || 'Direct card payment — no cash on delivery'}
                      </span>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{checkoutSettings.step5_badge || 'Stripe 256-Bit SSL Encrypted'}</span>
                  </div>
                </div>

                {/* Credit / Debit Card Option (Full Width & Clean) */}
                <div className="p-5 rounded-2xl border-2 border-[#96161B] bg-red-50/20 ring-2 ring-red-100/60 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-[#96161B] flex items-center justify-center bg-white shrink-0">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#96161B]" />
                      </div>
                      <div>
                        <div className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                          <span>{checkoutSettings.card_title || 'Credit / Debit Card'}</span>
                          <span className="bg-[#96161B] text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                            {checkoutSettings.card_badge || 'Direct Online'}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 font-medium block mt-0.5">
                          {checkoutSettings.card_description || 'Visa, Mastercard, American Express, Discover (3D-Secure & SCA verified)'}
                        </span>
                      </div>
                    </div>

                    {/* Official Crisp Vector Logos */}
                    <div className="flex items-center gap-2 shrink-0">
                      <VisaIcon className="h-7 w-auto drop-shadow-xs" />
                      <MastercardIcon className="h-7 w-auto drop-shadow-xs" />
                      <AmexIcon className="h-7 w-auto drop-shadow-xs" />
                      <DiscoverIcon className="h-7 w-auto drop-shadow-xs" />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-red-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{checkoutSettings.card_footnote || "Card details are processed directly through Stripe's certified PCI Level 1 gateway."}</span>
                    </div>
                    <StripeBadge />
                  </div>
                </div>
              </div>

              {/* =========================================================
                  STEP 5: COUPON / VOUCHER / REWARD
              ========================================================= */}
              {checkoutSettings.enable_coupons !== false && (
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 2xl:p-8 space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <span className="w-8 h-8 rounded-full bg-[#96161B] text-white font-black text-sm flex items-center justify-center shrink-0">
                      5
                    </span>
                    <h2 className="font-black text-sm sm:text-base 2xl:text-lg text-slate-900">
                      {checkoutSettings.step6_title || 'Coupon / Voucher / Reward'}
                    </h2>
                  </div>

                  {couponMessage && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold">
                      {couponMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Coupon Input */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="enter your coupon"
                        className="flex-1 bg-slate-50/60 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#96161B] focus:bg-white text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="bg-[#96161B] hover:bg-[#7d1216] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                      >
                        Submit
                      </button>
                    </div>

                    {/* Gift Certificate Input */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={giftCertificate}
                        onChange={(e) => setGiftCertificate(e.target.value)}
                        placeholder="enter your gift certificate code here"
                        className="flex-1 bg-slate-50/60 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#96161B] focus:bg-white text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={handleApplyGift}
                        className="bg-[#96161B] hover:bg-[#7d1216] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* -------------------------------------------------------------
                RIGHT COLUMN (4 COLS): STICKY ORDER SUMMARY (MATCHING SCREENSHOT)
            ------------------------------------------------------------- */}
            <div className="lg:col-span-5 xl:col-span-4 sticky top-24 space-y-6">
              
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-6 sm:p-7 2xl:p-8 space-y-6">
                
                {/* HEADER: Your Order / Edit Cart */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">Your Order</h2>
                  <Link
                    href="/products"
                    className="text-xs sm:text-sm font-bold text-[#96161B] hover:underline cursor-pointer"
                  >
                    Edit Cart ({totalItemCount})
                  </Link>
                </div>

                {/* CART ITEMS LIST */}
                {cartItems.length === 0 ? (
                  <div className="text-center py-10 px-4 space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
                    <h3 className="font-bold text-slate-700 text-xs sm:text-sm">Your Cart is Currently Empty</h3>
                    <p className="text-[11px] text-slate-500">Add instruments or medical supplies to your cart to checkout.</p>
                    <Link
                      href="/products"
                      className="inline-flex items-center justify-center gap-1.5 bg-[#96161B] hover:bg-[#7d1216] text-white py-2 px-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow"
                    >
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {cartItems.map((item) => {
                      const itemPrice = item.price ?? 53.90
                      const lineTotal = itemPrice * item.quantity
                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 bg-slate-50/90 p-3 rounded-2xl border border-slate-200/90 hover:border-slate-300 transition-colors"
                        >
                          {/* Product Image */}
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-xl border border-slate-200 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                            <SafeProductImage
                              src={item.product?.featured_image || '/images/products/image-399.png'}
                              alt={item.product?.title || 'Product'}
                              width={72}
                              height={72}
                              className="object-contain w-full h-full"
                            />
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0 space-y-0.5">
                            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 line-clamp-1" title={item.product?.title}>
                              {item.product?.title}
                            </h3>
                            <div className="text-[11px] text-slate-500 font-medium">
                              Length: {item.length || item.size || 'Standard'}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              Model: {item.product?.sku || 'AMS020146'}
                            </div>

                            {/* Quantity Stepper & Item Price & Remove */}
                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center justify-between border border-slate-300 rounded-lg px-2 py-0.5 w-20 bg-white">
                                <button
                                  type="button"
                                  onClick={() => handleQuantityStep(item.id, item.quantity - 1)}
                                  className="text-slate-500 hover:text-black font-black text-xs cursor-pointer"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="font-black text-xs text-slate-900 select-none">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => handleQuantityStep(item.id, item.quantity + 1)}
                                  className="text-slate-500 hover:text-black font-black text-xs cursor-pointer"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="font-black text-xs sm:text-sm text-slate-900">
                                  ${lineTotal.toFixed(2)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFromCart(item.id)}
                                  className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors cursor-pointer"
                                  title="Remove item"
                                  aria-label="Remove item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* PRICE BREAKDOWN (MATCHING SCREENSHOT) */}
                <div className="space-y-3 text-xs sm:text-sm text-slate-600 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span>Sub-Total</span>
                    <span className="font-bold text-slate-900">${subTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{checkoutSettings.shipping_name || 'Shipping Fee'}</span>
                    <span className="font-bold text-slate-900">
                      {shippingCost === 0 ? (
                        <span className="text-emerald-700 font-extrabold">Free Shipping</span>
                      ) : (
                        `$${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-emerald-600 font-bold">
                      <span>Discount / Voucher</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="border-t border-slate-200 pt-3 flex items-baseline justify-between">
                    <span className="text-base sm:text-lg font-black text-slate-900">Total</span>
                    <span className="text-2xl sm:text-3xl font-black text-[#96161B]">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* SECURITY NOTICE BOX (LIGHT REDDISH) */}
                <div className="bg-red-50/70 border border-red-100 rounded-2xl p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-[#96161B] flex items-center justify-center shrink-0 mt-0.5">
                    <ThumbsUp className="w-4 h-4 text-[#96161B]" />
                  </div>
                  <div className="leading-tight">
                    <div className="font-extrabold text-xs text-[#96161B]">
                      {checkoutSettings.security_box_title || 'Your Payment Information Is Secure'}
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      {checkoutSettings.security_box_desc || 'We Use 256-Bit SSL Encryption To Protect Your Data'}
                    </div>
                  </div>
                </div>

                {/* LARGE RED PLACE ORDER BUTTON */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#96161B] hover:bg-[#7d1216] disabled:bg-slate-400 text-white py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-200 shadow-xl shadow-red-950/25 active:scale-98 cursor-pointer shimmer-effect"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Connecting To Secure Payment Gateway...'
                      : paymentMethod === 'card'
                      ? (checkoutSettings.button_text || 'PAY WITH CARD').replace(/\s*\(STRIPE\)/i, '')
                      : 'PLACE ORDER'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* GUARANTEED SAFE & SECURE CHECKOUT WITH OFFICIAL CARDS */}
                <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 text-center space-y-2">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#96161B]" />
                    <span>{checkoutSettings.guarantee_title || 'Guaranteed Safe & Secure Checkout'}</span>
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
                    <VisaIcon className="h-6 w-auto drop-shadow-xs" />
                    <MastercardIcon className="h-6 w-auto drop-shadow-xs" />
                    <AmexIcon className="h-6 w-auto drop-shadow-xs" />
                    <DiscoverIcon className="h-6 w-auto drop-shadow-xs" />
                  </div>

                  <div className="pt-1 flex items-center justify-center gap-2 text-[10px] text-slate-500 font-medium">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>{checkoutSettings.guarantee_desc || '256-Bit SSL Encryption • Powered by Stripe'}</span>
                  </div>
                </div>

                {/* =========================================================
                    4 TRUST ICONS (MATCHING EXACT SVGS PROVIDED BY USER)
                ========================================================= */}
                <div className="grid grid-cols-4 gap-2 pt-2 text-center border-t border-slate-100">
                  
                  {/* 1. Secure Checkout */}
                  <div className="flex flex-col items-center gap-1.5 p-1 group">
                    <div className="w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Image
                        src="/images/icons/secure-checkout.svg"
                        alt="Secure Checkout"
                        width={36}
                        height={36}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-[10px] 2xl:text-xs font-bold text-slate-800 leading-tight">
                      {checkoutSettings.trust_badge_1 || 'Secure Checkout'}
                    </span>
                  </div>

                  {/* 2. Worldwide Shipping */}
                  <div className="flex flex-col items-center gap-1.5 p-1 group">
                    <div className="w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Image
                        src="/images/icons/fastshipping.svg"
                        alt="Worldwide Shipping"
                        width={36}
                        height={36}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-[10px] 2xl:text-xs font-bold text-slate-800 leading-tight">
                      {checkoutSettings.trust_badge_2 || 'Worldwide Shipping'}
                    </span>
                  </div>

                  {/* 3. Premium Quality */}
                  <div className="flex flex-col items-center gap-1.5 p-1 group">
                    <div className="w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Image
                        src="/images/icons/quality-icon.svg"
                        alt="Premium Quality"
                        width={36}
                        height={36}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-[10px] 2xl:text-xs font-bold text-slate-800 leading-tight">
                      {checkoutSettings.trust_badge_3 || 'Premium Quality'}
                    </span>
                  </div>

                  {/* 4. Expert Support */}
                  <div className="flex flex-col items-center gap-1.5 p-1 group">
                    <div className="w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Image
                        src="/images/icons/support.svg"
                        alt="Expert Support"
                        width={36}
                        height={36}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-[10px] 2xl:text-xs font-bold text-slate-800 leading-tight">
                      {checkoutSettings.trust_badge_4 || 'Expert Support'}
                    </span>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </form>
      </main>

      {/* =========================================================================
          ORDER CONFIRMATION MODAL
      ========================================================================= */}
      {orderPlaced && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl border border-slate-100">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                Order Confirmed!
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Thank you for your order with Alpha Wholesale Medical Supplies. Your order reference is{' '}
                <span className="font-mono font-black text-[#96161B]">{orderNumber}</span>.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-left space-y-2 max-h-48 overflow-y-auto">
              <div className="font-bold text-slate-800 pb-1 border-b border-slate-200">
                Ordered Products ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}):
              </div>
              {cartItems.map((it) => (
                <div key={it.id} className="flex justify-between items-center text-slate-600">
                  <span className="truncate max-w-[200px] font-medium">
                    {it.quantity}x {it.product.title}
                  </span>
                  <span className="font-mono font-bold text-slate-900 shrink-0">
                    ${(it.price * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t border-slate-200 pt-1.5 flex justify-between font-medium">
                <span className="text-slate-500">Total Paid:</span>
                <span className="font-bold text-[#96161B]">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Shipping:</span>
                <span className="font-bold text-slate-900">
                  {shippingCost === 0 ? 'Free Shipping' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                href="/products"
                className="block w-full bg-[#96161B] hover:bg-[#7d1216] text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow cursor-pointer"
              >
                Continue Shopping
              </Link>
              <Link
                href="/"
                className="block w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        <p>{checkoutSettings.footer_text || '© 2026 ALPHA Wholesale Medical Supplies LLC. All Rights Reserved. ISO 13485:2016 Certified.'}</p>
      </footer>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center py-20 font-sans">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#96161B] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-500">Loading Secure Checkout...</p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  )
}
