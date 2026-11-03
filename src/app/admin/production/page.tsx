'use client'

import React, { useState, useEffect } from 'react'
import AdminShell from '@/src/components/admin/AdminShell'
import Link from 'next/link'
import {
  Factory,
  ShieldCheck,
  CheckCircle2,
  Save,
  ExternalLink,
  Layers,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2,
  Award,
} from 'lucide-react'

interface ProductionStep {
  id: string
  stepNumber: string
  title: string
  subtitle: string
  description: string
  bulletPoints: string[]
  icon: string
}

const DEFAULT_PRODUCTION_STEPS: ProductionStep[] = [
  {
    id: 'step-1',
    stepNumber: '01',
    title: 'Raw Material Selection',
    subtitle: 'German & Japanese Stainless Steel',
    description: 'Every batch starts with certified medical-grade stainless steel (AISI 410, 420, and 316L) tested for chemical composition, tensile strength, and metallurgical purity.',
    bulletPoints: ['Spectrometric purity analysis', 'ASTM F899 compliant alloys', 'Traceable heat batch lot numbers'],
    icon: 'Layers',
  },
  {
    id: 'step-2',
    stepNumber: '02',
    title: 'Drop Forging & Die Shaping',
    subtitle: 'Thermal Integrity & Grain Alignment',
    description: 'Hot drop-forging aligns the metallic grain structure along the stress contours of the surgical instrument, eliminating micro-fracture risks during critical operating procedures.',
    bulletPoints: ['High-tonnage precision dies', 'Stress-relief annealing', 'Uniform density distribution'],
    icon: 'Factory',
  },
  {
    id: 'step-3',
    stepNumber: '03',
    title: 'Precision Milling & CNC Machining',
    subtitle: 'Micron-Level Dimensional Accuracy',
    description: 'Multi-axis CNC Swiss-turning and wire electrical discharge machining (EDM) craft intricate box locks, ratchets, and serrations with microscopic tolerances.',
    bulletPoints: ['±0.02mm dimensional tolerance', 'Flawless box lock alignment', 'Tungsten Carbide insert preparation'],
    icon: 'Sparkles',
  },
  {
    id: 'step-4',
    stepNumber: '04',
    title: 'Vacuum Heat Treatment & Tempering',
    subtitle: 'Optimized Hardness & Flexibility',
    description: 'Computer-controlled vacuum furnaces quench and double-temper each instrument to achieve the exact Rockwell hardness (48-54 HRC) preventing brittleness while maintaining keen cutting edges.',
    bulletPoints: ['Controlled atmosphere quenching', 'Double tempering cycle', 'Calibrated 50-54 HRC hardness'],
    icon: 'Award',
  },
  {
    id: 'step-5',
    stepNumber: '05',
    title: 'Master Hand-Crafting & Polishing',
    subtitle: 'Artisanal Assembly & Anti-Glare Finish',
    description: 'Master instrument makers hand-hone scissors blades, set delicate tooth alignments, adjust spring tensions, and apply non-reflective matte satin finishes to eliminate glare under surgical lights.',
    bulletPoints: ['Hand-honed cutting edges', 'Anti-reflective satin finish', 'Smooth ergonomic balancing'],
    icon: 'ShieldCheck',
  },
  {
    id: 'step-6',
    stepNumber: '06',
    title: 'Ultrasonic Cleaning & Passivation',
    subtitle: 'Corrosion Resistance & Laser Marking',
    description: 'Instruments undergo multi-stage ultrasonic de-greasing followed by chemical passivation (ASTM A967) forming a chromium oxide layer that protects against repeated autoclave cycles.',
    bulletPoints: ['ASTM A967 passivation bath', 'Autoclave cycle testing (134°C)', 'Permanent fiber laser lot etching'],
    icon: 'CheckCircle2',
  },
]

