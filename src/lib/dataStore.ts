import { ProductItem } from '@/src/types/product'
import { CategoryItem } from '@/src/types/category'
import { CatalogueItem } from '@/src/types/catalogue'
import { ContactMessage } from '@/src/types/media'
import { BannerItem } from '@/src/types/banner'
import { TrustFeatureItem } from '@/src/types/trustFeature'
import {
  VideoWhyChooseData,
  WorldExportData,
  CompliancesPromoData,
  ComplianceBadgeItem,
  ProcessOrderStep,
  ProcessOrderBadge,
  ProcessOrderSectionData,
  DiscountProductItem,
  DiscountProductsSectionData,
  FaqItem,
  BulkInquiryBadge,
  FaqBulkInquiryData,
} from '@/src/types/section'
import {
  savePersistentData,
  getLocalStorageSync,
} from '@/src/lib/persistentStorage'
import { GeoStoreSettings } from '@/src/types/storeSettings'

export type {
  ProductItem,
  CategoryItem,
  CatalogueItem,
  ContactMessage,
  BannerItem,
  TrustFeatureItem,
  VideoWhyChooseData,
  WorldExportData,
  CompliancesPromoData,
  ComplianceBadgeItem,
  ProcessOrderStep,
  ProcessOrderBadge,
  ProcessOrderSectionData,
}

import initialCategoriesData from '@/src/data/categories.json'
import initialProductsData from '@/src/data/products.json'
import initialCataloguesData from '@/src/data/catalogues.json'

// INITIAL CATEGORIES SEED (LOADED FROM src/data/categories.json)
export const INITIAL_CATEGORIES_SEED: CategoryItem[] = initialCategoriesData as unknown as CategoryItem[]

// INITIAL PRODUCTS SEED (LOADED FROM src/data/products.json)
export const INITIAL_PRODUCTS_SEED: ProductItem[] = initialProductsData as unknown as ProductItem[]

// INITIAL CATALOGUES SEED (LOADED FROM src/data/catalogues.json)
export const INITIAL_CATALOGUES_SEED: CatalogueItem[] = initialCataloguesData as unknown as CatalogueItem[]

// INITIAL CONTACT MESSAGES SEED
export const INITIAL_CONTACT_MESSAGES_SEED: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Dr. Tariq Mahmood',
    email: 'dr.tariq@cityhospital.com',
    phone: '+92 321 8899770',
    subject: 'Quotation Request for 5 ICU Patient Monitors & Beds',
    message: 'Respected Alpha Medical Supplies team, we are upgrading our 12-bed ICU facility. Please provide official quotation for ALPHA Pro-Care 12 Patient Monitors and Electric ICU Beds including warranty terms.',
    is_read: false,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'msg-2',
    name: 'Prof. Ayesha Khan',
    email: 'ayesha.khan@medunihospital.edu.pk',
    phone: '+92 300 4455667',
    subject: 'Bulk Inquiry for Disposable Sterile Packs & Surgical Gloves',
    message: 'We require monthly contract supply of sterile surgical gloves and disposable procedure kits for our surgical theater department. Please contact us.',
    is_read: true,
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
]

// DATA ACCESSORS WITH LOCALSTORAGE & INDEXEDDB SYNC & SERVER DISK API

let isCategoriesSyncInitiated = false

export function getStoredCategories(): CategoryItem[] {
  if (typeof window === 'undefined') return INITIAL_CATEGORIES_SEED
  try {
    const rawV3 = localStorage.getItem('alpha_categories_v3')
    if (rawV3) {
      try {
        const parsed = JSON.parse(rawV3)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      } catch (err) {}
    }

    // Auto-clean legacy storage keys containing old dead categories
    localStorage.removeItem('alpha_categories_v2')
    localStorage.removeItem('alpha_categories')

    // Initialize with clean seed (5 main categories + 8 subcategories)
    const seedStr = JSON.stringify(INITIAL_CATEGORIES_SEED)
    localStorage.setItem('alpha_categories_v3', seedStr)
    localStorage.setItem('alpha_categories_v2', seedStr)
    localStorage.setItem('alpha_categories', seedStr)

    // Sync from server /api/categories
    if (!isCategoriesSyncInitiated) {
      isCategoriesSyncInitiated = true
      fetch('/api/categories?t=' + Date.now(), { cache: 'no-store' })
        .then((res) => res.json())
        .then((serverCats) => {
          if (Array.isArray(serverCats) && serverCats.length > 0) {
            const serverStr = JSON.stringify(serverCats)
            localStorage.setItem('alpha_categories_v3', serverStr)
            localStorage.setItem('alpha_categories_v2', serverStr)
            localStorage.setItem('alpha_categories', serverStr)
            window.dispatchEvent(new Event('alpha_content_updated'))
          }
        })
        .catch(() => {})
    }
  } catch (e) {
    console.error('Failed to read alpha_categories:', e)
  }
  return INITIAL_CATEGORIES_SEED
}

