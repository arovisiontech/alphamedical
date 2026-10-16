'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Phone, Mail, MessageSquare, MapPin, X, ArrowUpRight, CheckCircle2 } from 'lucide-react'

export default function FloatingContactCTA() {
  const [isPhoneOpen, setIsPhoneOpen] = useState(false)
  const [isEmailOpen, setIsEmailOpen] = useState(false)
  const phoneRef = useRef<HTMLDivElement>(null)
  const emailRef = useRef<HTMLDivElement>(null)

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (phoneRef.current && !phoneRef.current.contains(event.target as Node)) {
        setIsPhoneOpen(false)
      }
      if (emailRef.current && !emailRef.current.contains(event.target as Node)) {
        setIsEmailOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <aside aria-label="Quick contact desk" className="fixed right-4 sm:right-6 bottom-6 z-50 flex flex-col items-end gap-3 pointer-events-none select-none">
      {/* ============================================================== */}
      {/* CTA 1: DIRECT CALL & WHATSAPP BUTTON (EMERALD / GREEN PULSE) */}
      {/* ============================================================== */}
      <div ref={phoneRef} className="relative pointer-events-auto">
        {/* Expanded Popover Card for Calling */}
        {isPhoneOpen && (
          <div className="absolute right-0 bottom-16 w-80 sm:w-88 bg-white border border-slate-200 shadow-2xl rounded-3xl p-5 mb-2 animate-fade-in text-slate-800 z-50">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Direct Phone Support
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPhoneOpen(false)}
                className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                aria-label="Close phone menu"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 pt-3 text-xs">
              <p className="text-[11px] text-slate-500">
                Speak directly with our surgical instrument specialists and USA procurement managers:
              </p>

              {/* Line 1 */}
              <a
                href="tel:+15615289764"
                className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 text-xs">+1 (561) 528 9764</div>
                    <div className="text-[10px] text-emerald-800 font-semibold">Direct Call / Inquiries</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              {/* Line 2 */}
              <a
                href="tel:+18644232826"
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-xs">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 text-xs">+1 (864) 423 2826</div>
                    <div className="text-[10px] text-slate-500 font-semibold">Hospital Sales & Orders</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              {/* WhatsApp Quick Chat */}
              <a
                href="https://wa.me/15615289764?text=Hello%20ALPHA%20Medical%20Supplies%2C%20I%20am%20interested%20in%20your%20surgical%20instruments."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp (+1 561 528 9764)</span>
              </a>

              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 justify-center pt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>USA Based 24/7 Procurement Assistance</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Floating Phone Trigger Button */}
        <button
          type="button"
          onClick={() => {
            setIsPhoneOpen(!isPhoneOpen)
            setIsEmailOpen(false)
          }}
          className="relative group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white cursor-pointer"
          aria-label="Call ALPHA Medical Supplies"
        >
          {/* Subtle pulse ring */}
          <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-pulse pointer-events-none" />

          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center relative">
            <Phone className="w-3.5 h-3.5 text-white" />
          </div>

          <span className="font-extrabold text-xs tracking-wide hidden sm:inline">
            Call Direct
          </span>

          <span className="text-[10px] bg-emerald-950/60 font-bold px-2 py-0.5 rounded-full hidden md:inline">
            +1 (561) 528 9764
          </span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* CTA 2: DIRECT EMAIL & ADDRESS BUTTON (ALPHA CRIMSON RED) */}
      {/* ============================================================== */}
      <div ref={emailRef} className="relative pointer-events-auto">
        {/* Expanded Popover Card for Email & Official Address */}
        {isEmailOpen && (
          <div className="absolute right-0 bottom-16 w-80 sm:w-92 bg-white border border-slate-200 shadow-2xl rounded-3xl p-5 mb-2 animate-fade-in text-slate-800 z-50">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#96161B] animate-ping" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Official Email & HQ Desk
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsEmailOpen(false)}
                className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                aria-label="Close email menu"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 pt-3 text-xs">
              {/* Address Badge */}
              <div className="p-3 bg-red-50/60 border border-red-100 rounded-2xl flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#96161B] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">USA Headquarters</div>
                  <div className="text-slate-600 font-semibold text-xs mt-0.5">
                    129 Fleetwood Drive Easley SC 29640 USA
                  </div>
                </div>
              </div>

              {/* Email 1 */}
              <a
                href="mailto:Sohail@alpha-medicalsupplies.com?subject=Inquiry%20from%20ALPHA%20Website"
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-red-50/60 border border-slate-200 hover:border-red-200 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-xl bg-[#96161B] text-white flex items-center justify-center shadow-xs shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="font-extrabold text-slate-900 text-xs truncate">Sohail@alpha-medicalsupplies.com</div>
                    <div className="text-[10px] text-slate-500 font-semibold">Executive Procurement Desk</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#96161B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </a>

              {/* Email 2 */}
              <a
                href="mailto:Aftab@alpha-medicalsupplies.com?subject=Wholesale%20Order%20Inquiry%20ALPHA"
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-red-50/60 border border-slate-200 hover:border-red-200 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-xs shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="font-extrabold text-slate-900 text-xs truncate">Aftab@alpha-medicalsupplies.com</div>
                    <div className="text-[10px] text-slate-500 font-semibold">Operations & Global Shipping</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </a>

              <a
                href="/contact"
                className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-[#96161B] hover:bg-[#7d1216] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <span>Open Formal RFQ & Quotation Page</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Main Floating Email Trigger Button */}
        <button
          type="button"
          onClick={() => {
            setIsEmailOpen(!isEmailOpen)
            setIsPhoneOpen(false)
          }}
          className="relative group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#96161B] to-[#7d1216] hover:from-[#b92025] hover:to-[#96161B] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white cursor-pointer"
          aria-label="Email ALPHA Medical Supplies"
        >
          {/* Subtle pulse ring */}
          <span className="absolute -inset-1 rounded-full bg-red-600/30 animate-pulse pointer-events-none" />

          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center relative">
            <Mail className="w-3.5 h-3.5 text-white" />
          </div>

          <span className="font-extrabold text-xs tracking-wide hidden sm:inline">
            Email & Address
          </span>

          <span className="text-[10px] bg-black/40 font-bold px-2 py-0.5 rounded-full hidden md:inline">
            Easley, SC USA
          </span>
        </button>
      </div>
    </aside>
  )
}
