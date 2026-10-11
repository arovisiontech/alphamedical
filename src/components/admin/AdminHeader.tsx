'use client'

import React from 'react'
import Link from 'next/link'
import { ExternalLink, ShieldCheck } from 'lucide-react'
import AlphaLogo from '@/src/components/public/AlphaLogo'

interface AdminHeaderProps {
  onToggleSidebar?: () => void
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-slate-950 text-white border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-4">
        <AlphaLogo variant="dark" />
        <span className="hidden sm:inline-block bg-[#B92025] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
          Admin Portal
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-red-400" />
          <span className="hidden sm:inline font-semibold">View Live Website</span>
        </Link>

        <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
          <div className="w-8 h-8 rounded-full bg-[#B92025] text-white flex items-center justify-center font-bold text-xs shadow">
            A
          </div>
          <div className="hidden md:flex flex-col">
            <span className="font-bold text-slate-100">Administrator</span>
            <span className="text-[10px] text-slate-400">admin@alphamedical.com</span>
          </div>
        </div>
      </div>
    </header>
  )
}
