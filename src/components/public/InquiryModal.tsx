'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
  X,
  Send,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Package,
  CheckCircle2,
  ShieldCheck,
  FileText,
} from 'lucide-react'
import { useGeoLocation } from '@/src/context/GeoLocationContext'
import { getStoredContactMessages, saveStoredContactMessages } from '@/src/lib/dataStore'
import { ContactMessage } from '@/src/types/media'
import SafeProductImage from '@/src/components/public/SafeProductImage'

export default function InquiryModal() {
  const { isInquiryModalOpen, closeInquiryModal, activeInquiryProduct, countryName, countryCode } =
    useGeoLocation()

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    country: countryName || 'International',
    city_port: '',
    quantity: '10-50 units',
    incoterm: 'CIF - Cost, Insurance and Freight',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [refId, setRefId] = useState('')

  if (!isInquiryModalOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const generatedRef = `RFQ-${Math.floor(100000 + Math.random() * 900000)}`
    setRefId(generatedRef)

    const productTitle = activeInquiryProduct?.title || 'General Surgical Instrumentation'
    const productSku = activeInquiryProduct?.sku || 'GEN-RFQ'

    // Save into Admin Contact Messages
    const newMessage: ContactMessage = {
      id: `inq-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: `[B2B Export Quote ${generatedRef}] ${formData.company} (${formData.country}) - ${productTitle}`,
      message: `PRODUCT INQUIRED:
• Title: ${productTitle} (SKU: ${productSku})
• Target Quantity: ${formData.quantity}
• Preferred Incoterm: ${formData.incoterm}

BUYER DETAILS:
• Company/Hospital: ${formData.company}
• Destination Country/Port: ${formData.country} / ${formData.city_port}
• Direct Phone/WhatsApp: ${formData.phone}
• Client Work Email: ${formData.email}

ADDITIONAL NOTES:
${formData.message || 'Please dispatch official catalog & commercial quote.'}`,
      is_read: false,
      created_at: new Date().toISOString(),
    }

    try {
      const existing = getStoredContactMessages()
      saveStoredContactMessages([newMessage, ...existing])
    } catch (err) {
      console.error('Failed to save inquiry:', err)
    }

    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
    }, 600)
  }

  const handleResetAndClose = () => {
    setIsSuccess(false)
    closeInquiryModal()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm animate-fade-in flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* MODAL HEADER */}
        <div className="bg-[#96161B] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-red-200">
                International Export Desk
              </div>
              <h2 className="text-lg sm:text-xl font-black">Request Official B2B Quotation</h2>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {isSuccess ? (
            <div className="text-center py-10 space-y-4 animate-scale-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Quotation Request Received!</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="font-bold text-slate-900">{formData.name}</span>. Your
                request reference is{' '}
                <span className="font-extrabold text-[#96161B] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  {refId}
                </span>
                . Our international medical export manager will email official factory-direct pricing
                and CIF shipping options within 24 hours.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="bg-[#96161B] hover:bg-[#7e1216] text-white font-bold text-xs sm:text-sm px-8 py-3 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Close & Continue Browsing
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* TARGET PRODUCT PREVIEW (IF SELECTED) */}
              {activeInquiryProduct && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-4">
                  <div className="relative w-16 h-16 bg-white rounded-xl overflow-hidden border border-slate-200 shrink-0">
                    <SafeProductImage
                      src={activeInquiryProduct.featured_image || '/images/products/image-399.png'}
                      alt={activeInquiryProduct.title || 'Product'}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-[#96161B] uppercase tracking-wider">
                      Selected Instrument
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                      {activeInquiryProduct.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      SKU: {activeInquiryProduct.sku || 'N/A'} • German Stainless Steel AISI 420
                    </p>
                  </div>
                </div>
              )}

              {/* FORM FIELDS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Dr. John Smith / Procurement Officer"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-[#96161B]"
                  />
                </div>

                {/* Company / Hospital */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Hospital / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Apex Healthcare Ltd / General Hospital"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-[#96161B]"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Official Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="purchasing@hospital.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-[#96161B]"
                  />
                </div>

                {/* Phone / WhatsApp */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+44 20 7946 0912"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-[#96161B]"
                  />
                </div>

                {/* Destination Country */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Destination Country *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="United Kingdom, UAE, Germany..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-[#96161B]"
                  />
                </div>

                {/* Port / Delivery City */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Destination City / Port of Entry
                  </label>
                  <input
                    type="text"
                    value={formData.city_port}
                    onChange={(e) => setFormData({ ...formData, city_port: e.target.value })}
                    placeholder="Dubai Airport / Southampton Port"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-[#96161B]"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Estimated Quantity
                  </label>
                  <select
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-[#96161B] bg-white cursor-pointer"
                  >
                    <option value="1-10 Sample Units">1-10 Sample Units</option>
                    <option value="10-50 units">10 - 50 Units (Small Clinic)</option>
                    <option value="50-200 units">50 - 200 Units (Hospital Batch)</option>
                    <option value="500+ units">500+ Units (Distributor Container)</option>
                    <option value="Full Hospital Setup">Full Department Setup (Turnkey)</option>
                  </select>
                </div>

                {/* Shipping Incoterm */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Preferred Freight Terms
                  </label>
                  <select
                    value={formData.incoterm}
                    onChange={(e) => setFormData({ ...formData, incoterm: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-[#96161B] bg-white cursor-pointer"
                  >
                    <option value="CIF - Cost, Insurance and Freight">CIF (Door-to-Door / Port Delivered)</option>
                    <option value="FOB - Free on Board">FOB (Factory Loading)</option>
                    <option value="Express Air Courier (DHL/FedEx)">Express Air Courier (3-5 Days)</option>
                    <option value="Ex-Works">Ex-Works</option>
                  </select>
                </div>
              </div>

              {/* Message / Specifications */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Custom Requirements & Packaging Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Specify laser-marking, custom sterilization tray sets, CE certificates required..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-[#96161B] resize-none"
                />
              </div>

              {/* TRUST NOTICE */}
              <div className="flex items-center gap-2 p-3 bg-red-50/70 border border-red-100 rounded-xl text-[11px] text-red-900">
                <ShieldCheck className="w-4 h-4 text-[#96161B] shrink-0" />
                <span>
                  Official FDA, CE & ISO 13485 export documentation included with every commercial shipment.
                </span>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#96161B] hover:bg-[#7e1216] disabled:opacity-50 text-white font-black text-xs sm:text-sm px-7 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-red-950/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Request...' : 'Submit Quotation Request'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
