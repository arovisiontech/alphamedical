'use client'

import React from 'react'
import Image from 'next/image'
import AdminShell from '@/src/components/admin/AdminShell'
import { Image as ImageIcon, Upload, Check } from 'lucide-react'

export default function AdminMediaPage() {
  const images = [
    { name: 'image_1.png', url: '/images/extracted/image_1.png', label: 'Hero Slide 1' },
    { name: 'image_2.png', url: '/images/extracted/image_2.png', label: 'Hero Slide 2' },
    { name: 'image_3.png', url: '/images/extracted/image_3.png', label: 'About Banner' },
    { name: 'image_4.png', url: '/images/extracted/image_4.png', label: 'Hero Slide 3' },
    { name: 'image_6.png', url: '/images/extracted/image_6.png', label: 'Quality Feature' },
    { name: 'image_7.png', url: '/images/extracted/image_7.png', label: 'Medical Equip' },
    { name: 'image_8.png', url: '/images/extracted/image_8.png', label: 'Surgical Tools' },
    { name: 'image_9.png', url: '/images/extracted/image_9.png', label: 'Hospital Furniture' },
    { name: 'image_10.png', url: '/images/extracted/image_10.png', label: 'Lab Diagnostics' },
    { name: 'image_11.png', url: '/images/extracted/image_11.png', label: 'Patient Monitor' },
    { name: 'image_12.png', url: '/images/extracted/image_12.png', label: 'CTA Banner' },
  ]

  return (
    <AdminShell>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-extrabold text-[#18355E]">Media & Asset Library</h1>
            <p className="text-slate-500 text-xs mt-1">
              Extracted high-resolution product photography and promotional banners for ALPHA Medical Supplies Store.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm space-y-2 group"
            >
              <div className="relative aspect-[4/3] w-full bg-slate-100 rounded-xl overflow-hidden">
                <Image src={img.url} alt={img.label} fill className="object-contain p-2" />
              </div>
              <div className="text-xs font-bold text-[#18355E] truncate">{img.label}</div>
              <div className="text-[10px] text-slate-400 font-mono truncate">{img.url}</div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  )
}
