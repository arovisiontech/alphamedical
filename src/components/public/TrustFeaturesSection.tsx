'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { getStoredTrustFeatures, INITIAL_TRUST_FEATURES_SEED } from '@/src/lib/dataStore'
import { TrustFeatureItem } from '@/src/types/trustFeature'

export default function TrustFeaturesSection() {
  const [features, setFeatures] = useState<TrustFeatureItem[]>(INITIAL_TRUST_FEATURES_SEED)

  const loadFeatures = () => {
    const data = getStoredTrustFeatures()
    setFeatures(data.filter((f) => f.is_published !== false))
  }

  useEffect(() => {
    loadFeatures()

    const handleUpdate = () => {
      loadFeatures()
    }

    window.addEventListener('alpha_content_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)

    return () => {
      window.removeEventListener('alpha_content_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  if (features.length === 0) return null

  return (
    <section className="py-6 sm:py-8 2xl:py-12 bg-[#fafbfc]">
      <div className="w-full max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 3xl:px-20">
        
        {/* HORIZONTAL TRUST / VALUE BADGES BAR MATCHING SCREENSHOT */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(150,22,27,0.06)] transition-all duration-300 overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 sm:divide-slate-200/70">
            {features.map((feat) => {
              return (
                <div
                  key={feat.id}
                  className="p-5 sm:p-6 2xl:p-8 flex items-center gap-4 sm:gap-5 group hover:bg-red-50/40 transition-all duration-300 hover-card-3d cursor-default"
                >
                  {/* Circular Pinkish Red Tinted Icon Container */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 2xl:w-20 2xl:h-20 rounded-full bg-[#fdecef] shrink-0 flex items-center justify-center p-3 sm:p-3.5 2xl:p-4 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-red-100/60 group-hover:shadow-md">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Image
                        src={feat.icon_url || '/images/features/preimum-1.svg'}
                        alt={feat.title}
                        fill
                        className="object-contain"
                        priority={false}
                      />
                    </div>
                  </div>

                  {/* Text Information */}
                  <div className="min-w-0 flex-1">
                    <h4 className="font-extrabold text-slate-900 text-sm sm:text-base 2xl:text-lg tracking-tight group-hover:text-[#96161B] transition-colors leading-snug">
                      {feat.title}
                    </h4>
                    <p className="text-xs sm:text-sm 2xl:text-base text-slate-400 font-medium mt-0.5 truncate">
                      {feat.subtitle}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
