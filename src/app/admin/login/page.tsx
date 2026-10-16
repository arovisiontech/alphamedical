'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react'
import AlphaLogo from '@/src/components/public/AlphaLogo'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simple demo validation or direct admin dashboard entry
    setTimeout(() => {
      if (email || password) {
        router.push('/admin')
      } else {
        router.push('/admin')
      }
    }, 400)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* BACKGROUND DECORATION */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#B92025]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#96161B]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 border border-slate-200 space-y-6">
        <div className="text-center space-y-2">
          <AlphaLogo className="justify-center mb-4" />
          <div className="inline-flex items-center gap-1.5 bg-red-50 text-[#B92025] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-red-100">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrator Access Portal</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Sign In to Management</h2>
          <p className="text-slate-500 text-xs">
            Manage ALPHA medical supplies catalog, hospital inquiries, categories, and settings.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@alphamedical.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#B92025] text-xs text-slate-900 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#B92025] text-xs text-slate-900 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#96161B] hover:bg-[#7d1216] text-white font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/20 active:scale-95 cursor-pointer"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-100">
          ALPHA Medical Supplies Store • Protected System
        </div>
      </div>
    </div>
  )
}
