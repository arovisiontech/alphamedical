'use client'

import React, { useState, useEffect } from 'react'
import AdminShell from '@/src/components/admin/AdminShell'
import Link from 'next/link'
import {
  Sparkles,
  Truck,
  CreditCard,
  ShieldCheck,
  Tag,
  CheckCircle2,
  Save,
  ExternalLink,
  Lock,
  Globe,
  DollarSign,
  HelpCircle,
  ShoppingBag,
  Award,
  Layers,
  ChevronRight,
  Eye,
} from 'lucide-react'
import {
  getStoredCheckoutSettings,
  saveStoredCheckoutSettings,
  INITIAL_CHECKOUT_SETTINGS_SEED,
} from '@/src/lib/dataStore'
import { CheckoutSettings } from '@/src/types/checkoutSettings'
import {
  VisaIcon,
  MastercardIcon,
  AmexIcon,
  DiscoverIcon,
  StripeBadge,
} from '@/src/components/public/PaymentCardIcons'

export default function AdminCheckoutCMS() {
  const [settings, setSettings] = useState<CheckoutSettings>(INITIAL_CHECKOUT_SETTINGS_SEED)
  const [activeTab, setActiveTab] = useState<'shipping' | 'titles' | 'steps' | 'coupons' | 'trust'>('shipping')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    setSettings(getStoredCheckoutSettings())
    const handleUpdate = () => setSettings(getStoredCheckoutSettings())
    window.addEventListener('alpha_checkout_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('alpha_checkout_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const updated = { ...settings, updated_at: new Date().toISOString() }
    saveStoredCheckoutSettings(updated)
    setSettings(updated)
    showToast('Checkout Page Settings saved successfully! Changes are live on /checkout.')
  }

  return (
    <AdminShell>
      <div className="space-y-8 animate-fade-in font-sans">
        
        {/* TOP HEADER */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-red-50 text-[#96161B] text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Checkout Page Studio CMS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Checkout & Shipping Manager
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Adjust shipping charges, free shipping threshold, delivery texts, card payment labels, coupons, and trust badges.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/checkout"
              target="_blank"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Live Checkout</span>
            </Link>

            <button
              onClick={handleSave}
              className="bg-[#96161B] hover:bg-[#7d1216] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm cursor-pointer transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        {/* TOAST MESSAGE */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg flex items-center gap-3 animate-fade-in text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* CMS NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('shipping')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'shipping'
                ? 'bg-[#96161B] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Shipping & Delivery Rates</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('titles')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'titles'
                ? 'bg-[#96161B] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Page Header & Security Notice</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('steps')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'steps'
                ? 'bg-[#96161B] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Steps 1 to 5 Form Controls</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'coupons'
                ? 'bg-[#96161B] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Coupons & Discounts</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('trust')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'trust'
                ? 'bg-[#96161B] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Trust Badges & Footer</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: SHIPPING & DELIVERY CHARGES (USER REQUEST CORE)
        ========================================================================= */}
        {activeTab === 'shipping' && (
          <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Shipping Rates & Delivery Configuration
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Set standard shipping cost, free shipping threshold, and courier description shown on the checkout page.
                </p>
              </div>
              <button
                type="submit"
                className="bg-[#96161B] text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Shipping Rates</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Default Shipping Fee ($ USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.shipping_cost}
                    onChange={(e) => setSettings({ ...settings, shipping_cost: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-black text-[#96161B]"
                    placeholder="30.99"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Default charges applied per order</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Free Shipping Minimum Order ($ USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
                  <input
                    type="number"
                    step="1"
                    value={settings.free_shipping_threshold}
                    onChange={(e) => setSettings({ ...settings, free_shipping_threshold: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-black text-emerald-700"
                    placeholder="100.00"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Free delivery if cart subtotal reaches this amount</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Free Shipping Quantity Threshold
                </label>
                <input
                  type="number"
                  step="1"
                  value={settings.free_shipping_quantity}
                  onChange={(e) => setSettings({ ...settings, free_shipping_quantity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-black text-slate-900"
                  placeholder="10"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Free delivery if buyer orders this many items</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Shipping Method Title
                </label>
                <input
                  type="text"
                  value={settings.shipping_name}
                  onChange={(e) => setSettings({ ...settings, shipping_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
                  placeholder="Fast International Shipping"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Shipping Description / Delivery Timeline
                </label>
                <input
                  type="text"
                  value={settings.shipping_description}
                  onChange={(e) => setSettings({ ...settings, shipping_description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-700"
                  placeholder="reliable worldwide delivery"
                />
              </div>
            </div>

            {/* LIVE PREVIEW OF SHIPPING OPTION */}
            <div className="pt-4 border-t border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 block mb-2">
                Live Preview (How it looks on Checkout Page)
              </span>
              <div className="max-w-md p-4 rounded-xl border-2 border-slate-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-[#96161B] bg-white flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#96161B]" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs sm:text-sm text-slate-900 block">
                      {settings.shipping_name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {settings.shipping_description}
                    </span>
                  </div>
                </div>
                <span className="font-extrabold text-sm sm:text-base text-slate-900">
                  ${settings.shipping_cost.toFixed(2)}
                </span>
              </div>
            </div>
          </form>
        )}

        {/* =========================================================================
            TAB 2: PAGE HEADER & SECURITY NOTICE
        ========================================================================= */}
        {activeTab === 'titles' && (
          <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Page Header & Security Notice Boxes
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customize the main page title, subtext, and the 256-Bit SSL trust message boxes.
                </p>
              </div>
              <button
                type="submit"
                className="bg-[#96161B] text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Titles</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Page Main Title</label>
                <input
                  type="text"
                  value={settings.page_title}
                  onChange={(e) => setSettings({ ...settings, page_title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-black text-slate-900"
                  placeholder="SECURE CHECKOUT"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Page Subtitle</label>
                <input
                  type="text"
                  value={settings.page_subtitle}
                  onChange={(e) => setSettings({ ...settings, page_subtitle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-700"
                  placeholder="Complete Your Order Safely And Securely"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Security Notice Box Title</label>
                <input
                  type="text"
                  value={settings.security_box_title}
                  onChange={(e) => setSettings({ ...settings, security_box_title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-[#96161B]"
                  placeholder="Your Payment Information Is Secure"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Security Notice Box Description</label>
                <input
                  type="text"
                  value={settings.security_box_desc}
                  onChange={(e) => setSettings({ ...settings, security_box_desc: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-700"
                  placeholder="We Use 256-Bit SSL Encryption To Protect Your Data"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Guarantee Box Title (Summary)</label>
                <input
                  type="text"
                  value={settings.guarantee_title}
                  onChange={(e) => setSettings({ ...settings, guarantee_title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
                  placeholder="Guaranteed Safe & Secure Checkout"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Guarantee Box Description</label>
                <input
                  type="text"
                  value={settings.guarantee_desc}
                  onChange={(e) => setSettings({ ...settings, guarantee_desc: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-700"
                  placeholder="256-Bit SSL Encryption • Powered by Stripe"
                />
              </div>
            </div>
          </form>
        )}

        {/* =========================================================================
            TAB 3: STEPS 1 TO 5 FORM CONTROLS
        ========================================================================= */}
        {activeTab === 'steps' && (
          <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Step 1 to 5 Titles & Payment Method Texts
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Control all form card titles, guest checkout options, allowed countries, and the card payment container.
                </p>
              </div>
              <button
                type="submit"
                className="bg-[#96161B] text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Steps</span>
              </button>
            </div>

            <div className="space-y-6">
              {/* STEP 1 */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-[10px] font-black text-[#96161B] uppercase tracking-wider">Step 1: Auth & Guest</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Title</label>
                    <input
                      type="text"
                      value={settings.step1_title}
                      onChange={(e) => setSettings({ ...settings, step1_title: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Subtitle</label>
                    <input
                      type="text"
                      value={settings.step1_subtitle}
                      onChange={(e) => setSettings({ ...settings, step1_subtitle: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Guest Badge Label</label>
                    <input
                      type="text"
                      value={settings.guest_badge_text}
                      onChange={(e) => setSettings({ ...settings, guest_badge_text: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* STEP 2 & 3 */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-[10px] font-black text-[#96161B] uppercase tracking-wider">Step 2 & Step 3: Personal & Address</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Step 2 Title</label>
                    <input
                      type="text"
                      value={settings.step2_title}
                      onChange={(e) => setSettings({ ...settings, step2_title: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Step 3 Title</label>
                    <input
                      type="text"
                      value={settings.step3_title}
                      onChange={(e) => setSettings({ ...settings, step3_title: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* STEP 5: PAYMENT CONTAINER */}
              <div className="p-5 bg-red-50/40 rounded-2xl border border-red-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#96161B] uppercase tracking-wider">Step 5: Stripe Credit / Debit Card</span>
                  <div className="flex items-center gap-1.5">
                    <VisaIcon className="h-5 w-auto" />
                    <MastercardIcon className="h-5 w-auto" />
                    <AmexIcon className="h-5 w-auto" />
                    <DiscoverIcon className="h-5 w-auto" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Step 5 Title</label>
                    <input
                      type="text"
                      value={settings.step5_title}
                      onChange={(e) => setSettings({ ...settings, step5_title: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Step 5 Subtitle</label>
                    <input
                      type="text"
                      value={settings.step5_subtitle}
                      onChange={(e) => setSettings({ ...settings, step5_subtitle: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Card Option Title</label>
                    <input
                      type="text"
                      value={settings.card_title}
                      onChange={(e) => setSettings({ ...settings, card_title: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Button Text (Red Action)</label>
                    <input
                      type="text"
                      value={settings.button_text}
                      onChange={(e) => setSettings({ ...settings, button_text: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-black text-[#96161B]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Card Description</label>
                    <input
                      type="text"
                      value={settings.card_description}
                      onChange={(e) => setSettings({ ...settings, card_description: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Security Footnote</label>
                    <input
                      type="text"
                      value={settings.card_footnote}
                      onChange={(e) => setSettings({ ...settings, card_footnote: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* =========================================================================
            TAB 4: COUPONS & DISCOUNTS
        ========================================================================= */}
        {activeTab === 'coupons' && (
          <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Coupons, Vouchers & Discounts
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure active promotional discount codes that buyers can apply at checkout.
                </p>
              </div>
              <button
                type="submit"
                className="bg-[#96161B] text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Coupons</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Step 6 Title</label>
                <input
                  type="text"
                  value={settings.step6_title}
                  onChange={(e) => setSettings({ ...settings, step6_title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enable_coupons}
                    onChange={(e) => setSettings({ ...settings, enable_coupons: e.target.checked })}
                    className="w-4 h-4 text-[#96161B] rounded"
                  />
                  <span>Enable Coupon Input on Checkout Page</span>
                </label>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-[#96161B] uppercase">Primary Coupon (Percentage)</span>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Coupon Code</label>
                  <input
                    type="text"
                    value={settings.coupon_code_1}
                    onChange={(e) => setSettings({ ...settings, coupon_code_1: e.target.value.toUpperCase() })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-black uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Discount Percentage (%)</label>
                  <input
                    type="number"
                    value={settings.coupon_discount_percent_1}
                    onChange={(e) => setSettings({ ...settings, coupon_discount_percent_1: parseInt(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-[#96161B] uppercase">Secondary Voucher (Fixed USD)</span>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Voucher Code</label>
                  <input
                    type="text"
                    value={settings.coupon_code_2}
                    onChange={(e) => setSettings({ ...settings, coupon_code_2: e.target.value.toUpperCase() })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-black uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Discount Amount ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.coupon_discount_fixed_2}
                    onChange={(e) => setSettings({ ...settings, coupon_discount_fixed_2: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-emerald-700"
                  />
                </div>
              </div>
            </div>
          </form>
        )}

        {/* =========================================================================
            TAB 5: TRUST BADGES & FOOTER
        ========================================================================= */}
        {activeTab === 'trust' && (
          <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  4 Trust Icons & Footer Copyright
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update the 4 icons displayed beneath the order summary and the bottom copyright notice.
                </p>
              </div>
              <button
                type="submit"
                className="bg-[#96161B] text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Trust Badges</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Badge 1 Label</label>
                <input
                  type="text"
                  value={settings.trust_badge_1}
                  onChange={(e) => setSettings({ ...settings, trust_badge_1: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Badge 2 Label</label>
                <input
                  type="text"
                  value={settings.trust_badge_2}
                  onChange={(e) => setSettings({ ...settings, trust_badge_2: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Badge 3 Label</label>
                <input
                  type="text"
                  value={settings.trust_badge_3}
                  onChange={(e) => setSettings({ ...settings, trust_badge_3: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Badge 4 Label</label>
                <input
                  type="text"
                  value={settings.trust_badge_4}
                  onChange={(e) => setSettings({ ...settings, trust_badge_4: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-xs font-bold text-slate-700 mb-1">Footer Copyright Line</label>
                <input
                  type="text"
                  value={settings.footer_text}
                  onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>
          </form>
        )}

      </div>
    </AdminShell>
  )
}
