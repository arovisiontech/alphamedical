'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Play,
  X,
  Package,
  Truck,
  ShieldCheck,
  RotateCcw,
  Award,
  Headphones,
} from 'lucide-react'
import {
  getStoredVideoWhyChoose,
  INITIAL_VIDEO_WHY_CHOOSE_SEED,
} from '@/src/lib/dataStore'
import { VideoWhyChooseData } from '@/src/types/section'

export default function VideoWhyChooseSection() {
  const [data, setData] = useState<VideoWhyChooseData>(INITIAL_VIDEO_WHY_CHOOSE_SEED)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  const loadData = () => {
    const stored = getStoredVideoWhyChoose()
    setData(stored)
  }

  useEffect(() => {
    loadData()

    const handleUpdate = () => {
      loadData()
    }
    window.addEventListener('alpha_content_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)

    return () => {
      window.removeEventListener('alpha_content_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  // Icon mapping
  const renderIcon = (name: string) => {
    const iconClass = 'w-5 h-5 2xl:w-6 2xl:h-6 text-[#2563EB]'
    switch (name) {
      case 'truck':
        return <Truck className={iconClass} />
      case 'shield-check':
        return <ShieldCheck className={iconClass} />
      case 'rotate-ccw':
        return <RotateCcw className={iconClass} />
      case 'award':
        return <Award className={iconClass} />
      case 'headphones':
        return <Headphones className={iconClass} />
      case 'package':
      default:
        return <Package className={iconClass} />
    }
  }

  return (
    <section className="py-12 sm:py-16 2xl:py-24 3xl:py-32 bg-[#fafbfc]">
      <div className="w-full max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 3xl:px-20">
        
        {/* CONTAINER CARD MATCHING SCREENSHOT 1 TOP */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden p-6 sm:p-8 2xl:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 2xl:gap-14 items-center">
            
            {/* LEFT: VIDEO BOX (DARK BACKGROUND WITH SURGICAL INSTRUMENTS) */}
            <div className="lg:col-span-6 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] 2xl:aspect-[16/10] w-full rounded-2xl sm:rounded-3xl overflow-hidden group shadow-lg">
              {/* Background Poster */}
              <Image
                src={data.poster_image || '/images/surgical-video-poster.jpg'}
                alt="Surgical Precision Video"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.7]"
                priority={false}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Center Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(true)}
                  className="w-16 h-16 sm:w-20 sm:h-20 2xl:w-24 2xl:h-24 rounded-full bg-white/95 hover:bg-white text-slate-900 shadow-2xl flex items-center justify-center pl-1 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer group/btn"
                  aria-label="Play video"
                >
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 fill-slate-900 text-slate-900 group-hover/btn:text-[#96161B] group-hover/btn:fill-[#96161B] transition-colors" />
                </button>
              </div>

              {/* Bottom Content Overlay */}
              <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 text-white space-y-3">
                <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-extrabold tracking-tight">
                  {data.video_title}
                </h3>
                <p className="text-xs sm:text-sm 2xl:text-base text-slate-300 max-w-md font-medium leading-relaxed">
                  {data.video_subtitle}
                </p>
                <div>
                  <button
                    type="button"
                    onClick={() => setIsVideoModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-900 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-900 text-slate-900" />
                    <span>{data.video_button_text || 'Watch Video'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT: WHY CHOOSE FEATURES (2-COLUMN GRID) */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8 2xl:space-y-10 lg:pl-4">
              {/* Heading */}
              <div>
                <span className="w-8 h-1 bg-[#2563EB] rounded-full inline-block mb-3" />
                <h2 className="text-2xl sm:text-3xl 2xl:text-4xl 3xl:text-5xl font-black text-slate-900 tracking-tight">
                  {data.section_title}
                </h2>
                <p className="text-xs sm:text-sm 2xl:text-base text-slate-500 font-medium mt-1.5">
                  {data.section_subtitle}
                </p>
              </div>

              {/* 6 Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 2xl:gap-8">
                {data.features.map((feat) => {
                  return (
                    <div
                      key={feat.id}
                      className="flex items-start gap-3.5 2xl:gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors"
                    >
                      {/* Icon with soft blue ring */}
                      <div className="w-11 h-11 sm:w-12 sm:h-12 2xl:w-14 2xl:h-14 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-center shrink-0">
                        {renderIcon(feat.icon_name)}
                      </div>

                      {/* Text */}
                      <div className="min-w-0 flex-1">
                        <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm 2xl:text-base leading-snug">
                          {feat.title}
                        </h4>
                        <p className="text-[11px] sm:text-xs 2xl:text-sm text-slate-500 font-medium mt-0.5 leading-relaxed">
                          {feat.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* VIDEO MODAL */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Close video"
            >
              <X className="w-5 h-5" />
            </button>
            <iframe
              src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="Manufacturing & Quality Video"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  )
}
