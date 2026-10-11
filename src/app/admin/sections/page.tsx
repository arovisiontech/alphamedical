'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import AdminShell from '@/src/components/admin/AdminShell'
import {
  Video,
  Globe,
  Save,
  CheckCircle2,
  RefreshCw,
  Plus,
  Trash2,
  Upload,
  Play,
  Users,
  Scissors,
} from 'lucide-react'
import {
  getStoredVideoWhyChoose,
  saveStoredVideoWhyChoose,
  getStoredWorldExport,
  saveStoredWorldExport,
} from '@/src/lib/dataStore'
import { VideoWhyChooseData, WorldExportData } from '@/src/types/section'

export default function AdminSectionsPage() {
  const [activeTab, setActiveTab] = useState<'video' | 'world'>('video')
  const [videoData, setVideoData] = useState<VideoWhyChooseData>(getStoredVideoWhyChoose())
  const [worldData, setWorldData] = useState<WorldExportData>(getStoredWorldExport())
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const loadData = () => {
    setVideoData(getStoredVideoWhyChoose())
    setWorldData(getStoredWorldExport())
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

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault()
    saveStoredVideoWhyChoose(videoData)
    showToast('Video & Why Choose Section saved! Changes are live & saved across page reload.')
  }

  const handleSaveWorld = (e: React.FormEvent) => {
    e.preventDefault()
    saveStoredWorldExport(worldData)
    showToast('World Export Destinations Section saved! Changes are live & saved across page reload.')
  }

  return (
    <AdminShell>
      <div className="w-full max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2500px] 4xl:max-w-[3200px] mx-auto space-y-6 sm:space-y-8 animate-fade-in">
        
        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#96161B] uppercase tracking-wider mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#96161B] animate-pulse" />
              <span>Interactive Homepage Sections (Screenshot 1)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Video & Global Export Sections Manager
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Fully dynamic management for the Video / Why Choose Section and the World Export Destinations Globe section. Changes persist permanently across page refreshes.
            </p>
          </div>
          <button
            onClick={() => {
              loadData()
              showToast('Refreshed data from storage!')
            }}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all self-start md:self-auto"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* TABS */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('video')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'video'
                ? 'bg-[#18355E] text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Video & Why Choose Section</span>
          </button>

          <button
            onClick={() => setActiveTab('world')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'world'
                ? 'bg-[#96161B] text-white shadow-md shadow-red-950/20'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>World Export Globe Section</span>
          </button>
        </div>

        {/* TAB 1: VIDEO & WHY CHOOSE FORM */}
        {activeTab === 'video' && (
          <form onSubmit={handleSaveVideo} className="space-y-6 sm:space-y-8">
            {/* LIVE PREVIEW BOX */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
              <div className="text-xs font-bold text-[#96161B] uppercase tracking-wider mb-2">
                Live Storefront Card Preview
              </div>
              <div className="border border-slate-200 rounded-2xl p-4 sm:p-6 bg-slate-50/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow">
                    <Image
                      src={videoData.poster_image || '/images/surgical-video-poster.jpg'}
                      alt="Preview"
                      fill
                      className="object-cover brightness-75"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center pl-0.5 shadow-xl">
                        <Play className="w-5 h-5 fill-slate-900 text-slate-900" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="font-extrabold text-sm">{videoData.video_title}</div>
                      <div className="text-[10px] text-slate-300">{videoData.video_subtitle}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-slate-900">{videoData.section_title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{videoData.section_subtitle}</p>
                    <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-semibold text-slate-700">
                      {videoData.features.slice(0, 4).map((f) => (
                        <div key={f.id} className="bg-white p-2 rounded-lg border border-slate-200 truncate">
                          • {f.title}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* EDITING CONTROLS */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="font-extrabold text-slate-900 text-lg border-b border-slate-100 pb-3">
                Video Left Column Configuration
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Video Overlay Title
                  </label>
                  <input
                    type="text"
                    value={videoData.video_title}
                    onChange={(e) => setVideoData({ ...videoData, video_title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Video Overlay Subtitle
                  </label>
                  <input
                    type="text"
                    value={videoData.video_subtitle}
                    onChange={(e) => setVideoData({ ...videoData, video_subtitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Poster Image Path
                  </label>
                  <input
                    type="text"
                    value={videoData.poster_image}
                    onChange={(e) => setVideoData({ ...videoData, poster_image: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Watch Button Text
                  </label>
                  <input
                    type="text"
                    value={videoData.video_button_text}
                    onChange={(e) => setVideoData({ ...videoData, video_button_text: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B]"
                  />
                </div>
              </div>

              <h3 className="font-extrabold text-slate-900 text-lg border-b border-slate-100 pb-3 pt-4">
                Why Choose Right Column Configuration
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={videoData.section_title}
                    onChange={(e) => setVideoData({ ...videoData, section_title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B] font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Section Subtitle
                  </label>
                  <input
                    type="text"
                    value={videoData.section_subtitle}
                    onChange={(e) => setVideoData({ ...videoData, section_subtitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#96161B]"
                  />
                </div>
              </div>

              {/* 6 Features List */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  6 Features Grid Items
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {videoData.features.map((f, idx) => (
                    <div key={f.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="text-[10px] font-bold text-slate-400">Feature #{idx + 1}</div>
                      <input
                        type="text"
                        value={f.title}
                        onChange={(e) => {
                          const updated = [...videoData.features]
                          updated[idx] = { ...f, title: e.target.value }
                          setVideoData({ ...videoData, features: updated })
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 font-bold outline-none"
                        placeholder="Feature Title"
                      />
                      <input
                        type="text"
                        value={f.description}
                        onChange={(e) => {
                          const updated = [...videoData.features]
                          updated[idx] = { ...f, description: e.target.value }
                          setVideoData({ ...videoData, features: updated })
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-600 outline-none"
                        placeholder="Description"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-2xl bg-[#96161B] hover:bg-[#7d1216] text-white font-bold text-xs sm:text-sm shadow-md shadow-red-950/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Video Section Changes</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: WORLD EXPORT DESTINATIONS FORM */}
        {activeTab === 'world' && (
          <form onSubmit={handleSaveWorld} className="space-y-6 sm:space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="font-extrabold text-slate-900 text-lg border-b border-slate-100 pb-3">
                Global Export Headings & Content
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Heading Line 1 (Dark)
                  </label>
                  <input
                    type="text"
                    value={worldData.heading_line1}
                    onChange={(e) => setWorldData({ ...worldData, heading_line1: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Heading Line 2 (Red)
                  </label>
                  <input
                    type="text"
                    value={worldData.heading_line2}
                    onChange={(e) => setWorldData({ ...worldData, heading_line2: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-[#96161B] font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Heading Line 3 (Red)
                  </label>
                  <input
                    type="text"
                    value={worldData.heading_line3}
                    onChange={(e) => setWorldData({ ...worldData, heading_line3: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-[#96161B] font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Paragraph Description
                </label>
                <textarea
                  rows={3}
                  value={worldData.description}
                  onChange={(e) => setWorldData({ ...worldData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-medium outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Users className="w-4 h-4 text-[#96161B]" />
                    <span>Staff Metric</span>
                  </div>
                  <input
                    type="text"
                    value={worldData.staff_count}
                    onChange={(e) => setWorldData({ ...worldData, staff_count: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 font-bold"
                    placeholder="250+"
                  />
                  <input
                    type="text"
                    value={worldData.staff_label}
                    onChange={(e) => setWorldData({ ...worldData, staff_label: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-600"
                    placeholder="Qualified Staff"
                  />
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Scissors className="w-4 h-4 text-[#96161B]" />
                    <span>Instruments Metric</span>
                  </div>
                  <input
                    type="text"
                    value={worldData.instruments_count}
                    onChange={(e) => setWorldData({ ...worldData, instruments_count: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 font-bold"
                    placeholder="More than 10000+"
                  />
                  <input
                    type="text"
                    value={worldData.instruments_label}
                    onChange={(e) => setWorldData({ ...worldData, instruments_label: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-600"
                    placeholder="Instruments"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-2xl bg-[#96161B] hover:bg-[#7d1216] text-white font-bold text-xs sm:text-sm shadow-md shadow-red-950/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save World Export Changes</span>
                </button>
              </div>
            </div>
          </form>
        )}

      </div>
    </AdminShell>
  )
}
