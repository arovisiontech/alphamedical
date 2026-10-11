import { z } from 'zod'

export interface CategoryItem {
  id: string
  parent_id: string | null
  name: string
  slug: string
  description: string | null
  image_url: string | null
  card_image?: string | null
  icon?: string | null
  sort_order: number
  is_published: boolean
  created_at: string
  updated_at: string
  parent_name?: string | null
  product_count?: number
  level?: number
}

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain lowercase letters, numbers, and hyphens'),
  parent_id: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  sort_order: z.number().int().min(0, 'Sort order must be non-negative'),
  is_published: z.boolean(),
})

export type CategoryFormData = z.infer<typeof categorySchema>

export interface CategoryFilterState {
  search: string
  parentId: string
  status: 'all' | 'published' | 'draft'
  sortBy: 'name' | 'order' | 'products' | 'newest'
}
