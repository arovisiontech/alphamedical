import React from 'react'
import Image from 'next/image'
import { ShieldCheck, Award, Truck, Clock, HeartPulse } from 'lucide-react'

export default function QualityTrustSection() {
  const pillars = [
    {
      icon: ShieldCheck,
      title: 'ISO 13485 & CE Certified',
      description: 'Strict quality control standard compliance for all critical care medical devices & instruments.',
    },
    {
      icon: Award,
      title: 'Japanese & German Steel',
      description: 'Surgical instruments forged with high tensile AISI 420 stainless steel for surgical precision.',
    },
    {
      icon: Truck,
      title: 'Nationwide Express Supply',
      description: 'Rapid dispatch & secure logistics network serving hospitals, clinics, and research centers.',
    },
    {
      icon: Clock,
      title: '24/7 Technical Support',
      description: 'Dedicated biomedical engineering support team for installation, training, and maintenance.',
    },
  ]

  return (
    <section className="py-16 bg-slate-950 text-white border-b border-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* LEFT FEATURE IMAGE */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl aspect-[4/3]">
              <Image
                src="/images/extracted/image_3.png"
                alt="Alpha Medical Hospital Quality"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-[#B92025] text-white text-xs font-bold px-3 py-1 rounded-lg inline-block mb-2">
                  Hospital Partner Standard
                </div>
                <h4 className="text-lg font-bold text-white">
                  Trusted by Over 250+ Hospitals Nationwide
                </h4>
              </div>
            </div>
          </div>

          {/* RIGHT QUALITY PILLARS */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B92025] uppercase tracking-widest mb-2">
                <HeartPulse className="w-4 h-4 text-red-500" />
                <span>Uncompromised Quality & Compliance</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Why Healthcare Leaders Choose ALPHA Medical
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {pillars.map((pil, idx) => {
                const Icon = pil.icon
                return (
                  <div
                    key={idx}
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:border-[#B92025] transition-colors space-y-2 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#B92025] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white pt-1">
                      {pil.title}
                    </h3>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {pil.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
