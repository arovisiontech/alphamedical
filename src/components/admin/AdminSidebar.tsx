'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Layers,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  BarChart3,
  Settings,
  Users,
  Sparkles,
  Sliders,
  LogOut,
  ShieldCheck,
  Globe,
  HelpCircle,
} from 'lucide-react'

export default function AdminSidebar() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products & Best Sellers', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Subcategories', href: '/admin/subcategories', icon: Sliders },
    { name: 'PDF Catalogues', href: '/admin/catalogues', icon: FileText },
    { name: 'FAQs Knowledgebase', href: '/admin/faqs', icon: HelpCircle },
    { name: 'Media Library', href: '/admin/media', icon: ImageIcon },
    { name: 'Inquiries & Messages', href: '/admin/contact-messages', icon: MessageSquare },
    { name: 'Content & Banners', href: '/admin/content', icon: Sparkles },
    { name: 'Trust Badges & Features', href: '/admin/features', icon: ShieldCheck },
    { name: 'Sections & Compliances', href: '/admin/sections', icon: Globe },
    { name: 'Analytics & Stats', href: '/admin/statistics', icon: BarChart3 },
    { name: 'Store & Geo Settings', href: '/admin/settings', icon: Settings },
    { name: 'User Access', href: '/admin/users', icon: Users },
  ]

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-[calc(100vh-61px)]">
      <div className="p-4 space-y-6">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Navigation Menu</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#B92025] text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-red-400'}`} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* FOOTER USER / LOGOUT */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
          <div className="font-bold text-white">ALPHA Medical System</div>
          <div className="text-[10px] text-emerald-400 font-semibold">● System Operational</div>
        </div>

        <Link
          href="/"
          className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-red-900/80 text-white font-semibold py-2 rounded-xl text-xs transition-colors border border-slate-800"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Admin</span>
        </Link>
      </div>
    </aside>
  )
}
