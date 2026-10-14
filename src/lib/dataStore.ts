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

// INITIAL CATEGORIES FOR ALPHA MEDICAL SUPPLIES STORE (CARDS 376, 377, 378, 379)
export const INITIAL_CATEGORIES_SEED: CategoryItem[] = [
  {
    id: 'cat-gen-surg',
    parent_id: null,
    name: 'SET BY PROCEDURE',
    slug: 'set-by-procedure',
    description: 'Precision Japanese & German stainless steel dissection scissors, hemostatic forceps, scalpels, and tray sets.',
    card_image: '/images/categories/image_376.png',
    image_url: '/images/categories/image_376.png',
    icon: '✂️',
    sort_order: 1,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_count: 42,
    level: 0,
  },
  {
    id: 'cat-ortho',
    parent_id: null,
    name: 'ORTHOPEDIC INSTRUMENTS',
    slug: 'orthopedic-instruments',
    description: 'High-leverage bone rongeurs, osteotomes, chisels, mallets, bone holding forceps, and retractors.',
    card_image: '/images/categories/image_377.png',
    image_url: '/images/categories/image_377.png',
    icon: '🦴',
    sort_order: 2,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_count: 68,
    level: 0,
  },
  {
    id: 'cat-titanium',
    parent_id: null,
    name: 'TITANIUM INSTRUMENTS',
    slug: 'titanium-instruments',
    description: 'Ultra-lightweight, non-magnetic grade 22 Ti micro forceps, titanium scissors, and vascular clamps.',
    card_image: '/images/categories/image_378.png',
    image_url: '/images/categories/image_378.png',
    icon: 'Ti',
    sort_order: 3,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_count: 35,
    level: 0,
  },
  {
    id: 'cat-neuro',
    parent_id: null,
    name: 'NEURO & SPINE INSTRUMENTS',
    slug: 'neuro-spine-instruments',
    description: 'German grade Kerrison punches, laminectomy rongeurs, pituitary forceps, and delicate micro dissectors.',
    card_image: '/images/categories/image_379.png',
    image_url: '/images/categories/image_379.png',
    icon: '🧠',
    sort_order: 4,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_count: 54,
    level: 0,
  },
  {
    id: 'cat-med-equip',
    parent_id: null,
    name: 'MEDICAL EQUIPMENT & ICU',
    slug: 'medical-equipment',
    description: 'Advanced ICU ventilators, multiparameter patient monitors, anesthesia workstations, and infusion pumps.',
    card_image: '/images/extracted/image_7.png',
    image_url: '/images/extracted/image_7.png',
    icon: '🩺',
    sort_order: 5,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_count: 24,
    level: 0,
  },
  {
    id: 'cat-hosp-furn',
    parent_id: null,
    name: 'HOSPITAL WARD FURNITURE',
    slug: 'hospital-furniture',
    description: 'Electric ICU hospital beds, MAYO instrument trolleys, stainless steel IV poles, and transport stretchers.',
    card_image: '/images/extracted/image_9.png',
    image_url: '/images/extracted/image_9.png',
    icon: '🛏️',
    sort_order: 6,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_count: 18,
    level: 0,
  },
]

