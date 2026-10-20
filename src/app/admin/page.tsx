'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import AdminShell from '@/src/components/admin/AdminShell'
import {
  Package,
  Layers,
  FileText,
  MessageSquare,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import {
  getStoredProducts,
  getStoredCategories,
  getStoredCatalogues,
  getStoredContactMessages,
  getStoredBanners,
} from '@/src/lib/dataStore'
import { ProductItem } from '@/src/types/product'
import { CategoryItem } from '@/src/types/category'
import { CatalogueItem } from '@/src/types/catalogue'
import { ContactMessage } from '@/src/types/media'
import { BannerItem } from '@/src/types/banner'

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [catalogues, setCatalogues] = useState<CatalogueItem[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [banners, setBanners] = useState<BannerItem[]>([])

  useEffect(() => {
    setProducts(getStoredProducts())
    setCategories(getStoredCategories())
    setCatalogues(getStoredCatalogues())
    setMessages(getStoredContactMessages())
    setBanners(getStoredBanners())
  }, [])

  const statCards = [
    {
      title: 'Total Medical Products',
      count: products.length,
      subtext: `${products.filter((p) => p.is_published).length} Published Active`,
      icon: Package,
      color: 'bg-slate-900',
      href: '/admin/products',
    },
    {
      title: 'Hero Banners',
      count: banners.length,
      subtext: `${banners.filter((b) => b.is_active).length} Active on Homepage`,
      icon: Sparkles,
      color: 'bg-[#B92025]',
      href: '/admin/content',
    },
    {
      title: 'Supply Divisions',
      count: categories.length,
      subtext: 'Active Product Categories',
      icon: Layers,
      color: 'bg-slate-800',
      href: '/admin/products',
    },
    {
      title: 'PDF Catalogues',
      count: catalogues.length,
      subtext: 'Downloadable Documentation',
      icon: FileText,
      color: 'bg-emerald-600',
      href: '/admin/catalogues',
    },
    {
      title: 'Hospital Inquiries',
      count: messages.length,
      subtext: `${messages.filter((m) => !m.is_read).length} Unread Quotation Requests`,
      icon: MessageSquare,
      color: 'bg-slate-700',
      href: '/admin/contact-messages',
    },
  ]

  return (
    <AdminShell>
      <div className="space-y-8 animate-fade-in">
        {/* HEADER WELCOME BANNER */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2 z-10">
            <div className="inline-flex items-center gap-1.5 bg-[#B92025] text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ALPHA Medical Supplies Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              Control Panel & System Overview
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              Manage product listings, medical equipment specifications, downloadable catalogues, and respond to hospital quotation inquiries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 z-10">
            <Link
              href="/admin/products"
              className="flex items-center gap-2 bg-[#B92025] hover:bg-[#96161B] text-white font-bold text-xs px-4 py-3 rounded-xl transition-all shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Manage Products</span>
            </Link>
            <Link
              href="/admin/content"
              className="flex items-center gap-2 bg-[#B92025]/30 hover:bg-[#B92025] text-white font-bold text-xs px-4 py-3 rounded-xl border border-red-500/30 transition-all shadow"
            >
              <Sparkles className="w-4 h-4 text-red-300" />
              <span>Hero Banners</span>
            </Link>
            <Link
              href="/admin/contact-messages"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-4 py-3 rounded-xl border border-white/20 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-red-300" />
              <span>View Inquiries</span>
            </Link>
          </div>
        </div>

        {/* METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statCards.map((st, idx) => {
            const Icon = st.icon
            return (
              <Link
                key={idx}
                href={st.href}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {st.title}
                  </span>
                  <div className={`w-10 h-10 rounded-xl ${st.color} text-white flex items-center justify-center shadow`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 space-y-1">
                  <div className="text-3xl font-extrabold text-slate-900 group-hover:text-[#B92025] transition-colors">
                    {st.count}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    {st.subtext}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* TABLES & INQUIRIES SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: PRODUCTS LIST OVERVIEW */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Recent Medical Products</h3>
                <p className="text-xs text-slate-400">Live products in catalog</p>
              </div>
              <Link
                href="/admin/products"
                className="text-xs font-bold text-[#B92025] hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Division</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.slice(0, 5).map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 flex items-center gap-3">
                        <div className="relative w-10 h-10 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                          <Image
                            src={prod.featured_image || '/images/extracted/image_7.png'}
                            alt={prod.title}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 truncate max-w-[200px]">{prod.title}</div>
                          <div className="text-[10px] text-slate-400">{prod.sku}</div>
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-slate-600">
                        {prod.category_name || 'General'}
                      </td>
                      <td className="p-3">
                        {prod.is_published ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                            Published
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                            Draft
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT: RECENT QUOTATION INQUIRIES */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Quotation Requests</h3>
                <p className="text-xs text-slate-400">Incoming hospital orders</p>
              </div>
              <Link
                href="/admin/contact-messages"
                className="text-xs font-bold text-[#B92025] hover:underline flex items-center gap-1"
              >
                <span>View Messages</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="text-xs text-slate-400 py-6 text-center">No inquiry messages yet.</div>
              ) : (
                messages.slice(0, 4).map((msg) => (
                  <div
                    key={msg.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{msg.name}</span>
                      <span className="text-[10px] text-slate-400">{new Date(msg.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="text-xs font-semibold text-[#B92025] truncate">
                      {msg.subject}
                    </div>
                    <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {msg.message}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