export function saveStoredCategories(categories: CategoryItem[]): void {
  if (typeof window !== 'undefined') {
    try {
      const serialized = JSON.stringify(categories)
      localStorage.setItem('alpha_categories_v3', serialized)
      localStorage.setItem('alpha_categories_v2', serialized)
      localStorage.setItem('alpha_categories', serialized)
      window.dispatchEvent(new Event('alpha_content_updated'))

      // Broadcast to other tabs
      if (typeof BroadcastChannel !== 'undefined') {
        try {
          const alphaChannel = new BroadcastChannel('alpha_sync_channel')
          alphaChannel.postMessage({ type: 'categories_updated', timestamp: Date.now() })
          alphaChannel.close()
        } catch (e) {}
      }

      fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: serialized,
      }).catch((e) => console.warn('Failed to sync categories to API:', e))
    } catch (e) {}
  }
  savePersistentData('alpha_categories_v3', categories)
  savePersistentData('alpha_categories_v2', categories)
  savePersistentData('alpha_categories', categories)
}

let isProductsSyncInitiated = false

// Cross-tab broadcast listener for immediate live updates across multiple open browser tabs
if (typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined') {
  try {
    const alphaChannel = new BroadcastChannel('alpha_sync_channel')
    alphaChannel.onmessage = (event) => {
      if (
        event.data?.type === 'products_updated' ||
        event.data?.type === 'categories_updated' ||
        event.data?.type === 'content_updated'
      ) {
        window.dispatchEvent(new Event('alpha_content_updated'))
      }
    }
  } catch (e) {}
}

export function getStoredProducts(): ProductItem[] {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS_SEED
  try {
    const rawV3 = localStorage.getItem('alpha_products_v3')
    if (rawV3) {
      try {
        const parsed = JSON.parse(rawV3)
        if (Array.isArray(parsed)) {
          if (parsed.length > 0) return parsed
          if (localStorage.getItem('alpha_products_user_managed') === 'true') return []
        }
      } catch (err) {}
    }

    // Auto-clean legacy storage keys containing old 40+ cluttered dummy products
    localStorage.removeItem('alpha_products_v2')
    localStorage.removeItem('alpha_products')

    // Initialize with pristine clean baseline (1 product per subcategory)
    const seedStr = JSON.stringify(INITIAL_PRODUCTS_SEED)
    localStorage.setItem('alpha_products_v3', seedStr)
    localStorage.setItem('alpha_products_v2', seedStr)
    localStorage.setItem('alpha_products', seedStr)

    // Sync from server /api/products
    if (!isProductsSyncInitiated) {
      isProductsSyncInitiated = true
      fetch(`/api/products?t=${Date.now()}`, { cache: 'no-store' })
        .then((res) => res.json())
        .then((serverProds) => {
          if (Array.isArray(serverProds) && serverProds.length > 0) {
            const serverStr = JSON.stringify(serverProds)
            localStorage.setItem('alpha_products_v3', serverStr)
            localStorage.setItem('alpha_products_v2', serverStr)
            localStorage.setItem('alpha_products', serverStr)
            window.dispatchEvent(new Event('alpha_content_updated'))
          }
        })
        .catch(() => {})
    }
    return INITIAL_PRODUCTS_SEED
  } catch (e) {
    console.error('Failed to read alpha_products:', e)
  }
  return INITIAL_PRODUCTS_SEED
}

export function saveStoredProducts(products: ProductItem[]): void {
  if (typeof window !== 'undefined') {
    try {
      const serialized = JSON.stringify(products)
      localStorage.setItem('alpha_products_v3', serialized)
      localStorage.setItem('alpha_products_v2', serialized)
      localStorage.setItem('alpha_products', serialized)
      localStorage.setItem('alpha_products_user_managed', 'true')
      window.dispatchEvent(new Event('alpha_content_updated'))

      // Broadcast to other open tabs
      if (typeof BroadcastChannel !== 'undefined') {
        try {
          const alphaChannel = new BroadcastChannel('alpha_sync_channel')
          alphaChannel.postMessage({ type: 'products_updated', timestamp: Date.now() })
          alphaChannel.close()
        } catch (e) {}
      }

      // Sync with server disk / memory
      fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: serialized,
      }).catch((e) => console.warn('Failed to sync products to API:', e))
    } catch (e) {}
  }
  savePersistentData('alpha_products_v3', products)
  savePersistentData('alpha_products_v2', products)
  savePersistentData('alpha_products', products)
}

