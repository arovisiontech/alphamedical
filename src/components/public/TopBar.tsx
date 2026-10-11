import React from 'react'
import Link from 'next/link'
import { Phone, Mail, ShieldCheck } from 'lucide-react'

export default function TopBar() {
  return (
    <div className="bg-[#596168] text-slate-100 text-[11px] font-normal py-1.5 px-4 sm:px-8 border-b border-slate-600/50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-center sm:text-left">
        {/* LEFT: USA Owned Operated */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-white tracking-wide">USA Owned Operated</span>
        </div>

        {/* CENTER: Free shipping notice */}
        <div className="hidden md:flex items-center justify-center text-slate-200 text-[11px]">
          <span>We ship all over the world - Choose Free shipping on all orders above $350 USD</span>
        </div>

        {/* RIGHT: Phone & Email + Admin access */}
        <div className="flex items-center gap-4 text-[11px] text-slate-200">
          <a href="tel:+9252000000" className="hover:text-white transition-colors">
            (+92 52 000 000)
          </a>
          <a href="mailto:Info@alpha-medicalsupplie.com" className="hover:text-white transition-colors hidden sm:inline">
            Info@alpha-medicalsupplie.com
          </a>
          <Link
            href="/admin"
            className="hidden lg:flex items-center gap-1 text-[10px] font-bold text-white bg-black/20 hover:bg-[#B92025] px-2 py-0.5 rounded transition-colors"
            title="Go to Admin Panel"
          >
            <ShieldCheck className="w-3 h-3 text-red-300" />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