export default function AdminProductionCMS() {
  const [heroHeading, setHeroHeading] = useState('Precision Begins Long Before Delivery.')
  const [heroSubtitle, setHeroSubtitle] = useState(
    'At Alpha Wholesale Medical Supplies, Every Surgical Instrument Follows A Disciplined Production Journey—From Carefully Selected Materials To Final Inspection, Packaging And Export.'
  )
  const [facilityHeadline, setFacilityHeadline] = useState(
    'Built For Accuracy, Reliability And Long-Term Performance.'
  )
  const [steps, setSteps] = useState<ProductionStep[]>(DEFAULT_PRODUCTION_STEPS)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('alpha_production_cms')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.heroHeading) setHeroHeading(parsed.heroHeading)
          if (parsed.heroSubtitle) setHeroSubtitle(parsed.heroSubtitle)
          if (parsed.facilityHeadline) setFacilityHeadline(parsed.facilityHeadline)
          if (Array.isArray(parsed.steps)) setSteps(parsed.steps)
        }
      } catch (e) {}
    }
  }, [])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (typeof window !== 'undefined') {
      const payload = {
        heroHeading,
        heroSubtitle,
        facilityHeadline,
        steps,
      }
      localStorage.setItem('alpha_production_cms', JSON.stringify(payload))
      window.dispatchEvent(new Event('alpha_content_updated'))
      showToast('Production Process Page CMS saved successfully!')
    }
  }

  const handleUpdateStep = (index: number, field: keyof ProductionStep, value: any) => {
    const updated = [...steps]
    updated[index] = { ...updated[index], [field]: value }
    setSteps(updated)
  }

  return (
    <AdminShell>
      <div className="space-y-8 animate-fade-in font-sans">
        
        {/* HEADER BAR */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-red-50 text-[#96161B] text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <Factory className="w-3.5 h-3.5" />
              <span>Production Process Page CMS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Our Production Process Editor
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Edit manufacturing journey steps, facility standards, quality certifications, and headings for /production.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/production"
              target="_blank"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live /production Page</span>
            </Link>
          </div>
        </div>

        {/* TOAST MESSAGE */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg flex items-center gap-3 animate-fade-in text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* SECTION 1: HERO BANNER SETTINGS */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">Hero Banner Text & Intro</h2>
                <p className="text-xs text-slate-500">The main red header section at the top of /production</p>
              </div>
              <button
                type="submit"
                className="bg-[#96161B] hover:bg-[#7d1216] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hero Main Heading</label>
                <input
                  type="text"
                  value={heroHeading}
                  onChange={(e) => setHeroHeading(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 outline-none focus:ring-1 focus:ring-[#96161B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hero Subtitle Paragraph</label>
                <textarea
                  rows={3}
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 outline-none focus:ring-1 focus:ring-[#96161B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Facility Standards Headline</label>
                <input
                  type="text"
                  value={facilityHeadline}
                  onChange={(e) => setFacilityHeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 outline-none focus:ring-1 focus:ring-[#96161B]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: THE 6-STEP PRODUCTION JOURNEY */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                The 6-Step Manufacturing Process Steps
              </h2>
              <p className="text-xs text-slate-500">
                Controls the 6 detailed cards displayed under the manufacturing workflow section on /production.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {steps.map((st, idx) => (
                <div key={st.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-full bg-[#96161B] text-white font-black text-xs flex items-center justify-center shadow-xs">
                      {st.stepNumber}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Stage {idx + 1}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Stage Title</label>
                      <input
                        type="text"
                        value={st.title}
                        onChange={(e) => handleUpdateStep(idx, 'title', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Subtitle / Focus</label>
                      <input
                        type="text"
                        value={st.subtitle}
                        onChange={(e) => handleUpdateStep(idx, 'subtitle', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-[#96161B] font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Description</label>
                      <textarea
                        rows={3}
                        value={st.description}
                        onChange={(e) => handleUpdateStep(idx, 'description', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-[11px] text-slate-700 leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="bg-[#96161B] hover:bg-[#7d1216] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Production CMS</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </AdminShell>
  )
}