export function resetToCleanBaselineProducts(): ProductItem[] {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('alpha_products_v2')
      localStorage.removeItem('alpha_products')
      const serialized = JSON.stringify(INITIAL_PRODUCTS_SEED)
      localStorage.setItem('alpha_products_v3', serialized)
      localStorage.setItem('alpha_products_v2', serialized)
      localStorage.setItem('alpha_products', serialized)
      localStorage.setItem('alpha_products_user_managed', 'false')
      window.dispatchEvent(new Event('alpha_content_updated'))

      fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: serialized,
      }).catch((e) => console.warn('Failed to reset products on API:', e))
    } catch (e) {}
  }
  return INITIAL_PRODUCTS_SEED
}

let isCataloguesSyncInitiated = false

export function getStoredCatalogues(): CatalogueItem[] {
  if (typeof window === 'undefined') return INITIAL_CATALOGUES_SEED
  try {
    const raw = localStorage.getItem('alpha_catalogues')
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      } catch (err) {}
    }

    if (!isCataloguesSyncInitiated) {
      isCataloguesSyncInitiated = true
      fetch('/api/catalogues?t=' + Date.now(), { cache: 'no-store' })
        .then((res) => res.json())
        .then((serverCats) => {
          if (Array.isArray(serverCats) && serverCats.length > 0) {
            const current = localStorage.getItem('alpha_catalogues')
            if (!current || current === '[]') {
              localStorage.setItem('alpha_catalogues', JSON.stringify(serverCats))
              window.dispatchEvent(new Event('alpha_content_updated'))
            }
          }
        })
        .catch(() => {})
    }
  } catch (e) {
    console.error('Failed to read alpha_catalogues:', e)
  }
  return INITIAL_CATALOGUES_SEED
}

export function saveStoredCatalogues(catalogues: CatalogueItem[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('alpha_catalogues', JSON.stringify(catalogues))
      window.dispatchEvent(new Event('alpha_content_updated'))

      fetch('/api/catalogues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catalogues),
      }).catch((e) => console.warn('Failed to sync catalogues to API:', e))
    } catch (e) {}
  }
  savePersistentData('alpha_catalogues', catalogues)
}

export function getStoredContactMessages(): ContactMessage[] {
  if (typeof window === 'undefined') return INITIAL_CONTACT_MESSAGES_SEED
  try {
    const data = getLocalStorageSync<ContactMessage[]>('alpha_contact_messages', INITIAL_CONTACT_MESSAGES_SEED)
    if (Array.isArray(data) && data.length > 0) return data
  } catch (e) {
    console.error('Failed to read alpha_contact_messages:', e)
  }
  return INITIAL_CONTACT_MESSAGES_SEED
}

export function saveStoredContactMessages(messages: ContactMessage[]): void {
  savePersistentData('alpha_contact_messages', messages)
}

