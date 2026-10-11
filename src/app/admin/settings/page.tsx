'use client'

import React, { useState } from 'react'
import AdminShell from '@/src/components/admin/AdminShell'
import { Settings, Save, CheckCircle2 } from 'lucide-react'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    storeName: 'ALPHA Medical Supplies Store',
    contactEmail: 'info@alphamedical.com',
    contactPhone: '+92 300 1234567',
    address: 'Alpha Medical Complex, Healthcare Industrial Zone, Lahore, Pakistan',
    enableQuotes: true,
  })

  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <AdminShell>
      <div className="space-y-6 animate-fade-in max-w-2xl">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h1 className="text-2xl font-extrabold text-[#18355E]">Store System Settings</h1>
          <p className="text-slate-500 text-xs mt-1">
            Configure contact details, quotation settings, and store branding.
          </p>
        </div>

        <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          {saved && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Store Title
            </label>
            <input
              type="text"
              value={settings.storeName}
              onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-[#B92025]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Contact Email
            </label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-[#B92025]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Contact Phone / WhatsApp
            </label>
            <input
              type="text"
              value={settings.contactPhone}
              onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-[#B92025]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Physical Address
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-[#B92025]"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="bg-[#18355E] hover:bg-[#B92025] text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors shadow flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save System Settings</span>
            </button>
          </div>
        </form>
      </div>
    </AdminShell>
  )
}
