export interface AlphaProduct {
  id: string
  title: string
  slug: string
  sku: string
  category: string
  subcategory: string
  brand: string
  originalPrice: number
  price: number
  inStock: boolean
  rating: number
  image: string
  badge?: 'New' | 'Sale' | 'Featured' | 'Best Seller'
  description: string
  specs: Record<string, string>
}

export interface AlphaCategory {
  id: string
  name: string
  slug: string
  image: string
  icon: string
  productCount: number
  subcategories: string[]
}

export const ALPHA_CATEGORIES: AlphaCategory[] = [
  {
    id: 'cat-set-proc',
    name: 'SET BY PROCEDURE',
    slug: 'set-by-procedure',
    image: '/images/extracted/image_7.png',
    icon: '✂️',
    productCount: 42,
    subcategories: ['General Surgery Set', 'ENT Surgery Set', 'Laparoscopy Pack', 'Orthopedic Set'],
  },
  {
    id: 'cat-ortho',
    name: 'ORTHOPEDIC INSTRUMENTS',
    slug: 'orthopedic-instruments',
    image: '/images/extracted/image_8.png',
    icon: '🦴',
    productCount: 68,
    subcategories: ['Bone Rongeurs', 'Bone Chisels', 'Osteotomes', 'Mallets', 'Holding Forceps'],
  },
  {
    id: 'cat-titanium',
    name: 'TITANIUM INSTRUMENTS',
    slug: 'titanium-instruments',
    image: '/images/extracted/image_9.png',
    icon: '💎',
    productCount: 35,
    subcategories: ['Micro Forceps', 'Titanium Scissors', 'Needle Holders', 'Vascular Clamps'],
  },
  {
    id: 'cat-neuro',
    name: 'NEURO & SPINE INSTRUMENTS',
    slug: 'neuro-spine-instruments',
    image: '/images/extracted/image_10.png',
    icon: '🧠',
    productCount: 54,
    subcategories: ['Kerrison Rongeurs', 'Laminectomy Punch', 'Spine Retractors', 'Nerve Hooks'],
  },
  {
    id: 'cat-ent',
    name: 'ENT SURGERY INSTRUMENTS',
    slug: 'ent-surgery',
    image: '/images/extracted/image_11.png',
    icon: '👂',
    productCount: 48,
    subcategories: ['Ear Speculums', 'Nasal Forceps', 'Laryngeal Mirrors', 'Tonsil Scissors'],
  },
  {
    id: 'cat-cardio',
    name: 'CARDIOVASCULAR TOOLS',
    slug: 'cardiovascular-tools',
    image: '/images/extracted/image_1.png',
    icon: '🫀',
    productCount: 30,
    subcategories: ['Aortic Clamps', 'Micro Scissors', 'Rib Spreaders', 'Suture Forceps'],
  },
]