// INITIAL BANNERS SEED (MATCHING SCREENSHOT 2 AND STOREFRONT)
export const INITIAL_BANNERS_SEED: BannerItem[] = [
  {
    id: 'banner-ent-instruments-1',
    title: 'ENT Surgery Instruments',
    subtitle: 'Precision instruments for advanced ENT procedures.',
    tagline: 'PRECISION CARE BETTER OUTCOMES',
    image_url: '/images/banners/image-392.svg',
    link_url: '/products',
    button_text: 'EXPLORE INSTRUMENTS',
    badges: [
      'Premium Quality / Built to Last',
      'Worldwide Shipping / Global Reach',
      'Wide Range / 1000+ Instruments',
      'Expert Support / Always Here to Help',
    ],
    display_mode: 'overlay_text',
    is_active: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'banner-kerrison-rongeur-1',
    title: 'Kerrison Rongeur Instruments',
    subtitle: 'Engineered for Precision. Trusted in Every Procedure.',
    tagline: 'PRECISION / QUALITY / BETTER CARE',
    image_url: '/images/banners/hero-banner-kerrison.jpg',
    link_url: '/products?cat=surgical-instruments',
    button_text: 'SHOP NOW',
    badges: ['SURGICAL GRADE STEEL', 'PRECISION ENGINEERED', 'DURABLE PERFORMANCE'],
    display_mode: 'full_image',
    is_active: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

let isBannersSyncInitiated = false

export function getStoredBanners(): BannerItem[] {
  if (typeof window === 'undefined') return INITIAL_BANNERS_SEED
  try {
    if (!isBannersSyncInitiated) {
      isBannersSyncInitiated = true
      fetch('/api/banners')
        .then((res) => res.json())
        .then((serverBanners) => {
          if (Array.isArray(serverBanners) && serverBanners.length > 0) {
            const localStr = localStorage.getItem('alpha_banners')
            const serverStr = JSON.stringify(serverBanners)
            if (localStr !== serverStr) {
              localStorage.setItem('alpha_banners', serverStr)
              window.dispatchEvent(new Event('alpha_content_updated'))
            }
          }
        })
        .catch(() => {})
    }

    const data = getLocalStorageSync<BannerItem[]>('alpha_banners', INITIAL_BANNERS_SEED)
    if (Array.isArray(data) && data.length > 0) return data
  } catch (e) {
    console.error('Failed to read alpha_banners:', e)
  }
  return INITIAL_BANNERS_SEED
}

export function saveStoredBanners(banners: BannerItem[]): void {
  if (typeof window !== 'undefined') {
    fetch('/api/banners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(banners),
    }).catch(() => {})
  }
  savePersistentData('alpha_banners', banners)
}

// INITIAL TRUST FEATURES SEED (MATCHING SCREENSHOT)
export const INITIAL_TRUST_FEATURES_SEED: TrustFeatureItem[] = [
  {
    id: 'feat-1',
    title: 'Premium Quality',
    subtitle: 'Certified Instruments',
    icon_url: '/images/features/preimum-1.svg',
    sort_order: 1,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'feat-2',
    title: 'Fast Shipping',
    subtitle: 'Worldwide Delivery',
    icon_url: '/images/features/fastshipping-1.svg',
    sort_order: 2,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'feat-3',
    title: 'Dedicated Support',
    subtitle: 'Experts Ready To Help',
    icon_url: '/images/features/support-1.svg',
    sort_order: 3,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'feat-4',
    title: 'Trused By Professionals',
    subtitle: 'Hospitals, Clinics .Distributors',
    icon_url: '/images/features/quality-icon-1.svg',
    sort_order: 4,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export function getStoredTrustFeatures(): TrustFeatureItem[] {
  if (typeof window === 'undefined') return INITIAL_TRUST_FEATURES_SEED
  try {
    const dataV2 = getLocalStorageSync<TrustFeatureItem[] | null>('alpha_trust_features_v2', null)
    if (Array.isArray(dataV2) && dataV2.length > 0) return dataV2

    const data = getLocalStorageSync<TrustFeatureItem[] | null>('alpha_trust_features', null)
    if (Array.isArray(data) && data.length > 0) return data
  } catch (e) {
    console.error('Failed to read alpha_trust_features:', e)
  }
  return INITIAL_TRUST_FEATURES_SEED
}

export function saveStoredTrustFeatures(features: TrustFeatureItem[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('alpha_trust_features_v2', JSON.stringify(features))
      localStorage.setItem('alpha_trust_features', JSON.stringify(features))
    } catch (e) {}
  }
  savePersistentData('alpha_trust_features_v2', features)
  savePersistentData('alpha_trust_features', features)
}

// INITIAL VIDEO & WHY CHOOSE SEED (MATCHING SCREENSHOT 1 TOP)
export const INITIAL_VIDEO_WHY_CHOOSE_SEED: VideoWhyChooseData = {
  video_title: 'Precision in Every Detail',
  video_subtitle: 'Watch how we maintain the highest standards from start to finish.',
  video_button_text: 'Watch Video',
  video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  poster_image: '/images/surgical-video-poster.jpg',
  section_title: 'Why Choose SurgiStore?',
  section_subtitle: 'Trusted by professionals. Chosen for quality.',
  features: [
    {
      id: 'f-1',
      title: 'Over 10,000+ Products',
      description: 'Wide range of premium products',
      icon_name: 'package',
    },
    {
      id: 'f-2',
      title: 'Fast & Reliable Shipping',
      description: 'Nationwide shipping across USA',
      icon_name: 'truck',
    },
    {
      id: 'f-3',
      title: 'FDA & ISO Certified',
      description: 'Certified for safety & quality',
      icon_name: 'shield-check',
    },
    {
      id: 'f-4',
      title: 'Easy Returns',
      description: '30-day hassle-free returns',
      icon_name: 'rotate-ccw',
    },
    {
      id: 'f-5',
      title: 'Competitive Pricing',
      description: 'Best prices for professionals',
      icon_name: 'award',
    },
    {
      id: 'f-6',
      title: 'Dedicated Support',
      description: 'Expert support, always here to help',
      icon_name: 'headphones',
    },
  ],
}

export function getStoredVideoWhyChoose(): VideoWhyChooseData {
  if (typeof window === 'undefined') return INITIAL_VIDEO_WHY_CHOOSE_SEED
  try {
    const dataV2 = getLocalStorageSync<VideoWhyChooseData | null>('alpha_video_why_choose_v2', null)
    if (dataV2 && dataV2.section_title) return dataV2
  } catch (e) {
    console.error('Failed to read alpha_video_why_choose:', e)
  }
  return INITIAL_VIDEO_WHY_CHOOSE_SEED
}

export function saveStoredVideoWhyChoose(data: VideoWhyChooseData): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('alpha_video_why_choose_v2', JSON.stringify(data))
    } catch (e) {}
  }
  savePersistentData('alpha_video_why_choose_v2', data)
}