// INITIAL PRODUCTS SEED FOR ALPHA MEDICAL SUPPLIES STORE
export const INITIAL_PRODUCTS_SEED: ProductItem[] = [
  {
    id: 'prod-weitlaner-1',
    category_id: 'cat-ortho',
    title: 'ORTHO WEITLANER RETRACTOR SHARP',
    slug: 'ortho-weitlaner-retractor-sharp-1001-1',
    sku: '1001',
    short_description: 'Self-retaining orthopedic retractor with sharp prongs (3x4), German grade stainless steel with ratchet lock mechanism.',
    full_description: 'Self-retaining Ortho Weitlaner Retractor Sharp is designed for plastic, spinal, and orthopedic surgery to hold back tissue and muscle layers. Features 3x4 sharp prongs, ergonomic finger rings, and a multi-position ratchet locking bar.',
    featured_image: '/images/products/image-399.png',
    price: 55.95,
    original_price: 64.95,
    badge: 'New',
    is_best_seller: true,
    is_new_arrival: true,
    in_stock: true,
    features: [
      'German Medical Grade Stainless Steel (DIN 1.4021)',
      'Sharp 3x4 Prongs for Secure Tissue Hold',
      'Smooth Precision Ratchet Locking Mechanism',
      'Autoclavable and Corrosion Resistant',
    ],
    specifications: {
      'Instrument Type': 'Self-Retaining Retractor',
      'Prong Style': 'Sharp (3 x 4 Prongs)',
      'Length': '130 mm (5 1/8")',
      'Material': 'Surgical Grade Stainless Steel',
      'Finish': 'Satin Anti-Glare Finish',
    },
    catalogue_pdf: null,
    is_featured: true,
    is_published: true,
    seo_title: 'Ortho Weitlaner Retractor Sharp - SKU 1001',
    seo_description: 'Ortho Weitlaner Retractor Sharp German Stainless Steel SKU 1001 on sale for $55.95.',
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'ORTHOPEDIC INSTRUMENTS',
  },
  {
    id: 'prod-weitlaner-2',
    category_id: 'cat-ortho',
    title: 'ORTHO WEITLANER RETRACTOR SHARP',
    slug: 'ortho-weitlaner-retractor-sharp-1001-2',
    sku: '1001',
    short_description: 'Self-retaining orthopedic retractor with sharp prongs (3x4), German grade stainless steel with ratchet lock mechanism.',
    full_description: 'Self-retaining Ortho Weitlaner Retractor Sharp is designed for plastic, spinal, and orthopedic surgery to hold back tissue and muscle layers. Features 3x4 sharp prongs, ergonomic finger rings, and a multi-position ratchet locking bar.',
    featured_image: '/images/products/image-399.png',
    price: 55.95,
    original_price: 64.95,
    badge: 'New',
    is_best_seller: true,
    is_new_arrival: true,
    in_stock: true,
    features: [
      'German Medical Grade Stainless Steel (DIN 1.4021)',
      'Sharp 3x4 Prongs for Secure Tissue Hold',
      'Smooth Precision Ratchet Locking Mechanism',
      'Autoclavable and Corrosion Resistant',
    ],
    specifications: {
      'Instrument Type': 'Self-Retaining Retractor',
      'Prong Style': 'Sharp (3 x 4 Prongs)',
      'Length': '165 mm (6 1/2")',
      'Material': 'Surgical Grade Stainless Steel',
      'Finish': 'Satin Anti-Glare Finish',
    },
    catalogue_pdf: null,
    is_featured: true,
    is_published: true,
    seo_title: 'Ortho Weitlaner Retractor Sharp - SKU 1001',
    seo_description: 'Ortho Weitlaner Retractor Sharp German Stainless Steel SKU 1001 on sale for $55.95.',
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'ORTHOPEDIC INSTRUMENTS',
  },
  {
    id: 'prod-weitlaner-3',
    category_id: 'cat-ortho',
    title: 'ORTHO WEITLANER RETRACTOR SHARP',
    slug: 'ortho-weitlaner-retractor-sharp-1001-3',
    sku: '1001',
    short_description: 'Self-retaining orthopedic retractor with sharp prongs (3x4), German grade stainless steel with ratchet lock mechanism.',
    full_description: 'Self-retaining Ortho Weitlaner Retractor Sharp is designed for plastic, spinal, and orthopedic surgery to hold back tissue and muscle layers. Features 3x4 sharp prongs, ergonomic finger rings, and a multi-position ratchet locking bar.',
    featured_image: '/images/products/image-399.png',
    price: 55.95,
    original_price: 64.95,
    badge: 'New',
    is_best_seller: true,
    is_new_arrival: true,
    in_stock: true,
    features: [
      'German Medical Grade Stainless Steel (DIN 1.4021)',
      'Sharp 3x4 Prongs for Secure Tissue Hold',
      'Smooth Precision Ratchet Locking Mechanism',
      'Autoclavable and Corrosion Resistant',
    ],
    specifications: {
      'Instrument Type': 'Self-Retaining Retractor',
      'Prong Style': 'Sharp (3 x 4 Prongs)',
      'Length': '200 mm (8")',
      'Material': 'Surgical Grade Stainless Steel',
      'Finish': 'Satin Anti-Glare Finish',
    },
    catalogue_pdf: null,
    is_featured: true,
    is_published: true,
    seo_title: 'Ortho Weitlaner Retractor Sharp - SKU 1001',
    seo_description: 'Ortho Weitlaner Retractor Sharp German Stainless Steel SKU 1001 on sale for $55.95.',
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'ORTHOPEDIC INSTRUMENTS',
  },
  {
    id: 'prod-weitlaner-4',
    category_id: 'cat-ortho',
    title: 'ORTHO WEITLANER RETRACTOR SHARP',
    slug: 'ortho-weitlaner-retractor-sharp-1001-4',
    sku: '1001',
    short_description: 'Self-retaining orthopedic retractor with sharp prongs (3x4), German grade stainless steel with ratchet lock mechanism.',
    full_description: 'Self-retaining Ortho Weitlaner Retractor Sharp is designed for plastic, spinal, and orthopedic surgery to hold back tissue and muscle layers. Features 3x4 sharp prongs, ergonomic finger rings, and a multi-position ratchet locking bar.',
    featured_image: '/images/products/image-399.png',
    price: 55.95,
    original_price: 64.95,
    badge: 'New',
    is_best_seller: true,
    is_new_arrival: true,
    in_stock: true,
    features: [
      'German Medical Grade Stainless Steel (DIN 1.4021)',
      'Sharp 3x4 Prongs for Secure Tissue Hold',
      'Smooth Precision Ratchet Locking Mechanism',
      'Autoclavable and Corrosion Resistant',
    ],
    specifications: {
      'Instrument Type': 'Self-Retaining Retractor',
      'Prong Style': 'Sharp (3 x 4 Prongs)',
      'Length': '250 mm (10")',
      'Material': 'Surgical Grade Stainless Steel',
      'Finish': 'Satin Anti-Glare Finish',
    },
    catalogue_pdf: null,
    is_featured: true,
    is_published: true,
    seo_title: 'Ortho Weitlaner Retractor Sharp - SKU 1001',
    seo_description: 'Ortho Weitlaner Retractor Sharp German Stainless Steel SKU 1001 on sale for $55.95.',
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'ORTHOPEDIC INSTRUMENTS',
  },
  {
    id: 'alpha-prod-1',
    category_id: 'cat-med-equip',
    title: 'ALPHA Pro-Care 12" Multiparameter Patient Monitor',
    slug: 'alpha-pro-care-12-multiparameter-patient-monitor',
    sku: 'ALPHA-MON-12',
    short_description: '12-inch high resolution color TFT monitor for ECG, SpO2, NIBP, Respiration, Temp, and PR.',
    full_description: 'The ALPHA Pro-Care 12 Patient Monitor provides comprehensive real-time patient monitoring for ICUs, operating rooms, and emergency departments. Features anti-interference technology, 120-hour trend data storage, adjustable audible and visual alarms, and built-in rechargeable lithium battery.',
    featured_image: '/images/extracted/image_11.png',
    price: 499.00,
    original_price: 580.00,
    badge: 'New',
    is_best_seller: false,
    is_new_arrival: true,
    in_stock: true,
    features: [
      '12.1-inch High-Resolution Color TFT Display with Multi-Lead ECG Waveform',
      'Accurate SpO2 Anti-Motion Measurement & Low Perfusion Tech',
      'Dual-IBP & EtCO2 Modular Expansion Capable',
      'Built-in Rechargeable Lithium Battery (4+ hours continuous operation)',
      'ISO 13485:2016 & CE Mark Certified Medical Device',
    ],
    specifications: {
      'Display': '12.1" TFT Color LCD (1024x768)',
      'Parameters': 'ECG, SpO2, NIBP, RESP, 2-TEMP, PR',
      'Battery': 'Rechargeable Li-ion 4400mAh',
      'Alarm': '3-Level Audible & Visual Alarms',
      'Certification': 'CE / ISO 13485 / FDA Approved',
    },
    catalogue_pdf: '/pdf/alpha-medical-equipment-catalogue.pdf',
    is_featured: true,
    is_published: true,
    seo_title: 'ALPHA Pro-Care 12 Patient Monitor - Alpha Medical Supplies',
    seo_description: 'Buy high quality multiparameter patient monitor for ICUs & surgical theaters nationwide.',
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Medical Equipment',
    gallery_images: [
      { id: 'g1', image_url: '/images/extracted/image_11.png', alt_text: 'ALPHA Patient Monitor Front View', sort_order: 1 },
      { id: 'g2', image_url: '/images/extracted/image_7.png', alt_text: 'ALPHA Patient Monitor Angle View', sort_order: 2 },
    ],
  },
  {
    id: 'alpha-prod-2',
    category_id: 'cat-med-equip',
    title: 'ALPHA Vent-Master ICU Turbine Ventilator',
    slug: 'alpha-vent-master-icu-turbine-ventilator',
    sku: 'ALPHA-VENT-100',
    short_description: 'High-end invasive & non-invasive mechanical ICU ventilator suitable for adult, pediatric, and neonatal care.',
    full_description: 'Engineered for critical care environments, the ALPHA Vent-Master offers precise volume and pressure controlled ventilation modes. Equipped with quiet high-performance turbine technology, 15-inch touchscreen interface, and comprehensive lung mechanics monitoring.',
    featured_image: '/images/extracted/image_7.png',
    features: [
      'Comprehensive Invasive & Non-Invasive Modes (VCV, PCV, SIMV, CPAP, PSV)',
      'High-Speed Turbine Driven Air Delivery (No external compressor needed)',
      '15" HD Touchscreen with 360-degree visible alarm light',
      'Intelligent Target Tidal Volume Control (20ml - 2000ml)',
    ],
    specifications: {
      'Tidal Volume': '20 - 2000 ml',
      'Ventilation Modes': 'VCV, PCV, SIMV-V, SIMV-P, CPAP/PSV, Bi-level',
      'Screen': '15" Color Touchscreen LCD',
      'Power Backup': 'Integrated Li-ion Battery (3 Hours)',
    },
    catalogue_pdf: '/pdf/alpha-icu-ventilator-catalogue.pdf',
    is_featured: true,
    is_published: true,
    seo_title: 'ALPHA Vent-Master ICU Ventilator - Critical Care Solutions',
    seo_description: 'Advanced turbine driven ICU mechanical ventilator with intuitive touchscreen.',
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Medical Equipment',
  },
  {
    id: 'alpha-prod-3',
    category_id: 'cat-surg-inst',
    title: 'ALPHA Master-Cut Surgical Scissors & Forceps Set (50 Pcs)',
    slug: 'alpha-master-cut-surgical-scissors-forceps-set',
    sku: 'ALPHA-SURG-SET50',
    short_description: 'Complete general surgery instrument set crafted from premium AISI 420 Japanese Stainless Steel.',
    full_description: 'The ALPHA Master-Cut 50-Piece Surgical Set includes Mayo scissors, Metzenbaum dissecting scissors, Crile & Mosquito hemostatic clamps, towel clamps, scalpel handles (#3 & #4), and Adson tissue forceps. Nitric passivated and heat treated for lifetime corrosion resistance.',
    featured_image: '/images/extracted/image_8.png',
    features: [
      'Forged from German & Japanese Grade Surgical Stainless Steel',
      'Precision Satin Finish - Non-Reflective for OR Operating Lights',
      'Autoclavable up to 134°C / 273°F without loss of edge sharpness',
      'Includes Stainless Steel Sterilization Box with Lid',
    ],
    specifications: {
      'Material': 'AISI 420 Japanese Stainless Steel',
      'Finish': 'Anti-glare Satin Finish',
      'Sterilization': 'Autoclavable 134°C',
      'Quantity': '50 Precision Surgical Instruments',
    },
    catalogue_pdf: '/pdf/alpha-surgical-instruments-catalogue.pdf',
    is_featured: true,
    is_published: true,
    seo_title: 'ALPHA Master-Cut Surgical Instrument Set - 50 Pcs Stainless Steel',
    seo_description: 'Professional grade 50-piece surgical instrument set for operating theaters.',
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Surgical Instruments',
  },
  {
    id: 'alpha-prod-4',
    category_id: 'cat-hosp-furn',
    title: 'ALPHA Deluxe Electric 5-Function ICU Hospital Bed',
    slug: 'alpha-deluxe-electric-5-function-icu-bed',
    sku: 'ALPHA-BED-ELE5',
    short_description: 'Full electric 5-function ICU bed with trendelenburg, cardiac chair position, CPR quick release, and central locking.',
    full_description: 'Designed for optimal patient comfort and nursing efficiency. Features LINAK electric actuators, tuck-away ABS side rails, built-in weight scale, dual control panels on side rails, and heavy-duty 125mm dust-proof casters.',
    featured_image: '/images/extracted/image_9.png',
    features: [
      '5 Electric Motor Functions: Backrest, Kneerest, Height Adjustment, Trendelenburg & Reverse Trendelenburg',
      'LINAK Heavy Duty Whisper-Quiet Actuators',
      'Integrated CPR Emergency Release Lever (Mechanical & Electric)',
      'Removable Molded Head/Foot Boards & Seamless ABS Side Rails',
    ],
    specifications: {
      'Dimensions': '2180mm x 1060mm x 480-780mm',
      'Safe Load': '250 kg (550 lbs)',
      'Functions': 'Backrest 0-75°, Legrest 0-45°, Height 480-780mm, Trendelenburg ±12°',
      'Motors': 'LINAK Medical Actuators',
    },
    catalogue_pdf: '/pdf/alpha-hospital-furniture-catalogue.pdf',
    is_featured: true,
    is_published: true,
    seo_title: 'ALPHA Deluxe Electric 5-Function ICU Hospital Bed',
    seo_description: 'Electric 5-function ICU hospital bed with LINAK motors and central brake system.',
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Hospital Furniture',
  },
  {
    id: 'alpha-prod-5',
    category_id: 'cat-lab-diag',
    title: 'ALPHA Lab-Bio Binocular Clinical Microscope 2000x',
    slug: 'alpha-lab-bio-binocular-clinical-microscope-2000x',
    sku: 'ALPHA-MIC-2000',
    short_description: 'Ergonomic clinical laboratory microscope with infinity achromatic optics and LED illumination.',
    full_description: 'High-precision lab microscope featuring Siedentopf binocular head, 4x, 10x, 40x, 100x oil immersion infinity plan objectives, coaxial coarse and fine focusing knobs, and variable intensity 3W LED Kohler illumination.',
    featured_image: '/images/extracted/image_10.png',
    features: [
      'Infinity Corrected Optical System with Crisp High Contrast Imaging',
      'Quadruple Reversing Nosepiece with Achromatic Plan Objectives',
      'Double-Layer Mechanical Stage (140mm x 140mm)',
      'Long-Life 3W Eco LED Kohler Illumination System',
    ],
    specifications: {
      'Magnification': '40x - 2000x',
      'Objectives': '4x, 10x, 40x (S), 100x (S, Oil)',
      'Head': 'Siedentopf Binocular 30° Inclined',
      'Illumination': '3W LED Variable Brightness',
    },
    catalogue_pdf: '/pdf/alpha-lab-diagnostics-catalogue.pdf',
    is_featured: true,
    is_published: true,
    seo_title: 'ALPHA Lab-Bio Binocular Microscope - Clinical Laboratory Diagnostics',
    seo_description: 'High precision binocular laboratory microscope for pathology & diagnostics.',
    sort_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Lab Supplies & Diagnostics',
  },
  {
    id: 'alpha-prod-6',
    category_id: 'cat-disposables',
    title: 'ALPHA Sterile Latex Surgical Gloves (Box of 50 Pairs)',
    slug: 'alpha-sterile-latex-surgical-gloves-box',
    sku: 'ALPHA-GLV-ST50',
    short_description: 'Powder-free anatomical fit sterile latex surgical gloves with textured fingertips.',
    full_description: 'Manufactured from 100% natural rubber latex, ALPHA Sterile Surgical Gloves feature micro-textured palm and fingers for superior wet and dry grip. Micro-thin wall design provides high tactile sensitivity for delicate surgical procedures.',
    featured_image: '/images/extracted/image_7.png',
    features: [
      'Gamma Radiation Sterilized & Individually Peel-Packed',
      'Conforms to EN 455 Parts 1, 2, 3 & ASTM D3577 Standards',
      'AQL 1.0 Pin-hole Level Inspection Guarantee',
      'Anatomical Curved Finger Design Reduces Hand Fatigue',
    ],
    specifications: {
      'Material': 'Medical Grade Natural Rubber Latex',
      'Sizes': '6.0, 6.5, 7.0, 7.5, 8.0, 8.5',
      'Sterilization': 'Gamma Radiation (R)',
      'Packaging': '50 Pairs / Box, 10 Boxes / Carton',
    },
    catalogue_pdf: '/pdf/alpha-disposables-catalogue.pdf',
    is_featured: false,
    is_published: true,
    seo_title: 'ALPHA Sterile Latex Surgical Gloves - Powder Free',
    seo_description: 'Sterile surgical gloves with superior grip and high tactile sensitivity.',
    sort_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Disposables & Single-Use',
  },
]

