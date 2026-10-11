'use client'

import React from 'react'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <AdminHeader />
      <div className="flex-1 flex overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 2xl:p-12 overflow-y-auto w-full max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2500px] 4xl:max-w-[3200px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
