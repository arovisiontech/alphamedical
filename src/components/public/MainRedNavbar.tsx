'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Sparkles } from 'lucide-react'

export default function MainRedNavbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const navItems = [
    {
      name: 'Surgical Instruments',
      href: '/products?cat=surgical-instruments',
      hasDropdown: true,
      columns: [
        {
          title: 'General Surgery',
          items: ['Bone Rongeurs', 'Dissecting Scissors', 'Extraction Forceps', 'Surgical Needle Holders', 'Cheek Retractors'],
        },
        {
          title: 'Bone Surgery',
          items: ['Bone Forceps', 'Elevators', 'Surgical Scissors', 'Surgical Needle Holders', 'Cheek Retractors'],
        },
        {
          title: 'Periodontics',
          items: ['Bone Rongeurs', 'Elevators', 'Surgical Scissors', 'Surgical Needle Holders', 'Cheek Retractors'],
        },
      ],
    },
    {
      name: 'Medical Supplies',
      href: '/products?cat=medical-supplies',
      hasDropdown: true,
      columns: [
        {
          title: 'Disposables',
          items: ['Sterile Gloves', 'IV Cannulas', 'Syringes & Needles', 'Gauze Swabs'],
        },
        {
          title: 'Diagnostics',
          items: ['Stethoscopes', 'Sphygmomanometers', 'Pulse Oximeters', 'Thermometers'],
        },
      ],
    },
    {
      name: 'PPE',
      href: '/products?cat=disposables-single-use',
      hasDropdown: true,
      columns: [
        {
          title: 'Protective Gear',
          items: ['N95 & Surgical Masks', 'Sterile Isolation Gowns', 'Protective Face Shields', 'Latex & Nitrile Gloves'],
        },
      ],
    },
    {
      name: 'Equipment',
      href: '/products?cat=medical-equipment',
      hasDropdown: true,
      columns: [
        {
          title: 'Critical Care & OR',
          items: ['ICU Turbine Ventilators', 'Multiparameter Monitors', 'Emergency Defibrillators', 'Electric ICU Beds'],
        },
      ],
    },
    {
      name: 'Brands',
      href: '/about',
      hasDropdown: true,
      columns: [
        {
          title: 'Certified Manufacturers',
          items: ['ALPHA Surgical Systems', 'German Steel Craft', 'MedEquip Pro', 'SurgiPrecision USA'],
        },
      ],
    },
    { name: 'Sale', href: '/products?sale=true', isBadge: false },
    { name: 'Resources', href: '/catalogues' },
    { name: 'Contact Us', href: '/contact' },
  ]

  return (
    <nav className="bg-[#B92025] text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between relative">
        <div className="flex items-center space-x-1 font-bold text-xs uppercase tracking-wider">
          {navItems.map((item) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={item.href}
                className={`flex items-center gap-1.5 px-4 py-3.5 hover:bg-black/20 transition-colors ${
                  item.isBadge ? 'bg-black/20 text-yellow-300 font-extrabold' : ''
                }`}
              >
                <span>{item.name}</span>
                {item.hasDropdown && <ChevronDown className="w-3.5 h-3.5 text-white/80" />}
              </Link>

              {/* MEGA MENU DROPDOWN */}
              {item.hasDropdown && activeDropdown === item.name && (
                <div className="absolute top-full left-0 w-[650px] bg-white text-slate-900 shadow-2xl border border-slate-200 rounded-b-2xl p-6 z-50 animate-fade-in grid grid-cols-3 gap-6">
                  {item.columns?.map((col, idx) => (
                    <div key={idx} className="space-y-3">
                      <h4 className="font-extrabold text-xs text-[#B92025] uppercase tracking-wider border-b border-red-100 pb-1.5">
                        {col.title}
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
                        {col.items.map((sub, sIdx) => (
                          <li key={sIdx}>
                            <Link
                              href={`/products?query=${encodeURIComponent(sub)}`}
                              className="hover:text-[#B92025] hover:underline block py-0.5"
                            >
                              • {sub}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  )
}
