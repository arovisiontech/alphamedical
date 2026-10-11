export interface MediaItem {
  id: string
  file_name: string
  file_path: string
  file_size: number
  mime_type: string
  alt_text?: string | null
  created_at: string
  url: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}