// INITIAL CATALOGUES SEED
export const INITIAL_CATALOGUES_SEED: CatalogueItem[] = [
  {
    id: 'alpha-cat-pdf-1',
    category_id: 'cat-med-equip',
    title: 'ALPHA Medical Equipment & Critical Care Catalogue 2026',
    slug: 'alpha-medical-equipment-catalogue-2026',
    description: 'Complete product lines of ICU ventilators, multiparameter patient monitors, syringe pumps, and defibrillators.',
    cover_image: '/images/extracted/image_1.png',
    pdf_url: '/pdf/alpha-medical-equipment-catalogue.pdf',
    is_published: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Medical Equipment',
  },
  {
    id: 'alpha-cat-pdf-2',
    category_id: 'cat-surg-inst',
    title: 'ALPHA Precision Surgical Instruments Master Catalogue',
    slug: 'alpha-surgical-instruments-master-catalogue',
    description: 'Comprehensive catalogue of German & Japanese stainless steel dissection tools, hemostats, and retractors.',
    cover_image: '/images/extracted/image_2.png',
    pdf_url: '/pdf/alpha-surgical-instruments-catalogue.pdf',
    is_published: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Surgical Instruments',
  },
  {
    id: 'alpha-cat-pdf-3',
    category_id: 'cat-hosp-furn',
    title: 'ALPHA Hospital Furniture & Ward Solutions Catalogue',
    slug: 'alpha-hospital-furniture-solutions-catalogue',
    description: 'Electric ICU beds, MAYO trolleys, stretchers, examination couches, and stainless steel ward furniture.',
    cover_image: '/images/extracted/image_4.png',
    pdf_url: '/pdf/alpha-hospital-furniture-catalogue.pdf',
    is_published: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Hospital Furniture',
  },
]

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

