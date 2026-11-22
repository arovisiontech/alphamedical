'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { GeoStoreSettings, StoreMode } from '@/src/types/storeSettings'
import { getStoredGeoStoreSettings } from '@/src/lib/dataStore'
import { ProductItem } from '@/src/types/product'

interface GeoLocationContextType {
  countryCode: string
  countryName: string
  isUsaStore: boolean
  settings: GeoStoreSettings
  mode: StoreMode
  setManualCountry: (code: string) => void
  openInquiryModal: (product?: ProductItem | Partial<ProductItem> | null) => void
  closeInquiryModal: () => void
  isInquiryModalOpen: boolean
  activeInquiryProduct: ProductItem | Partial<ProductItem> | null
  reloadSettings: () => void
}

const GeoLocationContext = createContext<GeoLocationContextType | undefined>(undefined)

const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States',
  CA: 'Canada',
  GB: 'United Kingdom',
  DE: 'Germany',
  AE: 'United Arab Emirates',
  SA: 'Saudi Arabia',
  PK: 'Pakistan',
  IN: 'India',
  AU: 'Australia',
  GLOBAL: 'International (Global)',
}

export function GeoLocationProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<GeoStoreSettings>(getStoredGeoStoreSettings())
  const [countryCode, setCountryCode] = useState<string>('US')
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false)
  const [activeInquiryProduct, setActiveInquiryProduct] = useState<ProductItem | Partial<ProductItem> | null>(null)

  // Reload settings from localStorage
  const reloadSettings = () => {
    const updated = getStoredGeoStoreSettings()
    setSettings(updated)
  }

  useEffect(() => {
    const loadedSettings = getStoredGeoStoreSettings()
    setSettings(loadedSettings)

    // Check manual override first
    const savedCountry = localStorage.getItem('alpha_user_country_override')
    if (savedCountry) {
      setCountryCode(savedCountry.toUpperCase())
      return
    }

    // If auto_geo, detect via IP cascade
    if (loadedSettings.store_mode === 'auto_geo') {
      const detectCountry = async () => {
        try {
          const res = await fetch('/api/geo')
          const data = await res.json()
          if (data && data.country && data.country.length === 2) {
            setCountryCode(data.country.toUpperCase())
            return
          }
        } catch {}

        try {
          const r1 = await fetch('https://api.country.is')
          const d1 = await r1.json()
          if (d1 && d1.country) {
            setCountryCode(d1.country.toUpperCase())
            return
          }
        } catch {}

        try {
          const r2 = await fetch('https://ipapi.co/json/')
          const d2 = await r2.json()
          if (d2 && d2.country_code) {
            setCountryCode(d2.country_code.toUpperCase())
            return
          }
        } catch {}

        try {
          const r3 = await fetch('https://ipwho.is/')
          const d3 = await r3.json()
          if (d3 && d3.country_code) {
            setCountryCode(d3.country_code.toUpperCase())
            return
          }
        } catch {}

        setCountryCode(loadedSettings.default_country || 'US')
      }

      detectCountry()
    } else if (loadedSettings.store_mode === 'force_usa_store') {
      setCountryCode('US')
    } else {
      setCountryCode('GLOBAL')
    }
  }, [])

  const setManualCountry = (code: string) => {
    const upper = code.toUpperCase()
    setCountryCode(upper)
    if (typeof window !== 'undefined') {
      localStorage.setItem('alpha_user_country_override', upper)
    }
  }

  const openInquiryModal = (product?: ProductItem | Partial<ProductItem> | null) => {
    setActiveInquiryProduct(product || null)
    setIsInquiryModalOpen(true)
  }

  const closeInquiryModal = () => {
    setIsInquiryModalOpen(false)
    setActiveInquiryProduct(null)
  }

  // Calculate whether current visitor gets USA Online Store or Global Inquiry
  let isUsaStore = false
  if (settings.store_mode === 'force_usa_store') {
    isUsaStore = true
  } else if (settings.store_mode === 'force_global_inquiry') {
    isUsaStore = false
  } else {
    // auto_geo
    const allowed = (settings.allowed_store_countries || ['US']).map((c) => c.toUpperCase())
    isUsaStore = allowed.includes(countryCode)
  }

  const countryName = COUNTRY_NAMES[countryCode] || countryCode

  return (
    <GeoLocationContext.Provider
      value={{
        countryCode,
        countryName,
        isUsaStore,
        settings,
        mode: settings.store_mode,
        setManualCountry,
        openInquiryModal,
        closeInquiryModal,
        isInquiryModalOpen,
        activeInquiryProduct,
        reloadSettings,
      }}
    >
      {children}
    </GeoLocationContext.Provider>
  )
}

export function useGeoLocation() {
  const context = useContext(GeoLocationContext)
  if (!context) {
    throw new Error('useGeoLocation must be used within a GeoLocationProvider')
  }
  return context
}
