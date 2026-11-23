'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Globe, ChevronDown, Check, Store, FileText, Shield, X } from 'lucide-react'
import { useGeoLocation } from '@/src/context/GeoLocationContext'

const PRESET_COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸', type: 'store', desc: 'Online Store & Instant Card/PayPal' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', type: 'inquiry', desc: 'B2B Export Quotations' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', type: 'inquiry', desc: 'B2B Export Quotations' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', type: 'inquiry', desc: 'B2B Export Quotations' },
  { code: 'DE', name: 'Germany / EU', flag: '🇩🇪', type: 'inquiry', desc: 'B2B Export Quotations' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', type: 'inquiry', desc: 'B2B Export Quotations' },
  { code: 'GLOBAL', name: 'Other Countries', flag: '🌐', type: 'inquiry', desc: 'Global B2B Inquiries' },
]

export default function GeoModeSwitcher() {
  const { countryCode, isUsaStore, setManualCountry } = useGeoLocation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentMatch = PRESET_COUNTRIES.find((c) => c.code === countryCode) || {
    code: countryCode,
    name: countryCode === 'US' ? 'United States' : 'International',
    flag: countryCode === 'US' ? '🇺🇸' : '🌐',
    type: isUsaStore ? 'store' : 'inquiry',
    desc: isUsaStore ? 'Online Store' : 'B2B Quotes',
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* TRIGGER PILL */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer border bg-white/10 hover:bg-white/20 text-white border-white/20 shadow-sm"
        title="Change Country & Store Mode"
      >
        <span className="text-xs">{currentMatch.flag}</span>
        <span className="truncate max-w-[120px]">
          {isUsaStore ? 'USA Store' : countryCode === 'PK' ? 'Pakistan' : 'Global Inquire'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* DROPDOWN MENU / MODAL */}
      {isOpen && (
        <>
          {/* BACKDROP: Prevents clipping and dismisses on click outside */}
          <div
            className="fixed inset-0 z-[99998] bg-black/40 backdrop-blur-[1px]"
            onClick={() => setIsOpen(false)}
          />

          {/* POPUP MENU */}
          <div className="fixed sm:absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:top-full sm:left-auto sm:right-0 sm:translate-x-0 sm:translate-y-0 mt-2 w-[90vw] sm:w-80 max-w-sm rounded-2xl bg-white shadow-2xl border border-slate-200 z-[99999] p-3 font-sans text-slate-800 animate-scale-in">
            <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Store Region & Mode
                </div>
                <div className="text-xs font-bold text-slate-900">
                  {isUsaStore ? '🇺🇸 USA Store Active' : '🌐 B2B Inquiry Active'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-2 space-y-1.5 max-h-72 overflow-y-auto">
              {PRESET_COUNTRIES.map((c) => {
                const isSelected = countryCode === c.code

                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setManualCountry(c.code)
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-red-50/80 border-[#96161B]/40 text-[#96161B] font-bold shadow-xs'
                        : 'border-transparent hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl shrink-0">{c.flag}</span>
                      <div>
                        <div className="text-xs font-bold leading-tight">{c.name}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{c.desc}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#96161B] shrink-0" />}
                  </button>
                )
              })}
            </div>

            <div className="p-2 border-t border-slate-100 text-[10px] text-slate-400 leading-tight">
              * Select <strong>United States</strong> to shop products and checkout online. Select <strong>Pakistan</strong> to view B2B quotation inquiries.
            </div>
          </div>
        </>
      )}
    </div>
  )
}
