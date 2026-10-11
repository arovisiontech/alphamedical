'use client'

import React from 'react'
import AdminShell from '@/src/components/admin/AdminShell'
import { Sliders, Plus, Check } from 'lucide-react'

export default function AdminSubcategoriesPage() {
  return (
    <AdminShell>
      <div className="space-y-6 animate-fade-in">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-[#18355E]">Subcategories & Specialized Lines</h1>
            <p className="text-slate-500 text-xs mt-1">
              Sub-division mappings for specialized surgical instruments and equipment.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#B92025]/10 text-[#B92025] flex items-center justify-center mx-auto">
            <Sliders className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-[#18355E] text-base">Subcategory Division Manager</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            All primary supply divisions (Medical Equipment, Surgical Instruments, Hospital Furniture, Lab Supplies) are dynamically linked with full product filter trees.
          </p>
        </div>
      </div>
    </AdminShell>
  )
}
