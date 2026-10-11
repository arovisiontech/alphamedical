'use client'

import React, { useState, useEffect } from 'react'
import AdminShell from '@/src/components/admin/AdminShell'
import { MessageSquare, Mail, Phone, Calendar, Trash2, CheckCircle2 } from 'lucide-react'
import { getStoredContactMessages, saveStoredContactMessages } from '@/src/lib/dataStore'
import { ContactMessage } from '@/src/types/media'

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])

  useEffect(() => {
    setMessages(getStoredContactMessages())
  }, [])

  const handleDelete = (id: string) => {
    if (confirm('Delete message?')) {
      const updated = messages.filter((m) => m.id !== id)
      setMessages(updated)
      saveStoredContactMessages(updated)
    }
  }

  const toggleRead = (id: string) => {
    const updated = messages.map((m) => (m.id === id ? { ...m, is_read: !m.is_read } : m))
    setMessages(updated)
    saveStoredContactMessages(updated)
  }

  return (
    <AdminShell>
      <div className="space-y-6 animate-fade-in">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-[#18355E]">Hospital Quotation Inquiries</h1>
            <p className="text-slate-500 text-xs mt-1">
              Direct inquiries and quotation requests submitted by healthcare providers.
            </p>
          </div>
          <span className="bg-[#B92025] text-white text-xs font-bold px-3 py-1 rounded-full">
            {messages.length} Total Messages
          </span>
        </div>

        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400 text-xs">
              No hospital inquiries received yet.
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`bg-white rounded-2xl border p-6 shadow-sm transition-all space-y-3 ${
                  msg.is_read ? 'border-slate-200 opacity-80' : 'border-[#B92025] ring-1 ring-[#B92025]/20'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-extrabold text-base text-[#18355E]">{msg.name}</h3>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-[#B92025]" />
                        <a href={`mailto:${msg.email}`} className="hover:underline">{msg.email}</a>
                      </span>
                      {msg.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-[#B92025]" />
                          <a href={`tel:${msg.phone}`} className="hover:underline">{msg.phone}</a>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(msg.created_at).toLocaleString()}
                    </span>
                    <button
                      onClick={() => toggleRead(msg.id)}
                      className={`text-xs font-bold px-3 py-1 rounded-lg border transition-colors ${
                        msg.is_read
                          ? 'bg-slate-100 text-slate-600 border-slate-200'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      }`}
                    >
                      {msg.is_read ? 'Mark Unread' : 'Mark Read'}
                    </button>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-xs font-bold text-[#B92025] uppercase tracking-wider">
                  Subject: {msg.subject}
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-4 rounded-xl leading-relaxed whitespace-pre-line border border-slate-200/60">
                  {msg.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminShell>
  )
}
