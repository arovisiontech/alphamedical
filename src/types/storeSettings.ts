export type StoreMode = 'auto_geo' | 'force_usa_store' | 'force_global_inquiry'

export interface GeoStoreSettings {
  store_mode: StoreMode
  allowed_store_countries: string[] // e.g. ['US']
  default_country: string // 'US'

  // PayPal Integration
  paypal_enabled: boolean
  paypal_mode: 'sandbox' | 'live'
  paypal_client_id: string
  paypal_secret_key: string

  // USA Bank & Stripe Integration
  usa_bank_enabled: boolean
  stripe_publishable_key: string
  stripe_secret_key: string
  ach_direct_debit_enabled: boolean
  credit_cards_enabled: boolean

  // International B2B Inquiry Settings
  inquiry_notification_email: string
  inquiry_phone_whatsapp: string
  international_quote_headline: string
  international_quote_notice: string
  show_prices_to_international: boolean // whether to show estimated USD price alongside "Request Quote"

  // General Store Info
  store_name: string
  contact_email: string
  contact_phone: string
  physical_address: string
  updated_at: string
}

export interface ProductInquiryPayload {
  product_id?: string
  product_title?: string
  product_sku?: string
  quantity: number
  customer_name: string
  email: string
  phone: string
  company_name: string
  country: string
  city_port?: string
  notes?: string
}
