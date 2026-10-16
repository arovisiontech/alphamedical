'use client'

import React, { useState } from 'react'
import { Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { getStoredContactMessages, saveStoredContactMessages } from '@/src/lib/dataStore'

interface ContactFormProps {
  initialSubject?: string
}

export default function ContactForm({ initialSubject = '' }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: initialSubject || '',
    message: '',
  })

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error')
      return
    }

    setStatus('submitting')

    try {
      const existing = getStoredContactMessages()
      const newMessage = {
        id: `msg-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject || 'General Inquiry / Quote Request',
        message: formData.message,
        is_read: false,
        created_at: new Date().toISOString(),
      }

      saveStoredContactMessages([newMessage, ...existing])

      setTimeout(() => {
        setStatus('success')
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      }, 500)
    } catch (err) {
      console.error('Failed to submit contact message:', err)
      setStatus('error')
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl">
      <div className="mb-6 space-y-1">
        <h3 className="text-2xl font-extrabold text-slate-900">
          Submit Hospital Inquiry or Request Quotation
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm">
          Fill out the form below. Our biomedical sales & support team will respond within 24 hours.
        </p>
      </div>

      {status === 'success' ? (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-6 text-center space-y-3 animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold">Inquiry Received Successfully!</h4>
          <p className="text-xs text-emerald-700 max-w-md mx-auto">
            Thank you for reaching out to ALPHA Medical Supplies Store. Your request has been logged in our administrative dispatch system.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
          >
            Send Another Inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Please fill in all required fields (Name, Email, Message).</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. Tariq Mahmood / Hospital Manager"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#B92025] focus:border-transparent text-xs text-slate-900 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Work Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="procurement@cityhospital.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#B92025] focus:border-transparent text-xs text-slate-900 outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone / WhatsApp Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (561) 528 9764"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#B92025] focus:border-transparent text-xs text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Subject / Division
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Quotation Request for ICU Patient Monitors"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#B92025] focus:border-transparent text-xs text-slate-900 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Detailed Requirement <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Specify quantities, hospital department details, delivery requirements, or technical specs..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#B92025] focus:border-transparent text-xs text-slate-900 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-[#B92025] hover:bg-[#96161B] text-white font-bold py-3.5 px-6 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <Send className="w-4 h-4 text-white" />
            <span>{status === 'submitting' ? 'Submitting Inquiry...' : 'Submit Quotation Request'}</span>
          </button>
        </form>
      )}
    </div>
  )
}
