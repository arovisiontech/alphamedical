export interface BannerItem {
  id: string
  title: string
  subtitle?: string
  tagline?: string
  image_url: string
  link_url: string
  button_text?: string
  badges?: string[]
  display_mode?: 'full_image' | 'overlay_text'
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}