// INITIAL WORLD EXPORT SEED (MATCHING SCREENSHOT 1 BOTTOM)
export const INITIAL_WORLD_EXPORT_SEED: WorldExportData = {
  badge_text: 'EXPORT DESTINATIONS',
  heading_line1: 'Trusted Worldwide',
  heading_line2: 'From Our Factory',
  heading_line3: 'to Your Market',
  description:
    'We export high-quality surgical instruments to countries across the globe, ensuring reliable supply and lasting partnerships.',
  staff_count: '250+',
  staff_label: 'Qualified Staff',
  instruments_count: 'More than 10000+',
  instruments_label: 'Instruments',
  globe_image: '/images/world-globe-export.jpg',
  destinations: [
    { country: 'United States', code: 'USA', flag: '🇺🇸' },
    { country: 'Germany', code: 'DE', flag: '🇩🇪' },
    { country: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
    { country: 'Pakistan', code: 'PK', flag: '🇵🇰' },
    { country: 'France', code: 'FR', flag: '🇫🇷' },
    { country: 'Kenya', code: 'KE', flag: '🇰🇪' },
    { country: 'Syria', code: 'SY', flag: '🇸🇾' },
    { country: 'Japan', code: 'JP', flag: '🇯🇵' },
    { country: 'South Africa', code: 'ZA', flag: '🇿🇦' },
  ],
}

export function getStoredWorldExport(): WorldExportData {
  if (typeof window === 'undefined') return INITIAL_WORLD_EXPORT_SEED
  try {
    const dataV2 = getLocalStorageSync<WorldExportData | null>('alpha_world_export_v2', null)
    if (dataV2 && dataV2.heading_line1) return dataV2
  } catch (e) {
    console.error('Failed to read alpha_world_export:', e)
  }
  return INITIAL_WORLD_EXPORT_SEED
}

export function saveStoredWorldExport(data: WorldExportData): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('alpha_world_export_v2', JSON.stringify(data))
    } catch (e) {}
  }
  savePersistentData('alpha_world_export_v2', data)
}

// INITIAL COMPLIANCES & ACTION PROMO CARDS SEED (MATCHING SCREENSHOT 1)
export const INITIAL_COMPLIANCES_PROMO_SEED: CompliancesPromoData = {
  compliance_badge: 'OUR COMPLIANCES',
  compliance_title_line1: 'Global Standards.',
  compliance_title_line2: 'Trusted Quality.',
  compliance_description:
    'We follow internationally recognized standards to ensure safety, quality and reliability in every product we deliver.',
  compliances: [
    { id: 'comp-1', type: 'iso', code: '13485 : 2016', label: 'ISO 13485:2016' },
    { id: 'comp-2', type: 'iso', code: '13485 : 2016', label: 'ISO 13485:2016' },
    { id: 'comp-3', type: 'iso', code: '13485 : 2016', label: 'ISO 13485:2016' },
    { id: 'comp-4', type: 'fda', code: 'FDA', label: 'FDA Approved' },
    { id: 'comp-5', type: 'fda', code: 'FDA', label: 'FDA Compliant' },
  ],
  left_card: {
    badge_text: 'OUR HEALTH CARE',
    title: 'Are you ready to get',
    highlight_title: 'customized tools?',
    description:
      'We offer tailored surgical instruments to meet your specific needs and requirements.',
    button_text: 'Contact Now',
    button_url: '/contact',
    bg_image: '/images/custom-tools-surgical.jpg',
  },
  right_card: {
    badge_icon: 'bell',
    title_line1: 'Stay Updated with Our',
    title_line2: 'Upcoming Activities',
    description:
      'Be the first to know about new launches, exhibitions, and latest updates.',
    button_text: 'View Events',
    button_url: '/news',
  },
}

