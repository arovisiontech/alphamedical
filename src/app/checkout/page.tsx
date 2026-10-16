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
} from 'lucide-react'
import { getStoredProducts } from '@/src/lib/dataStore'
import { ProductItem } from '@/src/types/product'

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productSlug = searchParams.get('product') || ''
  const queryQty = searchParams.get('qty') ? Math.max(1, parseInt(searchParams.get('qty') || '1')) : null
  const querySize = searchParams.get('size') || ''
  const queryPrice = searchParams.get('price') ? parseFloat(searchParams.get('price') || '') : null

  // Product state
  const [orderedProduct, setOrderedProduct] = useState<ProductItem | null>(null)
  const [quantity, setQuantity] = useState<number>(queryQty || 1)
  const [selectedLength, setSelectedLength] = useState<string>(querySize || '15.5cm')
  const [selectedType, setSelectedType] = useState<string>('2x3 Teeth')

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

  // Address
  const [company, setCompany] = useState('')
  const [address, setAddress] = useState('')
  const [address2, setAddress2] = useState('')
  const [city, setCity] = useState('')
  const [postCode, setPostCode] = useState('')
  const [country, setCountry] = useState('Pakistan')
  const [region, setRegion] = useState('Punjab')

  // Order state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  useEffect(() => {
    if (queryQty) setQuantity(queryQty)
    if (querySize) setSelectedLength(querySize)
  }, [queryQty, querySize])

  useEffect(() => {
    const products = getStoredProducts()
    let match: ProductItem | undefined
    if (productSlug) {
      match = products.find(
        (p) =>
          p.slug.toLowerCase() === productSlug.toLowerCase() ||
          p.id.toLowerCase() === productSlug.toLowerCase()
      )
    }
    if (!match && products.length > 0) {
      match =
        products.find((p) => p.title.toLowerCase().includes('tissue forceps') || p.title.toLowerCase().includes('adlerkreutz')) ||
        products[0]
    }
    if (match) {
      setOrderedProduct(match)
    }
  }, [productSlug])

  const productPrice = queryPrice !== null && !isNaN(queryPrice) ? queryPrice : (orderedProduct?.price ?? 53.90)
  const subTotal = productPrice * quantity
  const shippingCost = (quantity >= 10 || subTotal >= 100) ? 0.00 : 30.99
  const total = Math.max(0, subTotal + shippingCost - discountAmount)

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponCode.trim()) return
    if (couponCode.toUpperCase() === 'ALPHA10' || couponCode.toUpperCase() === 'SURGICAL') {
      const discount = subTotal * 0.1
      setDiscountAmount(discount)
      setCouponMessage('Coupon applied! 10% discount saved.')
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

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const generatedRef = `ALPH-${Math.floor(100000 + Math.random() * 900000)}`
    setOrderNumber(generatedRef)

    setTimeout(() => {
      setIsSubmitting(false)
      setOrderPlaced(true)
    }, 1200)
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
            <span>SECURE </span>
            <span className="text-[#96161B]">CHECKOUT</span>
          </h1>
          <p className="text-xs sm:text-sm 2xl:text-base text-slate-500 mt-1 font-medium">
            Complete Your Order Safely And Securely
          </p>
        </div>
      </section>

      {/* =========================================================================
          MAIN CHECKOUT STAGE: 2 COLUMNS (LEFT: 6 STEPS, RIGHT: STICKY ORDER SUMMARY)
      ========================================================================= */}
      <main className="flex-1 max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto px-4 sm:px-8 py-8 sm:py-12 w-full">
        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 2xl:gap-12 items-start">
            
            {/* -------------------------------------------------------------
                LEFT COLUMN (8 COLS): 6 NUMBERED STEP CARDS
            ------------------------------------------------------------- */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">

              {/* =========================================================
                  STEP 1: LOGIN OR REGISTER
              ========================================================= */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 2xl:p-8 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#96161B] text-white font-black text-sm flex items-center justify-center shrink-0">
                      1
                    </span>
                    <div>
                      <h2 className="font-black text-sm sm:text-base 2xl:text-lg text-slate-900 leading-tight">
                        Login Or Register
                      </h2>
                      <span className="text-xs text-slate-400 font-medium">
                        Already Have An Account?
                      </span>
                    </div>
                  </div>

                  {/* Right: Checkout as Guest */}
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Checkout As Guest</div>
                      <div className="text-[10px] text-slate-400">no account required</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-2 text-xs sm:text-sm font-bold text-slate-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="auth"
                      checked={authType === 'login'}
                      onChange={() => setAuthType('login')}
                      className="accent-[#96161B] w-4 h-4 cursor-pointer"
                    />
                    <span>Login</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="auth"
                      checked={authType === 'register'}
                      onChange={() => setAuthType('register')}
                      className="accent-[#96161B] w-4 h-4 cursor-pointer"
                    />
                    <span>Register</span>
                  </label>
                </div>
              </div>

              {/* =========================================================
                  STEP 2: YOUR PERSONAL DETAILS
              ========================================================= */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 2xl:p-8 space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <span className="w-8 h-8 rounded-full bg-[#96161B] text-white font-black text-sm flex items-center justify-center shrink-0">
                    2
                  </span>
                  <h2 className="font-black text-sm sm:text-base 2xl:text-lg text-slate-900">
                    Your Personal Details
                  </h2>
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
                  STEP 3: BILLING ADDRESS
              ========================================================= */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 2xl:p-8 space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <span className="w-8 h-8 rounded-full bg-[#96161B] text-white font-black text-sm flex items-center justify-center shrink-0">
                    3
                  </span>
                  <h2 className="font-black text-sm sm:text-base 2xl:text-lg text-slate-900">
                    Billing Address
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
                        <option value="Pakistan">Pakistan</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Germany">Germany</option>
                        <option value="United Arab Emirates">UAE</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
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
                        <option value="Punjab">Punjab</option>
                        <option value="Sindh">Sindh</option>
                        <option value="Khyber Pakhtunkhwa">KPK</option>
                        <option value="Balochistan">Balochistan</option>
                        <option value="Islamabad">Islamabad</option>
                        <option value="California">California</option>
                        <option value="Texas">Texas</option>
                        <option value="New York">New York</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* =========================================================
                  STEP 4: SHIPPING METHOD
              ========================================================= */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 2xl:p-8 space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <span className="w-8 h-8 rounded-full bg-[#96161B] text-white font-black text-sm flex items-center justify-center shrink-0">
                    4
                  </span>
                  <h2 className="font-black text-sm sm:text-base 2xl:text-lg text-slate-900">
                    Shipping Method
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
                        Fast International Shipping
                      </span>
                      <span className="text-[11px] text-slate-400">
                        reliable worldwide delivery
                      </span>
                    </div>
                  </div>
                  <span className="font-extrabold text-sm sm:text-base text-slate-900">
                    ${shippingCost.toFixed(2)}
                  </span>
                </label>
              </div>

              {/* =========================================================
                  STEP 5: PAYMENT METHOD
              ========================================================= */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 2xl:p-8 space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <span className="w-8 h-8 rounded-full bg-[#96161B] text-white font-black text-sm flex items-center justify-center shrink-0">
                    5
                  </span>
                  <h2 className="font-black text-sm sm:text-base 2xl:text-lg text-slate-900">
                    Payment Method
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card Option */}
                  <label
                    className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#96161B] bg-red-50/20 ring-1 ring-[#96161B]'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="accent-[#96161B] w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <span className="font-extrabold text-xs sm:text-sm text-slate-900 block">
                          Credit / Debit Card
                        </span>
                        <span className="text-[10px] text-slate-400">
                          (3d and sca secured)
                        </span>
                      </div>
                    </div>
                    {/* Card Brand Pills */}
                    <div className="flex items-center gap-1">
                      <span className="bg-blue-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded italic">
                        VISA
                      </span>
                      <span className="bg-red-600 text-white font-black text-[9px] px-1 py-0.5 rounded">
                        MC
                      </span>
                      <span className="bg-sky-500 text-white font-black text-[9px] px-1 py-0.5 rounded">
                        AMEX
                      </span>
                    </div>
                  </label>

                  {/* PayPal Option */}
                  <label
                    className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'paypal'
                        ? 'border-[#96161B] bg-red-50/20 ring-1 ring-[#96161B]'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === 'paypal'}
                        onChange={() => setPaymentMethod('paypal')}
                        className="accent-[#96161B] w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <span className="font-extrabold text-xs sm:text-sm text-slate-900 block">
                          Paypal
                        </span>
                        <span className="text-[10px] text-slate-400">
                          american express card
                        </span>
                      </div>
                    </div>
                    <span className="text-blue-700 font-black italic text-xs">PayPal</span>
                  </label>
                </div>
              </div>

              {/* =========================================================
                  STEP 6: COUPON / VOUCHER / REWARD
              ========================================================= */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 2xl:p-8 space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <span className="w-8 h-8 rounded-full bg-[#96161B] text-white font-black text-sm flex items-center justify-center shrink-0">
                    6
                  </span>
                  <h2 className="font-black text-sm sm:text-base 2xl:text-lg text-slate-900">
                    Coupon / Voucher / Reward
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

            </div>

            {/* -------------------------------------------------------------
                RIGHT COLUMN (4 COLS): STICKY ORDER SUMMARY (MATCHING SCREENSHOT)
            ------------------------------------------------------------- */}
            <div className="lg:col-span-5 xl:col-span-4 sticky top-24 space-y-6">
              
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-6 sm:p-7 2xl:p-8 space-y-6">
                
                {/* HEADER: Your Order / Edit Cart (1) */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">Your Order</h2>
                  <Link
                    href="/products"
                    className="text-xs sm:text-sm font-bold text-[#96161B] hover:underline cursor-pointer"
                  >
                    Edit Cart ({quantity})
                  </Link>
                </div>

                {/* CART PRODUCT CARD (MATCHING SCREENSHOT EXACT DESIGN) */}
                <div className="flex items-center gap-4 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
                  {/* Product Image */}
                  <div className="relative w-20 h-20 2xl:w-24 2xl:h-24 bg-white rounded-xl border border-slate-200 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                    <Image
                      src={orderedProduct?.featured_image || '/images/products/image-399.png'}
                      alt={orderedProduct?.title || 'Adlerkreutz Tissue Forceps'}
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 line-clamp-1">
                      {orderedProduct?.title || 'Adlerkreutz Tissue Forceps'}
                    </h3>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Length: {selectedLength}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Type: {selectedType}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Model: {orderedProduct?.sku || 'AMS020146'}
                    </div>

                    {/* Quantity Stepper & Item Price */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center justify-between border border-slate-300 rounded-lg px-2 py-0.5 w-20 bg-white">
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="text-slate-500 hover:text-black font-black text-xs cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-black text-xs text-slate-900">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => q + 1)}
                          className="text-slate-500 hover:text-black font-black text-xs cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-black text-sm text-slate-900">
                        ${productPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* PRICE BREAKDOWN (MATCHING SCREENSHOT) */}
                <div className="space-y-3 text-xs sm:text-sm text-slate-600 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span>Sub-Total</span>
                    <span className="font-bold text-slate-900">${subTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Fast International Shipping</span>
                    <span className="font-bold text-slate-900">${shippingCost.toFixed(2)}</span>
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
                      Your Payment Information Is Secure
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      We Use 256-Bit SSL Encryption To Protect Your Data
                    </div>
                  </div>
                </div>

                {/* LARGE RED PLACE ORDER BUTTON */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#96161B] hover:bg-[#7d1216] text-white py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-200 shadow-xl shadow-red-950/25 active:scale-98 cursor-pointer shimmer-effect"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isSubmitting ? 'Processing Order...' : 'PLACE ORDER'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

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
                      Secure Checkout
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
                      Worldwide Shipping
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
                      Premium Quality
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
                      Expert Support
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

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-left space-y-1.5">
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Item:</span>
                <span className="font-bold text-slate-900 truncate max-w-[180px]">
                  {orderedProduct?.title}
                </span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Total Paid:</span>
                <span className="font-bold text-[#96161B]">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Shipping:</span>
                <span className="font-bold text-slate-900">Fast International (Tracking dispatched)</span>
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
        <p>© 2026 ALPHA Wholesale Medical Supplies LLC. All Rights Reserved. ISO 13485:2016 Certified.</p>
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
