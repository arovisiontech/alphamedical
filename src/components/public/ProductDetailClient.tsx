'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ChevronRight,
  Star,
  Check,
  ShieldCheck,
  Truck,
  Headphones,
  Maximize2,
  X,
  ShoppingCart,
  Zap,
  MessageSquare,
  Minus,
  Plus,
  ArrowRight,
  Award,
  Sparkles,
  CheckCircle2,
  Edit2,
  Trash2,
  Sliders,
  Settings,
  Save,
  AlertCircle,
} from 'lucide-react'
import TopBar from '@/src/components/public/TopBar'
import HeaderNav from '@/src/components/public/HeaderNav'
import MainRedNavbar from '@/src/components/public/MainRedNavbar'
import PublicFooter from '@/src/components/public/PublicFooter'
import CartQuoteModal from '@/src/components/public/CartQuoteModal'
import PublicSearchModal from '@/src/components/public/PublicSearchModal'
import InquiryModal from '@/src/components/public/InquiryModal'
import { useGeoLocation } from '@/src/context/GeoLocationContext'
import { ProductItem } from '@/src/types/product'
import { getStoredProducts } from '@/src/lib/dataStore'

interface ProductDetailClientProps {
  initialProduct: ProductItem
  allProducts: ProductItem[]
}

export default function ProductDetailClient({
  initialProduct,
  allProducts: propProducts,
}: ProductDetailClientProps) {
  const router = useRouter()
  const { isUsaStore, openInquiryModal } = useGeoLocation()

  // State
  const [products, setProducts] = useState<ProductItem[]>(propProducts)
  const [product, setProduct] = useState<ProductItem>(initialProduct)
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0)
  const [isZoomOpen, setIsZoomOpen] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'sterilization' | 'certifications'>('overview')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Sizes selection & Customization
  const [availableSizes, setAvailableSizes] = useState<string[]>(
    product.sizes && product.sizes.length > 0
      ? product.sizes
      : ['12.5cm', '14.0cm', '15.5cm', '18.0cm', '20.5cm']
  )
  const [selectedSize, setSelectedSize] = useState<string>(
    (product.sizes && product.sizes[0]) || '15.5cm'
  )
  const [isCustomSizeOpen, setIsCustomSizeOpen] = useState<boolean>(false)
  const [customSizeInput, setCustomSizeInput] = useState<string>('')

  // Tiered Quantity Discounts matching Screenshot 1 (PeakSurgicals)
  const defaultDiscountTiers = [
    { quantity: 1, discount_percentage: 0, badge: 'Standard price', free_shipping: false },
    { quantity: 10, discount_percentage: 5, badge: 'Save 5%', free_shipping: true },
    { quantity: 30, discount_percentage: 10, badge: 'Save 10%', free_shipping: true },
    { quantity: 70, discount_percentage: 15, badge: 'Save 15%', free_shipping: true },
    { quantity: 100, discount_percentage: 20, badge: 'Save 20%', free_shipping: true },
  ]

  const discountTiers =
    product.quantity_discounts && product.quantity_discounts.length > 0
      ? product.quantity_discounts
      : defaultDiscountTiers

  const [selectedTierQty, setSelectedTierQty] = useState<number>(1)
  const [quantity, setQuantity] = useState<number>(1)

  // Stock inventory tracking
  const stockRemaining = typeof product.stock_quantity === 'number' ? product.stock_quantity : 142
  const unitsSold = 58

  // Base price calculation
  const basePrice = Number(product.price) || 53.90
  const originalPrice = product.original_price ?? (basePrice * 1.2)

  // Dynamic calculations based on selected quantity
  const sortedTiers = [...discountTiers].sort((a, b) => b.quantity - a.quantity)
  const activeTier =
    sortedTiers.find((t) => quantity >= t.quantity) || {
      quantity: 1,
      discount_percentage: 0,
      badge: 'Standard price',
      free_shipping: false,
    }
  const discountPercent = activeTier.discount_percentage
  const unitPrice = basePrice * (1 - discountPercent / 100)
  const totalPrice = unitPrice * quantity
  const totalRegularPrice = basePrice * quantity
  const totalSavings = totalRegularPrice - totalPrice

  // Variant selections
  const [selectedLength, setSelectedLength] = useState<string>('15.5cm (Standard)')
  const [selectedType, setSelectedType] = useState<string>('3x4 Sharp Prongs')
  const [isAddedToCart, setIsAddedToCart] = useState<boolean>(false)

  // Admin Quick Edit Modal state
  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false)
  const [isSavingProduct, setIsSavingProduct] = useState(false)
  const [quickEditForm, setQuickEditForm] = useState({
    price: product.price ?? 53.90,
    original_price: product.original_price ?? 64.95,
    stock_quantity: typeof product.stock_quantity === 'number' ? product.stock_quantity : 142,
    sizes: (product.sizes && product.sizes.length > 0 ? product.sizes : ['12.5cm', '14.0cm', '15.5cm', '18.0cm', '20.5cm']).join(', '),
    tier_10_discount: discountTiers.find((t) => t.quantity === 10)?.discount_percentage ?? 5,
    tier_30_discount: discountTiers.find((t) => t.quantity === 30)?.discount_percentage ?? 10,
    tier_70_discount: discountTiers.find((t) => t.quantity === 70)?.discount_percentage ?? 15,
    tier_100_discount: discountTiers.find((t) => t.quantity === 100)?.discount_percentage ?? 20,
  })

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false)
  const [cartItems, setCartItems] = useState<any[]>([])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Handle tier selection
  const handleSelectTier = (tQty: number) => {
    setSelectedTierQty(tQty)
    setQuantity(tQty)
  }

  // Handle quantity changes
  const handleQuantityChange = (newQty: number) => {
    const val = Math.max(1, Math.min(newQty, stockRemaining))
    setQuantity(val)
    const exactMatch = discountTiers.find((t) => t.quantity === val)
    if (exactMatch) {
      setSelectedTierQty(val)
    } else {
      const highestBelow = [...discountTiers]
        .sort((a, b) => b.quantity - a.quantity)
        .find((t) => val >= t.quantity)
      setSelectedTierQty(highestBelow ? highestBelow.quantity : 1)
    }
  }

  // Handle custom size add
  const handleAddCustomSize = () => {
    if (!customSizeInput.trim()) return
    const formatted = customSizeInput.trim()
    if (!availableSizes.includes(formatted)) {
      setAvailableSizes((prev) => [...prev, formatted])
    }
    setSelectedSize(formatted)
    setCustomSizeInput('')
    setIsCustomSizeOpen(false)
    showToast(`Custom size "${formatted}" selected!`)
  }

  // Handle Admin Quick Edit Save
  const handleSaveQuickEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingProduct(true)

    try {
      const parsedSizes = quickEditForm.sizes
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const updatedTiers = [
        { quantity: 1, discount_percentage: 0, badge: 'Standard price', free_shipping: false },
        {
          quantity: 10,
          discount_percentage: Number(quickEditForm.tier_10_discount) || 5,
          badge: `Save ${quickEditForm.tier_10_discount}%`,
          free_shipping: true,
        },
        {
          quantity: 30,
          discount_percentage: Number(quickEditForm.tier_30_discount) || 10,
          badge: `Save ${quickEditForm.tier_30_discount}%`,
          free_shipping: true,
        },
        {
          quantity: 70,
          discount_percentage: Number(quickEditForm.tier_70_discount) || 15,
          badge: `Save ${quickEditForm.tier_70_discount}%`,
          free_shipping: true,
        },
        {
          quantity: 100,
          discount_percentage: Number(quickEditForm.tier_100_discount) || 20,
          badge: `Save ${quickEditForm.tier_100_discount}%`,
          free_shipping: true,
        },
      ]

      const updatedProduct: ProductItem = {
        ...product,
        price: Number(quickEditForm.price) || 53.90,
        original_price: Number(quickEditForm.original_price) || 64.95,
        stock_quantity: Number(quickEditForm.stock_quantity) || 142,
        sizes: parsedSizes.length > 0 ? parsedSizes : availableSizes,
        quantity_discounts: updatedTiers,
        updated_at: new Date().toISOString(),
      }

      setProduct(updatedProduct)
      setAvailableSizes(updatedProduct.sizes || availableSizes)

      const allStored = getStoredProducts()
      const updatedAll = allStored.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      localStorage.setItem('alpha_products_v2', JSON.stringify(updatedAll))
      localStorage.setItem('alpha_products', JSON.stringify(updatedAll))
      window.dispatchEvent(new Event('alpha_content_updated'))

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'saveSingle', product: updatedProduct }),
      })

      if (res.ok) {
        showToast('Product pricing, discounts & sizes saved to disk!')
        setIsQuickEditOpen(false)
      } else {
        showToast('Saved locally, server returned notice.')
      }
    } catch (err) {
      console.error('Error saving product:', err)
      showToast('Error saving product.')
    } finally {
      setIsSavingProduct(false)
    }
  }

  // Handle direct product delete
  const handleDeleteProductDirect = async () => {
    if (!confirm(`Are you sure you want to delete "${product.title}"? This will remove it from the store.`)) return
    try {
      const allStored = getStoredProducts()
      const updatedAll = allStored.filter((p) => p.id !== product.id)
      localStorage.setItem('alpha_products_v2', JSON.stringify(updatedAll))
      localStorage.setItem('alpha_products', JSON.stringify(updatedAll))
      window.dispatchEvent(new Event('alpha_content_updated'))

      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id: product.id }),
      })

      showToast('Product deleted from server disk!')
      router.push('/products')
    } catch (err) {
      alert('Error deleting product')
    }
  }

  // Immediate update on prop change
  useEffect(() => {
    setProduct(initialProduct)
    setActiveImageIndex(0)
    if (initialProduct.sizes && initialProduct.sizes.length > 0) {
      setAvailableSizes(initialProduct.sizes)
      setSelectedSize(initialProduct.sizes[0])
    }
  }, [initialProduct])

  // Live client sync with API and localStorage
  useEffect(() => {
    const syncClient = () => {
      const stored = getStoredProducts()
      if (stored && stored.length > 0) {
        setProducts(stored)
        const match = stored.find((p) => p.id === initialProduct.id || p.slug === initialProduct.slug)
        if (match) {
          setProduct(match)
          if (match.sizes && match.sizes.length > 0) {
            setAvailableSizes(match.sizes)
          }
        }
      }
    }

    syncClient()

    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data)
          const match = data.find((p) => p.id === initialProduct.id || p.slug === initialProduct.slug)
          if (match) {
            setProduct(match)
            if (match.sizes && match.sizes.length > 0) {
              setAvailableSizes(match.sizes)
            }
          }
        }
      })
      .catch(() => {})

    window.addEventListener('alpha_content_updated', syncClient)
    window.addEventListener('storage', syncClient)

    return () => {
      window.removeEventListener('alpha_content_updated', syncClient)
      window.removeEventListener('storage', syncClient)
    }
  }, [initialProduct.id, initialProduct.slug])

  // Gallery images array
  const mainImage = product.featured_image || '/images/products/image-399.png'
  const gallery = [
    mainImage,
    '/images/products/image-399.png',
    '/images/categories/image_376.png',
    '/images/categories/image_377.png',
    '/images/extracted/image_8.png',
  ]
  const currentImage = gallery[activeImageIndex] || mainImage

  // Pricing & Badges
  const badge = product.badge || 'New'
  const inStock = product.in_stock !== false
  const sku = product.sku || 'NMD020146'

  // Related products
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.is_published !== false)
    .slice(0, 4)

  const handleAddToCart = () => {
    const itemToAdd = {
      ...product,
      price: unitPrice,
      selected_size: selectedSize,
      selected_quantity: quantity,
      selected_length: selectedLength,
      selected_type: selectedType,
    }
    setCartItems((prev) => {
      const exists = prev.some((i) => i.id === product.id)
      if (exists) return prev.map((i) => (i.id === product.id ? itemToAdd : i))
      return [...prev, itemToAdd]
    })
    setIsAddedToCart(true)
    setTimeout(() => setIsAddedToCart(false), 2200)
    setIsCartOpen(true)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push(
      `/checkout?product=${encodeURIComponent(product.slug || product.id)}&qty=${quantity}&size=${encodeURIComponent(
        selectedSize
      )}&price=${unitPrice.toFixed(2)}`
    )
  }

  const handleInquiryClick = () => {
    openInquiryModal(product)
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col font-sans text-slate-900 selection:bg-[#96161B] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP BAR */}
      <TopBar />

      {/* 2. HEADER */}
      <HeaderNav
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartItems.length}
      />

      {/* 3. MAIN MAROON RED NAVBAR */}
      <MainRedNavbar />

      {/* =========================================================================
          HERO BANNER AREA (MATCHING IMAGE 392.SVG CLEAN WHITE & RED DESIGN)
      ========================================================================= */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200/90 font-sans select-none min-h-[220px] sm:min-h-[260px] lg:min-h-[290px] flex items-center">
        {/* BACKGROUND SURGICAL TRAY IMAGE (IMAGE 392.SVG) ON THE RIGHT */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-2/3 lg:w-1/2 pointer-events-none z-0">
          <div className="relative w-full h-full opacity-90 sm:opacity-100 flex items-center justify-end">
            <Image
              src="/images/banners/banner-surgical-clean.png"
              alt="Alpha Medical Supplies Banner"
              fill
              priority
              className="object-cover object-right-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 sm:via-white/45 to-transparent" />
          </div>
        </div>

        <div className="relative z-10 w-full max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            {/* BREADCRUMB */}
            <nav className="flex items-center gap-1.5 text-xs 2xl:text-sm font-semibold text-slate-500 flex-wrap" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#B92025] transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link href="/products" className="hover:text-[#B92025] transition-colors">
                Shop
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[#B92025] font-bold uppercase">{product.category_name || 'Surgical Instruments'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-800 font-bold truncate max-w-[220px] sm:max-w-none">{product.title}</span>
            </nav>

            {/* HEADLINE */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black uppercase tracking-tight leading-tight">
              <span className="text-[#B92025] mr-2.5">{product.category_name?.split(' ')[0] || 'SURGICAL'}</span>
              <span className="text-slate-900">{product.title}</span>
            </h1>
            <p className="text-xs sm:text-sm 2xl:text-base text-slate-600 max-w-2xl leading-relaxed">
              {product.short_description ||
                'Precision instruments for advanced surgical, dental, orthopedic, and operating room procedures.'}
            </p>

            {/* VALUE BADGES PILL ROW */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-5 text-[11px] sm:text-xs font-bold text-slate-800">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-full shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-[#B92025]" />
                <span>Premium Quality (Built to Last)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-full shadow-xs">
                <Truck className="w-4 h-4 text-[#B92025]" />
                <span>Worldwide Shipping (Global Reach)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-full shadow-xs">
                <Award className="w-4 h-4 text-[#B92025]" />
                <span>Wide Range (1000+ Instruments)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-full shadow-xs">
                <Headphones className="w-4 h-4 text-[#B92025]" />
                <span>Expert Support (Always Here to Help)</span>
              </div>
            </div>
          </div>

          {/* RIGHT ACCENT CALLOUT */}
          <div className="hidden xl:flex flex-col items-end text-right border-l-2 border-[#B92025] pl-6 py-1">
            <span className="w-8 h-1 bg-[#B92025] rounded-full mb-1 inline-block" />
            <span className="text-[11px] uppercase tracking-widest text-[#B92025] font-extrabold">
              PRECISION CARE
            </span>
            <span className="text-xl 2xl:text-2xl font-black text-slate-900 tracking-wider">
              BETTER OUTCOMES
            </span>
            <span className="text-xs text-slate-500 mt-1">ISO 13485:2016 Certified Facility</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MAIN PRODUCT STAGE: 3-COLUMN VIEW LARGE DESIGN
      ========================================================================= */}
      <main className="flex-1 max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        
        {/* CLIENT / ADMIN QUICK EDIT ACTION BAR */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-3xl border border-slate-700 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600/30 border border-red-500/50 flex items-center justify-center text-red-400">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                <span>Product Management Controls</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Live Disk Sync
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Directly adjust price, discount tiers, custom sizes, and inventory stock for this item.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => {
                setQuickEditForm({
                  price: product.price ?? 53.90,
                  original_price: product.original_price ?? 64.95,
                  stock_quantity: typeof product.stock_quantity === 'number' ? product.stock_quantity : 142,
                  sizes: (availableSizes && availableSizes.length > 0 ? availableSizes : ['12.5cm', '14.0cm', '15.5cm', '18.0cm', '20.5cm']).join(', '),
                  tier_10_discount: discountTiers.find((t) => t.quantity === 10)?.discount_percentage ?? 5,
                  tier_30_discount: discountTiers.find((t) => t.quantity === 30)?.discount_percentage ?? 10,
                  tier_70_discount: discountTiers.find((t) => t.quantity === 70)?.discount_percentage ?? 15,
                  tier_100_discount: discountTiers.find((t) => t.quantity === 100)?.discount_percentage ?? 20,
                })
                setIsQuickEditOpen(true)
              }}
              className="flex-1 sm:flex-none bg-[#96161B] hover:bg-[#b92025] text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Quick Edit Price, Discounts & Sizes</span>
            </button>
            <button
              type="button"
              onClick={handleDeleteProductDirect}
              className="bg-red-950/60 hover:bg-red-900 text-red-200 border border-red-800 text-xs font-bold px-3 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
              title="Delete Product"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 2xl:gap-12 items-start">
          
          {/* -------------------------------------------------------------
              COLUMN 1 (LEFT): SMALL THUMBNAIL VIEWS (5 ANGLES)
          ------------------------------------------------------------- */}
          <div className="lg:col-span-1 flex lg:flex-col gap-3 order-2 lg:order-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
            {gallery.map((thumb, idx) => {
              const isActive = activeImageIndex === idx
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 2xl:w-24 2xl:h-24 rounded-2xl bg-white border-2 p-1.5 shrink-0 transition-all cursor-pointer flex items-center justify-center overflow-hidden hover-card-3d ${
                    isActive
                      ? 'border-[#96161B] shadow-md ring-2 ring-[#96161B]/20'
                      : 'border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100'
                  }`}
                  aria-label={`View angle ${idx + 1}`}
                >
                  <Image
                    src={thumb}
                    alt={`${product.title} angle ${idx + 1}`}
                    fill
                    sizes="96px"
                    className="object-contain p-1"
                  />
                  {isActive && (
                    <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#96161B]" />
                  )}
                </button>
              )
            })}
          </div>

          {/* -------------------------------------------------------------
              COLUMN 2 (CENTER): LARGE VIEW CARD WITH ZOOM & ANNOTATIONS
          ------------------------------------------------------------- */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
            <div className="relative bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-10 flex items-center justify-center min-h-[420px] sm:min-h-[500px] 2xl:min-h-[620px] overflow-hidden group">
              {/* TOP BADGE */}
              <div className="absolute top-5 left-5 z-20 flex items-center gap-2">
                <span className="bg-[#96161B] text-white text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl shadow-md">
                  {badge}
                </span>
                {product.is_best_seller && (
                  <span className="bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>Best Seller</span>
                  </span>
                )}
              </div>

              {/* EXPAND TO FULLSCREEN / ZOOM BUTTON */}
              <button
                type="button"
                onClick={() => setIsZoomOpen(true)}
                className="absolute bottom-5 right-5 z-20 w-11 h-11 rounded-2xl bg-white/90 hover:bg-[#96161B] hover:text-white text-slate-700 shadow-lg border border-slate-200 flex items-center justify-center transition-all cursor-pointer hover:scale-105"
                title="Click to Zoom Fullscreen"
                aria-label="Expand view"
              >
                <Maximize2 className="w-5 h-5" />
              </button>

              {/* MAIN LARGE INSTRUMENT VIEW */}
              <div className="relative w-full aspect-square max-w-[480px] 2xl:max-w-[580px] flex items-center justify-center">
                <Image
                  src={currentImage}
                  alt={product.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-105"
                  priority
                />
              </div>

              {/* ANNOTATION CALLOUT 1 */}
              <div className="hidden sm:flex items-center gap-3 absolute top-12 right-6 bg-white/95 backdrop-blur-sm border border-slate-200/90 shadow-lg rounded-2xl p-2.5 z-10 animate-fade-in hover-card-3d pointer-events-none">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden relative shrink-0">
                  <Image
                    src={gallery[1] || currentImage}
                    alt="Serrated Jaw Detail"
                    fill
                    className="object-cover p-0.5"
                  />
                </div>
                <div className="text-[11px] leading-tight pr-1">
                  <span className="font-extrabold text-slate-900 block">Serrated Jaws</span>
                  <span className="text-slate-500 text-[10px]">Secure tissue hold</span>
                </div>
              </div>

              {/* ANNOTATION CALLOUT 2 */}
              <div className="hidden sm:flex items-center gap-3 absolute bottom-12 left-6 bg-white/95 backdrop-blur-sm border border-slate-200/90 shadow-lg rounded-2xl p-2.5 z-10 animate-fade-in hover-card-3d pointer-events-none">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden relative shrink-0">
                  <Image
                    src={gallery[3] || currentImage}
                    alt="Precision Craftsmanship"
                    fill
                    className="object-cover p-0.5"
                  />
                </div>
                <div className="text-[11px] leading-tight pr-1">
                  <span className="font-extrabold text-slate-900 block">German DIN Steel</span>
                  <span className="text-slate-500 text-[10px]">Precision crafted</span>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#96161B]" />
              <span>Hover or click expand button to view high-resolution precision detailing.</span>
            </div>
          </div>

          {/* -------------------------------------------------------------
              COLUMN 3 (RIGHT): PRODUCT INFO & ORDER PANEL (SCREENSHOT 1)
          ------------------------------------------------------------- */}
          <div className="lg:col-span-5 order-3 space-y-5 bg-white rounded-3xl border border-slate-200/90 shadow-lg p-6 sm:p-8">
            
            {/* CATEGORY & TITLE */}
            <div>
              <span className="text-xs font-black text-[#96161B] uppercase tracking-widest block mb-1">
                {product.category_name || 'SURGICAL INSTRUMENTS'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {product.title}
              </h2>
            </div>

            {/* RATINGS ROW */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-slate-500 font-medium">Based on 18 reviews</span>
              <span className="text-slate-300">|</span>
              <span className="font-mono text-slate-500 font-bold">Model: {sku}</span>
            </div>

            {/* SCREENSHOT 1: TIERED QUANTITY DISCOUNT RADIO CARDS */}
            <div className="space-y-2.5 pt-1">
              <div className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center justify-between">
                <span>Select Quantity & Save:</span>
                <span className="text-[11px] font-bold text-[#1e3a8a] bg-blue-50 px-2 py-0.5 rounded-md">
                  Up to 20% Off Bulk Orders
                </span>
              </div>

              {discountTiers.map((tier) => {
                const isSelected = selectedTierQty === tier.quantity
                const tierUnitPrice = basePrice * (1 - tier.discount_percentage / 100)
                const tierTotal = tierUnitPrice * tier.quantity
                const tierOriginalTotal = basePrice * tier.quantity

                return (
                  <div
                    key={tier.quantity}
                    onClick={() => handleSelectTier(tier.quantity)}
                    className={`relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all duration-200 border-2 select-none ${
                      isSelected
                        ? 'border-[#1e3a8a] bg-blue-50/20 shadow-md ring-2 ring-blue-500/10'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {/* LEFT: RADIO + PIECES + BADGES */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected ? 'border-[#1e3a8a]' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#1e3a8a]" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-sm sm:text-base text-slate-900">
                            {tier.quantity} {tier.quantity === 1 ? 'piece' : 'pieces'}
                          </span>
                          {tier.quantity === 1 ? (
                            <span className="bg-slate-100 text-slate-600 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded">
                              Standard price
                            </span>
                          ) : (
                            <>
                              <span className="bg-[#1e3a8a] text-white text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded shadow-xs">
                                Save {tier.discount_percentage}%
                              </span>
                              {tier.free_shipping !== false && (
                                <span className="border border-slate-300 text-slate-700 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded bg-white">
                                  Free shipping
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT: TIER TOTAL & PER PIECE */}
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {tier.discount_percentage > 0 && (
                          <span className="text-xs text-slate-400 line-through font-semibold hidden sm:inline">
                            ${tierOriginalTotal.toFixed(2)}
                          </span>
                        )}
                        <span className="text-sm sm:text-base font-black text-slate-900">
                          ${tierTotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        ${tierUnitPrice.toFixed(2)} each
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* FREE SHIPPING THRESHOLD NOTIFICATION (SCREENSHOT 1) */}
            <div className="text-center text-xs font-bold py-0.5">
              {totalPrice >= 100 || activeTier.free_shipping ? (
                <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Qualified for Free Worldwide Express Shipping!</span>
                </span>
              ) : (
                <span className="text-slate-500">
                  ${(100 - totalPrice).toFixed(2)} more for free shipping
                </span>
              )}
            </div>

            {/* TRUST BADGES ROW (SCREENSHOT 1: SECURE CHECKOUT, QUALITY INSPECTED, WORLDWIDE SUPPLY) */}
            <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-center text-[10px] font-bold text-slate-700">
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-50 border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-[#1e3a8a]" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-50 border border-slate-100">
                <Award className="w-4 h-4 text-[#1e3a8a]" />
                <span>Quality Inspected</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-50 border border-slate-100">
                <Truck className="w-4 h-4 text-[#1e3a8a]" />
                <span>Worldwide Supply</span>
              </div>
            </div>

            {/* PRODUCT SIZES SECTION WITH CUSTOMIZE SIZE BUTTON */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Product Size:
                  </span>
                  <span className="text-xs font-bold text-[#96161B] bg-red-50 px-2 py-0.5 rounded-md">
                    {selectedSize}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCustomSizeOpen(!isCustomSizeOpen)}
                  className="text-xs font-bold text-[#96161B] hover:text-[#7d1216] flex items-center gap-1 cursor-pointer bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>+ Customize Size</span>
                </button>
              </div>

              {/* Selectable Size Pills */}
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => {
                  const isSelected = selectedSize === size
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-[#96161B] text-white border-[#96161B] shadow-sm ring-2 ring-[#96161B]/20 scale-105'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>

              {/* Custom Size Inline Input Box */}
              {isCustomSizeOpen && (
                <div className="p-3 bg-red-50/70 border border-red-200 rounded-2xl space-y-2 animate-fade-in">
                  <div className="text-[11px] font-bold text-slate-700">
                    Specify Custom Length / Dimensions / Specifications:
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={customSizeInput}
                      onChange={(e) => setCustomSizeInput(e.target.value)}
                      placeholder="e.g. 16.5cm (Custom Length) or 18mm Diameter"
                      className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B]"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomSize}
                      className="px-4 py-2 bg-[#96161B] text-white text-xs font-bold rounded-xl hover:bg-[#7d1216] transition-colors shrink-0 shadow-sm cursor-pointer"
                    >
                      Apply Custom Size
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* LIVE STOCK & AUTO QUANTITY TRACKER */}
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-slate-800">Remaining Inventory:</span>
                    <span className="text-[#96161B] font-black">{stockRemaining} units in stock</span>
                  </div>
                  <span className="text-slate-500 text-[11px] font-semibold">{unitsSold} units sold</span>
                </div>

                {/* Inventory visual bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-[#96161B] rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(10, (stockRemaining / (stockRemaining + unitsSold)) * 100))}%`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Auto-tracked live warehouse inventory</span>
                  <span className="font-bold text-amber-700">High demand in surgery centers</span>
                </div>
              </div>

              {/* Quantity counter + Total summary */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-between border-2 border-slate-300 rounded-2xl px-2.5 py-1.5 w-36 shrink-0 bg-white shadow-xs">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-[#96161B] cursor-pointer font-black rounded-lg hover:bg-slate-100"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={stockRemaining}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(Number(e.target.value) || 1)}
                    className="w-12 text-center font-black text-sm text-slate-900 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-[#96161B] cursor-pointer font-black rounded-lg hover:bg-slate-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 text-right">
                  <div className="text-xs text-slate-400 font-semibold">
                    {quantity} × ${unitPrice.toFixed(2)}
                    {discountPercent > 0 && (
                      <span className="ml-1 text-emerald-600 font-bold">({discountPercent}% OFF)</span>
                    )}
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-[#96161B]">
                    ${totalPrice.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* ADD TO CART & BUY NOW BUTTONS */}
              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full bg-[#96161B] hover:bg-[#7d1216] text-white py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-red-950/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shimmer-effect"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{isAddedToCart ? 'Added to Cart ✓' : `Add ${quantity} to Cart • $${totalPrice.toFixed(2)}`}</span>
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="bg-slate-900 hover:bg-black text-white py-3 px-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Buy Now • $${totalPrice.toFixed(2)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleInquiryClick}
                    className="bg-white hover:bg-slate-50 text-[#96161B] border-2 border-[#96161B] py-3 px-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Inquire Bulk Quote</span>
                  </button>
                </div>
              </div>
            </div>

            {/* CLINICAL BULLET HIGHLIGHTS */}
            <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-700">
              {(product.features && product.features.length > 0
                ? product.features
                : [
                    'Precision engineered for operating theater procedures.',
                    'Crafted with Surgical-Grade German Stainless Steel.',
                    'Fully Reusable and Autoclavable up to 134°C.',
                    'Certified by FDA, CE, and ISO 13485:2016.',
                    'Lifetime Corrosion & Craftsmanship Warranty.',
                  ]
              ).slice(0, 5).map((bullet, bIdx) => (
                <div key={bIdx} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-red-100 text-[#96161B] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* =========================================================================
            DETAILED PRODUCT TABS (OVERVIEW, SPECS, STERILIZATION, CERTIFICATIONS)
        ========================================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-6">
          {/* TAB HEADERS */}
          <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-none gap-6 sm:gap-8">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`pb-4 text-xs sm:text-sm font-extrabold uppercase tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-[#96161B] text-[#96161B]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Clinical Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`pb-4 text-xs sm:text-sm font-extrabold uppercase tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'specs'
                  ? 'border-[#96161B] text-[#96161B]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Technical Specifications
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sterilization')}
              className={`pb-4 text-xs sm:text-sm font-extrabold uppercase tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'sterilization'
                  ? 'border-[#96161B] text-[#96161B]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Sterilization & Maintenance
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('certifications')}
              className={`pb-4 text-xs sm:text-sm font-extrabold uppercase tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'certifications'
                  ? 'border-[#96161B] text-[#96161B]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Quality & Compliance
            </button>
          </div>

          {/* TAB CONTENT */}
          <div className="text-xs sm:text-sm leading-relaxed text-slate-600">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <p>
                  {product.full_description ||
                    `${product.title} is an indispensable surgical instrument forged from German-grade surgical stainless steel. Designed for use in operating theaters, plastic reconstructive procedures, orthopedic surgery, and oral maxillo-facial surgery.`}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <h4 className="font-extrabold text-slate-900 mb-2">Ergonomic OR Performance</h4>
                    <p className="text-xs text-slate-500">
                      Balanced weight distribution ensures surgeons experience minimum hand fatigue during lengthy multi-hour operating procedures.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <h4 className="font-extrabold text-slate-900 mb-2">Non-Reflective Satin Finish</h4>
                    <p className="text-xs text-slate-500">
                      Electropolished and passivated with an anti-glare satin surface that completely eliminates glare from surgical theater shadowless lamps.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <tbody className="divide-y divide-slate-100">
                    <tr className="bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-900 w-1/3">SKU / Catalog No.</td>
                      <td className="py-3 px-4 font-mono text-slate-700">{sku}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-slate-900">Category Division</td>
                      <td className="py-3 px-4 text-slate-700">{product.category_name || 'Surgical Instruments'}</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-900">Material Composition</td>
                      <td className="py-3 px-4 text-slate-700">German AISI 420 / DIN 1.4021 Surgical Stainless Steel</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-slate-900">Hardness Rating</td>
                      <td className="py-3 px-4 text-slate-700">Rockwell HRC 52 - 54</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-900">Surface Finish</td>
                      <td className="py-3 px-4 text-slate-700">Anti-Glare Electropolished Satin Finish</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-slate-900">Sterilization Method</td>
                      <td className="py-3 px-4 text-slate-700">Steam Autoclave (134°C / 273°F), Gamma, ETO Gas</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-900">Country of Manufacture</td>
                      <td className="py-3 px-4 text-slate-700">Precision Forged - Export Certified</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'sterilization' && (
              <div className="space-y-4">
                <p>
                  To maximize the clinical longevity of your Alpha instruments, follow validated hospital sterilization practices conforming to AAMI ST79 standards:
                </p>
                <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm">
                  <li><strong>Initial Rinse:</strong> Immediately after procedure, rinse thoroughly in warm deionized water to prevent blood coagulation.</li>
                  <li><strong>Ultrasonic Bath:</strong> Clean in an ultrasonic bath for 10-15 minutes using neutral enzymatic detergent (pH 7.0 - 8.5).</li>
                  <li><strong>Steam Autoclaving:</strong> Autoclavable at 134°C (273°F) for 5 minutes (prevacuum) or 121°C (250°F) for 20 minutes (gravity).</li>
                  <li><strong>Lubrication:</strong> Periodically lubricate box locks, ratchets, and hinges with water-soluble surgical instrument milk.</li>
                </ol>
              </div>
            )}

            {activeTab === 'certifications' && (
              <div className="space-y-4">
                <p>
                  All Alpha Medical Supplies instruments are manufactured under stringent international medical device directives:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-[#96161B] shrink-0" />
                    <div>
                      <div className="font-extrabold text-slate-900 text-xs">ISO 13485:2016</div>
                      <div className="text-[11px] text-slate-500">Quality Management System</div>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                    <Award className="w-8 h-8 text-[#96161B] shrink-0" />
                    <div>
                      <div className="font-extrabold text-slate-900 text-xs">CE 0197 Certified</div>
                      <div className="text-[11px] text-slate-500">European Medical Directive</div>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-[#96161B] shrink-0" />
                    <div>
                      <div className="font-extrabold text-slate-900 text-xs">FDA Registered</div>
                      <div className="text-[11px] text-slate-500">Class I Surgical Exempt</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            BOTTOM SECTION: RELATED PRODUCTS (MATCHING IMAGE 399 EXACT DESIGN)
        ========================================================================= */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#96161B] uppercase tracking-wider block">
                Recommended by Surgeons
              </span>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 uppercase">
                Related Instruments & Tools
              </h3>
            </div>
            <Link
              href="/products"
              className="text-xs font-extrabold text-[#96161B] hover:underline flex items-center gap-1"
            >
              <span>View All Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 4xl:grid-cols-5 gap-6">
            {relatedProducts.map((relProd) => {
              const relPrice = relProd.price ?? 55.95
              const relOriginalPrice = relProd.original_price ?? 64.95
              const relBadge = relProd.badge || 'Sale'
              const relImg = relProd.featured_image || '/images/products/image-399.png'

              return (
                <div
                  key={relProd.id}
                  className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(150,22,27,0.14)] hover:border-[#96161B]/30 hover-card-3d transition-all duration-300 p-5 flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-[#96161B] text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-sm">
                      {relBadge}
                    </span>
                  </div>

                  {/* CLICKABLE LINK TO VIEW LARGE PAGE */}
                  <Link
                    href={`/products/${relProd.slug || relProd.id}`}
                    className="block relative aspect-[4/3] w-full my-2 flex items-center justify-center bg-slate-50/50 rounded-xl overflow-hidden cursor-pointer"
                  >
                    <Image
                      src={relImg}
                      alt={relProd.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </Link>

                  <div className="space-y-2 pt-2">
                    <Link
                      href={`/products/${relProd.slug || relProd.id}`}
                      className="font-extrabold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-[#96161B] transition-colors block cursor-pointer"
                    >
                      {relProd.title}
                    </Link>

                    <div className="text-[11px] font-semibold text-slate-400">
                      SKU:{relProd.sku || '1001'}
                    </div>

                    <div className="flex items-baseline gap-2">
                      {relOriginalPrice && relOriginalPrice > relPrice && (
                        <span className="text-slate-400 font-bold text-xs line-through">
                          ${relOriginalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-[#96161B] font-extrabold text-base sm:text-lg">
                        ${relPrice.toFixed(2)}
                      </span>
                    </div>

                    <div className="pt-2">
                      <Link
                        href={`/products/${relProd.slug || relProd.id}`}
                        className="w-full bg-slate-100 hover:bg-[#96161B] text-slate-800 hover:text-white py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>View Large Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>

      {/* =========================================================================
          FULLSCREEN ZOOM MODAL
      ========================================================================= */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <button
            type="button"
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors cursor-pointer z-10"
            aria-label="Close Zoom"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-4xl max-h-[85vh] aspect-square flex items-center justify-center">
            <Image
              src={currentImage}
              alt={product.title}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}

      {/* =========================================================================
          ADMIN QUICK EDIT MODAL (LIVE DISK SYNC)
      ========================================================================= */}
      {isQuickEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsQuickEditOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#96161B] bg-red-50 px-2 py-0.5 rounded-md">
                Live Product Customizer
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-1">
              Adjust Pricing, Discounts, Sizes & Stock
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Changes will be saved directly to the database file on server disk and will persist across all page refreshes.
            </p>

            <form onSubmit={handleSaveQuickEdit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  readOnly
                  value={product.title}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 cursor-not-allowed"
                />
              </div>

              {/* Pricing Rows */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Base Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={quickEditForm.price}
                    onChange={(e) => setQuickEditForm({ ...quickEditForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Original / Compare Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={quickEditForm.original_price}
                    onChange={(e) => setQuickEditForm({ ...quickEditForm, original_price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B]"
                  />
                </div>
              </div>

              {/* Stock & Inventory */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Remaining Stock Quantity (Units) *
                </label>
                <input
                  type="number"
                  min={0}
                  required
                  value={quickEditForm.stock_quantity}
                  onChange={(e) => setQuickEditForm({ ...quickEditForm, stock_quantity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B]"
                />
              </div>

              {/* Available Sizes List */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Available Sizes (Comma Separated) *
                </label>
                <input
                  type="text"
                  required
                  value={quickEditForm.sizes}
                  onChange={(e) => setQuickEditForm({ ...quickEditForm, sizes: e.target.value })}
                  placeholder="12.5cm, 14.0cm, 15.5cm, 18.0cm, 20.5cm"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B]"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Each comma separates a size pill shown on the product page.
                </span>
              </div>

              {/* Bulk Tier Discounts */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Bulk Quantity Discount Percentages (%)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      10 Pieces (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={quickEditForm.tier_10_discount}
                      onChange={(e) => setQuickEditForm({ ...quickEditForm, tier_10_discount: Number(e.target.value) || 0 })}
                      className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs font-bold text-center text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      30 Pieces (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={quickEditForm.tier_30_discount}
                      onChange={(e) => setQuickEditForm({ ...quickEditForm, tier_30_discount: Number(e.target.value) || 0 })}
                      className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs font-bold text-center text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      70 Pieces (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={quickEditForm.tier_70_discount}
                      onChange={(e) => setQuickEditForm({ ...quickEditForm, tier_70_discount: Number(e.target.value) || 0 })}
                      className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs font-bold text-center text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      100 Pieces (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={quickEditForm.tier_100_discount}
                      onChange={(e) => setQuickEditForm({ ...quickEditForm, tier_100_discount: Number(e.target.value) || 0 })}
                      className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs font-bold text-center text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B]"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleDeleteProductDirect}
                  className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Product</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsQuickEditOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingProduct}
                    className="px-5 py-2 rounded-xl bg-[#96161B] hover:bg-[#7d1216] text-white text-xs font-bold shadow-md cursor-pointer transition-colors flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSavingProduct ? 'Saving to Disk...' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <PublicFooter />

      {/* MODALS */}
      <PublicSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartQuoteModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        quoteItems={cartItems}
        onRemoveItem={(id) => setCartItems((prev) => prev.filter((i) => i.id !== id))}
        onClearAll={() => setCartItems([])}
      />
      <InquiryModal />
    </div>
  )
}
