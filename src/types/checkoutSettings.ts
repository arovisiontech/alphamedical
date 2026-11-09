export interface CheckoutSettings {
  page_title: string
  page_subtitle: string

  // Step 1: Login / Register
  step1_title: string
  step1_subtitle: string
  allow_guest_checkout: boolean
  guest_badge_text: string
  guest_badge_subtext: string

  // Step 2: Personal details
  step2_title: string

  // Step 3: Billing Address
  step3_title: string
  allowed_countries: string[]
  default_country: string
  allowed_regions: string[]

  // Step 4: Shipping Method
  step4_title: string
  shipping_name: string
  shipping_description: string
  shipping_cost: number
  free_shipping_threshold: number
  free_shipping_quantity: number

  // Step 5: Payment Method
  step5_title: string
  step5_subtitle: string
  step5_badge: string
  card_title: string
  card_badge: string
  card_description: string
  card_footnote: string
  button_text: string

  // Step 6: Coupons
  step6_title: string
  enable_coupons: boolean
  coupon_code_1: string
  coupon_discount_percent_1: number
  coupon_code_2: string
  coupon_discount_fixed_2: number

  // Security Notice Box
  security_box_title: string
  security_box_desc: string

  // Summary Card Guarantee Box
  guarantee_title: string
  guarantee_desc: string

  // 4 Trust Badges
  trust_badge_1: string
  trust_badge_2: string
  trust_badge_3: string
  trust_badge_4: string

  // Footer copyright
  footer_text: string
  updated_at: string
}
