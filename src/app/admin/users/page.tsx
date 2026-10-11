'use client'

import React from 'react'
import AdminShell from '@/src/components/admin/AdminShell'
import { Users, ShieldCheck } from 'lucide-react'

export default function AdminUsersPage() {
  const users = [
    { name: 'System Administrator', email: 'admin@alphamedical.com', role: 'Super Admin', status: 'Active' },
    { name: 'Biomedical Sales Team', email: 'sales@alphamedical.com', role: 'Editor', status: 'Active' },
  ]

  return (
    <AdminShell>
      <div className="space-y-6 animate-fade-in">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-[#18355E]">User Access & Administrative Roles</h1>
            <p className="text-slate-500 text-xs mt-1">
              Control administrative privileges for store managers and sales operators.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-[#18355E]">{u.name}</td>
                  <td className="p-4 text-slate-600">{u.email}</td>
                  <td className="p-4 font-semibold text-[#B92025]">{u.role}</td>
                  <td className="p-4">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
}