// DATA ACCESSORS WITH LOCALSTORAGE & INDEXEDDB SYNC

export function getStoredCategories(): CategoryItem[] {
  if (typeof window === 'undefined') return INITIAL_CATEGORIES_SEED
  try {
    const dataV2 = getLocalStorageSync<CategoryItem[] | null>('alpha_categories_v2', null)
    if (Array.isArray(dataV2) && dataV2.length > 0) return dataV2

    const data = getLocalStorageSync<CategoryItem[] | null>('alpha_categories', null)
    if (Array.isArray(data) && data.length > 0) {
      const hasCards = data.some(
        (c) => c.card_image?.includes('376') || c.image_url?.includes('376')
      )
      if (hasCards) return data
    }
  } catch (e) {
    console.error('Failed to read alpha_categories:', e)
  }
  return INITIAL_CATEGORIES_SEED
}

export function saveStoredCategories(categories: CategoryItem[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('alpha_categories_v2', JSON.stringify(categories))
      localStorage.setItem('alpha_categories', JSON.stringify(categories))
    } catch (e) {}
  }
  savePersistentData('alpha_categories_v2', categories)
  savePersistentData('alpha_categories', categories)
}

export function getStoredProducts(): ProductItem[] {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS_SEED
  try {
    const dataV2 = getLocalStorageSync<ProductItem[] | null>('alpha_products_v2', null)
    if (Array.isArray(dataV2) && dataV2.length > 0) return dataV2

    const data = getLocalStorageSync<ProductItem[] | null>('alpha_products', null)
    if (Array.isArray(data) && data.length > 0) {
      const hasRetractor = data.some(
        (p) => p.featured_image?.includes('399') || p.sku === '1001'
      )
      if (hasRetractor) return data
    }
  } catch (e) {
    console.error('Failed to read alpha_products:', e)
  }
  return INITIAL_PRODUCTS_SEED
}

