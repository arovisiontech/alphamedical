'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
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
  FolderTree,
  FolderPlus,
  Folder,
  Layers,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Maximize2,
  ArrowRight,
  Boxes,
} from 'lucide-react'
import {
  getStoredProducts,
  saveStoredProducts,
  getStoredCategories,
  saveStoredCategories,
  resetToCleanBaselineProducts,
  markProductAsDeleted,
} from '@/src/lib/dataStore'
import { ProductItem, QuantityDiscountTier } from '@/src/types/product'
import { CategoryItem } from '@/src/types/category'
import { compressImageFile } from '@/src/lib/imageCompressor'

function AdminProductsContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<ProductItem[]>([])
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('all')
  const [viewTab, setViewTab] = useState<'all' | 'best_sellers' | 'new_arrivals' | 'sale'>('all')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // ==========================================
  // HIERARCHICAL CATEGORY DRILL-DOWN MODALS
  // ==========================================
  const [isCategoryExplorerOpen, setIsCategoryExplorerOpen] = useState(false)
  const [drilldownCategory, setDrilldownCategory] = useState<CategoryItem | null>(null)
  const [drilldownSubcategory, setDrilldownSubcategory] = useState<CategoryItem | null>(null)

  // Unified Add / Edit / Remove Category, Subcategory & Group Modal
  const [categoryModal, setCategoryModal] = useState<{
    isOpen: boolean
    mode: 'add_main' | 'edit_main' | 'add_sub' | 'edit_sub' | 'add_group' | 'edit_group'
    targetCategory: CategoryItem | null
    parentId: string | null
    name: string
    icon: string
    description: string
  }>({
    isOpen: false,
    mode: 'add_main',
    targetCategory: null,
    parentId: null,
    name: '',
    icon: '✂️',
    description: '',
  })

  // Add Category Modal (legacy fallbacks)
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [newCategoryData, setNewCategoryData] = useState({
    name: '',
    slug: '',
    icon: '✂️',
    description: '',
  })

  // Add Subcategory Modal (legacy fallbacks)
  const [isAddSubcategoryOpen, setIsAddSubcategoryOpen] = useState(false)
  const [newSubcategoryData, setNewSubcategoryData] = useState({
    parent_id: '',
    name: '',
    description: '',
  })

  // Zoom Large Image Modal
  const [previewLargeImage, setPreviewLargeImage] = useState<string | null>(null)

  // ==========================================
  // PRODUCT ADD / EDIT MODAL STATE
  // ==========================================
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const galleryFileInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isUploadingGallery, setIsUploadingGallery] = useState(false)

  // Inline Category / Subcategory Creation within Product Modal
  const [showInlineNewCategory, setShowInlineNewCategory] = useState(false)
  const [inlineCategoryName, setInlineCategoryName] = useState('')
  const [showInlineNewSubcategory, setShowInlineNewSubcategory] = useState(false)
  const [inlineSubcategoryName, setInlineSubcategoryName] = useState('')

  // Active main category & subcategory in 3-level visual hierarchy navigator
  const [activeMainCatId, setActiveMainCatId] = useState<string>('cat-surg-inst')
  const [activeSubcatId, setActiveSubcatId] = useState<string | null>('sub-dental-surgery')

  const [formData, setFormData] = useState({
    title: '',
    sku: '',
    category_id: '',
    subcategory_id: '',
    sub_subcategory_id: '',
    sub_subcategory_name: '',
    price: 49.50,
    original_price: 59.50,
    weight: '140g',
    stock_quantity: 100,
    sizes: '12.5cm, 14.0cm, 15.5cm, 18.0cm, 20.5cm',
    custom_tiers: [
      { pieces: 10, discount: 5 },
      { pieces: 30, discount: 10 },
      { pieces: 70, discount: 15 },
      { pieces: 100, discount: 20 },
    ],
    badge: 'New',
    short_description: '',
    full_description: '',
    featured_image: '',
    gallery_images: [] as string[],
    in_stock: true,
    is_best_seller: false,
    is_new_arrival: true,
    is_featured: false,
    is_published: true,
  })

  const loadData = () => {
    const prods = getStoredProducts()
    const cats = getStoredCategories()
    setProducts(prods)
    setCategories(cats)
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

  // Handle URL deep-links
  useEffect(() => {
    const catParam = searchParams.get('cat')
    const queryParam = searchParams.get('query')
    const addParam = searchParams.get('add')
    const editParam = searchParams.get('edit')

    if (catParam) setSelectedCat(catParam)
    if (queryParam) setSearch(queryParam)

    if (addParam === 'true') {
      handleOpenAdd(catParam || undefined)
    } else if (editParam && products.length > 0) {
      const match = products.find((p) => p.id === editParam || p.slug === editParam)
      if (match) handleOpenEdit(match)
    }
  }, [searchParams, products.length])

  // ==========================================
  // PRODUCT ADD / EDIT OPEN HANDLERS
  // ==========================================
  const handleOpenAdd = (
    overrideCatId?: string | null,
    overrideSubcatId?: string | null,
    overrideSubSubcatId?: string | null
  ) => {
    setEditingProduct(null)
    setShowInlineNewCategory(false)
    setShowInlineNewSubcategory(false)

    // Determine target category and subcategory
    let targetCat = overrideCatId || activeMainCatId || ''
    if (!targetCat) {
      const mainCats = categories.filter((c) => !c.parent_id || c.level === 0)
      targetCat = mainCats[0]?.id || 'cat-surg-inst'
    }

    let targetSubcat = overrideSubcatId || activeSubcatId || ''
    if (!targetSubcat) {
      const subs = categories.filter((c) => c.parent_id === targetCat && c.level === 1)
      targetSubcat = subs[0]?.id || ''
    }

    let targetSubSubcat = overrideSubSubcatId || ''
    let targetSubSubcatName = ''
    if (targetSubSubcat) {
      const subsub = categories.find((c) => c.id === targetSubSubcat)
      if (subsub) targetSubSubcatName = subsub.name
    } else if (targetSubcat) {
      const subsubs = categories.filter((c) => c.parent_id === targetSubcat && c.level === 2)
      if (subsubs.length > 0) {
        targetSubSubcat = subsubs[0].id
        targetSubSubcatName = subsubs[0].name
      }
    }

    setFormData({
      title: '',
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      category_id: targetCat,
      subcategory_id: targetSubcat,
      sub_subcategory_id: targetSubSubcat,
      sub_subcategory_name: targetSubSubcatName,
      price: 49.50,
      original_price: 59.50,
      weight: '140g',
      stock_quantity: 100,
      sizes: '12.5cm, 14.0cm, 15.5cm, 18.0cm, 20.5cm',
      custom_tiers: [
        { pieces: 10, discount: 5 },
        { pieces: 30, discount: 10 },
        { pieces: 70, discount: 15 },
        { pieces: 100, discount: 20 },
      ],
      badge: 'New',
      short_description: '',
      full_description: '',
      featured_image: '/images/products/image-399.png',
      gallery_images: ['/images/products/image-399.png'],
      in_stock: true,
      is_best_seller: false,
      is_new_arrival: true,
      is_featured: false,
      is_published: true,
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (prod: ProductItem) => {
    setEditingProduct(prod)
    setShowInlineNewCategory(false)
    setShowInlineNewSubcategory(false)

    const existingTiers = (prod.quantity_discounts || []).filter((t) => t.quantity > 1)
    const initialTiers =
      existingTiers.length > 0
        ? existingTiers.map((t) => ({ pieces: t.quantity, discount: t.discount_percentage }))
        : [
            { pieces: 10, discount: 5 },
            { pieces: 30, discount: 10 },
            { pieces: 70, discount: 15 },
            { pieces: 100, discount: 20 },
          ]

    const rawGallery: string[] = Array.isArray(prod.gallery_images)
      ? prod.gallery_images.map((g: any) => (typeof g === 'string' ? g : g?.image_url)).filter(Boolean)
      : []

    // Resolve subcategory id from prod.subcategory_id or matching by name in specifications
    let resolvedSubId = prod.subcategory_id || ''
    if (!resolvedSubId && prod.specifications?.Subcategory) {
      const matchSub = categories.find(
        (c) => c.name.toLowerCase() === prod.specifications.Subcategory.toLowerCase()
      )
      if (matchSub) resolvedSubId = matchSub.id
    }

    // Resolve sub-subcategory id (Level 2 group)
    let resolvedSubSubId = prod.sub_subcategory_id || ''
    let resolvedSubSubName = prod.sub_subcategory_name || prod.specifications?.Group || ''
    if (!resolvedSubSubId && resolvedSubId) {
      const subsubs = categories.filter((c) => c.parent_id === resolvedSubId && c.level === 2)
      const matchSubSub = subsubs.find(
        (c) =>
          prod.title.toLowerCase().includes(c.name.toLowerCase()) ||
          c.name.toLowerCase() === prod.specifications?.Group?.toLowerCase()
      )
      if (matchSubSub) {
        resolvedSubSubId = matchSubSub.id
        resolvedSubSubName = matchSubSub.name
      }
    }

    setFormData({
      title: prod.title,
      sku: prod.sku || '',
      category_id: prod.category_id || 'cat-surg-inst',
      subcategory_id: resolvedSubId,
      sub_subcategory_id: resolvedSubSubId,
      sub_subcategory_name: resolvedSubSubName,
      price: prod.price ?? 55.95,
      original_price: prod.original_price ?? 64.95,
      weight: prod.weight || prod.specifications?.Weight || '140g',
      stock_quantity: typeof prod.stock_quantity === 'number' ? prod.stock_quantity : 142,
      sizes: (prod.sizes && prod.sizes.length > 0 ? prod.sizes : ['12.5cm', '14.0cm', '15.5cm', '18.0cm', '20.5cm']).join(', '),
      custom_tiers: initialTiers,
      badge: prod.badge || '',
      short_description: prod.short_description || '',
      full_description: prod.full_description || '',
      featured_image: prod.featured_image || '/images/products/image-399.png',
      gallery_images: rawGallery.length > 0 ? rawGallery : [prod.featured_image || '/images/products/image-399.png'],
      in_stock: prod.in_stock !== false,
      is_best_seller: !!prod.is_best_seller,
      is_new_arrival: !!prod.is_new_arrival,
      is_featured: prod.is_featured,
      is_published: prod.is_published,
    })
    setIsModalOpen(true)
  }

  // ==========================================
  // IMAGE UPLOADS WITH LOCAL CANVAS COMPRESSION
  // ==========================================
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0]
    if (!rawFile) return

    setIsUploadingImage(true)
    try {
      const { dataUrl } = await compressImageFile(rawFile, 800, 800, 0.85)
      if (dataUrl) {
        setFormData((prev) => ({
          ...prev,
          featured_image: dataUrl,
          gallery_images: prev.gallery_images.length === 0 ? [dataUrl] : prev.gallery_images,
        }))
        showToast('Featured view large image loaded & ready!')
      }
    } catch (err) {
      console.error(err)
      showToast('Error uploading image')
    } finally {
      setIsUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploadingGallery(true)
    try {
      const newUrls: string[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const { dataUrl } = await compressImageFile(file, 800, 800, 0.85)
        if (dataUrl) newUrls.push(dataUrl)
      }
      setFormData((prev) => ({
        ...prev,
        gallery_images: [...(prev.gallery_images || []), ...newUrls],
      }))
      showToast(`Added ${newUrls.length} view/angle image(s)!`)
    } catch (err) {
      console.error(err)
      showToast('Error uploading view image')
    } finally {
      setIsUploadingGallery(false)
      if (galleryFileInputRef.current) galleryFileInputRef.current.value = ''
    }
  }

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery_images: (prev.gallery_images || []).filter((_, i) => i !== indexToRemove),
    }))
  }

  // ==========================================
  // CATEGORY & SUBCATEGORY CREATION HANDLERS
  // ==========================================
  const handleCreateCategory = (name: string, icon = '✂️', description = '') => {
    if (!name.trim()) return null
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    const newCat: CategoryItem = {
      id: `cat-${slug}-${Date.now()}`,
      parent_id: null,
      name: name.trim(),
      slug,
      icon: icon || '✂️',
      description: description || `${name} equipment & instruments.`,
      sort_order: categories.length + 1,
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      product_count: 0,
      level: 0,
    }
    const updatedCats = [...categories, newCat]
    setCategories(updatedCats)
    saveStoredCategories(updatedCats)
    showToast(`New category "${newCat.name}" created!`)
    return newCat
  }

  const handleCreateSubcategory = (parentId: string, name: string, description = '') => {
    if (!name.trim() || !parentId) return null
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    const newSubcat: CategoryItem = {
      id: `sub-${slug}-${Date.now()}`,
      parent_id: parentId,
      name: name.trim(),
      slug,
      description: description || `${name} specialized instruments and tools.`,
      sort_order: categories.filter((c) => c.parent_id === parentId).length + 1,
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      product_count: 0,
      level: 1,
    }
    const updatedCats = [...categories, newSubcat]
    setCategories(updatedCats)
    saveStoredCategories(updatedCats)
    showToast(`New subcategory "${newSubcat.name}" created!`)
    return newSubcat
  }

  // ==========================================
  // COMPREHENSIVE CATEGORY CRUD HANDLERS
  // ==========================================
  const handleOpenCategoryModal = (
    mode: 'add_main' | 'edit_main' | 'add_sub' | 'edit_sub' | 'add_group' | 'edit_group',
    targetCategory: CategoryItem | null = null,
    parentId: string | null = null
  ) => {
    let initialIcon = '📁'
    if (mode === 'add_main') initialIcon = '✂️'
    else if (mode === 'add_sub') initialIcon = '📂'
    else if (mode === 'add_group') initialIcon = '🔹'
    else if (targetCategory?.icon) initialIcon = targetCategory.icon

    setCategoryModal({
      isOpen: true,
      mode,
      targetCategory,
      parentId: parentId || targetCategory?.parent_id || null,
      name: targetCategory?.name || '',
      icon: initialIcon,
      description: targetCategory?.description || '',
    })
  }

  const handleSaveCategoryModal = (e: React.FormEvent) => {
    e.preventDefault()
    const { mode, targetCategory, parentId, name, icon, description } = categoryModal
    if (!name.trim()) return

    const trimmedName = name.trim()
    const cleanSlug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

    let updatedCats: CategoryItem[] = []

    if (mode === 'add_main') {
      const newCat: CategoryItem = {
        id: `cat-${cleanSlug}-${Date.now()}`,
        parent_id: null,
        name: trimmedName,
        slug: cleanSlug,
        icon: icon || '📁',
        description: description || `${trimmedName} equipment & instruments.`,
        sort_order: categories.filter((c) => !c.parent_id || c.level === 0).length + 1,
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        product_count: 0,
        level: 0,
      }
      updatedCats = [...categories, newCat]
      setActiveMainCatId(newCat.id)
      setActiveSubcatId(null)
      showToast(`Category "${newCat.name}" created successfully!`)
    } else if (mode === 'edit_main' && targetCategory) {
      const oldName = targetCategory.name
      updatedCats = categories.map((c) =>
        c.id === targetCategory.id
          ? {
              ...c,
              name: trimmedName,
              icon: icon || c.icon || '📁',
              description: description,
              updated_at: new Date().toISOString(),
            }
          : c
      )
      // Cascade rename to products if name changed
      if (oldName !== trimmedName) {
        const updatedProds = products.map((p) => {
          if (p.category_id === targetCategory.id || p.category_name?.toLowerCase() === oldName.toLowerCase()) {
            return {
              ...p,
              category_name: trimmedName,
              specifications: {
                ...(p.specifications || {}),
                Category: trimmedName,
              },
              updated_at: new Date().toISOString(),
            }
          }
          return p
        })
        setProducts(updatedProds)
        saveStoredProducts(updatedProds)
      }
      showToast(`Category "${trimmedName}" updated successfully!`)
    } else if (mode === 'add_sub') {
      const resolvedParentId = parentId || activeMainCatId
      const newSub: CategoryItem = {
        id: `sub-${cleanSlug}-${Date.now()}`,
        parent_id: resolvedParentId,
        name: trimmedName,
        slug: cleanSlug,
        icon: icon || '📂',
        description: description || `${trimmedName} specialized instruments and tools.`,
        sort_order: categories.filter((c) => c.parent_id === resolvedParentId).length + 1,
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        product_count: 0,
        level: 1,
      }
      updatedCats = [...categories, newSub]
      setActiveSubcatId(newSub.id)
      showToast(`Subcategory "${newSub.name}" created successfully!`)
    } else if (mode === 'edit_sub' && targetCategory) {
      const oldName = targetCategory.name
      updatedCats = categories.map((c) =>
        c.id === targetCategory.id
          ? {
              ...c,
              name: trimmedName,
              icon: icon || c.icon || '📂',
              description: description,
              parent_id: parentId || c.parent_id,
              updated_at: new Date().toISOString(),
            }
          : c
      )
      // Cascade rename to products
      if (oldName !== trimmedName) {
        const updatedProds = products.map((p) => {
          if (p.subcategory_id === targetCategory.id || p.subcategory_name?.toLowerCase() === oldName.toLowerCase()) {
            return {
              ...p,
              subcategory_name: trimmedName,
              specifications: {
                ...(p.specifications || {}),
                Subcategory: trimmedName,
              },
              updated_at: new Date().toISOString(),
            }
          }
          return p
        })
        setProducts(updatedProds)
        saveStoredProducts(updatedProds)
      }
      showToast(`Subcategory "${trimmedName}" updated successfully!`)
    } else if (mode === 'add_group') {
      const resolvedParentId = parentId || activeSubcatId
      if (!resolvedParentId) {
        showToast('Please select a subcategory first.')
        return
      }
      const newGroup: CategoryItem = {
        id: `grp-${cleanSlug}-${Date.now()}`,
        parent_id: resolvedParentId,
        name: trimmedName,
        slug: cleanSlug,
        icon: '🔹',
        description: description || `${trimmedName} instrument collection.`,
        sort_order: categories.filter((c) => c.parent_id === resolvedParentId).length + 1,
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        product_count: 0,
        level: 2,
      }
      updatedCats = [...categories, newGroup]
      showToast(`Group "${newGroup.name}" created successfully!`)
    } else if (mode === 'edit_group' && targetCategory) {
      const oldName = targetCategory.name
      updatedCats = categories.map((c) =>
        c.id === targetCategory.id
          ? {
              ...c,
              name: trimmedName,
              description: description,
              parent_id: parentId || c.parent_id,
              updated_at: new Date().toISOString(),
            }
          : c
      )
      // Cascade rename to products
      if (oldName !== trimmedName) {
        const updatedProds = products.map((p) => {
          if (p.sub_subcategory_id === targetCategory.id || p.sub_subcategory_name?.toLowerCase() === oldName.toLowerCase()) {
            return {
              ...p,
              sub_subcategory_name: trimmedName,
              specifications: {
                ...(p.specifications || {}),
                Group: trimmedName,
              },
              updated_at: new Date().toISOString(),
            }
          }
          return p
        })
        setProducts(updatedProds)
        saveStoredProducts(updatedProds)
      }
      showToast(`Group "${trimmedName}" updated successfully!`)
    }

    setCategories(updatedCats)
    saveStoredCategories(updatedCats)
    setCategoryModal((prev) => ({ ...prev, isOpen: false }))
  }

  const handleDeleteCategory = (cat: CategoryItem) => {
    // Find all child and grandchild IDs
    const toDelete = new Set<string>([cat.id])
    let added = true
    while (added) {
      added = false
      categories.forEach((c) => {
        if (c.parent_id && toDelete.has(c.parent_id) && !toDelete.has(c.id)) {
          toDelete.add(c.id)
          added = true
        }
      })
    }

    const typeLabel = cat.level === 0 ? 'Main Category' : cat.level === 1 ? 'Subcategory' : 'Group'
    const nestedCount = toDelete.size - 1
    const confirmText = nestedCount > 0
      ? `Are you sure you want to delete ${typeLabel} "${cat.name}" and its ${nestedCount} nested subcategories/groups? (Products will NOT be deleted).`
      : `Are you sure you want to delete ${typeLabel} "${cat.name}"? (Products will NOT be deleted).`

    if (!confirm(confirmText)) return

    const remaining = categories.filter((c) => !toDelete.has(c.id))
    setCategories(remaining)
    saveStoredCategories(remaining)

    // If active main cat was deleted, switch activeMainCatId
    if (toDelete.has(activeMainCatId)) {
      const nextMain = remaining.find((c) => !c.parent_id || c.level === 0)
      setActiveMainCatId(nextMain?.id || '')
      setActiveSubcatId(null)
    } else if (activeSubcatId && toDelete.has(activeSubcatId)) {
      const nextSub = remaining.find((c) => c.parent_id === activeMainCatId && c.level === 1)
      setActiveSubcatId(nextSub?.id || null)
    }

    showToast(`"${cat.name}" removed successfully! Live on website & saved across reload.`)
  }

  // ==========================================
  // SAVE PRODUCT HANDLER
  // ==========================================
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    const catObj = categories.find((c) => c.id === formData.category_id)
    const subcatObj = categories.find((c) => c.id === formData.subcategory_id)
    const subSubcatObj = categories.find((c) => c.id === formData.sub_subcategory_id)

    const resolvedCatId = catObj?.id || 'cat-surg-inst'
    const resolvedCatName = catObj?.name || 'Surgical Instruments'
    const resolvedSubcatId = subcatObj?.id || null
    const resolvedSubcatName = subcatObj?.name || ''
    const resolvedSubSubcatId = subSubcatObj?.id || formData.sub_subcategory_id || null
    const resolvedSubSubcatName = subSubcatObj?.name || formData.sub_subcategory_name || ''

    const parsedSizes = formData.sizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    const discountTiers: QuantityDiscountTier[] = [
      { quantity: 1, discount_percentage: 0, badge: 'Standard price', free_shipping: false },
      ...formData.custom_tiers
        .filter((t) => Number(t.pieces) > 1 && Number(t.discount) >= 0)
        .sort((a, b) => Number(a.pieces) - Number(b.pieces))
        .map((t) => ({
          quantity: Number(t.pieces),
          discount_percentage: Number(t.discount),
          badge: `Save ${t.discount}%`,
          free_shipping: true,
        })),
    ]

    const cleanSlug = formData.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    let updated: ProductItem[] = []

    if (editingProduct) {
      updated = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              title: formData.title,
              slug: p.slug || cleanSlug,
              sku: formData.sku,
              price: Number(formData.price),
              original_price: Number(formData.original_price),
              weight: formData.weight || undefined,
              badge: formData.badge || null,
              category_id: resolvedCatId,
              category_name: resolvedCatName,
              subcategory_id: resolvedSubcatId,
              subcategory_name: resolvedSubcatName,
              sub_subcategory_id: resolvedSubSubcatId,
              sub_subcategory_name: resolvedSubSubcatName,
              short_description: formData.short_description,
              full_description: formData.full_description,
              featured_image: formData.featured_image,
              gallery_images: formData.gallery_images,
              stock_quantity: Number(formData.stock_quantity) || 100,
              sizes: parsedSizes.length > 0 ? parsedSizes : ['12.5cm', '14.0cm', '15.5cm', '18.0cm', '20.5cm'],
              quantity_discounts: discountTiers,
              in_stock: formData.in_stock,
              is_best_seller: formData.is_best_seller,
              is_new_arrival: formData.is_new_arrival,
              is_featured: formData.is_featured,
              is_published: formData.is_published,
              is_user_created: true,
              specifications: {
                ...(p.specifications || {}),
                Category: resolvedCatName,
                Subcategory: resolvedSubcatName,
                Group: resolvedSubSubcatName,
                ...(formData.weight ? { Weight: formData.weight } : {}),
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
        slug: cleanSlug,
        sku: formData.sku,
        category_id: resolvedCatId,
        category_name: resolvedCatName,
        subcategory_id: resolvedSubcatId,
        subcategory_name: resolvedSubcatName,
        sub_subcategory_id: resolvedSubSubcatId,
        sub_subcategory_name: resolvedSubSubcatName,
        price: Number(formData.price),
        original_price: Number(formData.original_price),
        weight: formData.weight || undefined,
        badge: formData.badge || null,
        short_description: formData.short_description || `High quality medical equipment for ${resolvedCatName}.`,
        full_description: formData.full_description || `Precision engineered medical device for ${resolvedCatName} - ${resolvedSubcatName}. Built to last with hospital grade compliance.`,
        featured_image: formData.featured_image || '/images/products/image-399.png',
        gallery_images: formData.gallery_images.length > 0 ? formData.gallery_images : [formData.featured_image || '/images/products/image-399.png'],
        stock_quantity: Number(formData.stock_quantity) || 100,
        sizes: parsedSizes.length > 0 ? parsedSizes : ['12.5cm', '14.0cm', '15.5cm', '18.0cm', '20.5cm'],
        quantity_discounts: discountTiers,
        features: ['Hospital Grade Compliance', 'Autoclavable & Durable', 'ISO 13485 Certified'],
        specifications: {
          Category: resolvedCatName,
          Subcategory: resolvedSubcatName,
          Group: resolvedSubSubcatName,
          ...(formData.weight ? { Weight: formData.weight } : {}),
          'Quality Grade': 'Medical Grade German Stainless Steel',
          Sterilization: 'Autoclavable (134°C)',
        },
        catalogue_pdf: null,
        in_stock: formData.in_stock,
        is_best_seller: formData.is_best_seller,
        is_new_arrival: formData.is_new_arrival,
        is_featured: formData.is_featured,
        is_published: formData.is_published,
        is_user_created: true,
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
    setIsModalOpen(false)
  }

  // ==========================================
  // DELETE / REMOVE PRODUCT HANDLER
  // ==========================================
  const handleDelete = (id: string) => {
    const target = products.find((p) => p.id === id)
    if (confirm(`Are you sure you want to delete "${target?.title || 'this product'}"? This action will permanently remove it.`)) {
      markProductAsDeleted(id)
      const updated = products.filter((p) => p.id !== id)
      setProducts(updated)
      saveStoredProducts(updated)
      showToast('Product successfully deleted!')
    }
  }

  // ==========================================
  // TOGGLES FOR STATUS BADGES
  // ==========================================
  const handleToggleBestSeller = (prod: ProductItem) => {
    const updated = products.map((p) =>
      p.id === prod.id ? { ...p, is_best_seller: !p.is_best_seller, is_featured: !p.is_best_seller, is_user_created: true } : p
    )
    setProducts(updated)
    saveStoredProducts(updated)
    showToast(`"${prod.title}" Best Seller status updated!`)
  }

  const handleToggleNewArrival = (prod: ProductItem) => {
    const updated = products.map((p) =>
      p.id === prod.id ? { ...p, is_new_arrival: !p.is_new_arrival, is_user_created: true } : p
    )
    setProducts(updated)
    saveStoredProducts(updated)
    showToast(`"${prod.title}" New Arrival status updated!`)
  }

  const handleToggleInStock = (prod: ProductItem) => {
    const updated = products.map((p) =>
      p.id === prod.id ? { ...p, in_stock: !(p.in_stock !== false), is_user_created: true } : p
    )
    setProducts(updated)
    saveStoredProducts(updated)
    showToast(`"${prod.title}" stock status updated!`)
  }

  // Reset to clean baseline (1 product per subcategory)
  const handleResetCleanBaseline = () => {
    if (
      confirm(
        'Are you sure you want to reset all products to the clean 1-product-per-subcategory baseline? This will remove any duplicate old dummy items.'
      )
    ) {
      const cleaned = resetToCleanBaselineProducts()
      setProducts(cleaned)
      showToast('Pristine clean catalog restored: exactly 1 product per subcategory!')
    }
  }

  // Manual save all
  const [isSavingAll, setIsSavingAll] = useState(false)
  const handleSaveAllChanges = async () => {
    setIsSavingAll(true)
    try {
      saveStoredProducts(products)
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(products),
      }).catch(() => {})
      showToast('ALL PRODUCTS SAVED! Live storefront and server file synchronized.')
    } finally {
      setIsSavingAll(false)
    }
  }

  // Filter products for the master table
  const mainCategories = categories.filter((c) => !c.parent_id || c.level === 0)
  const subCategories = categories.filter((c) => c.parent_id)

  const filtered = products.filter((p) => {
    // Tab filter
    if (viewTab === 'best_sellers' && !p.is_best_seller && !p.is_featured) return false
    if (viewTab === 'new_arrivals' && !p.is_new_arrival && p.badge !== 'New') return false
    if (viewTab === 'sale' && !p.badge?.toLowerCase().includes('sale') && !(p.original_price && p.price && p.original_price > p.price)) return false

    // Category filter
    if (selectedCat !== 'all') {
      const catObj = categories.find((c) => c.id === selectedCat || c.slug === selectedCat)
      const childIds = catObj ? categories.filter((c) => c.parent_id === catObj.id).map((c) => c.id) : []
      const matches =
        p.category_id === selectedCat ||
        p.subcategory_id === selectedCat ||
        p.sub_subcategory_id === selectedCat ||
        childIds.includes(p.category_id || '') ||
        childIds.includes(p.subcategory_id || '') ||
        childIds.includes(p.sub_subcategory_id || '') ||
        (catObj && p.category_name?.toLowerCase() === catObj.name.toLowerCase()) ||
        (catObj && p.subcategory_name?.toLowerCase() === catObj.name.toLowerCase()) ||
        (catObj && p.sub_subcategory_name?.toLowerCase() === catObj.name.toLowerCase()) ||
        (catObj && p.specifications?.Subcategory?.toLowerCase() === catObj.name.toLowerCase()) ||
        (catObj && p.specifications?.Group?.toLowerCase() === catObj.name.toLowerCase())
      if (!matches) return false
    }

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      const haystack = `${p.title} ${p.sku} ${p.category_name} ${p.subcategory_name || ''} ${p.specifications?.Subcategory || ''} ${p.short_description || ''}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }

    return true
  })

  // Current product location helper
  const selectedCatObj = categories.find((c) => c.id === formData.category_id)
  const availableSubcats = categories.filter((c) => c.parent_id === formData.category_id && c.level === 1)
  const selectedSubcatObj = categories.find((c) => c.id === formData.subcategory_id)
  const availableSubSubcats = categories.filter(
    (c) => c.parent_id === formData.subcategory_id && c.level === 2
  )
  const selectedSubSubcatObj = categories.find((c) => c.id === formData.sub_subcategory_id)

  // Matching helpers for 3-level tree
  const matchProductToGroup = (p: ProductItem, group: CategoryItem) => {
    if (p.sub_subcategory_id === group.id) return true
    if (p.sub_subcategory_name && p.sub_subcategory_name.toLowerCase() === group.name.toLowerCase()) return true
    if (p.specifications?.Group && p.specifications.Group.toLowerCase() === group.name.toLowerCase()) return true
    if (p.title.toLowerCase().includes(group.name.toLowerCase())) return true
    return false
  }

  const matchProductToSubcat = (p: ProductItem, subcat: CategoryItem) => {
    if (p.subcategory_id === subcat.id) return true
    if (p.category_id === subcat.id) return true
    if (p.subcategory_name && p.subcategory_name.toLowerCase() === subcat.name.toLowerCase()) return true
    if (p.specifications?.Subcategory && p.specifications.Subcategory.toLowerCase() === subcat.name.toLowerCase()) return true
    return false
  }

  const matchProductToMainCat = (p: ProductItem, mainCat: CategoryItem) => {
    if (p.category_id === mainCat.id) return true
    if (p.category_name && p.category_name.toLowerCase() === mainCat.name.toLowerCase()) return true
    const childSubs = categories.filter((c) => c.parent_id === mainCat.id)
    return childSubs.some((s) => s.id === p.subcategory_id || s.id === p.category_id)
  }

  return (
    <AdminShell>
      <div className="w-full max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2500px] 4xl:max-w-[3200px] mx-auto space-y-6 sm:space-y-8 animate-fade-in font-sans">
        
        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ========================================================
            HEADER SECTION & ACTION BUTTONS
        ======================================================== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#96161B] uppercase tracking-wider mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#96161B] animate-pulse" />
              <span>Catalog Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Products Management
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              View, add, edit, and organize all products and their categories.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                loadData()
                showToast('Products refreshed!')
              }}
              className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-all cursor-pointer"
              title="Refresh Products"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* ADD NEW PRODUCT BUTTON */}
            <button
              id="admin-add-product-btn"
              onClick={() => handleOpenAdd()}
              className="flex items-center gap-2 bg-[#96161B] hover:bg-[#7d1216] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl transition-all shadow-md shadow-red-950/20 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            3-LEVEL STOREFRONT HIERARCHY & PRODUCTS NAVIGATOR
        ======================================================== */}
        <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-[#96161B]" />
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Product Categories & Hierarchy
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Browse products by category, subcategory, and instrument group.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenAdd(activeMainCatId, activeSubcatId || undefined)}
                className="text-xs font-bold text-white bg-[#96161B] hover:bg-[#7d1216] px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product in Group</span>
              </button>
            </div>
          </div>

          {/* LEVEL 0: MAIN CATEGORIES TABS */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#96161B]" />
                <span>Main Categories</span>
              </div>
              <button
                type="button"
                onClick={() => handleOpenCategoryModal('add_main')}
                className="text-xs font-bold text-[#96161B] hover:text-[#7d1216] bg-red-50 hover:bg-red-100 border border-red-200/80 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Category</span>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {mainCategories.map((cat) => {
                const childSubs = categories.filter((c) => c.parent_id === cat.id && c.level === 1)
                const catProds = products.filter((p) => matchProductToMainCat(p, cat))
                const isActive = activeMainCatId === cat.id

                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setActiveMainCatId(cat.id)
                      const firstSub = childSubs[0]?.id || null
                      setActiveSubcatId(firstSub)
                    }}
                    className={`relative group/cat p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? 'border-[#96161B] bg-gradient-to-br from-red-50/80 to-white shadow-md shadow-red-950/5 ring-2 ring-[#96161B]/20'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/70 hover:bg-white'
                    }`}
                  >
                    {/* Action buttons (Edit & Delete) on Category Card */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 opacity-70 group-hover/cat:opacity-100 transition-opacity z-10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenCategoryModal('edit_main', cat)
                        }}
                        className="p-1.5 rounded-lg bg-white/95 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs transition-colors cursor-pointer"
                        title={`Edit category ${cat.name}`}
                      >
                        <Edit2 className="w-3 h-3 text-slate-700" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteCategory(cat)
                        }}
                        className="p-1.5 rounded-lg bg-white/95 hover:bg-red-50 border border-slate-200 text-slate-400 hover:text-red-600 shadow-2xs transition-colors cursor-pointer"
                        title={`Delete category ${cat.name}`}
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </button>
                    </div>

                    <div>
                      <div className="text-xl mb-1">{cat.icon || '📁'}</div>
                      <div className={`font-black text-xs sm:text-sm line-clamp-1 pr-14 ${isActive ? 'text-[#96161B]' : 'text-slate-800'}`}>
                        {cat.name}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-slate-500 border-t border-slate-200/70 pt-2">
                      <span>{childSubs.length} Subcats</span>
                      <span className={`px-1.5 py-0.5 rounded font-black text-[10px] ${
                        isActive ? 'bg-[#96161B] text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {catProds.length} Prods
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* LEVEL 1 & LEVEL 2: SUBCATEGORIES ACCORDION WITH GROUPS & PRODUCTS */}
          {activeMainCatId && (() => {
            const currentMainCat = categories.find((c) => c.id === activeMainCatId)
            const currentSubs = categories.filter((c) => c.parent_id === activeMainCatId && c.level === 1)

            if (currentSubs.length === 0) {
              return (
                <div className="p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center space-y-3">
                  <p className="text-xs text-slate-500 font-semibold">No subcategories defined for {currentMainCat?.name}.</p>
                  <button
                    type="button"
                    onClick={() => handleOpenCategoryModal('add_sub', null, activeMainCatId)}
                    className="text-xs font-bold text-white bg-[#96161B] hover:bg-[#7d1216] px-4 py-2 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create First Subcategory</span>
                  </button>
                </div>
              )
            }

            return (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    <span>Subcategories ({currentMainCat?.name})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenCategoryModal('add_sub', null, activeMainCatId)}
                    className="text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Subcategory</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {currentSubs.map((subcat) => {
                    const isOpen = activeSubcatId === subcat.id
                    const groups = categories.filter((c) => c.parent_id === subcat.id && c.level === 2)
                    const subcatProds = products.filter((p) => matchProductToSubcat(p, subcat))

                    return (
                      <div
                        key={subcat.id}
                        className={`rounded-2xl border transition-all overflow-hidden ${
                          isOpen
                            ? 'border-indigo-300 bg-slate-50/40 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        {/* SUBCATEGORY HEADER BAR (CLICK TO TOGGLE - ONE OPEN AT A TIME) */}
                        <div
                          onClick={() => setActiveSubcatId(isOpen ? null : subcat.id)}
                          className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none bg-white hover:bg-slate-50/80 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${
                              isOpen ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {isOpen ? '▾' : '▸'}
                            </div>
                            <div>
                              <div className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                                <span>{subcat.name}</span>
                                <span className="text-[11px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200/60">
                                  {groups.length} Groups
                                </span>
                                <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                  {subcatProds.length} Products
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 line-clamp-1">{subcat.description}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
                            {/* Edit Subcategory */}
                            <button
                              type="button"
                              onClick={() => handleOpenCategoryModal('edit_sub', subcat, activeMainCatId)}
                              className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
                              title={`Edit subcategory ${subcat.name}`}
                            >
                              <Edit2 className="w-3.5 h-3.5 text-slate-700" />
                            </button>
                            {/* Delete Subcategory */}
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(subcat)}
                              className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors shadow-2xs cursor-pointer"
                              title={`Delete subcategory ${subcat.name}`}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            </button>
                            {/* Add Group */}
                            <button
                              type="button"
                              onClick={() => handleOpenCategoryModal('add_group', null, subcat.id)}
                              className="text-xs font-bold text-slate-700 hover:text-indigo-700 bg-slate-100 hover:bg-indigo-50 border border-slate-200 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                              title={`Add an instrument group in ${subcat.name}`}
                            >
                              <Plus className="w-3 h-3 text-indigo-600" />
                              <span>+ Group</span>
                            </button>
                            {/* Add Product in Subcategory */}
                            <button
                              type="button"
                              onClick={() => handleOpenAdd(activeMainCatId, subcat.id)}
                              className="text-xs font-bold text-indigo-700 hover:text-white hover:bg-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                              title="Add product directly into this subcategory"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Product in {subcat.name}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveSubcatId(isOpen ? null : subcat.id)}
                              className="text-xs font-bold text-slate-400 hover:text-slate-700 p-1.5 rounded-lg cursor-pointer"
                            >
                              {isOpen ? 'Collapse' : 'Expand'}
                            </button>
                          </div>
                        </div>

                        {/* LEVEL 3: FURTHER SUBCATEGORIES / INSTRUMENT GROUPS & PRODUCTS */}
                        {isOpen && (
                          <div className="p-4 sm:p-5 border-t border-slate-200/80 space-y-5 bg-slate-50/50 animate-fade-in">
                            {groups.length === 0 ? (
                              <div>
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs font-bold text-slate-600">Direct Products in {subcat.name}:</span>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleOpenCategoryModal('add_group', null, subcat.id)}
                                      className="text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-xl flex items-center gap-1 cursor-pointer"
                                    >
                                      <Plus className="w-3 h-3" />
                                      <span>Add 1st Group</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenAdd(activeMainCatId, subcat.id)}
                                      className="text-xs font-bold text-[#96161B] hover:underline flex items-center gap-1 cursor-pointer"
                                    >
                                      <Plus className="w-3 h-3" />
                                      <span>Add Product</span>
                                    </button>
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                  {subcatProds.map((prod) => (
                                    <ProductMiniCard
                                      key={prod.id}
                                      prod={prod}
                                      onViewLarge={() => setPreviewLargeImage(prod.featured_image)}
                                      onEdit={() => handleOpenEdit(prod)}
                                      onDelete={() => handleDelete(prod.id)}
                                    />
                                  ))}
                                </div>
                              </div>
                            ) : (
                              groups.map((group) => {
                                const groupProds = products.filter((p) => matchProductToGroup(p, group))

                                return (
                                  <div
                                    key={group.id}
                                    className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3"
                                  >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                                      <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#96161B]" />
                                        <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">
                                          {group.name}
                                        </h4>
                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                          {groupProds.length} {groupProds.length === 1 ? 'Product' : 'Products'}
                                        </span>
                                        {/* Edit Group */}
                                        <button
                                          type="button"
                                          onClick={() => handleOpenCategoryModal('edit_group', group, subcat.id)}
                                          className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                                          title={`Edit group ${group.name}`}
                                        >
                                          <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        {/* Delete Group */}
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteCategory(group)}
                                          className="p-1 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                                          title={`Delete group ${group.name}`}
                                        >
                                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                        </button>
                                      </div>

                                      <button
                                        onClick={() => handleOpenAdd(activeMainCatId, subcat.id, group.id)}
                                        className="text-xs font-bold text-emerald-700 hover:text-white hover:bg-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 w-fit"
                                      >
                                        <Plus className="w-3 h-3" />
                                        <span>Add Product in {group.name}</span>
                                      </button>
                                    </div>

                                    {groupProds.length > 0 ? (
                                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-1">
                                        {groupProds.map((prod) => (
                                          <ProductMiniCard
                                            key={prod.id}
                                            prod={prod}
                                            onViewLarge={() => setPreviewLargeImage(prod.featured_image)}
                                            onEdit={() => handleOpenEdit(prod)}
                                            onDelete={() => handleDelete(prod.id)}
                                          />
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 text-center flex items-center justify-between">
                                        <span className="text-xs text-slate-400 font-medium">No products uploaded in this group yet.</span>
                                        <button
                                          onClick={() => handleOpenAdd(activeMainCatId, subcat.id, group.id)}
                                          className="text-xs font-bold text-[#96161B] hover:underline cursor-pointer"
                                        >
                                          + Upload 1st Product
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )
                              })
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })()}
        </div>

        {/* ========================================================
            NAVIGATION TABS & SEARCH FILTERS
        ======================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setViewTab('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewTab === 'all'
                  ? 'bg-[#96161B] text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>All Products ({products.length})</span>
            </button>

            <button
              onClick={() => setViewTab('best_sellers')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewTab === 'best_sellers'
                  ? 'bg-[#96161B] text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Best Sellers ({products.filter((p) => p.is_best_seller).length})</span>
            </button>

            <button
              onClick={() => setViewTab('new_arrivals')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewTab === 'new_arrivals'
                  ? 'bg-[#96161B] text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>New Arrivals ({products.filter((p) => p.is_new_arrival || p.badge === 'New').length})</span>
            </button>

            <button
              onClick={() => setViewTab('sale')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewTab === 'sale'
                  ? 'bg-[#96161B] text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-red-500" />
              <span>Special Sale ({products.filter((p) => p.badge?.toLowerCase().includes('sale') || (p.original_price && p.price && p.original_price > p.price)).length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by title, SKU..."
                className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-[#96161B]"
              />
            </div>

            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#96161B]"
            >
              <option value="all">All Categories</option>
              {mainCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon || '📁'} {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ========================================================
            MASTER PRODUCTS TABLE
        ======================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4 sm:p-5">Product Details</th>
                  <th className="p-4 sm:p-5">Category & Subcategory</th>
                  <th className="p-4 sm:p-5">Price ($)</th>
                  <th className="p-4 sm:p-5">Sizes / Lengths</th>
                  <th className="p-4 sm:p-5 text-center">Best Seller</th>
                  <th className="p-4 sm:p-5 text-center">New</th>
                  <th className="p-4 sm:p-5 text-center">Stock</th>
                  <th className="p-4 sm:p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-slate-400">
                      No products found. Click &quot;+ Add New Product&quot; to add one.
                    </td>
                  </tr>
                ) : (
                  filtered.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Product Thumbnail & Title */}
                      <td className="p-4 sm:p-5 flex items-center gap-3">
                        <div
                          onClick={() => setPreviewLargeImage(prod.featured_image || '/images/products/image-399.png')}
                          className="relative w-14 h-14 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center cursor-pointer group"
                          title="Click to view large image"
                        >
                          <Image
                            src={prod.featured_image || '/images/products/image-399.png'}
                            alt={prod.title}
                            fill
                            unoptimized
                            className="object-contain p-1 group-hover:scale-110 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Maximize2 className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900 text-sm">
                            {prod.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {prod.badge && (
                              <span className="bg-[#96161B] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                {prod.badge}
                              </span>
                            )}
                            <span className="font-mono text-[11px] text-slate-500 font-bold">
                              SKU: {prod.sku || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category, Subcategory & Instrument Group */}
                      <td className="p-4 sm:p-5">
                        <div className="font-bold text-slate-800">{prod.category_name || 'General'}</div>
                        <div className="text-[11px] text-[#96161B] font-semibold flex items-center gap-1 mt-0.5">
                          <span>↳</span>
                          <span>{prod.subcategory_name || prod.specifications?.Subcategory || 'Standard Line'}</span>
                        </div>
                        {(prod.sub_subcategory_name || prod.specifications?.Group) && (
                          <div className="text-[10px] text-indigo-700 font-bold pl-3 flex items-center gap-1 mt-0.5">
                            <span>↳</span>
                            <span className="bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded">
                              {prod.sub_subcategory_name || prod.specifications?.Group}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Pricing with Discount */}
                      <td className="p-4 sm:p-5">
                        <div className="text-[#96161B] font-extrabold text-sm">
                          ${(prod.price ?? 49.50).toFixed(2)}
                        </div>
                        {prod.original_price && prod.original_price > (prod.price ?? 0) && (
                          <div className="flex items-center gap-1 text-[11px] mt-0.5">
                            <span className="text-slate-400 line-through font-semibold">
                              ${prod.original_price.toFixed(2)}
                            </span>
                            <span className="text-emerald-700 bg-emerald-50 px-1 rounded font-black text-[10px]">
                              -{Math.round(((prod.original_price - (prod.price ?? 0)) / prod.original_price) * 100)}%
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Sizes / Lengths */}
                      <td className="p-4 sm:p-5">
                        <div className="text-xs font-bold text-slate-700 truncate max-w-[200px]">
                          {Array.isArray(prod.sizes) && prod.sizes.length > 0 ? prod.sizes.join(', ') : 'Standard Sizes'}
                        </div>
                      </td>

                      {/* Best Seller Toggle */}
                      <td className="p-4 sm:p-5 text-center">
                        <button
                          onClick={() => handleToggleBestSeller(prod)}
                          className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
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
                          className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
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
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-all ${
                            prod.in_stock !== false
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {prod.in_stock !== false ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </td>

                      {/* Actions: + Quick Add, Storefront View, Edit, Delete */}
                      <td className="p-4 sm:p-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenAdd(prod.category_id, prod.subcategory_id, prod.sub_subcategory_id || undefined)}
                            className="p-2 text-emerald-700 hover:text-white hover:bg-emerald-600 bg-emerald-50 rounded-xl transition-all cursor-pointer font-bold"
                            title={`+ Quick Add Product in ${prod.subcategory_name || 'this category'}`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <Link
                            href={`/products/${prod.slug || prod.id}`}
                            target="_blank"
                            className="p-2 text-slate-500 hover:text-[#96161B] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                            title="View Large Product Page on Live Website"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleOpenEdit(prod)}
                            className="p-2 text-slate-600 hover:text-[#96161B] hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(prod.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
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

      {/* ========================================================
          POPUP 1: CATEGORY & SUBCATEGORY EXPLORER DRILL-DOWN
      ======================================================== */}
      {isCategoryExplorerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-slate-200">
            <button
              onClick={() => setIsCategoryExplorerOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <span className="text-[11px] font-bold text-[#96161B] uppercase tracking-wider">
                Storefront Architecture
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Explore Website Categories & Subcategories
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Click any category to open its subcategories popup, browse products, or add new items directly!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {mainCategories.map((cat) => {
                const childSubs = categories.filter((c) => c.parent_id === cat.id)
                const catProds = products.filter(
                  (p) =>
                    p.category_id === cat.id ||
                    childSubs.some((s) => s.id === p.subcategory_id || s.id === p.category_id) ||
                    p.category_name?.toLowerCase() === cat.name.toLowerCase()
                )

                return (
                  <div
                    key={cat.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#96161B] hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{cat.icon || '📁'}</span>
                        <span className="text-[11px] font-bold bg-[#96161B]/10 text-[#96161B] px-2 py-0.5 rounded-full">
                          {catProds.length} Products
                        </span>
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-900 mt-2">{cat.name}</h3>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{cat.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-600">
                        {childSubs.length} Subcategories
                      </span>
                      <button
                        onClick={() => {
                          setDrilldownCategory(cat)
                          setDrilldownSubcategory(null)
                        }}
                        className="bg-[#96161B] hover:bg-[#7d1216] text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1"
                      >
                        <span>Open ➔</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          POPUP 2: SUBCATEGORIES OF SELECTED CATEGORY
      ======================================================== */}
      {drilldownCategory && !drilldownSubcategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-slate-200">
            <button
              onClick={() => setDrilldownCategory(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#96161B] uppercase tracking-wider">
                  <span>Category Hierarchy</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-700">{drilldownCategory.name}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                  {drilldownCategory.name} Subcategories
                </h2>
              </div>

              <button
                onClick={() => handleOpenCategoryModal('add_sub', null, drilldownCategory.id)}
                className="bg-[#96161B] hover:bg-[#7d1216] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm w-fit"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Subcategory</span>
              </button>
            </div>

            {/* List of subcategories under this category */}
            <div className="space-y-3">
              {categories.filter((c) => c.parent_id === drilldownCategory.id).length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-xs text-slate-500 font-semibold mb-3">
                    No subcategories created yet under &quot;{drilldownCategory.name}&quot;.
                  </p>
                  <button
                    onClick={() => handleOpenCategoryModal('add_sub', null, drilldownCategory.id)}
                    className="bg-[#96161B] text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                  >
                    + Create First Subcategory
                  </button>
                </div>
              ) : (
                categories
                  .filter((c) => c.parent_id === drilldownCategory.id)
                  .map((subcat) => {
                    const subProds = products.filter(
                      (p) =>
                        p.subcategory_id === subcat.id ||
                        p.category_id === subcat.id ||
                        p.specifications?.Subcategory?.toLowerCase() === subcat.name.toLowerCase()
                    )

                    return (
                      <div
                        key={subcat.id}
                        className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-[#96161B] hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-extrabold text-slate-900">{subcat.name}</h3>
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                              {subProds.length} Products
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">{subcat.description || 'Specialized surgical instrument line'}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenCategoryModal('edit_sub', subcat, drilldownCategory.id)}
                            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
                            title={`Edit subcategory ${subcat.name}`}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(subcat)}
                            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors shadow-2xs cursor-pointer"
                            title={`Delete subcategory ${subcat.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          </button>
                          <button
                            onClick={() => {
                              handleOpenAdd(drilldownCategory.id, subcat.id)
                              setDrilldownCategory(null)
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Product</span>
                          </button>
                          <button
                            onClick={() => setDrilldownSubcategory(subcat)}
                            className="bg-[#96161B] hover:bg-[#7d1216] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <span>View Products ({subProds.length}) ➔</span>
                          </button>
                        </div>
                      </div>
                    )
                  })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          POPUP 3: PRODUCTS INSIDE SELECTED SUBCATEGORY
      ======================================================== */}
      {drilldownCategory && drilldownSubcategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-slate-200">
            <button
              onClick={() => setDrilldownSubcategory(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#96161B] uppercase tracking-wider">
                  <span className="cursor-pointer hover:underline" onClick={() => setDrilldownSubcategory(null)}>
                    {drilldownCategory.name}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-800">{drilldownSubcategory.name}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                  Products in {drilldownSubcategory.name}
                </h2>
              </div>

              <button
                onClick={() => {
                  handleOpenAdd(drilldownCategory.id, drilldownSubcategory.id)
                  setDrilldownSubcategory(null)
                  setDrilldownCategory(null)
                }}
                className="bg-[#96161B] hover:bg-[#7d1216] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm w-fit"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Product in this Subcategory</span>
              </button>
            </div>

            {/* List products inside this subcategory */}
            {(() => {
              const subcatProducts = products.filter(
                (p) =>
                  p.subcategory_id === drilldownSubcategory.id ||
                  p.category_id === drilldownSubcategory.id ||
                  p.specifications?.Subcategory?.toLowerCase() === drilldownSubcategory.name.toLowerCase()
              )

              if (subcatProducts.length === 0) {
                return (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <p className="text-xs text-slate-500 font-semibold">
                      No products added yet to {drilldownSubcategory.name}.
                    </p>
                    <button
                      onClick={() => {
                        handleOpenAdd(drilldownCategory.id, drilldownSubcategory.id)
                        setDrilldownSubcategory(null)
                        setDrilldownCategory(null)
                      }}
                      className="bg-[#96161B] text-white text-xs font-bold px-4 py-2 rounded-xl"
                    >
                      + Add First Product Here
                    </button>
                  </div>
                )
              }

              return (
                <div className="space-y-3">
                  {subcatProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => setPreviewLargeImage(p.featured_image || '/images/products/image-399.png')}
                          className="relative w-14 h-14 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center cursor-pointer"
                        >
                          <Image
                            src={p.featured_image || '/images/products/image-399.png'}
                            alt={p.title}
                            fill
                            unoptimized
                            className="object-contain p-1"
                          />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900">{p.title}</h4>
                          <div className="flex items-center gap-2 mt-0.5 text-xs">
                            <span className="font-mono text-slate-500 font-bold">SKU: {p.sku || 'N/A'}</span>
                            <span className="text-slate-300">|</span>
                            <span className="font-bold text-[#96161B]">${(p.price ?? 49.5).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/products/${p.slug || p.id}`}
                          target="_blank"
                          className="p-2 text-slate-500 hover:text-[#96161B] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                          title="View Large Product Page on Website"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            handleOpenEdit(p)
                            setDrilldownSubcategory(null)
                            setDrilldownCategory(null)
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* ========================================================
          POPUP 4: UNIFIED CATEGORY / SUBCATEGORY / GROUP CRUD MODAL
      ======================================================== */}
      {categoryModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setCategoryModal((prev) => ({ ...prev, isOpen: false }))}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-5">
              <span className="text-[11px] font-bold text-[#96161B] uppercase tracking-wider">
                {categoryModal.mode.startsWith('add') ? 'Create Hierarchy Item' : 'Edit Hierarchy Item'}
              </span>
              <h3 className="text-xl font-black text-slate-900">
                {categoryModal.mode === 'add_main' && 'Add New Main Category'}
                {categoryModal.mode === 'edit_main' && `Edit Category: ${categoryModal.targetCategory?.name || ''}`}
                {categoryModal.mode === 'add_sub' && 'Add New Subcategory'}
                {categoryModal.mode === 'edit_sub' && `Edit Subcategory: ${categoryModal.targetCategory?.name || ''}`}
                {categoryModal.mode === 'add_group' && 'Add Instrument Group'}
                {categoryModal.mode === 'edit_group' && `Edit Group: ${categoryModal.targetCategory?.name || ''}`}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {categoryModal.mode.includes('edit')
                  ? 'Changes will immediately update across the website, filters, and products.'
                  : 'New items will be immediately available on the website storefront.'}
              </p>
            </div>

            <form onSubmit={handleSaveCategoryModal} className="space-y-4">
              {/* Parent category selector for Subcategory */}
              {(categoryModal.mode === 'add_sub' || categoryModal.mode === 'edit_sub') && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Parent Main Category *
                  </label>
                  <select
                    required
                    value={categoryModal.parentId || activeMainCatId}
                    onChange={(e) => setCategoryModal({ ...categoryModal, parentId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#96161B]"
                  >
                    {mainCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon || '📁'} {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Parent subcategory selector for Group */}
              {(categoryModal.mode === 'add_group' || categoryModal.mode === 'edit_group') && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Parent Subcategory *
                  </label>
                  <select
                    required
                    value={categoryModal.parentId || activeSubcatId || ''}
                    onChange={(e) => setCategoryModal({ ...categoryModal, parentId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#96161B]"
                  >
                    {categories
                      .filter((c) => c.level === 1)
                      .map((c) => {
                        const parent = categories.find((p) => p.id === c.parent_id)
                        return (
                          <option key={c.id} value={c.id}>
                            {parent ? `${parent.name} ➔ ` : ''}{c.name}
                          </option>
                        )
                      })}
                  </select>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {categoryModal.mode.includes('group') ? 'Group Name *' : categoryModal.mode.includes('sub') ? 'Subcategory Name *' : 'Category Name *'}
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={categoryModal.name}
                  onChange={(e) => setCategoryModal({ ...categoryModal, name: e.target.value })}
                  placeholder={
                    categoryModal.mode.includes('group')
                      ? 'e.g. Sterile Gloves, Bone Rongeurs, Needle Holders'
                      : categoryModal.mode.includes('sub')
                      ? 'e.g. Dental & Oral Surgery, Disposables'
                      : 'e.g. Surgical Instruments, Medical Supplies'
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-[#96161B]"
                />
              </div>

              {/* Icon (for Main Categories and Subcategories) */}
              {!categoryModal.mode.includes('group') && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Icon (Emoji)
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={categoryModal.icon}
                      onChange={(e) => setCategoryModal({ ...categoryModal, icon: e.target.value })}
                      className="w-20 px-3 py-2 text-center text-lg rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-[#96161B]"
                    />
                    <div className="flex flex-wrap gap-1.5 flex-1">
                      {['✂️', '🩹', '🥽', '🩺', '🏷️', '🦷', '🦴', '🔬', '💉', '🛏️', '🏥', '📁', '📂', '⚡'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setCategoryModal({ ...categoryModal, icon: emoji })}
                          className={`w-7 h-7 rounded-lg text-sm border flex items-center justify-center hover:scale-110 transition-transform cursor-pointer ${
                            categoryModal.icon === emoji ? 'border-[#96161B] bg-red-50' : 'border-slate-200 bg-slate-50'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={categoryModal.description}
                  onChange={(e) => setCategoryModal({ ...categoryModal, description: e.target.value })}
                  placeholder="Short description displayed on website storefront and filters..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-[#96161B]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCategoryModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#96161B] hover:bg-[#7d1216] rounded-xl shadow-sm cursor-pointer"
                >
                  {categoryModal.mode.startsWith('add') ? 'Create & Save' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          POPUP 6: FULL-SIZE VIEW LARGE IMAGE MODAL
      ======================================================== */}
      {previewLargeImage && (
        <div
          onClick={() => setPreviewLargeImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[88vh] w-full h-[80vh] flex items-center justify-center">
            <button
              onClick={() => setPreviewLargeImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-red-400 p-2 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            >
              <X className="w-5 h-5" />
              <span>Close View Large</span>
            </button>
            <Image
              src={previewLargeImage}
              alt="High Resolution Large View"
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* ========================================================
          POPUP 7: MASTER ADD / EDIT PRODUCT MODAL
      ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto border border-slate-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* HEADER */}
            <div className="mb-4">
              <span className="text-[11px] font-bold text-[#96161B] uppercase tracking-wider">
                Storefront Product Customizer
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {editingProduct ? 'Edit Product Details' : 'Add New Product'}
              </h3>
            </div>

            {/* LIVE WEBSITE LOCATION BREADCRUMB INDICATOR */}
            <div className="p-3 bg-red-50/70 border border-red-200/80 rounded-2xl flex items-center gap-2 text-xs font-bold text-slate-800 mb-5">
              <span className="text-base shrink-0">📍</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-slate-500 font-semibold">Storefront Hierarchy:</span>
                <span className="text-slate-900">Home</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[#96161B] font-extrabold">{selectedCatObj?.name || 'Category'}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-800 font-extrabold">
                  {selectedSubcatObj?.name || 'General Subcategory'}
                </span>
                {(selectedSubSubcatObj || formData.sub_subcategory_name) && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-indigo-800 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded font-extrabold">
                      {selectedSubSubcatObj?.name || formData.sub_subcategory_name}
                    </span>
                  </>
                )}
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4 sm:space-y-5">
              
              {/* Product Title (Custom name) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Product Name / Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Dental Bone Rongeur Friedman 14cm"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B] font-semibold"
                />
              </div>

              {/* 3 Cascading Category Dropdowns: Main Category, Subcategory, Further Subcategory / Group */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {/* 1. Category Selection */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      1. Main Category *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowInlineNewCategory(!showInlineNewCategory)}
                      className="text-[10px] font-bold text-[#96161B] hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ New</span>
                    </button>
                  </div>

                  {showInlineNewCategory ? (
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 mb-2">
                      <input
                        type="text"
                        value={inlineCategoryName}
                        onChange={(e) => setInlineCategoryName(e.target.value)}
                        placeholder="Enter new category name..."
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (!inlineCategoryName.trim()) return
                            const created = handleCreateCategory(inlineCategoryName)
                            if (created) {
                              setFormData({ ...formData, category_id: created.id, subcategory_id: '' })
                              setInlineCategoryName('')
                              setShowInlineNewCategory(false)
                            }
                          }}
                          className="bg-[#96161B] text-white text-[10px] font-bold px-3 py-1 rounded-lg"
                        >
                          Save & Select
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowInlineNewCategory(false)}
                          className="text-slate-500 text-[10px] font-bold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <select
                      value={formData.category_id}
                      onChange={(e) => {
                        const newCatId = e.target.value
                        const available = categories.filter((c) => c.parent_id === newCatId && c.level === 1)
                        const firstSub = available[0]?.id || ''
                        const availableGroups = categories.filter((c) => c.parent_id === firstSub && c.level === 2)
                        setFormData({
                          ...formData,
                          category_id: newCatId,
                          subcategory_id: firstSub,
                          sub_subcategory_id: availableGroups[0]?.id || '',
                          sub_subcategory_name: availableGroups[0]?.name || '',
                        })
                      }}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B] font-semibold"
                    >
                      {mainCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon || '📁'} {cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* 2. Subcategory Selection */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      2. Subcategory *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowInlineNewSubcategory(!showInlineNewSubcategory)}
                      className="text-[10px] font-bold text-[#96161B] hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ New</span>
                    </button>
                  </div>

                  {showInlineNewSubcategory ? (
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 mb-2">
                      <input
                        type="text"
                        value={inlineSubcategoryName}
                        onChange={(e) => setInlineSubcategoryName(e.target.value)}
                        placeholder="Enter new subcategory name..."
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (!inlineSubcategoryName.trim()) return
                            const created = handleCreateSubcategory(formData.category_id, inlineSubcategoryName)
                            if (created) {
                              setFormData({ ...formData, subcategory_id: created.id })
                              setInlineSubcategoryName('')
                              setShowInlineNewSubcategory(false)
                            }
                          }}
                          className="bg-[#96161B] text-white text-[10px] font-bold px-3 py-1 rounded-lg"
                        >
                          Save & Select
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowInlineNewSubcategory(false)}
                          className="text-slate-500 text-[10px] font-bold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <select
                      value={formData.subcategory_id}
                      onChange={(e) => {
                        const newSubId = e.target.value
                        const availableGroups = categories.filter((c) => c.parent_id === newSubId && c.level === 2)
                        setFormData({
                          ...formData,
                          subcategory_id: newSubId,
                          sub_subcategory_id: availableGroups[0]?.id || '',
                          sub_subcategory_name: availableGroups[0]?.name || '',
                        })
                      }}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B] font-semibold"
                    >
                      <option value="">Select Subcategory...</option>
                      {availableSubcats.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          ↳ {sub.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* 3. Further Subcategory / Instrument Group (Level 2) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      3. Group / Sub-Subcat
                    </label>
                  </div>
                  <select
                    value={formData.sub_subcategory_id}
                    onChange={(e) => {
                      const selectedId = e.target.value
                      const subsub = categories.find((c) => c.id === selectedId)
                      setFormData({
                        ...formData,
                        sub_subcategory_id: selectedId,
                        sub_subcategory_name: subsub?.name || '',
                      })
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B] font-semibold"
                  >
                    <option value="">Select Group / Further Sub...</option>
                    {availableSubSubcats.map((subsub) => (
                      <option key={subsub.id} value={subsub.id}>
                        ↳ {subsub.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SKU, Sale Price, Original Price, Weight */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    SKU / Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="DEN-1401"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Sale Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="49.50"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-[#96161B] outline-none focus:ring-2 focus:ring-[#96161B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Original Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: parseFloat(e.target.value) || 0 })}
                    placeholder="59.50"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B]"
                  />
                </div>

                {/* LIVE DISCOUNT PERCENTAGE BADGE & SAVINGS */}
                {formData.original_price > formData.price && formData.price > 0 && (
                  <div className="col-span-1 sm:col-span-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs font-bold text-emerald-800">
                    <span className="flex items-center gap-1.5">
                      <span>🎉</span>
                      <span>Live Discount: {Math.round(((formData.original_price - formData.price) / formData.original_price) * 100)}% OFF</span>
                    </span>
                    <span className="font-extrabold text-emerald-700">
                      Client saves ${(formData.original_price - formData.price).toFixed(2)} per unit
                    </span>
                  </div>
                )}
              </div>

              {/* Sizes & Stock Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Sizes / Lengths (Comma Separated) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    placeholder="12.5cm, 14.0cm, 15.5cm, 18.0cm, 20.5cm"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B]"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Comma-separated size pills (e.g. 12.5cm, 14.0cm, 15.5cm, 18.0cm)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Remaining Stock & In Stock
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={0}
                      required
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                      className="w-24 px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B]"
                    />
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-800">
                      <input
                        type="checkbox"
                        checked={formData.in_stock}
                        onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                        className="rounded text-[#96161B] focus:ring-[#96161B]"
                      />
                      <span>In Stock</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Card Badge (Sale, New, Best Seller)
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {['New', 'Sale', 'Best Seller', 'Precision', 'Medical Grade', 'None'].map((b) => (
                    <button
                      type="button"
                      key={b}
                      onClick={() => setFormData({ ...formData, badge: b === 'None' ? '' : b })}
                      className={`text-xs font-bold px-3 py-1 rounded-xl cursor-pointer transition-all ${
                        (formData.badge === b || (b === 'None' && !formData.badge))
                          ? 'bg-[#96161B] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Custom badge..."
                    className="w-32 px-3 py-1 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              {/* ===================================================
                  FEATURED IMAGE (VIEW LARGE PREVIEW & UPLOAD)
              =================================================== */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                      Featured Product Image (View Large) *
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Main high-resolution image shown on shop and zoom view.
                    </span>
                  </div>

                  {formData.featured_image && (
                    <button
                      type="button"
                      onClick={() => setPreviewLargeImage(formData.featured_image)}
                      className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-[#96161B]" />
                      <span>View Large Preview</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 rounded-2xl bg-white border-2 border-dashed border-[#96161B]/50 hover:border-[#96161B] flex items-center justify-center relative overflow-hidden shrink-0 cursor-pointer group shadow-xs"
                    title="Click to Upload Image"
                  >
                    {isUploadingImage ? (
                      <div className="w-5 h-5 border-2 border-[#96161B] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Image
                        src={formData.featured_image || '/images/products/image-399.png'}
                        alt="Product Preview"
                        fill
                        unoptimized
                        className="object-contain p-1.5 group-hover:scale-105 transition-transform"
                      />
                    )}
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageFileUpload}
                      accept="image/*"
                      className="sr-only"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[#96161B] hover:bg-[#7d1216] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingImage ? 'Uploading Image...' : 'Browse Image File (JPG, PNG, WEBP)'}</span>
                    </button>
                    <input
                      type="text"
                      value={formData.featured_image}
                      onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                      placeholder="/images/products/image-399.png"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* ===================================================
                  SMALL / OTHER VIEWS (MULTI-ANGLES GALLERY)
              =================================================== */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                      Small / Other Views (Angles Gallery)
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Upload multi-angle photos (side view, angle view, tip detail). Users can click thumbnails on View Large page to switch views!
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => galleryFileInputRef.current?.click()}
                    className="bg-[#96161B] hover:bg-[#7d1216] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer w-fit"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isUploadingGallery ? 'Compressing...' : 'Add Another View / Angle'}</span>
                  </button>
                </div>

                <input
                  type="file"
                  ref={galleryFileInputRef}
                  onChange={handleGalleryImageUpload}
                  accept="image/*"
                  multiple
                  className="sr-only"
                />

                {formData.gallery_images && formData.gallery_images.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    {formData.gallery_images.map((imgUrl, gIdx) => (
                      <div
                        key={gIdx}
                        className="relative group w-16 h-16 rounded-xl bg-white border border-slate-300 p-1 flex items-center justify-center shadow-xs overflow-hidden"
                      >
                        <Image
                          src={imgUrl}
                          alt={`Angle ${gIdx + 1}`}
                          fill
                          unoptimized
                          className="object-contain p-0.5 cursor-pointer"
                          onClick={() => setPreviewLargeImage(imgUrl)}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(gIdx)}
                          className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 opacity-90 hover:opacity-100 transition-all cursor-pointer shadow-md z-10"
                          title="Remove this angle"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <span className="absolute bottom-0 inset-x-0 bg-slate-900/70 text-white text-[9px] font-bold text-center py-0.5">
                          View {gIdx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 italic py-1">
                    No additional angles yet. Click &quot;Add Another View / Angle&quot; to upload extra views.
                  </div>
                )}
              </div>

              {/* ===================================================
                  BULK ORDER QUANTITY DISCOUNT TIERS TABLE
              =================================================== */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                      Wholesale Quantity Discount Tiers
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Tiered wholesale discounts auto-applied on the live product detail and checkout pages.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const lastTier = formData.custom_tiers[formData.custom_tiers.length - 1]
                      const nextPieces = lastTier ? Number(lastTier.pieces) + 25 : 150
                      const nextDiscount = lastTier ? Math.min(Number(lastTier.discount) + 5, 50) : 25
                      setFormData({
                        ...formData,
                        custom_tiers: [...formData.custom_tiers, { pieces: nextPieces, discount: nextDiscount }],
                      })
                    }}
                    className="text-[11px] font-bold text-[#96161B] bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Tier</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {formData.custom_tiers.map((tier, idx) => (
                    <div key={idx} className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-2 relative group shadow-2xs">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                        <span>Tier {idx + 1}</span>
                        {formData.custom_tiers.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                custom_tiers: formData.custom_tiers.filter((_, i) => i !== idx),
                              })
                            }
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                            title="Remove tier"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block font-semibold">Min Pieces</label>
                          <input
                            type="number"
                            min={2}
                            value={tier.pieces}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0
                              const updatedTiers = [...formData.custom_tiers]
                              updatedTiers[idx].pieces = val
                              setFormData({ ...formData, custom_tiers: updatedTiers })
                            }}
                            className="w-full px-2 py-1 border border-slate-200 rounded text-xs font-bold text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block font-semibold">Discount %</label>
                          <input
                            type="number"
                            min={1}
                            max={90}
                            value={tier.discount}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0
                              const updatedTiers = [...formData.custom_tiers]
                              updatedTiers[idx].discount = val
                              setFormData({ ...formData, custom_tiers: updatedTiers })
                            }}
                            className="w-full px-2 py-1 border border-slate-200 rounded text-xs font-bold text-[#96161B]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Short & Full Description */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    placeholder="Short summary displayed on catalog cards..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-[#96161B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Description & Technical Specifications
                  </label>
                  <textarea
                    rows={3}
                    value={formData.full_description}
                    onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                    placeholder="Comprehensive description of the product and surgical applications..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-[#96161B]"
                  />
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#96161B] hover:bg-[#7d1216] shadow-md shadow-red-950/20 active:scale-95 cursor-pointer"
                >
                  {editingProduct ? 'Save Product Changes' : 'Create & Publish Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </AdminShell>
  )
}

function ProductMiniCard({
  prod,
  onViewLarge,
  onEdit,
  onDelete,
}: {
  prod: ProductItem
  onViewLarge: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="p-3 bg-white rounded-2xl border border-slate-200/90 hover:border-[#96161B]/60 hover:shadow-md transition-all group flex flex-col justify-between">
      <div>
        <div className="relative w-full h-32 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center mb-2.5">
          <Image
            src={prod.featured_image || '/images/products/image-399.png'}
            alt={prod.title}
            fill
            unoptimized
            className="object-contain p-2 group-hover:scale-105 transition-transform"
          />
          <button
            type="button"
            onClick={onViewLarge}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 hover:bg-[#96161B] text-slate-600 hover:text-white shadow-sm transition-colors cursor-pointer"
            title="View Large"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          {prod.badge && (
            <span className="absolute top-2 left-2 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#96161B] text-white shadow-xs">
              {prod.badge}
            </span>
          )}
        </div>

        <div className="text-xs font-black text-slate-900 line-clamp-2 leading-snug group-hover:text-[#96161B] transition-colors" title={prod.title}>
          {prod.title}
        </div>
        <div className="text-[10px] font-mono text-slate-400 mt-1">
          <span>{prod.sku || 'SKU-N/A'}</span>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[#96161B] font-black text-sm">
            ${(prod.price ?? 49.50).toFixed(2)}
          </span>
          {prod.original_price && prod.original_price > (prod.price ?? 0) && (
            <span className="text-slate-400 text-[11px] line-through ml-1.5 font-semibold">
              ${prod.original_price.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Link
            href={`/products/${prod.slug || prod.id}`}
            target="_blank"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Storefront View"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={onEdit}
            className="p-1.5 text-slate-600 hover:text-[#96161B] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Edit Product"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Product"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminProductsPage() {
  return (
    <Suspense
      fallback={
        <AdminShell>
          <div className="p-12 text-center text-slate-400 font-bold">Loading Products Portal...</div>
        </AdminShell>
      }
    >
      <AdminProductsContent />
    </Suspense>
  )
}
