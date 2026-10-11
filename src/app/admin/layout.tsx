import React from 'react'

export const metadata = {
  title: 'ALPHA Admin Portal - Medical Supplies Management',
  description: 'Control panel for ALPHA Medical Supplies Store products, categories, and hospital inquiries.',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-slate-100">{children}</div>
}