export function getStoredCompliancesPromo(): CompliancesPromoData {
  if (typeof window === 'undefined') return INITIAL_COMPLIANCES_PROMO_SEED
  try {
    const dataV2 = getLocalStorageSync<CompliancesPromoData | null>(
      'alpha_compliances_promo_v2',
      null
    )
    if (dataV2 && dataV2.compliance_title_line1) return dataV2
  } catch (e) {
    console.error('Failed to read alpha_compliances_promo:', e)
  }
  return INITIAL_COMPLIANCES_PROMO_SEED
}

export function saveStoredCompliancesPromo(data: CompliancesPromoData): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('alpha_compliances_promo_v2', JSON.stringify(data))
    } catch (e) {}
  }
  savePersistentData('alpha_compliances_promo_v2', data)
}

// INITIAL PROCESS ORDER WORKFLOW SEED (MATCHING SCREENSHOT 1)
export const INITIAL_PROCESS_ORDER_SEED: ProcessOrderSectionData = {
  subtitle: 'HOW ALPHA WHOLESALE MEDICAL SUPPLIES',
  title_line1: 'Processes Your',
  title_line2: 'Order',
  tagline: 'PRECISION • QUALITY • TRUST • WORLDWIDE',
  left_tag: 'QUALITY IN EVERY STEP',
  right_tag: 'SURGICAL INSTRUMENTS FOR A HEALTHIER TOMORROW',
  steps: [
    {
      id: 'step-1',
      step_number: '01',
      title: 'Requirement Analysis',
      description:
        'Our team carefully reviews your product requirements, specifications, branding details, and order quantities to ensure complete accuracy before production begins.',
      icon_name: 'clipboard-search',
    },
    {
      id: 'step-2',
      step_number: '02',
      title: 'Order Updates & Delivery Timeline',
      description:
        'We keep you regularly informed about your order status, production progress, and estimated delivery timeline for complete transparency.',
      icon_name: 'file-check',
    },
    {
      id: 'step-3',
      step_number: '03',
      title: 'Quality Inspection & Testing',
      description:
        'Every surgical instrument undergoes strict quality control, functional testing, and final inspection to meet international standards and certifications.',
      icon_name: 'shield-check',
    },
    {
      id: 'step-4',
      step_number: '04',
      title: 'Custom Branding & Packaging',
      description:
        'We offer smooth customization options for logos, laser engraving, and private labeling to help promote your brand around the world.',
      icon_name: 'package',
    },
    {
      id: 'step-5',
      step_number: '05',
      title: 'Customs Clearance Support',
      description:
        'We assist with smooth customs clearance processes to ensure hassle-free delivery. We work with trusted partners to handle regulations for Europe, UK, and the USA.',
      icon_name: 'file-text',
    },
    {
      id: 'step-6',
      step_number: '06',
      title: 'Secure Shipping & Delivery',
      description:
        'All orders are securely packed and shipped through reliable couriers and freight partners with tracking support for safe and on-time delivery.',
      icon_name: 'truck',
    },
    {
      id: 'step-7',
      step_number: '07',
      title: 'After-Sales Support',
      description:
        "Our relationship doesn't end after delivery. We provide dedicated customer support, assistance, and guidance to ensure your complete satisfaction.",
      icon_name: 'headphones',
    },
  ],
  bottom_quote: 'ADVANCING SURGERY, IMPROVING LIVES.',
  bottom_badges: [
    { id: 'b-1', icon_name: 'shield', text: 'TRUSTED WORLDWIDE' },
    { id: 'b-2', icon_name: 'globe', text: 'PREMIUM QUALITY INSTRUMENTS' },
    { id: 'b-3', icon_name: 'users', text: 'DEDICATED B2B SUPPORT' },
    { id: 'b-4', icon_name: 'truck', text: 'ON-TIME GLOBAL DELIVERY' },
  ],
  cta_button_text: 'PARTNER WITH US',
  cta_button_url: '/contact',
}

export function getStoredProcessOrder(): ProcessOrderSectionData {
  if (typeof window === 'undefined') return INITIAL_PROCESS_ORDER_SEED
  try {
    const dataV2 = getLocalStorageSync<ProcessOrderSectionData | null>(
      'alpha_process_order_v2',
      null
    )
    if (dataV2 && dataV2.title_line1) return dataV2
  } catch (e) {
    console.error('Failed to read alpha_process_order:', e)
  }
  return INITIAL_PROCESS_ORDER_SEED
}

export function saveStoredProcessOrder(data: ProcessOrderSectionData): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('alpha_process_order_v2', JSON.stringify(data))
    } catch (e) {}
  }
  savePersistentData('alpha_process_order_v2', data)
}

