'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import AdminShell from '@/src/components/admin/AdminShell'
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  FileText,
  AlertCircle,
  Filter,
  Star,
  Sparkles,
  Award,
  Upload,
  Eye,
  CheckCircle2,
  RefreshCw,
  ShoppingBag,
  Tag,
} from 'lucide-react'
import {
  getStoredProducts,
  saveStoredProducts,
  getStoredCategories,
} from '@/src/lib/dataStore'
import { ProductItem } from '@/src/types/product'
import { CategoryItem } from '@/src/types/category'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('all')
  const [viewTab, setViewTab] = useState<'all' | 'best_sellers' | 'new_arrivals' | 'sale'>('all')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    sku: '',
    category_id: '',
    price: 55.95,
    original_price: 64.95,
    stock_quantity: 142,
    sizes: '12.5cm, 14.0cm, 15.5cm, 18.0cm, 20.5cm',
    tier_10_discount: 5,
    tier_30_discount: 10,
    tier_70_discount: 15,
    tier_100_discount: 20,
    badge: 'New',
    short_description: '',
    full_description: '',
    featured_image: '/images/products/image-399.png',
    in_stock: true,
    is_best_seller: true,
    is_new_arrival: true,
    is_featured: true,
    is_published: true,
  })

  const loadData = async () => {
    // 1. Instant optimistic load from localStorage / memory
    const prods = getStoredProducts()
    const cats = getStoredCategories()
    setProducts(prods)
    setCategories(cats)

    // 2. Authoritative sync with server disk JSON file
    try {
      const res = await fetch(`/api/products?t=${Date.now()}`, { cache: 'no-store' })
      if (res.ok) {
        const serverProds = await res.json()
        if (Array.isArray(serverProds) && serverProds.length > 0) {
          setProducts(serverProds)
          if (typeof window !== 'undefined') {
            localStorage.setItem('alpha_products_v2', JSON.stringify(serverProds))
            localStorage.setItem('alpha_products', JSON.stringify(serverProds))
          }
        }
      }
    } catch (err) {
      console.warn('Could not sync products from API:', err)
    }

    try {
      const catRes = await fetch(`/api/categories?t=${Date.now()}`, { cache: 'no-store' })
      if (catRes.ok) {
        const serverCats = await catRes.json()
        if (Array.isArray(serverCats) && serverCats.length > 0) {
          setCategories(serverCats)
          if (typeof window !== 'undefined') {
            localStorage.setItem('alpha_categories_v2', JSON.stringify(serverCats))
            localStorage.setItem('alpha_categories', JSON.stringify(serverCats))
          }
        }
      }
    } catch (err) {}
  }

  useEffect(() => {
    loadData()

    const handleUpdate = () => {
      loadData()
    }
    window.addEventListener('alpha_content_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)

    return () => {
      window.removeEventListener('alpha_content_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleOpenAdd = () => {
    setEditingProduct(null)
    setFormData({
      title: 'ORTHO WEITLANER RETRACTOR SHARP',
      sku: '1001',
      category_id: categories.find((c) => c.slug.includes('ortho'))?.id || categories[0]?.id || '',
      price: 55.95,
      original_price: 64.95,
      stock_quantity: 142,
      sizes: '12.5cm, 14.0cm, 15.5cm, 18.0cm, 20.5cm',
      tier_10_discount: 5,
      tier_30_discount: 10,
      tier_70_discount: 15,
      tier_100_discount: 20,
      badge: 'New',
      short_description: 'Self-retaining orthopedic retractor with sharp prongs (3x4), German stainless steel.',
      full_description: 'German medical grade stainless steel retractor for spinal, orthopedic, and plastic surgery.',
      featured_image: '/images/products/image-399.png',
      in_stock: true,
      is_best_seller: true,
      is_new_arrival: true,
      is_featured: true,
      is_published: true,
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (prod: ProductItem) => {
    setEditingProduct(prod)
    const tiers = prod.quantity_discounts || []
    setFormData({
      title: prod.title,
      sku: prod.sku || '',
      category_id: prod.category_id || '',
      price: prod.price ?? 55.95,
      original_price: prod.original_price ?? 64.95,
      stock_quantity: typeof prod.stock_quantity === 'number' ? prod.stock_quantity : 142,
      sizes: (prod.sizes && prod.sizes.length > 0 ? prod.sizes : ['12.5cm', '14.0cm', '15.5cm', '18.0cm', '20.5cm']).join(', '),
      tier_10_discount: tiers.find((t) => t.quantity === 10)?.discount_percentage ?? 5,
      tier_30_discount: tiers.find((t) => t.quantity === 30)?.discount_percentage ?? 10,
      tier_70_discount: tiers.find((t) => t.quantity === 70)?.discount_percentage ?? 15,
      tier_100_discount: tiers.find((t) => t.quantity === 100)?.discount_percentage ?? 20,
      badge: prod.badge || '',
      short_description: prod.short_description || '',
      full_description: prod.full_description || '',
      featured_image: prod.featured_image || '/images/products/image-399.png',
      in_stock: prod.in_stock !== false,
      is_best_seller: !!prod.is_best_seller,
      is_new_arrival: !!prod.is_new_arrival,
      is_featured: prod.is_featured,
      is_published: prod.is_published,
    })
    setIsModalOpen(true)
  }

  const syncProductsToServer = async (prods: ProductItem[]) => {
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prods),
      })
    } catch (e) {
      console.warn('Error saving to /api/products:', e)
    }
  }

  const handleDelete = async (id: string) => {
    const target = products.find((p) => p.id === id)
    if (confirm(`Are you sure you want to delete "${target?.title || 'this product'}"? This action will immediately update the live store and persist on reload.`)) {
      const updated = products.filter((p) => p.id !== id)
      setProducts(updated)
      saveStoredProducts(updated)
      await syncProductsToServer(updated)
      showToast('Product successfully deleted! Storefront updated.')
    }
  }

  const handleToggleBestSeller = async (prod: ProductItem) => {
    const updated = products.map((p) =>
      p.id === prod.id ? { ...p, is_best_seller: !p.is_best_seller, is_featured: !p.is_best_seller } : p
    )
    setProducts(updated)
    saveStoredProducts(updated)
    await syncProductsToServer(updated)
    showToast(`"${prod.title}" Best Seller status updated!`)
  }

  const handleToggleNewArrival = async (prod: ProductItem) => {
    const updated = products.map((p) =>
      p.id === prod.id ? { ...p, is_new_arrival: !p.is_new_arrival } : p
    )
    setProducts(updated)
    saveStoredProducts(updated)
    await syncProductsToServer(updated)
    showToast(`"${prod.title}" New Arrival status updated!`)
  }

  const handleToggleInStock = async (prod: ProductItem) => {
    const updated = products.map((p) =>
      p.id === prod.id ? { ...p, in_stock: !(p.in_stock !== false) } : p
    )
    setProducts(updated)
    saveStoredProducts(updated)
    await syncProductsToServer(updated)
    showToast(`"${prod.title}" stock status updated!`)
  }

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingImage(true)
    try {
      const data = new FormData()
      data.append('file', file)
      data.append('type', 'product')

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      })
      const json = await res.json()
      if (json.success) {
        setFormData((prev) => ({ ...prev, featured_image: json.url }))
        showToast('Image uploaded & saved to server disk!')
      } else {
        showToast(`Upload failed: ${json.error || 'Server error'}`)
      }
    } catch (err) {
      console.error('Error uploading product image:', err)
      showToast('Error uploading image file')
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    const catObj = categories.find((c) => c.id === formData.category_id)
    const parsedSizes = formData.sizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    const discountTiers = [
      { quantity: 1, discount_percentage: 0, badge: 'Standard price', free_shipping: false },
      { quantity: 10, discount_percentage: Number(formData.tier_10_discount) || 5, badge: `Save ${formData.tier_10_discount}%`, free_shipping: true },
      { quantity: 30, discount_percentage: Number(formData.tier_30_discount) || 10, badge: `Save ${formData.tier_30_discount}%`, free_shipping: true },
      { quantity: 70, discount_percentage: Number(formData.tier_70_discount) || 15, badge: `Save ${formData.tier_70_discount}%`, free_shipping: true },
      { quantity: 100, discount_percentage: Number(formData.tier_100_discount) || 20, badge: `Save ${formData.tier_100_discount}%`, free_shipping: true },
    ]

    let updated: ProductItem[] = []
    if (editingProduct) {
      updated = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              title: formData.title,
              sku: formData.sku,
              price: Number(formData.price),
              original_price: Number(formData.original_price),
              badge: formData.badge || null,
              category_id: formData.category_id,
              category_name: catObj?.name || p.category_name,
              short_description: formData.short_description,
              full_description: formData.full_description,
              featured_image: formData.featured_image,
              stock_quantity: Number(formData.stock_quantity) || 142,
              sizes: parsedSizes.length > 0 ? parsedSizes : ['12.5cm', '14.0cm', '15.5cm', '18.0cm', '20.5cm'],
              quantity_discounts: discountTiers,
              in_stock: formData.in_stock,
              is_best_seller: formData.is_best_seller,
              is_new_arrival: formData.is_new_arrival,
              is_featured: formData.is_featured,
              is_published: formData.is_published,
              specifications: {
                ...(p.specifications || {}),
                Subcategory: catObj?.name || p.specifications?.Subcategory || '',
              },
              updated_at: new Date().toISOString(),
            }
          : p
      )
      showToast('Product updated successfully! Live on website & saved across reload.')
    } else {
      const newProd: ProductItem = {
        id: `alpha-prod-${Date.now()}`,
        title: formData.title,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        sku: formData.sku,
        category_id: formData.category_id,
        category_name: catObj?.name || 'Medical Equipment',
        price: Number(formData.price),
        original_price: Number(formData.original_price),
        badge: formData.badge || null,
        short_description: formData.short_description,
        full_description: formData.full_description,
        featured_image: formData.featured_image,
        stock_quantity: Number(formData.stock_quantity) || 142,
        sizes: parsedSizes.length > 0 ? parsedSizes : ['12.5cm', '14.0cm', '15.5cm', '18.0cm', '20.5cm'],
        quantity_discounts: discountTiers,
        features: ['German Grade Stainless Steel', 'Autoclavable & Durable', 'ISO 13485 Certified'],
        specifications: {
          Subcategory: catObj?.name || '',
          'Quality Grade': 'Medical Grade German Stainless Steel',
          Sterilization: 'Autoclavable (134°C)',
        },
        catalogue_pdf: null,
        in_stock: formData.in_stock,
        is_best_seller: formData.is_best_seller,
        is_new_arrival: formData.is_new_arrival,
        is_featured: formData.is_featured,
        is_published: formData.is_published,
        seo_title: `${formData.title} - Alpha Medical Supplies`,
        seo_description: formData.short_description,
        sort_order: products.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      updated = [newProd, ...products]
      showToast('New product created! Live on website & saved across reload.')
    }

    setProducts(updated)
    saveStoredProducts(updated)
    await syncProductsToServer(updated)
    setIsModalOpen(false)
  }

  // Filter products based on active tab and search/category
  const filtered = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
    const matchesCat = selectedCat === 'all' || p.category_id === selectedCat

    let matchesTab = true
    if (viewTab === 'best_sellers') {
      matchesTab = !!p.is_best_seller || p.is_featured
    } else if (viewTab === 'new_arrivals') {
      matchesTab = !!p.is_new_arrival || p.badge === 'New'
    } else if (viewTab === 'sale') {
      matchesTab = !!(p.badge?.toLowerCase().includes('sale') || (p.original_price && p.price && p.original_price > p.price))
    }

    return matchesSearch && matchesCat && matchesTab
  })

  const bestSellersCount = products.filter((p) => p.is_best_seller || p.is_featured).length
  const newArrivalsCount = products.filter((p) => p.is_new_arrival || p.badge === 'New').length
  const saleCount = products.filter(
    (p) =>
      p.badge?.toLowerCase().includes('sale') ||
      (p.original_price && p.price && p.original_price > p.price)
  ).length

  return (
    <AdminShell>
      <div className="w-full max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2500px] 4xl:max-w-[3200px] mx-auto space-y-6 sm:space-y-8 animate-fade-in">
        
        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#96161B] uppercase tracking-wider mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#96161B] animate-pulse" />
              <span>Live Storefront Catalog & Best Sellers Manager</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Products & Best Sellers Management
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Add, edit, delete, or toggle Best Sellers (Image 399 Section). All modifications save permanently across refreshes and appear live instantly.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                loadData()
                showToast('Refreshed data from storage!')
              }}
              className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              id="admin-add-product-btn"
              onClick={handleOpenAdd}
              className="flex items-center gap-2 bg-[#96161B] hover:bg-[#7d1216] text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl transition-all shadow-md shadow-red-950/20 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS: ALL / BEST SELLERS / NEW ARRIVALS */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setViewTab('all')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              viewTab === 'all'
                ? 'bg-[#96161B] text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>All Products ({products.length})</span>
          </button>

          <button
            onClick={() => setViewTab('best_sellers')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              viewTab === 'best_sellers'
                ? 'bg-[#96161B] text-white shadow-md shadow-red-950/20'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span>⭐ Best Sellers (Featured in Image 399) ({bestSellersCount})</span>
          </button>

          <button
            onClick={() => setViewTab('new_arrivals')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              viewTab === 'new_arrivals'
                ? 'bg-[#96161B] text-white shadow-md shadow-red-950/20'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>✨ New Arrivals ({newArrivalsCount})</span>
          </button>

          <button
            onClick={() => setViewTab('sale')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              viewTab === 'sale'
                ? 'bg-[#96161B] text-white shadow-md shadow-red-950/20'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Tag className="w-4 h-4 text-white" />
            <span>🏷️ Sale / Discount Products ({saleCount})</span>
          </button>
        </div>

        {/* LIVE STOREFRONT PREVIEW SECTION (EXACT CARD LAYOUT FROM IMAGE 399) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
            <div>
              <div className="text-[11px] font-bold text-[#96161B] uppercase tracking-wider">
                Live Storefront Preview
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Active Featured / Best Sellers Display (Matching Image 399)
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              Interactive cards as displayed on the live website
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 3xl:grid-cols-4 4xl:grid-cols-6 gap-6">
            {products
              .filter((p) => p.is_best_seller || p.is_new_arrival || p.is_featured)
              .slice(0, 4)
              .map((prod) => {
                const price = prod.price ?? 55.95
                const originalPrice = prod.original_price ?? 64.95
                const badge = prod.badge || 'New'
                const imageSrc = prod.featured_image || '/images/products/image-399.png'

                return (
                  <div
                    key={`preview-${prod.id}`}
                    className="group bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between relative hover:border-[#96161B]/40 hover:shadow-md transition-all"
                  >
                    {/* Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-[#96161B] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                        {badge}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="p-1 text-slate-400 hover:text-slate-800 rounded"
                          title="Quick Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded"
                          title="Quick Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Image */}
                    <div className="relative aspect-[4/3] w-full my-2 flex items-center justify-center">
                      <Image
                        src={imageSrc}
                        alt={prod.title}
                        fill
                        className="object-contain p-2"
                      />
                    </div>

                    {/* Details */}
                    <div className="space-y-2 pt-2">
                      <h3 className="font-extrabold text-slate-900 text-xs uppercase line-clamp-1">
                        {prod.title}
                      </h3>
                      <div className="text-[10px] font-semibold text-slate-400">
                        SKU:{prod.sku || '1001'}
                      </div>
                      <div className="flex items-baseline gap-2">
                        {originalPrice && (
                          <span className="text-slate-900 font-bold text-sm line-through">
                            ${originalPrice.toFixed(2)}
                          </span>
                        )}
                        <span className="text-[#96161B] font-extrabold text-base">
                          ${price.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        <span>{prod.in_stock !== false ? 'In Stock' : 'Out of Stock'}</span>
                      </div>

                      {/* Mock Buttons */}
                      <div className="pt-2 flex items-center gap-2">
                        <div className="flex items-center justify-between border border-slate-200 rounded-lg px-2 py-1 text-xs w-20 text-slate-600 bg-slate-50">
                          <span>-</span>
                          <span className="font-bold text-slate-900">1</span>
                          <span>+</span>
                        </div>
                        <button
                          disabled
                          className="flex-1 py-1.5 px-2 bg-[#96161B] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 opacity-90"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add To Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>

        {/* CONTROLS (SEARCH & CATEGORY FILTER) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 w-full sm:w-96 text-xs sm:text-sm">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, SKU, or category..."
              className="bg-transparent text-slate-900 font-medium outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none cursor-pointer"
            >
              <option value="all">All Categories ({products.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* PRODUCTS DATA TABLE */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4 sm:p-5">Product Details</th>
                  <th className="p-4 sm:p-5">Category & SKU</th>
                  <th className="p-4 sm:p-5">Price ($)</th>
                  <th className="p-4 sm:p-5 text-center">Best Seller</th>
                  <th className="p-4 sm:p-5 text-center">New Arrival</th>
                  <th className="p-4 sm:p-5 text-center">Stock</th>
                  <th className="p-4 sm:p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-400">
                      No products found matching your search. Click &quot;Add New Product&quot; to create one.
                    </td>
                  </tr>
                ) : (
                  filtered.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Product Thumbnail & Title */}
                      <td className="p-4 sm:p-5 flex items-center gap-3">
                        <div className="relative w-14 h-14 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                          <Image
                            src={prod.featured_image || '/images/products/image-399.png'}
                            alt={prod.title}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900 text-sm sm:text-base">
                            {prod.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {prod.badge && (
                              <span className="bg-[#96161B] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                {prod.badge}
                              </span>
                            )}
                            <span className="text-[11px] text-slate-400">
                              {prod.short_description || 'German Stainless Steel'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category & SKU */}
                      <td className="p-4 sm:p-5">
                        <div className="font-semibold text-slate-800">{prod.category_name || 'General'}</div>
                        <div className="font-mono text-xs text-slate-500 font-semibold mt-0.5">
                          SKU: {prod.sku || 'N/A'}
                        </div>
                      </td>

                      {/* Pricing */}
                      <td className="p-4 sm:p-5">
                        <div className="text-[#96161B] font-extrabold text-sm sm:text-base">
                          ${(prod.price ?? 55.95).toFixed(2)}
                        </div>
                        {prod.original_price && (
                          <div className="text-slate-400 text-xs line-through font-semibold">
                            ${prod.original_price.toFixed(2)}
                          </div>
                        )}
                      </td>

                      {/* Best Seller Toggle */}
                      <td className="p-4 sm:p-5 text-center">
                        <button
                          onClick={() => handleToggleBestSeller(prod)}
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            prod.is_best_seller
                              ? 'bg-amber-50 border-amber-300 text-amber-600 shadow-sm'
                              : 'bg-slate-50 border-slate-200 text-slate-300 hover:text-slate-500'
                          }`}
                          title="Toggle Best Seller Status"
                        >
                          <Star className={`w-4 h-4 ${prod.is_best_seller ? 'fill-amber-500 text-amber-500' : ''}`} />
                        </button>
                      </td>

                      {/* New Arrival Toggle */}
                      <td className="p-4 sm:p-5 text-center">
                        <button
                          onClick={() => handleToggleNewArrival(prod)}
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            prod.is_new_arrival
                              ? 'bg-red-50 border-red-200 text-[#96161B] shadow-sm'
                              : 'bg-slate-50 border-slate-200 text-slate-300 hover:text-slate-500'
                          }`}
                          title="Toggle New Arrival Status"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      </td>

                      {/* Stock Toggle */}
                      <td className="p-4 sm:p-5 text-center">
                        <button
                          onClick={() => handleToggleInStock(prod)}
                          className={`text-[11px] font-bold px-3 py-1 rounded-full cursor-pointer transition-all ${
                            prod.in_stock !== false
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {prod.in_stock !== false ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 sm:p-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(prod)}
                            className="p-2.5 text-slate-600 hover:text-[#96161B] hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(prod.id)}
                            className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* COMPREHENSIVE ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto border border-slate-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <span className="text-[11px] font-bold text-[#96161B] uppercase tracking-wider">
                Product Information
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {editingProduct ? 'Edit Product & Best Seller' : 'Add New Product (Image 399 Section)'}
              </h3>
            </div>

            <form onSubmit={handleSave} className="space-y-4 sm:space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. ORTHO WEITLANER RETRACTOR SHARP"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B] font-semibold"
                />
              </div>

              {/* SKU & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="1001"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category Division
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sale Price, Original Price, Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Sale Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="55.95"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B] font-bold text-[#96161B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Original Price ($) (Strikethrough)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: parseFloat(e.target.value) || 0 })}
                    placeholder="64.95"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Card Badge Text
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Sale / New / Best Seller / Hot"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B]"
                  />
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {['Sale', 'New', 'Best Seller', 'Hot'].map((b) => (
                      <button
                        type="button"
                        key={b}
                        onClick={() => setFormData({ ...formData, badge: b })}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                          formData.badge === b
                            ? 'bg-[#96161B] text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Image Selection with Presets and File Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Product Image (Select Reference Image or Upload)
                </label>
                
                {/* Presets Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, featured_image: '/images/products/image-399.png' })}
                    className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      formData.featured_image === '/images/products/image-399.png'
                        ? 'border-[#96161B] bg-red-50 text-[#96161B] font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="relative w-8 h-8 rounded bg-white shrink-0 border border-slate-200">
                      <Image src="/images/products/image-399.png" alt="Ortho Retractor" fill className="object-contain p-0.5" />
                    </div>
                    <span className="text-[11px] truncate">Image 399 (Retractor)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, featured_image: '/images/categories/image_376.png' })}
                    className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      formData.featured_image === '/images/categories/image_376.png'
                        ? 'border-[#96161B] bg-red-50 text-[#96161B] font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="relative w-8 h-8 rounded bg-white shrink-0 border border-slate-200">
                      <Image src="/images/categories/image_376.png" alt="Procedure Kit" fill className="object-contain p-0.5" />
                    </div>
                    <span className="text-[11px] truncate">Procedure Kit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, featured_image: '/images/categories/image_377.png' })}
                    className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      formData.featured_image === '/images/categories/image_377.png'
                        ? 'border-[#96161B] bg-red-50 text-[#96161B] font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="relative w-8 h-8 rounded bg-white shrink-0 border border-slate-200">
                      <Image src="/images/categories/image_377.png" alt="Ortho Rongeur" fill className="object-contain p-0.5" />
                    </div>
                    <span className="text-[11px] truncate">Ortho Rongeur</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, featured_image: '/images/extracted/image_11.png' })}
                    className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      formData.featured_image === '/images/extracted/image_11.png'
                        ? 'border-[#96161B] bg-red-50 text-[#96161B] font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="relative w-8 h-8 rounded bg-white shrink-0 border border-slate-200">
                      <Image src="/images/extracted/image_11.png" alt="Patient Monitor" fill className="object-contain p-0.5" />
                    </div>
                    <span className="text-[11px] truncate">ICU Monitor</span>
                  </button>
                </div>

                {/* Custom URL and File Upload Dropzone */}
                <div className="space-y-2 pt-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageFileUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  {/* DROPZONE PLACEHOLDER */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#96161B]/40 hover:border-[#96161B] bg-red-50/30 hover:bg-red-50/70 rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-all group"
                  >
                    <div className="relative w-14 h-14 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                      {isUploadingImage ? (
                        <div className="w-5 h-5 border-2 border-[#96161B] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Image
                          src={formData.featured_image || '/images/products/image-399.png'}
                          alt="Product preview"
                          fill
                          className="object-contain p-1"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-black text-slate-800 group-hover:text-[#96161B] flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploadingImage ? 'Uploading Image to Server...' : 'Click to Upload Product Image from Laptop'}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">
                        {formData.featured_image || 'PNG, JPG, or WEBP saved directly on server disk'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.featured_image}
                      onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                      placeholder="/images/products/image-399.png or custom image URL"
                      className="flex-1 px-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B]"
                    />
                  </div>
                </div>
              </div>

              {/* Stock Quantity & Sizes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Remaining Stock Quantity (Units) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                    placeholder="142"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Product Sizes (Comma Separated) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    placeholder="12.5cm, 14.0cm, 15.5cm, 18.0cm, 20.5cm"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B]"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Pill buttons displayed on View Large product page.
                  </span>
                </div>
              </div>

              {/* Bulk Quantity Discount Tiers */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Bulk Order Discount Tiers (Screenshot 1 Setup)
                  </span>
                  <span className="text-[10px] font-bold text-[#1e3a8a] bg-blue-50 px-2 py-0.5 rounded">
                    Auto-Applied at Checkout
                  </span>
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
                      value={formData.tier_10_discount}
                      onChange={(e) => setFormData({ ...formData, tier_10_discount: Number(e.target.value) || 0 })}
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
                      value={formData.tier_30_discount}
                      onChange={(e) => setFormData({ ...formData, tier_30_discount: Number(e.target.value) || 0 })}
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
                      value={formData.tier_70_discount}
                      onChange={(e) => setFormData({ ...formData, tier_70_discount: Number(e.target.value) || 0 })}
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
                      value={formData.tier_100_discount}
                      onChange={(e) => setFormData({ ...formData, tier_100_discount: Number(e.target.value) || 0 })}
                      className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs font-bold text-center text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B]"
                    />
                  </div>
                </div>
              </div>

              {/* Status Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.in_stock}
                    onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                    className="w-4 h-4 accent-[#96161B]"
                  />
                  <span>In Stock</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_best_seller}
                    onChange={(e) => setFormData({ ...formData, is_best_seller: e.target.checked })}
                    className="w-4 h-4 accent-[#96161B]"
                  />
                  <span>Best Seller Tab</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_new_arrival}
                    onChange={(e) => setFormData({ ...formData, is_new_arrival: e.target.checked })}
                    className="w-4 h-4 accent-[#96161B]"
                  />
                  <span>New Arrival Tab</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="w-4 h-4 accent-[#96161B]"
                  />
                  <span>Published Online</span>
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Summary / Specifications
                </label>
                <input
                  type="text"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="e.g. Self-retaining orthopedic retractor with sharp prongs (3x4), German grade stainless steel"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B]"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="admin-save-product-submit-btn"
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-[#96161B] hover:bg-[#7d1216] text-white text-xs sm:text-sm font-bold shadow-md shadow-red-950/20 active:scale-95 cursor-pointer transition-all"
                >
                  {editingProduct ? 'Save Changes' : 'Create & Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  )
}
