export interface WhyChooseFeature {
  id: string
  title: string
  description: string
  icon_name: string
}

export interface VideoWhyChooseData {
  video_title: string
  video_subtitle: string
  video_button_text: string
  video_url: string
  poster_image: string
  section_title: string
  section_subtitle: string
  features: WhyChooseFeature[]
}

export interface WorldExportData {
  badge_text: string
  heading_line1: string
  heading_line2: string
  heading_line3: string
  description: string
  staff_count: string
  staff_label: string
  instruments_count: string
  instruments_label: string
  globe_image: string
  destinations: {
    country: string
    code: string
    flag: string
  }[]
}

export interface ComplianceBadgeItem {
  id: string
  type: 'iso' | 'fda' | 'custom'
  code: string
  label: string
}

export interface CompliancesPromoData {
  compliance_badge: string
  compliance_title_line1: string
  compliance_title_line2: string
  compliance_description: string
  compliances: ComplianceBadgeItem[]
  left_card: {
    badge_text: string
    title: string
    highlight_title: string
    description: string
    button_text: string
    button_url: string
    bg_image: string
  }
  right_card: {
    badge_icon: string
    title_line1: string
    title_line2: string
    description: string
    button_text: string
    button_url: string
  }
}