// ============================================================================
// DISCOUNT PRODUCTS SECTION SEED & PERSISTENCE (MATCHING SCREENSHOT 1)
// ============================================================================
export const INITIAL_DISCOUNT_PRODUCTS_SEED: DiscountProductsSectionData = {
  subtitle: 'Explore Our Range',
  title_line1: 'DISCOUNT',
  title_line2: 'PRODUCTS',
  products: [
    {
      id: 'disc-1',
      title: 'ORTHO WEITLANER RETRACTOR SHARP',
      sku: '1001',
      original_price: 64.95,
      price: 55.95,
      badge: 'Sale',
      in_stock: true,
      featured_image: '/images/products/image-399.png',
      slug: 'ortho-weitlaner-retractor-sharp-1001-1',
      sort_order: 1,
    },
    {
      id: 'disc-2',
      title: 'ORTHO WEITLANER RETRACTOR SHARP',
      sku: '1001',
      original_price: 64.95,
      price: 55.95,
      badge: 'Sale',
      in_stock: true,
      featured_image: '/images/products/image-399.png',
      slug: 'ortho-weitlaner-retractor-sharp-1001-2',
      sort_order: 2,
    },
    {
      id: 'disc-3',
      title: 'ORTHO WEITLANER RETRACTOR SHARP',
      sku: '1001',
      original_price: 64.95,
      price: 55.95,
      badge: 'Sale',
      in_stock: true,
      featured_image: '/images/products/image-399.png',
      slug: 'ortho-weitlaner-retractor-sharp-1001-3',
      sort_order: 3,
    },
    {
      id: 'disc-4',
      title: 'ORTHO WEITLANER RETRACTOR SHARP',
      sku: '1001',
      original_price: 64.95,
      price: 55.95,
      badge: 'Sale',
      in_stock: true,
      featured_image: '/images/products/image-399.png',
      slug: 'ortho-weitlaner-retractor-sharp-1001-4',
      sort_order: 4,
    },
    {
      id: 'disc-5',
      title: 'ORTHO WEITLANER RETRACTOR SHARP',
      sku: '1001',
      original_price: 64.95,
      price: 55.95,
      badge: 'Sale',
      in_stock: true,
      featured_image: '/images/products/image-399.png',
      slug: 'ortho-weitlaner-retractor-sharp-1001-5',
      sort_order: 5,
    },
    {
      id: 'disc-6',
      title: 'ORTHO WEITLANER RETRACTOR SHARP',
      sku: '1001',
      original_price: 64.95,
      price: 55.95,
      badge: 'Sale',
      in_stock: true,
      featured_image: '/images/products/image-399.png',
      slug: 'ortho-weitlaner-retractor-sharp-1001-6',
      sort_order: 6,
    },
  ],
}

export function getStoredDiscountProducts(): DiscountProductsSectionData {
  if (typeof window === 'undefined') return INITIAL_DISCOUNT_PRODUCTS_SEED
  try {
    const dataV1 = getLocalStorageSync<DiscountProductsSectionData | null>(
      'alpha_discount_products_v1',
      null
    )
    if (dataV1 && dataV1.products && dataV1.products.length > 0) return dataV1
  } catch (e) {
    console.error('Failed to read alpha_discount_products:', e)
  }
  return INITIAL_DISCOUNT_PRODUCTS_SEED
}

export function saveStoredDiscountProducts(data: DiscountProductsSectionData): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('alpha_discount_products_v1', JSON.stringify(data))
    } catch (e) {}
  }
  savePersistentData('alpha_discount_products_v1', data)
}

