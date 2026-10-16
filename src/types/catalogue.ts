import { z } from 'zod'

export interface CatalogueItem {
  id: string
  category_id: string | null
  title: string
  slug?: string
  catalog_number?: string
  category?: string
  description: string | null
  cover_image: string | null
  pdf_url: string
  pages?: number
  file_size?: string
  is_published: boolean
  sort_order: number
  created_at: string
  updated_at: string
  category_name?: string | null
}

export const catalogueSchema = z.object({
  title: z.string().min(2, 'Catalogue title must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain lowercase letters, numbers, and hyphens'),
  category_id: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  cover_image: z.string().nullable().optional(),
  pdf_url: z.string().min(1, 'PDF File URL is required'),
  is_published: z.boolean(),
  sort_order: z.number().int().min(0, 'Sort order must be non-negative'),
})

export type CatalogueFormData = z.infer<typeof catalogueSchema>
