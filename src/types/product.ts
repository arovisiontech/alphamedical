import { z } from 'zod'

export interface ProductImageItem {
  id?: string
  product_id?: string
  image_url: string
  alt_text?: string | null
  sort_order: number
}

export interface SpecificationItem {
  key: string
  value: string
}

export interface ProductItem {
  id: string
  category_id: string | null
  title: string
  slug: string
  sku: string | null
  short_description: string | null
  full_description: string | null
  featured_image: string | null
  features: string[]
  specifications: Record<string, string>
  catalogue_pdf: string | null
  is_featured: boolean
  is_published: boolean
  seo_title: string | null
  seo_description: string | null
  sort_order: number
  created_at: string
  updated_at: string
  category_name?: string | null
  gallery_images?: ProductImageItem[]
  price?: number | null
  original_price?: number | null
  badge?: string | null
  is_best_seller?: boolean
  is_new_arrival?: boolean
  in_stock?: boolean
}

export const productGalleryImageSchema = z.object({
  id: z.string().optional(),
  image_url: z.string().min(1, 'Image URL is required'),
  alt_text: z.string().nullable().optional(),
  sort_order: z.number().int(),
})

export const productSpecificationSchema = z.object({
  key: z.string().min(1, 'Specification name is required'),
  value: z.string().min(1, 'Specification value is required'),
})

export const productSchema = z.object({
  title: z.string().min(2, 'Product title must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain lowercase letters, numbers, and hyphens'),
  sku: z.string().nullable().optional(),
  category_id: z.string().nullable().optional(),
  short_description: z.string().nullable().optional(),
  full_description: z.string().nullable().optional(),
  featured_image: z.string().nullable().optional(),
  gallery_images: z.array(productGalleryImageSchema),
  features: z.array(z.string()),
  specifications: z.array(productSpecificationSchema),
  catalogue_pdf: z.string().nullable().optional(),
  is_featured: z.boolean(),
  is_published: z.boolean(),
  price: z.number().nullable().optional(),
  original_price: z.number().nullable().optional(),
  badge: z.string().nullable().optional(),
  is_best_seller: z.boolean().optional(),
  is_new_arrival: z.boolean().optional(),
  in_stock: z.boolean().optional(),
  seo_title: z.string().nullable().optional(),
  seo_description: z.string().nullable().optional(),
  sort_order: z.number().int().min(0, 'Sort order must be non-negative'),
})

export type ProductFormData = z.infer<typeof productSchema>

export interface ProductFilterState {
  search: string
  categoryId: string
  status: 'all' | 'published' | 'draft'
  featured: 'all' | 'featured' | 'standard'
  sortBy: 'newest' | 'oldest' | 'title' | 'order'
}