// ============================================================================
// FAQ & BULK INQUIRY LUXURY SECTION (MATCHING SCREENSHOT 1)
// ============================================================================
export const INITIAL_FAQ_BULK_INQUIRY_SEED: FaqBulkInquiryData = {
  faq_subtitle: 'SUPPORT',
  faq_title: 'FAQ',
  faq_description: 'Here are some frequently asked questions to help you.',
  faq_tag: 'QUALITY INSTRUMENTS FOR A HEALTHIER TOMORROW',
  faqs: [
    {
      id: 'faq-1',
      question: 'Do you offer bulk or wholesale pricing?',
      answer:
        'Yes, special pricing is available for bulk orders, distributors, and long-term business partners.',
    },
    {
      id: 'faq-2',
      question: 'What payment methods do you accept?',
      answer:
        'We accept Wire Transfer (TT), Letter of Credit (LC), PayPal, and major corporate purchasing cards.',
    },
    {
      id: 'faq-3',
      question: 'What is your warranty policy?',
      answer:
        'All Alpha surgical instruments come with a comprehensive 2-year warranty against defects in material and craftsmanship.',
    },
    {
      id: 'faq-4',
      question: 'Do you ship internationally?',
      answer:
        'Yes, we provide fully insured express air shipping and sea freight partnerships to over 75+ countries globally.',
    },
    {
      id: 'faq-5',
      question: 'Are your instruments reusable and sterilizable?',
      answer:
        'Yes, all surgical instruments are precision forged from German medical stainless steel, autoclave compliant up to 134°C.',
    },
  ],
  inquiry_subtitle: 'BUSINESS SOLUTIONS',
  inquiry_title_p1: 'Bulk',
  inquiry_title_p2: 'Inquiry ?',
  inquiry_description: 'Get special discounts on bulk purchases.',
  inquiry_button_text: 'Contact Us Today',
  inquiry_button_url: '/contact',
  inquiry_image: '/images/bulk-inquiry-surgical.jpg',
  inquiry_badges: [
    { id: 'b-1', icon_name: 'users', title: 'B2B PRICING' },
    { id: 'b-2', icon_name: 'shield', title: 'TRUSTED SUPPLY PARTNER' },
    { id: 'b-3', icon_name: 'globe', title: 'GLOBAL SHIPPING' },
  ],
  bottom_quote: 'ADVANCING SURGERY, IMPROVING LIVES.',
  bottom_tag: 'MEDICAL INSTRUMENTS FOR A BETTER TOMORROW',
}

export function getStoredFaqBulkInquiry(): FaqBulkInquiryData {
  if (typeof window === 'undefined') return INITIAL_FAQ_BULK_INQUIRY_SEED
  try {
    const dataV1 = getLocalStorageSync<FaqBulkInquiryData | null>(
      'alpha_faq_bulk_inquiry_v1',
      null
    )
    if (dataV1 && dataV1.faq_title) return dataV1
  } catch (e) {
    console.error('Failed to read alpha_faq_bulk_inquiry:', e)
  }
  return INITIAL_FAQ_BULK_INQUIRY_SEED
}

export function saveStoredFaqBulkInquiry(data: FaqBulkInquiryData): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('alpha_faq_bulk_inquiry_v1', JSON.stringify(data))
    } catch (e) {}
  }
  savePersistentData('alpha_faq_bulk_inquiry_v1', data)
}

// INITIAL GEO STORE SETTINGS (DUAL MODE: USA ONLINE STORE + GLOBAL INQUIRY)
export const INITIAL_GEO_STORE_SETTINGS_SEED: GeoStoreSettings = {
  store_mode: 'auto_geo',
  allowed_store_countries: ['US'],
  default_country: 'US',
  paypal_enabled: true,
  paypal_mode: 'sandbox',
  paypal_client_id: 'sb',
  paypal_secret_key: '',
  usa_bank_enabled: true,
  stripe_publishable_key: 'pk_test_sample',
  stripe_secret_key: '',
  ach_direct_debit_enabled: true,
  credit_cards_enabled: true,
  inquiry_notification_email: 'Sohail@alpha-medicalsupplies.com',
  inquiry_phone_whatsapp: '+1 (561) 528 9764 / +1 (864) 423 2826',
  international_quote_headline: 'International B2B Surgical & Medical Export Inquiries',
  international_quote_notice:
    'Direct instant online checkout is configured for USA hospital networks and clinics. For all international orders, our export desk delivers precision B2B quotation, bulk FOB/CIF shipping, and custom surgical instrumentation support.',
  show_prices_to_international: true,
  store_name: 'ALPHA Medical Supplies Store',
  contact_email: 'Sohail@alpha-medicalsupplies.com, Aftab@alpha-medicalsupplies.com',
  contact_phone: '+1 (561) 528 9764 / +1 (864) 423 2826',
  physical_address: '129 Fleetwood Drive Easley SC 29640 USA',
  updated_at: new Date().toISOString(),
}

export function getStoredGeoStoreSettings(): GeoStoreSettings {
  if (typeof window === 'undefined') return INITIAL_GEO_STORE_SETTINGS_SEED
  try {
    const data = getLocalStorageSync<GeoStoreSettings | null>(
      'alpha_geo_store_settings_v1',
      null
    )
    if (data && data.store_mode) return data
  } catch (e) {
    console.error('Failed to read alpha_geo_store_settings:', e)
  }
  return INITIAL_GEO_STORE_SETTINGS_SEED
}

export function saveStoredGeoStoreSettings(data: GeoStoreSettings): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('alpha_geo_store_settings_v1', JSON.stringify(data))
    } catch (e) {}
  }
  savePersistentData('alpha_geo_store_settings_v1', data)
}






