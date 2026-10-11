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
