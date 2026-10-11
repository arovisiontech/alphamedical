'use client'

import React from 'react'
import AdminShell from '@/src/components/admin/AdminShell'
import { BarChart3, TrendingUp, Users, ShoppingBag } from 'lucide-react'

export default function AdminStatisticsPage() {
  return (
    <AdminShell>
      <div className="space-y-6 animate-fade-in">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h1 className="text-2xl font-extrabold text-[#18355E]">Analytics & System Reports</h1>
          <p className="text-slate-500 text-xs mt-1">
            Track catalog views, quotation submissions, and hospital engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase">Monthly Quotation Requests</div>
            <div className="text-3xl font-extrabold text-[#18355E]">48 Inquiries</div>
            <div className="text-[11px] text-emerald-600 font-semibold">+18.5% vs last month</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase">Catalogue Downloads</div>
            <div className="text-3xl font-extrabold text-[#18355E]">312 Downloads</div>
            <div className="text-[11px] text-emerald-600 font-semibold">+24.0% PDF views</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase">System Health</div>
            <div className="text-3xl font-extrabold text-emerald-600">100% Operational</div>
            <div className="text-[11px] text-slate-400">IndexedDB & Storage Sync OK</div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