export function saveStoredProducts(products: ProductItem[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('alpha_products_v2', JSON.stringify(products))
      localStorage.setItem('alpha_products', JSON.stringify(products))
    } catch (e) {}
  }
  savePersistentData('alpha_products_v2', products)
  savePersistentData('alpha_products', products)
}

export function getStoredCatalogues(): CatalogueItem[] {
  if (typeof window === 'undefined') return INITIAL_CATALOGUES_SEED
  try {
    const data = getLocalStorageSync<CatalogueItem[]>('alpha_catalogues', INITIAL_CATALOGUES_SEED)
    if (Array.isArray(data) && data.length > 0) return data
  } catch (e) {
    console.error('Failed to read alpha_catalogues:', e)
  }
  return INITIAL_CATALOGUES_SEED
}

export function saveStoredCatalogues(catalogues: CatalogueItem[]): void {
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

// INITIAL BANNERS SEED (KERRISON RONGEUR HERO BANNER AS DEFAULT ACTIVE)
export const INITIAL_BANNERS_SEED: BannerItem[] = [
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
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export function getStoredBanners(): BannerItem[] {
  if (typeof window === 'undefined') return INITIAL_BANNERS_SEED
  try {
    const data = getLocalStorageSync<BannerItem[]>('alpha_banners', INITIAL_BANNERS_SEED)
    if (Array.isArray(data) && data.length > 0) return data
  } catch (e) {
    console.error('Failed to read alpha_banners:', e)
  }
  return INITIAL_BANNERS_SEED
}

export function saveStoredBanners(banners: BannerItem[]): void {
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
  inquiry_notification_email: 'info@alpha-medicalsupplie.com',
  inquiry_phone_whatsapp: '+92 52 000 000 / +92 300 000 000',
  international_quote_headline: 'International B2B Surgical & Medical Export Inquiries',
  international_quote_notice:
    'Direct instant online checkout is configured for USA hospital networks and clinics. For all international orders, our export desk delivers precision B2B quotation, bulk FOB/CIF shipping, and custom surgical instrumentation support.',
  show_prices_to_international: true,
  store_name: 'ALPHA Medical Supplies Store',
  contact_email: 'info@alpha-medicalsupplie.com',
  contact_phone: '+92 52 000 000',
  physical_address: 'Alpha Medical Complex, Healthcare Industrial Zone, Sialkot, Pakistan / USA Fulfillment',
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






