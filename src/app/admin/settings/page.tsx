'use client'

import React, { useState, useEffect } from 'react'
import AdminShell from '@/src/components/admin/AdminShell'
import {
  Globe,
  Store,
  CreditCard,
  Building,
  Save,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Mail,
  Phone,
  Layers,
  Settings as SettingsIcon,
  HelpCircle,
  ExternalLink,
} from 'lucide-react'
import {
  getStoredGeoStoreSettings,
  saveStoredGeoStoreSettings,
  INITIAL_GEO_STORE_SETTINGS_SEED,
} from '@/src/lib/dataStore'
import { GeoStoreSettings, StoreMode } from '@/src/types/storeSettings'

const AVAILABLE_COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
]

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<GeoStoreSettings>(INITIAL_GEO_STORE_SETTINGS_SEED)
  const [activeTab, setActiveTab] = useState<'geo' | 'payments' | 'inquiry' | 'general'>('geo')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSettings(getStoredGeoStoreSettings())
  }, [])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const updated = { ...settings, updated_at: new Date().toISOString() }
    saveStoredGeoStoreSettings(updated)
    setSettings(updated)
    setSaved(true)

    // Notify other components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('alpha_content_updated'))
    }

    setTimeout(() => setSaved(false), 3500)
  }

  const toggleCountry = (code: string) => {
    const list = settings.allowed_store_countries || ['US']
    if (list.includes(code)) {
      if (list.length === 1 && code === 'US') {
        alert('At least one country (e.g. USA) must remain enabled for the Online Store.')
        return
      }
      setSettings({
        ...settings,
        allowed_store_countries: list.filter((c) => c !== code),
      })
    } else {
      setSettings({
        ...settings,
        allowed_store_countries: [...list, code],
      })
    }
  }

  return (
    <AdminShell>
      <div className="space-y-6 animate-fade-in max-w-5xl font-sans">
        {/* HEADER BANNER */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#96161B]">
                Dual-Mode Commerce Control Center
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Store & Geo-Targeting Settings
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Configure USA Online Store (PayPal + USA Bank) and International B2B Quotations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="bg-[#96161B] hover:bg-[#7e1216] text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-red-950/20 active:scale-95 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save All Settings</span>
            </button>
          </div>
        </div>

        {saved && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-3 shadow-sm animate-scale-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-extrabold">Settings updated successfully!</span> Changes are live
              and persisted across all page refreshes.
            </div>
          </div>
        )}

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('geo')}
            className={`px-4 sm:px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'geo'
                ? 'bg-[#96161B] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>1. Geo-Location & Store Mode</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('payments')}
            className={`px-4 sm:px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'payments'
                ? 'bg-[#96161B] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>2. PayPal & USA Bank Payments</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inquiry')}
            className={`px-4 sm:px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'inquiry'
                ? 'bg-[#96161B] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>3. International Inquiry Desk</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-4 sm:px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'general'
                ? 'bg-[#96161B] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>4. Store Information</span>
          </button>
        </div>

        {/* TAB 1: GEO-LOCATION & DUAL-MODE */}
        {activeTab === 'geo' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Primary Store Operation Mode
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                Choose how visitors across different regions will experience your medical supply store.
              </p>
            </div>

            {/* MODE OPTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* OPTION A: AUTO GEO-DETECT (RECOMMENDED) */}
              <div
                onClick={() => setSettings({ ...settings, store_mode: 'auto_geo' })}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 relative ${
                  settings.store_mode === 'auto_geo'
                    ? 'border-[#96161B] bg-red-50/40 shadow-sm ring-2 ring-red-100'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-red-100 text-[#96161B] flex items-center justify-center font-bold">
                    <Globe className="w-5 h-5" />
                  </div>
                  {settings.store_mode === 'auto_geo' && (
                    <span className="bg-[#96161B] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                      Active
                    </span>
                  )}
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Automatic Geo-Detection (Recommended)
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  <strong>🇺🇸 USA visitors</strong> see the full Online Store with Add to Cart and
                  instant checkout. <strong>🌐 Other countries</strong> see B2B Inquiry & Request Quote.
                </p>
              </div>

              {/* OPTION B: FORCE USA STORE (ALL COUNTRIES) */}
              <div
                onClick={() => setSettings({ ...settings, store_mode: 'force_usa_store' })}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 relative ${
                  settings.store_mode === 'force_usa_store'
                    ? 'border-[#96161B] bg-red-50/40 shadow-sm ring-2 ring-red-100'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                    <Store className="w-5 h-5" />
                  </div>
                  {settings.store_mode === 'force_usa_store' && (
                    <span className="bg-[#96161B] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                      Active
                    </span>
                  )}
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">Force Online Store (All)</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  All visitors globally will see product prices, &quot;Add To Cart&quot;, and the checkout
                  drawer (useful for testing or international retail).
                </p>
              </div>

              {/* OPTION C: FORCE INQUIRY ONLY (ALL COUNTRIES) */}
              <div
                onClick={() => setSettings({ ...settings, store_mode: 'force_global_inquiry' })}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 relative ${
                  settings.store_mode === 'force_global_inquiry'
                    ? 'border-[#96161B] bg-red-50/40 shadow-sm ring-2 ring-red-100'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                    <Building className="w-5 h-5" />
                  </div>
                  {settings.store_mode === 'force_global_inquiry' && (
                    <span className="bg-[#96161B] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                      Active
                    </span>
                  )}
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">Force B2B Inquiry (All)</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Disables direct card checkout everywhere and switches entire site to catalog & quotation
                  mode (for wholesale exhibitions / medical conferences).
                </p>
              </div>
            </div>

            {/* ALLOWED STORE COUNTRIES */}
            <div className="pt-6 border-t border-slate-200 space-y-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Countries with Online Store & Checkout Enabled
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Visitors from selected countries will see the instant store. All other countries will
                  automatically receive the B2B inquiry form.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {AVAILABLE_COUNTRIES.map((c) => {
                  const isChecked = (settings.allowed_store_countries || ['US']).includes(c.code)
                  return (
                    <label
                      key={c.code}
                      onClick={() => toggleCountry(c.code)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[#96161B] bg-red-50/50 font-bold text-slate-900 ring-1 ring-[#96161B]'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{c.flag}</span>
                        <span className="text-xs">{c.name}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="text-[#96161B] rounded focus:ring-0"
                      />
                    </label>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PAYPAL & USA BANK PAYMENTS */}
        {activeTab === 'payments' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
            {/* PAYPAL SECTION */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-black text-sm">
                    PP
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">PayPal Integration</h3>
                    <p className="text-slate-500 text-xs">
                      Enables one-click PayPal checkout, Pay in 4, and PayPal Credit for USA buyers.
                    </p>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs font-bold text-slate-700">
                    {settings.paypal_enabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.paypal_enabled}
                    onChange={(e) => setSettings({ ...settings, paypal_enabled: e.target.checked })}
                    className="w-5 h-5 text-[#96161B] rounded cursor-pointer"
                  />
                </label>
              </div>

              {settings.paypal_enabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Environment Mode
                    </label>
                    <select
                      value={settings.paypal_mode}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          paypal_mode: e.target.value as 'sandbox' | 'live',
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-white outline-none focus:ring-2 focus:ring-[#96161B]"
                    >
                      <option value="sandbox">Sandbox (Testing / Demo)</option>
                      <option value="live">Live Production (Real Transactions)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      PayPal Client ID
                    </label>
                    <input
                      type="text"
                      value={settings.paypal_client_id}
                      onChange={(e) =>
                        setSettings({ ...settings, paypal_client_id: e.target.value })
                      }
                      placeholder="e.g. sb or client-id-from-paypal-developer"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-white outline-none focus:ring-2 focus:ring-[#96161B]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      PayPal Secret Key (Encrypted)
                    </label>
                    <input
                      type="password"
                      value={settings.paypal_secret_key}
                      onChange={(e) =>
                        setSettings({ ...settings, paypal_secret_key: e.target.value })
                      }
                      placeholder="••••••••••••••••••••••••••••••••"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-white outline-none focus:ring-2 focus:ring-[#96161B]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* USA BANK ACH & STRIPE */}
            <div className="space-y-4 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">
                      USA Bank Transfer (ACH) & Cards (Stripe)
                    </h3>
                    <p className="text-slate-500 text-xs">
                      Enables direct US Bank ACH payments (Chase, BoA, Wells Fargo) & Credit Cards.
                    </p>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs font-bold text-slate-700">
                    {settings.usa_bank_enabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.usa_bank_enabled}
                    onChange={(e) => setSettings({ ...settings, usa_bank_enabled: e.target.checked })}
                    className="w-5 h-5 text-[#96161B] rounded cursor-pointer"
                  />
                </label>
              </div>

              {settings.usa_bank_enabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="sm:col-span-2 flex items-center gap-6">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.ach_direct_debit_enabled}
                        onChange={(e) =>
                          setSettings({ ...settings, ach_direct_debit_enabled: e.target.checked })
                        }
                        className="text-[#96161B] rounded"
                      />
                      <span>USA Bank ACH Direct Debit</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.credit_cards_enabled}
                        onChange={(e) =>
                          setSettings({ ...settings, credit_cards_enabled: e.target.checked })
                        }
                        className="text-[#96161B] rounded"
                      />
                      <span>Credit / Debit Cards (Visa, Mastercard, Amex)</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Stripe Publishable Key
                    </label>
                    <input
                      type="text"
                      value={settings.stripe_publishable_key}
                      onChange={(e) =>
                        setSettings({ ...settings, stripe_publishable_key: e.target.value })
                      }
                      placeholder="pk_live_... or pk_test_..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-white outline-none focus:ring-2 focus:ring-[#96161B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Stripe Secret Key (Encrypted)
                    </label>
                    <input
                      type="password"
                      value={settings.stripe_secret_key}
                      onChange={(e) =>
                        setSettings({ ...settings, stripe_secret_key: e.target.value })
                      }
                      placeholder="sk_live_... or sk_test_..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-white outline-none focus:ring-2 focus:ring-[#96161B]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: INTERNATIONAL INQUIRY DESK */}
        {activeTab === 'inquiry' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                International B2B Inquiry Desk Configuration
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                Customize the experience and contact destinations for foreign hospital buyers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Inquiry Notification Email
                </label>
                <input
                  type="email"
                  value={settings.inquiry_notification_email}
                  onChange={(e) =>
                    setSettings({ ...settings, inquiry_notification_email: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-white outline-none focus:ring-2 focus:ring-[#96161B]"
                />
                <span className="text-[10px] text-slate-400">
                  New quotations and international leads will be logged and dispatched here.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  International Phone / WhatsApp Desk
                </label>
                <input
                  type="text"
                  value={settings.inquiry_phone_whatsapp}
                  onChange={(e) =>
                    setSettings({ ...settings, inquiry_phone_whatsapp: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-white outline-none focus:ring-2 focus:ring-[#96161B]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  International Modal Headline
                </label>
                <input
                  type="text"
                  value={settings.international_quote_headline}
                  onChange={(e) =>
                    setSettings({ ...settings, international_quote_headline: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-white outline-none focus:ring-2 focus:ring-[#96161B]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Custom Notice for International Buyers
                </label>
                <textarea
                  rows={3}
                  value={settings.international_quote_notice}
                  onChange={(e) =>
                    setSettings({ ...settings, international_quote_notice: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-white outline-none focus:ring-2 focus:ring-[#96161B]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={settings.show_prices_to_international}
                    onChange={(e) =>
                      setSettings({ ...settings, show_prices_to_international: e.target.checked })
                    }
                    className="text-[#96161B] rounded"
                  />
                  <span>Show Estimated USD Reference Prices alongside &quot;Request B2B Quote&quot;</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GENERAL STORE DETAILS */}
        {activeTab === 'general' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Store Corporate Details</h2>
              <p className="text-slate-500 text-xs mt-1">
                Official information displayed on commercial invoices, headers, and footer.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Store Title / Brand
                </label>
                <input
                  type="text"
                  value={settings.store_name}
                  onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-[#96161B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  General Contact Email
                </label>
                <input
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-[#96161B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Support Telephone
                </label>
                <input
                  type="text"
                  value={settings.contact_phone}
                  onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-[#96161B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Corporate Physical Address
                </label>
                <input
                  type="text"
                  value={settings.physical_address}
                  onChange={(e) => setSettings({ ...settings, physical_address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-[#96161B]"
                />
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM SAVE BAR */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">
            Last Updated:{' '}
            <span className="font-bold text-slate-700">
              {new Date(settings.updated_at || Date.now()).toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleSave}
            className="bg-[#96161B] hover:bg-[#7e1216] text-white font-extrabold text-xs sm:text-sm px-7 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-red-950/20 active:scale-95 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save & Apply Live</span>
          </button>
        </div>
      </div>
    </AdminShell>
  )
}