export const ALPHA_PRODUCTS: AlphaProduct[] = [
  {
    id: 'prod-1',
    title: 'ORTHO WETLANER RETRACTOR SHARP',
    slug: 'ortho-wetlaner-retractor-sharp',
    sku: 'SKU: 8721',
    category: 'ORTHOPEDIC INSTRUMENTS',
    subcategory: 'Orthopedic Retractors',
    brand: 'Alpha Surgical',
    originalPrice: 64.05,
    price: 55.35,
    inStock: true,
    rating: 5,
    image: '/images/extracted/image_8.png',
    badge: 'Sale',
    description: 'Precision self-retaining Wetlaner Retractor with sharp prongs, 3x4 teeth, engineered for deep tissue orthopedic access.',
    specs: {
      'Material': 'German Stainless Steel AISI 420',
      'Length': '5.5 Inches (14 cm)',
      'Finish': 'Anti-Glare Satin Finish',
      'Sterilization': 'Autoclavable 134°C',
    },
  },
  {
    id: 'prod-2',
    title: 'KERRISON RONGEUR 90 DEGREE UPWARD',
    slug: 'kerrison-rongeur-90-degree-upward',
    sku: 'SKU: 9012',
    category: 'NEURO & SPINE INSTRUMENTS',
    subcategory: 'Kerrison Rongeurs',
    brand: 'Alpha Spine Tech',
    originalPrice: 185.00,
    price: 149.99,
    inStock: true,
    rating: 5,
    image: '/images/extracted/image_1.png',
    badge: 'Best Seller',
    description: 'Heavy duty Kerrison Bone Rongeur with 90° upward bite, 3mm shaft length 7", thin footplate for spinal laminectomy.',
    specs: {
      'Bite Angle': '90° Upward Bite',
      'Jaw Opening': '3mm / 4mm',
      'Material': 'German Surgical Steel with Black Nitride Coating',
    },
  },
  {
    id: 'prod-3',
    title: 'MAYO DISSECTING SCISSORS STRAIGHT',
    slug: 'mayo-dissecting-scissors-straight',
    sku: 'SKU: 4402',
    category: 'SET BY PROCEDURE',
    subcategory: 'Surgical Scissors',
    brand: 'Alpha Surgical',
    originalPrice: 38.50,
    price: 29.95,
    inStock: true,
    rating: 5,
    image: '/images/extracted/image_7.png',
    badge: 'New',
    description: 'Heavy Mayo Dissecting Scissors with straight beveled blades, tungsten carbide inserts for long-lasting edge retention.',
    specs: {
      'Blade Type': 'Straight Beveled',
      'Inserts': 'Tungsten Carbide Gold Handles',
      'Length': '6.75 Inches (17 cm)',
    },
  },
  {
    id: 'prod-4',
    title: 'TITANIUM MICRO NEEDLE HOLDER CASTROVIEJO',
    slug: 'titanium-micro-needle-holder-castroviejo',
    sku: 'SKU: 6109',
    category: 'TITANIUM INSTRUMENTS',
    subcategory: 'Needle Holders',
    brand: 'Alpha Titanium',
    originalPrice: 210.00,
    price: 175.00,
    inStock: true,
    rating: 5,
    image: '/images/extracted/image_9.png',
    badge: 'Sale',
    description: 'Ultra-lightweight titanium micro needle holder with locking mechanism, round handle, for 6-0 to 10-0 microsutures.',
    specs: {
      'Material': 'Medical Grade Titanium Alloy',
      'Jaw': 'Dust-Coated Diamond Jaw',
      'Length': '5.5 Inches (14 cm)',
    },
  },
  {
    id: 'prod-5',
    title: 'ENT ADSON TONSILLAR FORCEPS SERRATED',
    slug: 'ent-adson-tonsillar-forceps-serrated',
    sku: 'SKU: 3311',
    category: 'ENT SURGERY INSTRUMENTS',
    subcategory: 'ENT Forceps',
    brand: 'Alpha ENT',
    originalPrice: 48.00,
    price: 39.50,
    inStock: true,
    rating: 4,
    image: '/images/extracted/image_11.png',
    badge: 'New',
    description: 'Precision ENT Adson tissue forceps with fine serrated tips for delicate mucosa handling.',
    specs: {
      'Material': 'Japanese Stainless Steel',
      'Tip': 'Fine Serrated 1x2 Teeth Option',
      'Length': '4.75 Inches (12 cm)',
    },
  },
  {
    id: 'prod-6',
    title: 'ALPHA PRO-CARE MULTIPARAMETER MONITOR',
    slug: 'alpha-pro-care-multiparameter-monitor',
    sku: 'SKU: 1200',
    category: 'EQUIPMENT',
    subcategory: 'Patient Monitors',
    brand: 'Alpha Medical',
    originalPrice: 850.00,
    price: 720.00,
    inStock: true,
    rating: 5,
    image: '/images/extracted/image_11.png',
    badge: 'Best Seller',
    description: '12.1" Color TFT display multiparameter monitor for ECG, SpO2, NIBP, Respiration, Temp, and Pulse Rate.',
    specs: {
      'Display': '12.1" High Resolution Color TFT',
      'Battery': 'Rechargeable Li-ion 4+ Hours',
      'Certification': 'CE / ISO 13485 Approved',
    },
  },
]
