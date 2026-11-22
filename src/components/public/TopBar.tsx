import React from 'react'
import Link from 'next/link'
import { Phone, Mail } from 'lucide-react'
import GeoModeSwitcher from './GeoModeSwitcher'

export default function TopBar() {
  return (
    <div className="bg-[#596168] text-slate-100 text-[11px] font-normal py-1.5 px-3 sm:px-6 lg:px-8 border-b border-slate-600/50 w-full overflow-hidden">
      <div className="max-w-7xl 2xl:max-w-[1900px] mx-auto flex items-center justify-between gap-2 text-center sm:text-left">
        {/* LEFT: USA Owned Operated */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-medium text-white tracking-wide whitespace-nowrap">USA Owned Operated</span>
        </div>

        {/* CENTER: Free shipping notice */}
        <div className="hidden xl:flex items-center justify-center text-slate-200 text-[11px] truncate">
          <span>We ship all over the world - Choose Free shipping on all orders above $350 USD</span>
        </div>

        {/* RIGHT: Phone & Email + Mode Switcher */}
        <div className="flex items-center gap-2 sm:gap-4 text-[11px] text-slate-200 shrink-0">
          <a href="tel:+15615289764" className="hover:text-white transition-colors hidden sm:inline-flex items-center gap-1 whitespace-nowrap">
            <Phone className="w-3 h-3 text-red-300" />
            <span>+1 (561) 528 9764</span>
          </a>
          <a href="mailto:Sohail@alpha-medicalsupplies.com" className="hover:text-white transition-colors hidden 2xl:inline-flex items-center gap-1 whitespace-nowrap">
            <Mail className="w-3 h-3 text-red-300" />
            <span>Sohail@alpha-medicalsupplies.com</span>
          </a>
          <GeoModeSwitcher />
        </div>
      </div>
    </div>
  )
}
